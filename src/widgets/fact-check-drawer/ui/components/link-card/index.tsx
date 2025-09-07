import { useState } from "react";
import { ExternalLinkIcon } from "@/components/animate-ui/icons/external-link";
import type { FactCheckAnnotation } from "@/core/api/chat/types";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

type LinkCardProps = {
	annotation: FactCheckAnnotation;
};

// Function to extract domain from URL
const getDomainFromUrl = (url: string): string => {
	try {
		const domain = new URL(url).hostname;
		return domain.replace('www.', '');
	} catch {
		return url;
	}
};

// Function to get favicon URL
const getFaviconUrl = (url: string): string => {
	try {
		const domain = new URL(url).origin;
		return `${domain}/favicon.ico`;
	} catch {
		return '';
	}
};

const DomainPill = ({ url }: { url: string }) => {
	const [faviconUrl] = useState(getFaviconUrl(url));
	const domain = getDomainFromUrl(url);

	return (
		<div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-600 dark:border-amber-400 rounded-full">
			{/* Avatar/Favicon */}
			<div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
				{faviconUrl ? (
					<img
						src={faviconUrl}
						alt=""
						className="w-full h-full object-cover"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.style.display = 'none';
							target.nextElementSibling?.classList.remove('hidden');
						}}
					/>
				) : null}
				<div className={`w-full h-full bg-muted-foreground/20 flex items-center justify-center text-xs font-medium text-muted-foreground ${faviconUrl ? 'hidden' : ''}`}>
					{domain.slice(0, 2).toUpperCase()}
				</div>
			</div>

			{/* Domain */}
			<span className="text-amber-800 dark:text-amber-200 text-sm font-normal leading-tight">
				{domain}
			</span>

			{/* External Link Icon */}
			<ExternalLinkIcon 
				size={16} 
				className="text-amber-800 dark:text-amber-200 flex-shrink-0" 
				strokeWidth={1.2} 
			/>
		</div>
	);
};

export const LinkCard = ({ annotation }: LinkCardProps) => {
	return (
		<AnimateIcon animateOnHover>
			<a
			href={annotation.url}
			target="_blank"
			rel="noopener noreferrer"
			className="block p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
		>
			{/* Domain Pill */}
			<div className="mb-4">
				<DomainPill url={annotation.url} />
			</div>

			{/* Content */}
			{annotation.header && annotation.text ? (
				// Full card with title and description
				<div>
					<h4 className="font-medium text-card-foreground text-sm leading-5 mb-2 line-clamp-2">
						{annotation.header}
					</h4>
					<p className="text-muted-foreground text-xs leading-4 line-clamp-2">
						{annotation.text}
					</p>
				</div>
			) : (
				// Fallback: show URL
				<div>
					<span className="text-primary text-sm font-medium hover:underline break-all">
						{annotation.url}
					</span>
				</div>
			)}
		</a>
		</AnimateIcon>
		
	);
};