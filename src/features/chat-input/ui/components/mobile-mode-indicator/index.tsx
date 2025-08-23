import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MobileModeIndicatorProps = {
	icon: React.ReactNode;
	onClose: () => void;
	disabled?: boolean;
};

export function MobileModeIndicator({
	icon,
	onClose,
	disabled = false,
}: MobileModeIndicatorProps) {
	return (
		<div className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg shadow-sm">
			<div className="flex items-center justify-center w-4 h-4 text-black">
				{icon}
			</div>
			<Button
				variant="ghost"
				size="sm"
				onClick={onClose}
				disabled={disabled}
				className="h-4 w-4 p-0 opacity-50 hover:opacity-70 rounded-sm"
			>
				<X className="h-2 w-2" strokeWidth={1.33} />
			</Button>
		</div>
	);
}