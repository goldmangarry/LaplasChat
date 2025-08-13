import { FileText, X } from "lucide-react";
import type { UploadedFileInfo } from "../../../model/types";
import { getFileTypeInfo } from "./file-utils";

type FilePreviewProps = {
	file: UploadedFileInfo;
	onRemove: (fileId: string) => void;
};

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
	const fileTypeInfo = getFileTypeInfo(file.filename);

	const handleRemove = () => {
		onRemove(file.file_id);
	};

	return (
		<div className="relative flex items-start gap-3 p-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg max-w-sm">
			{/* File Icon */}
			<div className="flex-shrink-0 mt-1">
				<FileText className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
			</div>

			{/* File Info */}
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-gray-900 truncate">
					{file.filename}
				</div>
				<div className="text-xs text-gray-500 mt-1">
					{fileTypeInfo.label}
				</div>
			</div>

			{/* Remove Button */}
			<button
				onClick={handleRemove}
				className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
			>
				<X className="w-3 h-3 text-gray-600" strokeWidth={2} />
			</button>
		</div>
	);
};