export type SettingsSliderProps = {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	leftLabel: string;
	rightLabel: string;
	onChange: (value: number) => void;
	showTooltip?: boolean;
	tooltipContent?: string;
};