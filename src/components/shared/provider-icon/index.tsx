import type { ModelProvider } from "@/core/api/models/types";

// Импорты иконок провайдеров
import OpenAIIcon from "@/assets/icons/openai.svg";
import PerplexityIcon from "@/assets/icons/perplexity.svg";
import AnthropicIcon from "@/assets/icons/anthropic.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import GrokIcon from "@/assets/icons/grok.svg";
import MetaIcon from "@/assets/icons/meta-color.svg";
import MistralIcon from "@/assets/icons/mistral-color.svg";
import DeepseekIcon from "@/assets/icons/deepseek-color.svg";
import QwenIcon from "@/assets/icons/qwen-color.svg";
import { useTheme } from "@/core/theme";

type ProviderIconProps = {
  provider: ModelProvider;
  className?: string;
};

export const ProviderIcon = ({ provider, className = "w-4 h-4" }: ProviderIconProps) => {
  const { theme } = useTheme();

  const getIconStyle = () => {
    // Провайдеры, которые нуждаются в белом цвете для темной темы
    const needsWhiteInDark = ["openai", "perplexity"];
    
    if (needsWhiteInDark.includes(provider) && theme === "dark") {
      return { filter: "brightness(0) invert(1)" };
    }
    
    return {};
  };

  const getIcon = () => {
    switch (provider) {
      case "openai":
        return OpenAIIcon;
      case "anthropic":
        return AnthropicIcon;
      case "perplexity":
        return PerplexityIcon;
      case "google":
        return GoogleIcon;
      case "meta-llama":
        return MetaIcon;
      case "mistralai":
        return MistralIcon;
      case "deepseek":
        return DeepseekIcon;
      case "qwen":
        return QwenIcon;
      case "grok":
        return GrokIcon;
      default:
        return OpenAIIcon; // fallback
    }
  };

  return (
    <img 
      src={getIcon()} 
      alt={`${provider} icon`} 
      className={className}
      style={getIconStyle()}
    />
  );
};