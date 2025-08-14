import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import type { PromptSuggestionProps, PromptSuggestionItem } from "./types";

export const PromptSuggestion = ({ 
  suggestions, 
  onSuggestionClick 
}: PromptSuggestionProps) => {

  const handleSuggestionClick = (suggestion: PromptSuggestionItem) => {
    onSuggestionClick?.(suggestion);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
      {suggestions.map((suggestion) => {
        const IconComponent = suggestion.icon;
        
        return (
          <AnimateIcon key={suggestion.id} animateOnHover animateOnTap>
          <button
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className="flex items-start gap-2 p-2 border border-stone-200 bg-stone-50 rounded-lg text-left hover:bg-stone-100 transition-colors"
          >
            {/* Icon Container */}
            <div className="flex items-center justify-center p-1 flex-shrink-0 mt-1">
              <IconComponent 
                size={16} 
                className="text-stone-500" 
                strokeWidth={1.5}
              />
            </div>
            
            {/* Text Content */}
            <span className="text-stone-800 text-base leading-6 font-normal">
              {suggestion.text}
            </span>
          </button>
          </AnimateIcon>
        );
      })}
    </div>
  );
};