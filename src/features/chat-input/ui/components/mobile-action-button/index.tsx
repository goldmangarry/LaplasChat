import { forwardRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type MobileActionButtonProps = {
	disabled?: boolean;
};

export const MobileActionButton = forwardRef<
	HTMLButtonElement,
	MobileActionButtonProps
>(({ disabled = false, ...props }, ref) => {
	return (
		<Button
			ref={ref}
			variant="secondary"
			size="icon"
			disabled={disabled}
			className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 shadow-sm border border-gray-200"
			{...props}
		>
			<Plus className="h-5 w-5 text-neutral-700" strokeWidth={1.33} />
		</Button>
	);
});

MobileActionButton.displayName = "MobileActionButton";