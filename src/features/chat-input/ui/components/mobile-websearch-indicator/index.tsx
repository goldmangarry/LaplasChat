import { Globe } from "lucide-react";
import { MobileModeIndicator } from "../mobile-mode-indicator";

type MobileWebSearchIndicatorProps = {
	onClose: () => void;
	disabled?: boolean;
};

export function MobileWebSearchIndicator({
	onClose,
	disabled = false,
}: MobileWebSearchIndicatorProps) {
	return (
		<MobileModeIndicator
			icon={<Globe className="w-4 h-4" strokeWidth={1.33} />}
			onClose={onClose}
			disabled={disabled}
		/>
	);
}