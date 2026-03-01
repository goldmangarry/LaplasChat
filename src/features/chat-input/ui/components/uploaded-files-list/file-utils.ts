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
				label: 'Document',
				icon: 'FileText'
			};
		
		case 'xlsx':
		case 'xls':
			return {
				type: 'spreadsheet',
				label: 'Spreadsheet',
				icon: 'Sheet'
			};
		
		case 'pptx':
		case 'ppt':
			return {
				type: 'presentation',
				label: 'Presentation',
				icon: 'Presentation'
			};
		
		case 'txt':
		case 'md':
			return {
				type: 'text',
				label: 'Text File',
				icon: 'FileText'
			};
		
		default:
			return {
				type: 'document',
				label: 'Document',
				icon: 'FileText'
			};
	}
};