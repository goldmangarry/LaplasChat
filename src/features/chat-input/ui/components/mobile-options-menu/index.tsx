import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Paperclip, Globe } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUploadFiles } from "@/core/api/chat/hooks";
import { useChatInputStore } from "../../../model/store";
import { MobileActionButton } from "../mobile-action-button";

type MobileOptionsMenuProps = {
	isSecure: boolean;
	onSecureToggle: (secure: boolean) => void;
	webSearchEnabled: boolean;
	onWebSearchToggle: (enabled: boolean) => void;
	disabled?: boolean;
};

export function MobileOptionsMenu({
	isSecure,
	onSecureToggle,
	webSearchEnabled,
	onWebSearchToggle,
	disabled = false,
}: MobileOptionsMenuProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadFilesMutation = useUploadFiles();
	const { addUploadedFiles } = useChatInputStore();

	const handleSecureModeClick = () => {
		onSecureToggle(!isSecure);
		setOpen(false);
	};

	const handleWebSearchClick = () => {
		onWebSearchToggle(!webSearchEnabled);
		setOpen(false);
	};

	const handleFileUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
		setOpen(false);
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
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<MobileActionButton disabled={disabled || uploadFilesMutation.isPending} />
				</DropdownMenuTrigger>
				<DropdownMenuContent 
					side="top"
					align="start" 
					className="w-[266px] p-1 bg-white border border-gray-200 shadow-lg"
				>
				<DropdownMenuItem
					onClick={handleSecureModeClick}
					className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-sm ${
						isSecure ? "bg-gray-100" : "hover:bg-gray-50"
					}`}
				>
					<ShieldCheck className="h-4 w-4 text-neutral-600" strokeWidth={1.33} />
					<span className="text-black">{t("chatInput.secureMode", "Безопасный режим")}</span>
					{isSecure && (
						<div className="ml-auto w-4 h-4 flex items-center justify-center">
							<div className="w-2 h-1 border-l-2 border-b-2 border-black transform rotate-[-45deg]" />
						</div>
					)}
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={handleFileUploadClick}
					className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-gray-50"
				>
					<Paperclip className="h-4 w-4 text-neutral-600" strokeWidth={1.33} />
					<span className="text-black">{t("chatInput.attachFile", "Прикрепить файл")}</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="my-1 bg-gray-200" />

				<DropdownMenuItem
					onClick={handleWebSearchClick}
					className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-sm ${
						webSearchEnabled ? "bg-gray-100" : "hover:bg-gray-50"
					}`}
				>
					<Globe className="h-4 w-4 text-neutral-600" strokeWidth={1.33} />
					<span className="text-black">{t("chatInput.webSearch", "Поиск в сети")}</span>
					{webSearchEnabled && (
						<div className="ml-auto w-4 h-4 flex items-center justify-center">
							<div className="w-2 h-1 border-l-2 border-b-2 border-black transform rotate-[-45deg]" />
						</div>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		</>
	);
}