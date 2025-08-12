import type { TFunction } from "i18next";
import type { PromptSuggestionItem } from "./types";
import { Bot } from "@/components/animate-ui/icons/bot";
import { Heart } from "@/components/animate-ui/icons/heart";
import { MessageSquareMore } from "@/components/animate-ui/icons/message-square-more";

export const createDefaultSuggestions = (t: TFunction): PromptSuggestionItem[] => [
  {
    id: "ai-business-scaling",
    text: t("suggestions.aiBusinessScaling", "Как крупные компании масштабируют ИИ в ключевых бизнес-процессах?"),
    icon: Bot,
  },
  {
    id: "ai-healthcare",
    text: t("suggestions.aiHealthcare", "Какие ИИ-решения применяют медорганизации для диагностики и лечения?"),
    icon: Heart,
  },
  {
    id: "nlp-customer-support",
    text: t("suggestions.nlpCustomerSupport", "Как компании используют NLP для автоматизации клиентской поддержки?"),
    icon: MessageSquareMore,
  },
];