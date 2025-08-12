import { Copy, SearchCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type MessageFooterProps = {
  onCopy: () => void;
  onFactCheck: () => void;
};

export const MessageFooter = ({ onCopy, onFactCheck }: MessageFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {/* Copy Button */}
      <button
        onClick={onCopy}
        className="flex items-center gap-2 px-2 py-[10px] rounded-lg hover:bg-stone-100 transition-colors"
      >
        <Copy className="w-4 h-4 text-stone-700" />
        <span className="text-sm font-medium text-stone-700">
          {t('message.copy')}
        </span>
      </button>

      {/* Fact Check Button */}
      <button
        onClick={onFactCheck}
        className="flex items-center gap-2 px-2 py-[10px] rounded-lg hover:bg-stone-100 transition-colors"
      >
        <SearchCheck className="w-4 h-4 text-stone-700" />
        <span className="text-sm font-medium text-stone-700">
          {t('message.factCheck')}
        </span>
      </button>
    </div>
  );
};