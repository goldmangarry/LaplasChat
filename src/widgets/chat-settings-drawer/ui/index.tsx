import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { ChatSettingsDrawerProps } from "../types";
import { ChatSettingsHeader } from "./components/chat-settings-header";
import { ChatSettingsPanel } from "./components/chat-settings-panel";
import { ModelInfoBlock } from "./components/model-info-block";

export const ChatSettingsDrawer = ({
	isOpen,
	onClose,
	settings,
	onSettingsChange,
}: ChatSettingsDrawerProps) => {
	const { t } = useTranslation();
	const [localSettings, setLocalSettings] = useState(settings);

	useEffect(() => {
		setLocalSettings(settings);
	}, [settings]);

	const handleLocalSettingsChange = (newSettings: Partial<typeof settings>) => {
		setLocalSettings((prev) => ({ ...prev, ...newSettings }));
	};

	const handleReset = () => {
		setLocalSettings(settings);
		onClose();
	};

	const handleApply = () => {
		onSettingsChange(localSettings);
		onClose();
	};

	const handleClose = () => {
		setLocalSettings(settings); // Сбрасываем локальные изменения
		onClose();
	};
	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<SheetContent 
				side="right" 
				className="w-full sm:max-w-md p-0"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<ChatSettingsHeader />
				<ModelInfoBlock settings={settings} />

				<div className="px-4">
					<div className="h-px bg-border"></div>
				</div>

				<div className="pt-4 px-4">
					<ChatSettingsPanel
						settings={localSettings}
						onSettingsChange={handleLocalSettingsChange}
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 pt-6 px-2">
					<Button
						variant="secondary"
						size="lg"
						onClick={handleReset}
						className="flex-1 h-10"
					>
						{t("chatSettings.reset")}
					</Button>
					<Button
						variant="default"
						size="lg"
						onClick={handleApply}
						className="flex-1 h-10"
					>
						{t("chatSettings.apply")}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
