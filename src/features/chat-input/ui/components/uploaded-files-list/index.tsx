import { useChatInputStore } from "../../../model/store";
import { FilePreview } from "./file-preview";

export const UploadedFilesList = () => {
	const { uploadedFiles, removeUploadedFile } = useChatInputStore();

	if (uploadedFiles.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-2 p-4 bg-background rounded-t-2xl">
			{uploadedFiles.map((file) => (
				<FilePreview
					key={file.file_id}
					file={file}
					onRemove={removeUploadedFile}
				/>
			))}
		</div>
	);
};