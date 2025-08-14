import { ProviderIcon } from "@/components/shared/provider-icon";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import type { ChatSettings } from "@/core/chat/types";

type ModelInfoBlockProps = {
	settings: ChatSettings;
};

// Описания моделей согласно предоставленной таблице
const getModelDescription = (modelId: string) => {
	const descriptions: Record<string, string> = {
		// OpenAI модели
		"openai/gpt-5-chat": "Превосходна для самых сложных задач в бизнесе; работает с многоступенчатыми процессами и глубоким анализом; справляется с комплексным решением проблем компании.",
		"openai/gpt-5-mini": "Оптимальна для быстрых решений в высоконагруженных системах; работает с потоковой обработкой и мгновенными ответами; справляется с массовыми запросами в реальном времени.",
		"openai/gpt-4o": "Уместна для повседневных задач в бизнесе; работает с текстом и изображениями; справляется с точными ответами в процессах компании.",
		"openai/gpt-4o-mini": "Хороша для массовых чатов и ботов; работает быстро при высокой нагрузке; справляется с типовыми запросами.",
		"openai/gpt-4-turbo": "Эффективна для стабильных сервисов; работает с шаблонами и формами; справляется с автоматизацией рутин.",
		
		// Anthropic модели
		"anthropic/claude-sonnet-4": "Пригодна для длинных документов и четких выводов; работает с договорами и правилами; справляется с аккуратным суммированием.",
		"anthropic/claude-opus-4": "Оптимальна для сложной аналитики и материалов для руководства; работает с разнородными материалами; справляется, когда нужна высокая точность.",
		"anthropic/claude-3.5-haiku": "Полезна для быстрых черновиков и вариантов текстов; работает с короткими запросами; справляется там, где важна скорость.",
		
		// Perplexity модели
		"perplexity/sonar": "Идеальна для поиска актуальной информации в интернете; работает с реальными данными и свежими новостями; справляется с быстрым анализом текущих событий.",
		"perplexity/sonar-deep-research": "Превосходна для глубокого исследовательского анализа; работает с множественными источниками и детальной проверкой; справляется с комплексными исследовательскими задачами.",
		
		// Google модели
		"google/gemini-2.5-pro": "Рекомендуется для больших наборов файлов; работает с текстом, таблицами и медиа; справляется с анализом презентаций и записей встреч.",
		"google/gemini-2.5-flash": "Удобна для потоковых задач; работает с классификацией, тегами и типовыми ответами; справляется в реальном времени.",
		
		// Meta модели
		"meta-llama/llama-4-maverick": "Целесообразна для обработки целых документов; работает с большими объемами текста; справляется с настройкой под задачи компании.",
		"meta-llama/llama-3.3-70b-instruct": "Предпочтительна для работы на собственных серверах; работает с внутренними данными; справляется с адаптацией под лексику и правила компании.",
		
		// Mistral модели
		"mistralai/mistral-small-3.2-24b-instruct": "Практична для ограниченных ресурсов; работает быстро на обычных серверах; справляется со стандартными офисными задачами.",
		
		// DeepSeek модели
		"deepseek/deepseek-chat-v3-0324": "Рекомендуется для инженерных задач; работает с кодом и вычислениями; справляется с автотестами и расчетами.",
		"deepseek/deepseek-r1:free": "Идеальна для экспериментов и пилотов; работает с задачами, где нужно подробное рассуждение; справляется с быстрой проверкой гипотез.",
		"deepseek/deepseek-r1": "Оптимальна для важной нагрузки; работает стабильно при длинных рассуждениях; справляется, когда нужен предсказуемый результат.",
		"deepseek/deepseek-chat-v3-0324:free": "Хороша для прототипов поддержки и FAQ; работает в базовом режиме; справляется с типовыми вопросами клиентов.",
		
		// Qwen модели
		"qwen/qwen3-coder": "Пригодна для разработки; работает с большими проектами кода; справляется с чисткой кода, обновлениями и примерами.",
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
	const displayModelId = getDisplayModelId(settings.model);
	
	return (
		<div className="flex flex-col items-center justify-center gap-2 p-4 pb-8">
			<div className="flex items-center justify-center w-14 h-14 rounded-full">
				<ProviderIcon 
					provider={settings.provider} 
					className="w-14 h-14" 
				/>
			</div>
			
			<h3 className="text-center font-medium text-base leading-6 text-black">
				{getModelDisplayName(displayModelId)}
			</h3>
			
			<p className="text-center font-normal text-base leading-6 text-neutral-500 px-2">
				{getModelDescription(displayModelId)}
			</p>
		</div>
	);
};