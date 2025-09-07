import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { useUploadFiles } from "@/core/api/chat/hooks";
import { useChatInputStore } from "../../../model/store";

type FileUploadButtonProps = {
	disabled?: boolean;
};

export const FileUploadButton = ({ disabled }: FileUploadButtonProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadFilesMutation = useUploadFiles();
	const { addUploadedFiles } = useChatInputStore();

	const handleButtonClick = () => {
		if (!disabled && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const fileArray = Array.from(files);
			
			// Проверяем ограничение на 5 файлов
			if (fileArray.length > 5) {
				console.warn("Maximum 5 files allowed");
				return;
			}

			try {
				const response = await uploadFilesMutation.mutateAsync(fileArray);
				addUploadedFiles(response.files);
			} catch (error) {
				console.error("Failed to upload files:", error);
			}
		}
		
		// Сбрасываем значение input для возможности повторной загрузки того же файла
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.md"
				onChange={handleFileChange}
				className="hidden"
			/>
			<button
				onClick={handleButtonClick}
				disabled={disabled || uploadFilesMutation.isPending}
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