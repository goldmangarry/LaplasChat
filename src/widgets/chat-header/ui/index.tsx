import { useTranslation } from "react-i18next";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Settings } from "@/components/animate-ui/icons/settings";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { ChatHeaderProps } from "../types";
import { ModelSelector } from "./components/model-selector";

export const ChatHeader = ({ settings, onSettingsChange }: ChatHeaderProps) => {
	const { t } = useTranslation();

	const handleModelChange = (
		model: string,
		provider: typeof settings.provider,
	) => {
		onSettingsChange({ model, provider });
	};

	const handleModelSettingsClick = () => {
		// TODO: Implement model settings functionality
	};

	return (
		<div className="flex items-center justify-between p-4 border-b bg-background">
			<div className="flex items-center gap-4">
				<SidebarTrigger className="-ml-1" />
				<ModelSelector
					selectedModel={settings.model}
					selectedProvider={settings.provider}
					onModelChange={handleModelChange}
				/>
			</div>
			<AnimateIcon animateOnHover>
				<div className="flex items-center gap-2">
					<Button
						variant="secondary"
						size="default"
						onClick={handleModelSettingsClick}
						className="h-9 gap-2 transition-colors"
					>
						<Settings className="h-4 w-4" />
						{t("chatHeader.modelSettings")}
					</Button>
				</div>
			</AnimateIcon>
		</div>
	);
};
