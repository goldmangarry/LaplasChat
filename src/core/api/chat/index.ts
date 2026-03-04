import {
	getAllDialogs,
	getDialog,
	createDialog,
	updateDialog,
	deleteDialog,
	getMessages,
	addMessage,
	deleteMessages,
} from "@/core/storage/chat-db";
import { sendChatCompletion, sendFactCheck } from "./completions";
import { sendSecureMessage } from "./secure-pipeline";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type {
	ChatHistoryResponse,
	ChatMessagesResponse,
	SendMessageRequest,
	SendMessageResponse,
	UpdateDialogNameRequest,
	UpdateDialogNameResponse,
	FactCheckRequest,
	FactCheckResponse,
	UploadFilesResponse,
	FileDownloadResponse,
	Dialog,
	ChatMessage,
	ModelInfo,
} from "./types";

function getProviderFromModelId(modelId: string): string {
	const displayId = getDisplayModelId(modelId);
	const slash = displayId.indexOf("/");
	return slash !== -1 ? displayId.slice(0, slash) : "openai";
}

function getModelNameFromId(modelId: string): string {
	const displayId = getDisplayModelId(modelId);
	const slash = displayId.indexOf("/");
	return slash !== -1 ? displayId.slice(slash + 1) : displayId;
}

export const chatApi = {
	getHistory: async (): Promise<ChatHistoryResponse> => {
		const dialogs = await getAllDialogs();
		return { dialogs };
	},

	sendMessage: async (
		messageData: SendMessageRequest,
	): Promise<SendMessageResponse> => {
		const apiKey = localStorage.getItem("openrouter_api_key");
		if (!apiKey) {
			throw new Error("No OpenRouter API key found. Please add your API key in settings.");
		}

		let dialogId = messageData.dialog_id;
		const isNewDialog = !dialogId;

		// Create new dialog if needed
		if (isNewDialog) {
			dialogId = crypto.randomUUID();
			const provider = getProviderFromModelId(messageData.model);
			const modelName = getModelNameFromId(messageData.model);
			const displayModelId = getDisplayModelId(messageData.model);

			const modelInfo: ModelInfo = {
				id: displayModelId,
				name: modelName,
				provider: provider as ModelInfo["provider"],
				max_output: messageData.max_tokens,
				temperature: messageData.temperature,
			};

			const messageText = messageData.message;
			const dialogName =
				messageText.length > 50
					? `${messageText.slice(0, 50)}...`
					: messageText;

			const newDialog: Dialog = {
				id: dialogId,
				name: dialogName,
				has_encrypted_messages: messageData.secure_mode ?? false,
				last_model_info: modelInfo,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			await createDialog(newDialog);
		}

		let responseContent: string;
		let encryptedContent: string | undefined;

		// Capture user message timestamp BEFORE the API call to guarantee correct ordering
		const userMessageTimestamp = Date.now();

		if (messageData.secure_mode && messageData.ollama_model) {
			// ── Secure Mode: anonymize current message only, no conversation history ──
			const secureResult = await sendSecureMessage({
				userMessage: messageData.message,
				mainModel: messageData.model,
				ollamaModel: messageData.ollama_model,
				temperature: messageData.temperature,
				maxTokens: messageData.max_tokens,
				apiKey,
			});

			responseContent = secureResult.content;
			// Show both the anonymized message and the mapping in the lock modal
			const mappingInfo = Object.keys(secureResult.mapping).length > 0
				? `\n\n---\n**PII Mapping (${Object.keys(secureResult.mapping).length} entities found):**\n${Object.entries(secureResult.mapping).map(([k, v]) => `- ${k} → \`${v}\``).join("\n")}`
				: "\n\n---\n**No PII detected by Ollama**";
			encryptedContent = secureResult.cleanedMessage + mappingInfo;
		} else {
			// ── Normal Mode: direct call to OpenRouter with conversation history ──
			const existingMessages = await getMessages(dialogId as string);
			const messagesForApi: Array<{
				role: "system" | "user" | "assistant";
				content: string;
			}> = [];

			for (const msg of existingMessages) {
				messagesForApi.push({
					role: msg.role as "user" | "assistant",
					content: msg.content,
				});
			}
			messagesForApi.push({ role: "user", content: messageData.message });

			const response = await sendChatCompletion({
				messages: messagesForApi,
				model: messageData.model,
				temperature: messageData.temperature,
				maxTokens: messageData.max_tokens,
				apiKey,
			});

			responseContent = response.content;
		}

		// Save user message to IndexedDB (uses timestamp captured BEFORE API call)
		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content: messageData.message,
			created_at: new Date(userMessageTimestamp).toISOString(),
			timestamp: userMessageTimestamp,
			...(encryptedContent ? { encrypted_content: encryptedContent } : {}),
		};
		await addMessage(dialogId as string, userMessage);

		// Build model info for the response
		const provider = getProviderFromModelId(messageData.model);
		const modelName = getModelNameFromId(messageData.model);
		const displayModelId = getDisplayModelId(messageData.model);

		const modelInfo: ModelInfo = {
			id: displayModelId,
			name: modelName,
			provider: provider as ModelInfo["provider"],
			max_output: messageData.max_tokens,
			temperature: messageData.temperature,
		};

		// Save assistant response to IndexedDB (timestamp AFTER API call = always after user message)
		const assistantMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: "assistant",
			content: responseContent,
			created_at: new Date().toISOString(),
			timestamp: Date.now(),
			last_model_info: modelInfo,
		};
		await addMessage(dialogId as string, assistantMessage);

		// Update dialog metadata
		await updateDialog(dialogId as string, {
			updated_at: new Date().toISOString(),
			last_model_info: modelInfo,
		});

		return {
			response: responseContent,
			dialog_id: dialogId as string,
		};
	},

	getChatMessages: async (
		dialogId: string,
	): Promise<ChatMessagesResponse> => {
		const messages = await getMessages(dialogId);
		const dialog = await getDialog(dialogId);

		return {
			messages,
			has_encrypted_messages: dialog?.has_encrypted_messages ?? false,
			last_model_info: dialog?.last_model_info ?? {
				id: "unknown",
				name: "Unknown",
				provider: "openai",
				max_output: 4000,
				temperature: 0.7,
			},
		};
	},

	deleteChatHistory: async (dialogId: string): Promise<void> => {
		await deleteMessages(dialogId);
		await deleteDialog(dialogId);
	},

	updateDialogName: async (
		dialogId: string,
		updateData: UpdateDialogNameRequest,
	): Promise<UpdateDialogNameResponse> => {
		const now = new Date().toISOString();
		await updateDialog(dialogId, {
			name: updateData.dialog_name,
			updated_at: now,
		});

		return {
			dialog_id: dialogId,
			dialog_name: updateData.dialog_name,
			updated_at: now,
		};
	},

	factCheck: async (
		factCheckData: FactCheckRequest,
	): Promise<FactCheckResponse> => {
		const apiKey = localStorage.getItem("openrouter_api_key");
		if (!apiKey) {
			throw new Error("No OpenRouter API key found.");
		}

		return sendFactCheck(factCheckData.message, apiKey);
	},

	// Client-side file handling — files are read in the browser, no server upload
	uploadFiles: async (_files: File[]): Promise<UploadFilesResponse> => {
		const results = await Promise.all(
			_files.map(async (file) => {
				const content = await readFileAsText(file);
				return {
					file_id: crypto.randomUUID(),
					filename: file.name,
					download_url: "",
					expires_at: "",
					text_extracted: content !== null,
					content: content ?? "",
				};
			}),
		);

		return { files: results };
	},

	// No server-side file storage — no-op
	getFileDownloadUrl: async (
		_fileId: string,
	): Promise<FileDownloadResponse> => {
		return { download_url: "", expires_in: "0" };
	},
};

// Read a file as text (returns null for binary files)
async function readFileAsText(file: File): Promise<string | null> {
	const textExtensions = [
		".txt",
		".md",
		".csv",
		".json",
		".xml",
		".html",
		".css",
		".js",
		".ts",
		".tsx",
		".jsx",
		".py",
		".rb",
		".java",
		".c",
		".cpp",
		".h",
		".sh",
		".yaml",
		".yml",
		".toml",
		".ini",
		".cfg",
		".log",
		".sql",
		".env",
	];

	const fileName = file.name.toLowerCase();
	const isTextFile = textExtensions.some((ext) => fileName.endsWith(ext));

	if (!isTextFile && file.size > 100 * 1024) {
		// For large non-text files, skip reading
		return null;
	}

	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => resolve(null);
		reader.readAsText(file);
	});
}
