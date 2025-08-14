import type { ComponentType } from "react";

export type PromptSuggestionItem = {
  id: string;
  text: string;
  icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
};

export type PromptSuggestionProps = {
  suggestions: PromptSuggestionItem[];
  onSuggestionClick?: (suggestion: PromptSuggestionItem) => void;
};