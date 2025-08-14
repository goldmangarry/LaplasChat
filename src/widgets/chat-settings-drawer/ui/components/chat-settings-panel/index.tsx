import { useTranslation } from "react-i18next";
import { SettingsSlider } from "../settings-slider";
import { useModels } from "@/core/api/models/hooks";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { ChatSettingsPanelProps } from "./types";

export const ChatSettingsPanel = ({
	settings,
	onSettingsChange,
}: ChatSettingsPanelProps) => {
	const { t } = useTranslation();
	const { data: modelsData } = useModels();

	// Находим текущую модель для получения её max_output
	const displayModelId = getDisplayModelId(settings.model);
	const currentModel = modelsData?.models.find(model => model.id === displayModelId);
	const maxTokens = currentModel?.max_output || 16384; // fallback к дефолтному значению

	const handleTemperatureChange = (temperature: number) => {
		onSettingsChange({ temperature });
	};

	const handleMaxTokensChange = (max_tokens: number) => {
		onSettingsChange({ max_tokens });
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Temperature Slider */}
			<SettingsSlider
				label={t("chatSettings.temperature")}
				value={settings.temperature}
				min={0}
				max={2}
				step={0.1}
				leftLabel={t("chatSettings.tooltips.lessAccuracy")}
				rightLabel={t("chatSettings.tooltips.moreCreativity")}
				onChange={handleTemperatureChange}
				showTooltip={true}
				tooltipContent={t("chatSettings.tooltips.temperature")}
			/>

			{/* Output Length (Max Tokens) Slider */}
			<SettingsSlider
				label={t("chatSettings.maxTokens")}
				value={Math.min(settings.max_tokens, maxTokens)}
				min={1000}
				max={maxTokens}
				step={1000}
				leftLabel={t("chatSettings.tooltips.shorter")}
				rightLabel={t("chatSettings.tooltips.longer")}
				onChange={handleMaxTokensChange}
				showTooltip={true}
				tooltipContent={t("chatSettings.tooltips.outputLength", { maxTokens })}
			/>
		</div>
	);
};