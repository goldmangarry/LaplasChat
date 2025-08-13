export type UploadedFileInfo = {
	file_id: string;
	filename: string;
	download_url: string;
	expires_at: string;
	text_extracted: boolean;
};

export type ChatInputState = {
	message: string;
	webSearchEnabled: boolean;
	uploadedFiles: UploadedFileInfo[];
	setMessage: (message: string) => void;
	clearMessage: () => void;
	setWebSearchEnabled: (enabled: boolean) => void;
	addUploadedFiles: (files: UploadedFileInfo[]) => void;
	removeUploadedFile: (fileId: string) => void;
	clearUploadedFiles: () => void;
};
