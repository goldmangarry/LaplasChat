import { SettingsSlider } from "../settings-slider";
import { useModels } from "@/core/api/models/hooks";
import type { ChatSettingsPanelProps } from "./types";

export const ChatSettingsPanel = ({
	settings,
	onSettingsChange,
}: ChatSettingsPanelProps) => {
	const { data: modelsData } = useModels();

	// Находим текущую модель для получения её max_output
	const currentModel = modelsData?.models.find(model => model.id === settings.model);
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
				label="Temperature"
				value={settings.temperature}
				min={0}
				max={2}
				step={0.1}
				leftLabel="Less accuracy"
				rightLabel="More creativity"
				onChange={handleTemperatureChange}
				showTooltip={true}
				tooltipContent="Controls randomness in responses. Lower values make the model more focused and deterministic, while higher values increase creativity and variability."
			/>

			{/* Output Length (Max Tokens) Slider */}
			<SettingsSlider
				label="Output Length"
				value={Math.min(settings.max_tokens, maxTokens)}
				min={1000}
				max={maxTokens}
				step={1000}
				leftLabel="Shorter"
				rightLabel="Longer"
				onChange={handleMaxTokensChange}
				showTooltip={true}
				tooltipContent={`Maximum number of tokens the model can generate in a single response. One token is roughly 3-4 characters or 0.75 words in English. Current model supports up to ${maxTokens} tokens.`}
			/>
		</div>
	);
};