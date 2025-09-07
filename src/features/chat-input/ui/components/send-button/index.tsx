import { ArrowUp } from "@/components/animate-ui/icons/arrow-up";
import type { SendButtonProps } from "./types";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

export function SendButton({ onSend, disabled = false, loading = false }: SendButtonProps) {
  return (
    <AnimateIcon animateOnHover='default' animateOnTap='out'>
      <button
      onClick={onSend}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center w-10 h-10 rounded-lg transition-all
        ${disabled || loading 
          ? 'bg-primary opacity-50 cursor-not-allowed' 
          : 'bg-primary hover:bg-primary/90 active:scale-95'
        }
        shadow-sm
      `}
    >
      <ArrowUp className="w-5 h-5 text-primary-foreground" strokeWidth={1.33} />
    </button>
    </AnimateIcon>
  );
}