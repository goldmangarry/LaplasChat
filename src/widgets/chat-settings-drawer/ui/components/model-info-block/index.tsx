import { ProviderIcon } from "@/components/shared/provider-icon";
import type { ChatSettings } from "@/core/chat/types";

type ModelInfoBlockProps = {
	settings: ChatSettings;
};

// Описания моделей из Figma дизайна
const getModelDescription = (modelId: string) => {
	const descriptions: Record<string, string> = {
		// OpenAI модели
		"openai/gpt-4o": "Уместна для повседневных задач в бизнесе; работает с текстом и изображениями; справляется с точными ответами в процессах компании.",
		"openai/gpt-4o-mini": "Хороша для массовых чатов и ботов; работает быстро при высокой нагрузке; справляется с типовыми запросами.",
		"openai/gpt-4-turbo": "Эффективна для стабильных сервисов; работает с шаблонами и формами; справляется с автоматизацией рутин.",
		
		// DeepSeek модели
		"deepseek/deepseek-chat-v3-0324": "Рекомендуется для инженерных задач; работает с кодом и вычислениями; справляется с автотестами и расчетами.",
		"deepseek/deepseek-r1": "Оптимальна для важной нагрузки; работает стабильно при длинных рассуждениях; справляется, когда нужен предсказуемый результат.",
		"deepseek/deepseek-r1:free": "Идеальна для экспериментов и пилотов; работает с задачами, где нужно подробное рассуждение; справляется с быстрой проверкой гипотез.",
		"deepseek/deepseek-chat-v3-0324:free": "Хороша для прототипов поддержки и FAQ; работает в базовом режиме; справляется с типовыми вопросами клиентов.",
		
		// Anthropic модели
		"anthropic/claude-sonnet-4": "Пригодна для длинных документов и четких выводов; работает с договорами и правилами; справляется с аккуратным суммированием.",
		"anthropic/claude-opus-4": "Оптимальна для сложной аналитики и материалов для руководства; работает с разнородными материалами; справляется, когда нужна высокая точность.",
		"anthropic/claude-3.5-haiku": "Полезна для быстрых черновиков и вариантов текстов; работает с короткими запросами; справляется там, где важна скорость.",
		
		// Для остальных моделей - общие описания
		"openai/gpt-5-chat": "Новейшая флагманская модель OpenAI с передовыми возможностями.",
		"openai/gpt-5-mini": "Быстрая и экономичная версия GPT-5 для повседневных задач.",
		"perplexity/sonar": "Специализированная модель для поиска и анализа информации в реальном времени.",
		"perplexity/sonar-deep-research": "Углубленный поиск и исследование с детальным анализом источников.",
		"google/gemini-2.5-pro": "Мощная модель Google с огромным контекстным окном для обработки больших документов.",
		"google/gemini-2.5-flash": "Быстрая версия Gemini для задач, требующих мгновенного ответа.",
		"meta-llama/llama-4-maverick": "Новейшая модель Meta с революционными возможностями обработки текста.",
		"meta-llama/llama-3.3-70b-instruct": "Открытая модель Meta для инструкций и диалогов с высокой точностью.",
		"mistralai/mistral-small-3.2-24b-instruct": "Компактная европейская модель для быстрых и точных ответов.",
		"qwen/qwen3-coder": "Специализированная модель для программирования и разработки кода.",
	};
	return descriptions[modelId] || "Универсальная модель для решения широкого спектра задач.";
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
	return (
		<div className="flex flex-col items-center justify-center gap-2 p-4 pb-8">
			<div className="flex items-center justify-center w-14 h-14 rounded-full">
				<ProviderIcon 
					provider={settings.provider} 
					className="w-14 h-14" 
				/>
			</div>
			
			<h3 className="text-center font-medium text-base leading-6 text-black">
				{getModelDisplayName(settings.model)}
			</h3>
			
			<p className="text-center font-normal text-base leading-6 text-neutral-500 px-2">
				{getModelDescription(settings.model)}
			</p>
		</div>
	);
};