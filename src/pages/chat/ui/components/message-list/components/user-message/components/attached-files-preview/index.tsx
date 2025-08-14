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
        label: 'Документ'
      };
    
    case 'xlsx':
    case 'xls':
      return {
        type: 'spreadsheet',
        label: 'Таблица'
      };
    
    case 'pptx':
    case 'ppt':
      return {
        type: 'presentation',
        label: 'Презентация'
      };
    
    case 'txt':
    case 'md':
      return {
        type: 'text',
        label: 'Текстовый файл'
      };
    
    default:
      return {
        type: 'document',
        label: 'Документ'
      };
  }
};

type FileItemProps = {
  file: AttachedFile;
};

const FileItem = ({ file }: FileItemProps) => {
  const fileTypeInfo = getFileTypeInfo(file.filename);
  
  const handleDownload = async () => {
    try {
      // Получаем ссылку на скачивание через API
      const response = await fetch(`/api/chat/files/${file.id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }
      
      const data = await response.json();
      
      // Создаем временный элемент для скачивания
      const link = document.createElement('a');
      link.href = data.download_url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div
      onClick={handleDownload}
      className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg max-w-sm cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors"
    >
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