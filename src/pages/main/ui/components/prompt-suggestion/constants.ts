import type { TFunction } from "i18next";
import type { PromptSuggestionItem } from "./types";
import { Eye, Shield, AlertTriangle } from "lucide-react";

export const createDefaultSuggestions = (t: TFunction): PromptSuggestionItem[] => [
  {
    id: "ai-data-collection",
    text: t("suggestions.aiDataCollection", "What data do AI companies collect from your conversations, and who has access?"),
    icon: Eye,
  },
  {
    id: "local-anonymization",
    text: t("suggestions.localAnonymization", "How does local anonymization protect your privacy when using AI models?"),
    icon: Shield,
  },
  {
    id: "business-secrets",
    text: t("suggestions.businessSecrets", "What are the real risks of sharing business secrets with commercial AI chatbots?"),
    icon: AlertTriangle,
  },
];
