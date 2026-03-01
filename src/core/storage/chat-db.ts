import type {
	Dialog,
	ChatMessage,
	ModelInfo,
} from "@/core/api/chat/types";

const DB_NAME = "laplas-chat-db";
const DB_VERSION = 1;
const DIALOGS_STORE = "dialogs";
const MESSAGES_STORE = "messages";

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
	if (dbInstance) return Promise.resolve(dbInstance);

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;

			if (!db.objectStoreNames.contains(DIALOGS_STORE)) {
				const dialogStore = db.createObjectStore(DIALOGS_STORE, {
					keyPath: "id",
				});
				dialogStore.createIndex("updated_at", "updated_at", {
					unique: false,
				});
			}

			if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
				const messageStore = db.createObjectStore(MESSAGES_STORE, {
					keyPath: "id",
				});
				messageStore.createIndex("dialog_id", "dialog_id", {
					unique: false,
				});
			}
		};

		request.onsuccess = () => {
			dbInstance = request.result;
			resolve(dbInstance);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

// Dialog operations

export async function getAllDialogs(): Promise<Dialog[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DIALOGS_STORE, "readonly");
		const store = tx.objectStore(DIALOGS_STORE);
		const request = store.getAll();

		request.onsuccess = () => {
			const dialogs = request.result as Dialog[];
			dialogs.sort(
				(a, b) =>
					new Date(b.updated_at).getTime() -
					new Date(a.updated_at).getTime(),
			);
			resolve(dialogs);
		};

		request.onerror = () => reject(request.error);
	});
}

export async function getDialog(id: string): Promise<Dialog | undefined> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DIALOGS_STORE, "readonly");
		const store = tx.objectStore(DIALOGS_STORE);
		const request = store.get(id);

		request.onsuccess = () => resolve(request.result as Dialog | undefined);
		request.onerror = () => reject(request.error);
	});
}

export async function createDialog(dialog: Dialog): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DIALOGS_STORE, "readwrite");
		const store = tx.objectStore(DIALOGS_STORE);
		const request = store.put(dialog);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function updateDialog(
	id: string,
	updates: Partial<Dialog>,
): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DIALOGS_STORE, "readwrite");
		const store = tx.objectStore(DIALOGS_STORE);
		const getRequest = store.get(id);

		getRequest.onsuccess = () => {
			const existing = getRequest.result;
			if (!existing) {
				reject(new Error(`Dialog ${id} not found`));
				return;
			}
			const updated = { ...existing, ...updates };
			const putRequest = store.put(updated);
			putRequest.onsuccess = () => resolve();
			putRequest.onerror = () => reject(putRequest.error);
		};

		getRequest.onerror = () => reject(getRequest.error);
	});
}

export async function deleteDialog(id: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DIALOGS_STORE, "readwrite");
		const store = tx.objectStore(DIALOGS_STORE);
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

// Message operations

export async function getMessages(dialogId: string): Promise<ChatMessage[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(MESSAGES_STORE, "readonly");
		const store = tx.objectStore(MESSAGES_STORE);
		const index = store.index("dialog_id");
		const request = index.getAll(dialogId);

		request.onsuccess = () => {
			const messages = request.result as ChatMessage[];
			messages.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
			resolve(messages);
		};

		request.onerror = () => reject(request.error);
	});
}

export async function addMessage(
	dialogId: string,
	message: ChatMessage,
): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(MESSAGES_STORE, "readwrite");
		const store = tx.objectStore(MESSAGES_STORE);
		// Store with dialog_id for indexing
		const storedMessage = { ...message, dialog_id: dialogId };
		const request = store.put(storedMessage);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function deleteMessages(dialogId: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(MESSAGES_STORE, "readwrite");
		const store = tx.objectStore(MESSAGES_STORE);
		const index = store.index("dialog_id");
		const request = index.openCursor(dialogId);

		request.onsuccess = () => {
			const cursor = request.result;
			if (cursor) {
				cursor.delete();
				cursor.continue();
			} else {
				resolve();
			}
		};

		request.onerror = () => reject(request.error);
	});
}

// Utility to build model info for a dialog
export function buildModelInfo(
	modelId: string,
	modelName: string,
	provider: string,
	maxTokens: number,
	temperature: number,
): ModelInfo {
	return {
		id: modelId,
		name: modelName,
		provider: provider as ModelInfo["provider"],
		max_output: maxTokens,
		temperature,
	};
}
