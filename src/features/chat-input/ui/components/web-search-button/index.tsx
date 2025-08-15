import { useTranslation } from "react-i18next";
import { Globe, Info, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type WebSearchButtonProps = {
	isActive?: boolean;
	onToggle?: (active: boolean) => void;
	disabled?: boolean;
};

export const WebSearchButton = ({ isActive = false, onToggle, disabled }: WebSearchButtonProps) => {
	const { t } = useTranslation();

	const handleClick = () => {
		if (!disabled && onToggle) {
			onToggle(!isActive);
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`flex items-center justify-center gap-2 h-10 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
				isActive
					? "bg-amber-100 border border-amber-500 hover:bg-amber-200"
					: "bg-white border border-gray-200 hover:bg-gray-50"
			}`}
		>
			<Globe 
				className={`w-4 h-4 ${isActive ? "text-amber-900" : "text-stone-800"}`} 
				strokeWidth={1.33} 
			/>
			<span className={`text-sm font-medium ${isActive ? "text-amber-900" : "text-stone-800"}`}>
				{t("chatInput.webSearch")}
			</span>
			{isActive ? (
				<X className="w-4 h-4 text-amber-900 opacity-50" strokeWidth={1.33} />
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<Info 
							onClick={(e) => e.stopPropagation()} 
							className="w-4 h-4 text-stone-800 opacity-50 cursor-help" 
						/>
					</TooltipTrigger>
					<TooltipContent className="max-w-xs">
						<p>{t("chatInput.webSearchTooltip")}</p>
					</TooltipContent>
				</Tooltip>
			)}
		</button>
	);
};