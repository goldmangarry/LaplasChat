import { ShieldCheck } from "lucide-react";
import { MobileModeIndicator } from "../mobile-mode-indicator";

type MobileSecureIndicatorProps = {
	onClose: () => void;
	disabled?: boolean;
};

export function MobileSecureIndicator({
	onClose,
	disabled = false,
}: MobileSecureIndicatorProps) {
	return (
		<MobileModeIndicator
			icon={<ShieldCheck className="w-4 h-4" strokeWidth={1.33} />}
			onClose={onClose}
			disabled={disabled}
		/>
	);
}