import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { useChatInputStore } from "../../../model/store";
import type { UploadedFileInfo } from "../../../model/types";

const TEXT_EXTENSIONS = [
	".txt", ".md", ".csv", ".json", ".xml", ".html", ".css",
	".js", ".ts", ".tsx", ".jsx", ".py", ".rb", ".java",
	".c", ".cpp", ".h", ".sh", ".yaml", ".yml", ".toml",
	".ini", ".cfg", ".log", ".sql", ".env",
];

function isTextFile(filename: string): boolean {
	const lower = filename.toLowerCase();
	return TEXT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function readFileAsText(file: File): Promise<string | null> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => resolve(null);
		reader.readAsText(file);
	});
}

type FileUploadButtonProps = {
	disabled?: boolean;
};

export const FileUploadButton = ({ disabled }: FileUploadButtonProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const { addUploadedFiles } = useChatInputStore();

	const handleButtonClick = () => {
		if (!disabled && !isProcessing && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const fileArray = Array.from(files);

			if (fileArray.length > 5) {
				console.warn("Maximum 5 files allowed");
				return;
			}

			setIsProcessing(true);

			try {
				const uploadedFiles: UploadedFileInfo[] = await Promise.all(
					fileArray.map(async (file) => {
						let content: string | undefined;

						if (isTextFile(file.name) || file.size < 100 * 1024) {
							const text = await readFileAsText(file);
							content = text ?? undefined;
						}

						return {
							file_id: crypto.randomUUID(),
							filename: file.name,
							download_url: "",
							expires_at: "",
							text_extracted: !!content,
							content,
						};
					}),
				);

				addUploadedFiles(uploadedFiles);
			} catch (error) {
				console.error("Failed to process files:", error);
			} finally {
				setIsProcessing(false);
			}
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.md,.csv,.json,.xml,.html,.css,.js,.ts,.tsx,.jsx,.py,.rb,.java,.c,.cpp,.h,.sh,.yaml,.yml,.toml,.ini,.cfg,.log,.sql"
				onChange={handleFileChange}
				className="hidden"
			/>
			<button
				onClick={handleButtonClick}
				disabled={disabled || isProcessing}
				className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Paperclip
					className="w-4 h-4 text-foreground"
					strokeWidth={1.33}
				/>
			</button>
		</>
	);
};
