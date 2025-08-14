import { useState } from "react";

type LinkCardProps = {
	url: string;
};

type LinkMetadata = {
	title?: string;
	description?: string;
	domain?: string;
	favicon?: string;
};

// Temporary function to extract domain from URL
const getDomainFromUrl = (url: string): string => {
	try {
		const domain = new URL(url).hostname;
		return domain.replace('www.', '');
	} catch {
		return url;
	}
};

// Temporary function to get favicon URL
const getFaviconUrl = (url: string): string => {
	try {
		const domain = new URL(url).origin;
		return `${domain}/favicon.ico`;
	} catch {
		return '';
	}
};

export const LinkCard = ({ url }: LinkCardProps) => {
	const [metadata] = useState<LinkMetadata>({
		domain: getDomainFromUrl(url),
		favicon: getFaviconUrl(url),
		// TODO: Fetch real metadata from API
		title: undefined,
		description: undefined,
	});

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="block p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
		>
			{/* Domain with favicon */}
			<div className="flex items-center gap-2 mb-4">
				{metadata.favicon && (
					<img
						src={metadata.favicon}
						alt=""
						className="w-4 h-4 rounded-sm"
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				)}
				<span className="text-stone-500 text-xs font-medium">
					{metadata.domain}
				</span>
			</div>

			{/* Content */}
			{metadata.title && metadata.description ? (
				// Full card with title and description
				<div>
					<h4 className="font-medium text-stone-900 text-sm leading-5 mb-2 line-clamp-2">
						{metadata.title}
					</h4>
					<p className="text-stone-600 text-xs leading-4 line-clamp-2">
						{metadata.description}
					</p>
				</div>
			) : (
				// Fallback: show URL
				<div>
					<span className="text-blue-600 text-sm font-medium hover:underline break-all">
						{url}
					</span>
				</div>
			)}
		</a>
	);
};