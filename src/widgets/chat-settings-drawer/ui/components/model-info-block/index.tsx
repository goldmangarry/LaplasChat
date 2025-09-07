import { useTranslation } from "react-i18next";
import { ProviderIcon } from "@/components/shared/provider-icon";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { ChatSettings } from "@/core/chat/types";

type ModelInfoBlockProps = {
	settings: ChatSettings;
};


// Получение отображаемого имени модели из API данных
const getModelDisplayName = (modelId: string) => {
	const modelNames: Record<string, string> = {
		"openai/gpt-5-chat": "OpenAI: GPT-5",
		"openai/gpt-5-mini": "OpenAI: GPT-5 Mini",
		"openai/gpt-4o": "OpenAI: GPT-4 Omni",
		"openai/gpt-4o-mini": "OpenAI: GPT-4 Omni Mini",
		"openai/gpt-4-turbo": "OpenAI: GPT-4 Turbo",
		"anthropic/claude-sonnet-4": "Anthropic: Claude Sonnet 4",
		"anthropic/claude-opus-4": "Anthropic: Claude 4 Opus",
		"anthropic/claude-3.5-haiku": "Anthropic: Claude 3.5 Haiku",
		"perplexity/sonar": "Perplexity: Sonar",
		"perplexity/sonar-deep-research": "Perplexity: Sonar Deep Research",
		"google/gemini-2.5-pro": "Google: Gemini 2.5 Pro",
		"google/gemini-2.5-flash": "Google: Gemini 2.5 Flash",
		"meta-llama/llama-4-maverick": "Meta: Llama 4 Maverick",
		"meta-llama/llama-3.3-70b-instruct": "Meta: Llama 3.3 70B Instruct",
		"mistralai/mistral-small-3.2-24b-instruct": "Mistral: Mistral Small 3.2 24B",
		"deepseek/deepseek-chat-v3-0324": "DeepSeek: DeepSeek V3 0324",
		"deepseek/deepseek-r1": "DeepSeek: DeepSeek R1",
		"deepseek/deepseek-r1:free": "DeepSeek: DeepSeek R1 (free)",
		"deepseek/deepseek-chat-v3-0324:free": "DeepSeek: DeepSeek V3 0324 (free)",
		"qwen/qwen3-coder": "Qwen: Qwen3 Coder",
	};
	return modelNames[modelId] || modelId;
};

export const ModelInfoBlock = ({ settings }: ModelInfoBlockProps) => {
	const { t } = useTranslation();
	const displayModelId = getDisplayModelId(settings.model);
	
	return (
		<div className="flex flex-col items-center justify-center gap-2 p-4 pb-8">
			<div className="flex items-center justify-center w-14 h-14 rounded-full">
				<ProviderIcon 
					provider={settings.provider} 
					className="w-14 h-14" 
				/>
			</div>
			
			<h3 className="text-center font-medium text-base leading-6">
				{getModelDisplayName(displayModelId)}
			</h3>
			
			<p className="text-center font-normal text-base leading-6 text-muted-foreground px-2">
				{t(`modelDescriptions.${displayModelId}`, t("modelDescriptions.unavailable"))}
			</p>
		</div>
	);
};