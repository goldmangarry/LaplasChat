import { ChevronsUpDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Drawer,
	DrawerContent,
} from "@/components/ui/drawer";
import { ProviderIcon } from "@/components/shared/provider-icon";
import { useModels } from "@/core/api/models/hooks";
import { getDisplayModelId } from "@/shared/lib/model-utils";
import { useIsMobile } from "@/components/hooks/use-mobile";
import type { ModelSelectorProps } from "../../../types";
import type { ModelProvider, Model } from "@/core/api/models/types";

const formatTokenCount = (count: number): string => {
	if (count >= 1000000) return `${(count / 1000000).toFixed(0)}M`;
	if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
	return `${count}`;
};

const PROVIDER_DISPLAY_NAMES: Record<ModelProvider, string> = {
	openai: "OpenAI",
	anthropic: "Anthropic",
	google: "Google",
	"meta-llama": "Meta",
	deepseek: "DeepSeek",
	mistralai: "Mistral",
	perplexity: "Perplexity",
	qwen: "Qwen",
	"x-ai": "xAI",
};

const PROVIDER_ORDER: ModelProvider[] = [
	"openai",
	"anthropic",
	"google",
	"deepseek",
	"meta-llama",
	"mistralai",
	"perplexity",
	"qwen",
	"x-ai",
];

type ModelItemProps = {
	model: Model;
	isSelected: boolean;
	onClick: () => void;
};

const ModelItem = ({ model, isSelected, onClick }: ModelItemProps) => {
	return (
		<button
			className={cn(
				"w-full text-left p-2 rounded-md transition-colors border-0 bg-transparent",
				"hover:bg-muted focus:outline-none",
				isSelected && "bg-muted",
			)}
			onClick={onClick}
		>
			<div className="flex items-center justify-between gap-2">
				<span className="font-medium text-sm truncate text-foreground">
					{model.name}
				</span>
				{model.context_window > 0 && (
					<span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
						{formatTokenCount(model.context_window)} ctx
					</span>
				)}
			</div>
		</button>
	);
};

type ProviderBlockProps = {
	provider: ModelProvider;
	models: Model[];
	selectedModel: string;
	onModelChange: (model: string, provider: ModelProvider) => void;
};

const ProviderBlock = ({
	provider,
	models,
	selectedModel,
	onModelChange,
}: ProviderBlockProps) => {
	const displaySelectedModel = getDisplayModelId(selectedModel);
	return (
		<div className="space-y-1">
			<div className="flex items-center gap-2 px-1 py-1">
				<div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
					<ProviderIcon provider={provider} className="w-5 h-5" />
				</div>
				<span className="font-medium text-xs text-foreground">
					{PROVIDER_DISPLAY_NAMES[provider] ?? provider}
				</span>
			</div>
			<div className="space-y-0.5">
				{models.map((model) => (
					<ModelItem
						key={model.id}
						model={model}
						isSelected={displaySelectedModel === model.id}
						onClick={() => onModelChange(model.id, model.provider)}
					/>
				))}
			</div>
		</div>
	);
};

export const ModelSelector = ({
	selectedModel,
	selectedProvider,
	onModelChange,
}: ModelSelectorProps) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const { data: modelsData, isLoading } = useModels();
	const isMobile = useIsMobile();
	const { t } = useTranslation();

	const models = modelsData?.models ?? [];
	const displayModelId = getDisplayModelId(selectedModel);
	const selectedModelData = models.find(
		(model) => model.id === displayModelId,
	);

	const filteredModels = useMemo(() => {
		if (!search.trim()) return models;
		const q = search.toLowerCase();
		return models.filter(
			(m) =>
				m.name.toLowerCase().includes(q) ||
				m.id.toLowerCase().includes(q),
		);
	}, [models, search]);

	const modelsByProvider = useMemo(() => {
		const grouped: Partial<Record<ModelProvider, Model[]>> = {};
		for (const model of filteredModels) {
			if (!grouped[model.provider]) {
				grouped[model.provider] = [];
			}
			grouped[model.provider]!.push(model);
		}

		const sorted: Array<[ModelProvider, Model[]]> = [];
		for (const p of PROVIDER_ORDER) {
			if (grouped[p]) {
				sorted.push([p, grouped[p]!]);
			}
		}
		return sorted;
	}, [filteredModels]);

	const [leftColumn, rightColumn] = useMemo(() => {
		if (isMobile) return [[], modelsByProvider];
		const left: typeof modelsByProvider = [];
		const right: typeof modelsByProvider = [];
		const leftProviders = new Set<ModelProvider>([
			"openai",
			"anthropic",
			"perplexity",
			"meta-llama",
		]);
		for (const entry of modelsByProvider) {
			if (leftProviders.has(entry[0])) {
				left.push(entry);
			} else {
				right.push(entry);
			}
		}
		return [left, right];
	}, [modelsByProvider, isMobile]);

	const handleModelSelect = (modelId: string, provider: ModelProvider) => {
		if (selectedModel !== modelId) {
			onModelChange(modelId, provider);
		}
		setOpen(false);
		setSearch("");
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) setSearch("");
	};

	const triggerButton = (
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={open}
			className="w-[250px] sm:w-[300px] justify-between"
			disabled={isLoading}
			onClick={() => setOpen(true)}
		>
			<div className="flex items-center gap-2">
				<ProviderIcon provider={selectedProvider} className="w-4 h-4" />
				<span className="truncate">
					{selectedModelData?.name ?? displayModelId}
				</span>
			</div>
			<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
		</Button>
	);

	const content = (
		<div className="flex flex-col">
			<div className="flex items-center gap-2 px-3 py-2 border-b">
				<Search className="w-4 h-4 text-muted-foreground shrink-0" />
				<input
					type="text"
					placeholder={t("chat.searchModels", "Search models...")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					autoFocus
				/>
			</div>

			<div
				className={cn(
					"overflow-y-auto p-2",
					isMobile ? "max-h-[60vh]" : "max-h-[500px]",
				)}
			>
				{modelsByProvider.length === 0 ? (
					<div className="text-center text-sm text-muted-foreground py-8">
						{isLoading
							? t("chat.loadingModels", "Loading models...")
							: t("chat.noModels", "No models found")}
					</div>
				) : (
					<div
						className={cn(
							isMobile ? "space-y-3" : "grid grid-cols-2 gap-3",
						)}
					>
						{!isMobile && (
							<div className="space-y-3">
								{leftColumn.map(([provider, providerModels]) => (
									<ProviderBlock
										key={provider}
										provider={provider}
										models={providerModels}
										selectedModel={selectedModel}
										onModelChange={handleModelSelect}
									/>
								))}
							</div>
						)}

						<div className="space-y-3">
							{rightColumn.map(([provider, providerModels]) => (
								<ProviderBlock
									key={provider}
									provider={provider}
									models={providerModels}
									selectedModel={selectedModel}
									onModelChange={handleModelSelect}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={handleOpenChange}>
				{triggerButton}
				<DrawerContent className="max-h-[80vh]">
					{content}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
			<PopoverContent className="w-[700px] p-0" align="start">
				{content}
			</PopoverContent>
		</Popover>
	);
};
