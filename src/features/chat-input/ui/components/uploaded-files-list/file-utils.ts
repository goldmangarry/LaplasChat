export type FileTypeInfo = {
	type: 'document' | 'spreadsheet' | 'presentation' | 'text';
	label: string;
	icon: 'FileText' | 'Sheet' | 'Presentation' | 'FileText';
};

export const getFileTypeInfo = (filename: string): FileTypeInfo => {
	const extension = filename.toLowerCase().split('.').pop() || '';

	switch (extension) {
		case 'pdf':
		case 'docx':
		case 'doc':
			return {
				type: 'document',
				label: 'Документ',
				icon: 'FileText'
			};
		
		case 'xlsx':
		case 'xls':
			return {
				type: 'spreadsheet',
				label: 'Таблица',
				icon: 'Sheet'
			};
		
		case 'pptx':
		case 'ppt':
			return {
				type: 'presentation',
				label: 'Презентация',
				icon: 'Presentation'
			};
		
		case 'txt':
		case 'md':
			return {
				type: 'text',
				label: 'Текстовый файл',
				icon: 'FileText'
			};
		
		default:
			return {
				type: 'document',
				label: 'Документ',
				icon: 'FileText'
			};
	}
};