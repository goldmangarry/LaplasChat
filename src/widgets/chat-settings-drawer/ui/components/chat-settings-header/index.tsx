import { useTranslation } from "react-i18next";
import { Settings } from "@/components/animate-ui/icons/settings";

export const ChatSettingsHeader = () => {
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-between p-2 border-b bg-background">
			<div className="flex items-center gap-2 p-2">
				<div className="flex items-center justify-center w-8 h-8 bg-[#f0eeff] dark:bg-[#6c56f0]/15 rounded-lg">
					<Settings className="w-4 h-4 text-[#6c56f0] dark:text-[#a78bfa]" />
				</div>
				<div className="flex flex-col justify-center">
					<span className="text-sm font-semibold">
						{t("chatSettings.modelSettings")}
					</span>
				</div>
			</div>
		</div>
	);
};