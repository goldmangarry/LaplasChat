import { FileText } from "lucide-react";
import type { AttachedFile } from "@/core/api/chat/types";

type AttachedFilesPreviewProps = {
  files: AttachedFile[];
};

type FileTypeInfo = {
  type: 'document' | 'spreadsheet' | 'presentation' | 'text';
  label: string;
};

const getFileTypeInfo = (filename: string): FileTypeInfo => {
  const extension = filename.toLowerCase().split('.').pop() || '';

  switch (extension) {
    case 'pdf':
    case 'docx':
    case 'doc':
      return {
        type: 'document',
        label: 'Document'
      };
    
    case 'xlsx':
    case 'xls':
      return {
        type: 'spreadsheet',
        label: 'Spreadsheet'
      };
    
    case 'pptx':
    case 'ppt':
      return {
        type: 'presentation',
        label: 'Presentation'
      };
    
    case 'txt':
    case 'md':
      return {
        type: 'text',
        label: 'Text File'
      };
    
    default:
      return {
        type: 'document',
        label: 'Document'
      };
  }
};

type FileItemProps = {
  file: AttachedFile;
};

const FileItem = ({ file }: FileItemProps) => {
  const fileTypeInfo = getFileTypeInfo(file.filename);

  return (
    <div
      className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg max-w-sm"
    >
      <div className="flex-shrink-0 mt-1">
        <FileText className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {file.filename}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {fileTypeInfo.label}
        </div>
      </div>
    </div>
  );
};

export const AttachedFilesPreview = ({ files }: AttachedFilesPreviewProps) => {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-3">
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
};