import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { SettingsSliderProps } from "./types";

export const SettingsSlider = ({
	label,
	value,
	min,
	max,
	step,
	leftLabel,
	rightLabel,
	onChange,
	showTooltip = false,
	tooltipContent,
}: SettingsSliderProps) => {
	const [inputValue, setInputValue] = useState(value.toString());

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseFloat(e.target.value);
		setInputValue(newValue.toString());
		onChange(newValue);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		
		const numValue = parseFloat(newValue);
		if (!isNaN(numValue) && numValue >= min && numValue <= max) {
			onChange(numValue);
		}
	};

	const handleInputBlur = () => {
		const numValue = parseFloat(inputValue);
		if (isNaN(numValue) || numValue < min || numValue > max) {
			setInputValue(value.toString());
		}
	};

	return (
		<div className="flex flex-col items-center gap-2 px-2">
			{/* Label and Input Row */}
			<div className="flex justify-between items-center w-full gap-10">
				<div className="flex items-center gap-1">
					<span className="text-sm font-normal">
						{label}
					</span>
					{showTooltip && tooltipContent && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="w-4 h-4 text-muted-foreground cursor-help" />
							</TooltipTrigger>
							<TooltipContent side="top" className="max-w-xs">
								<p>{tooltipContent}</p>
							</TooltipContent>
						</Tooltip>
					)}
				</div>
				<div className="w-16">
					<div className="relative">
						<input
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							onBlur={handleInputBlur}
							autoFocus={false}
							className="w-full h-8 px-3 text-sm text-center bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
						/>
					</div>
				</div>
			</div>

			{/* Slider */}
			<div className="relative w-full h-1 bg-neutral-100 rounded-full">
				<input
					type="range"
					autoFocus={false}
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={handleSliderChange}
					className="absolute inset-0 w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-neutral-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-neutral-900 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-sm"
					style={{
						background: `linear-gradient(to right, #292524 0%, #292524 ${((value - min) / (max - min)) * 100}%, #f5f5f5 ${((value - min) / (max - min)) * 100}%, #f5f5f5 100%)`
					}}
				/>
			</div>

			{/* Labels */}
			<div className="flex justify-between items-center w-full gap-12">
				<span className="text-xs font-medium text-muted-foreground">
					{leftLabel}
				</span>
				<span className="text-xs font-medium text-muted-foreground">
					{rightLabel}
				</span>
			</div>

		</div>
	);
};