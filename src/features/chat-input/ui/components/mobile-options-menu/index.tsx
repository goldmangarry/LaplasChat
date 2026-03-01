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
import { useChatInputStore } from "../../../model/store";
import type { UploadedFileInfo } from "../../../model/types";
import { MobileActionButton } from "../mobile-action-button";

const TEXT_EXTENSIONS = [
	".txt", ".md", ".csv", ".json", ".xml", ".html", ".css",
	".js", ".ts", ".tsx", ".jsx", ".py",
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
	const [isProcessing, setIsProcessing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
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
				accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.md,.csv,.json,.xml,.html,.css,.js,.ts,.tsx,.jsx,.py"
				onChange={handleFileChange}
				className="hidden"
			/>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<MobileActionButton disabled={disabled || isProcessing} />
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
					<span className="text-black">{t("chatInput.secureMode", "Secure Mode")}</span>
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
					<span className="text-black">{t("chatInput.attachFile", "Attach File")}</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="my-1 bg-gray-200" />

				<DropdownMenuItem
					onClick={handleWebSearchClick}
					className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-sm ${
						webSearchEnabled ? "bg-gray-100" : "hover:bg-gray-50"
					}`}
				>
					<Globe className="h-4 w-4 text-neutral-600" strokeWidth={1.33} />
					<span className="text-black">{t("chatInput.webSearch", "Web Search")}</span>
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
