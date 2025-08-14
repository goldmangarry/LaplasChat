import { Copy, SearchCheck, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

type MessageFooterProps = {
  onCopy: () => void;
  onFactCheck: () => void;
};

export const MessageFooter = ({ onCopy, onFactCheck }: MessageFooterProps) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="flex items-center gap-1">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-2 py-[10px] rounded-lg hover:bg-stone-100 transition-colors"
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-stone-700" />
        )}
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