import { useTranslation } from "react-i18next";
import { Globe, Info, Check } from "lucide-react";
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
					? "bg-[#f0eeff] dark:bg-[#6c56f0]/15 border border-[#6c56f0]/30 hover:bg-[#e8e0ff] dark:hover:bg-[#6c56f0]/25"
					: "bg-background border border-border hover:bg-muted"
			}`}
		>
			<Globe
				className={`w-4 h-4 ${isActive ? "text-[#6c56f0] dark:text-[#a78bfa]" : "text-foreground"}`}
				strokeWidth={1.33}
			/>
			<span className={`text-sm font-medium ${isActive ? "text-[#6c56f0] dark:text-[#a78bfa]" : "text-foreground"}`}>
				{t("chatInput.webSearch")}
			</span>
			{isActive ? (
				<Check className="w-4 h-4 text-[#6c56f0] dark:text-[#a78bfa]" strokeWidth={2} />
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<Info
							onClick={(e) => e.stopPropagation()}
							className="w-4 h-4 text-muted-foreground opacity-50 cursor-help"
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