import { useTranslation } from "react-i18next";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Settings } from "@/components/animate-ui/icons/settings";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChatStore } from "@/core/chat/store";
import { useModels } from "@/core/api/models/hooks";
import type { ChatHeaderProps } from "../types";
import { ModelSelector } from "./components/model-selector";

export const ChatHeader = ({
	settings,
	onOpenSettingsDrawer,
}: Omit<ChatHeaderProps, 'onSettingsChange'>) => {
	const { t } = useTranslation();
	const { updateModelWithTokensCorrection } = useChatStore();
	const { data: modelsData } = useModels();

	const handleModelChange = (
		model: string,
		provider: typeof settings.provider,
	) => {
		// Используем новую функцию для корректировки max_tokens
		const availableModels = modelsData?.models || [];
		updateModelWithTokensCorrection(model, provider, availableModels);
	};

	const handleModelSettingsClick = () => {
		onOpenSettingsDrawer?.();
	};

	return (
		<div className="flex items-center justify-between p-4 bg-background max-w-full min-w-0">
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
					{/* Desktop version - icon + text */}
					<Button
						variant="secondary"
						size="default"
						onClick={handleModelSettingsClick}
						className="hidden sm:flex h-9 gap-2 transition-colors"
					>
						<Settings className="h-4 w-4" />
						{t("chatHeader.modelSettings")}
					</Button>
					{/* Mobile version - icon only */}
					<Button
						variant="secondary"
						size="icon"
						onClick={handleModelSettingsClick}
						className="sm:hidden h-9 w-9 transition-colors"
					>
						<Settings className="h-4 w-4" />
					</Button>
				</div>
			</AnimateIcon>
		</div>
	);
};
