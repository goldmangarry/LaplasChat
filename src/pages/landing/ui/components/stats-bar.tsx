import { motion } from "motion/react";
import { Cpu, Server, Code2, Database } from "lucide-react";
import { fadeInUp, staggerContainer } from "../lib/animations";
import { useCountUp } from "../lib/use-count-up";

const STATS = [
	{
		target: 20,
		suffix: "+",
		label: "AI Models",
		icon: Cpu,
		color: "#6c56f0",
	},
	{
		target: 9,
		suffix: "",
		label: "Providers",
		icon: Server,
		color: "#4f8ef7",
	},
	{
		target: 100,
		suffix: "%",
		label: "Open Source",
		icon: Code2,
		color: "#8b5cf6",
	},
	{
		target: 0,
		suffix: "",
		label: "Data Stored",
		icon: Database,
		color: "#6c56f0",
		accent: true,
	},
];

const StatItem = ({
	target,
	suffix,
	label,
	icon: Icon,
	color,
	accent,
}: {
	target: number;
	suffix: string;
	label: string;
	icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
	color: string;
	accent?: boolean;
}) => {
	const { count, ref } = useCountUp(target);

	return (
		<motion.div
			variants={fadeInUp}
			className="text-center group"
			ref={ref as React.RefObject<HTMLDivElement>}
		>
			<div
				className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
				style={{ backgroundColor: `${color}12` }}
			>
				<Icon className="w-5 h-5" style={{ color }} />
			</div>
			<div
				className={`text-3xl sm:text-4xl font-bold ${accent ? "text-[#6c56f0]" : "text-[#0f0f0f]"}`}
			>
				{count}
				{suffix}
			</div>
			<div className="text-xs sm:text-sm text-gray-500 mt-1">{label}</div>
		</motion.div>
	);
};

// ─── Animated background — network/metrics theme ────────────────────────────

const StatsBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="xMidYMid slice">
			{/* Floating gradient blobs */}
			<circle cx="150" cy="50" r="100" fill="url(#sb-g1)" opacity="0.07">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 20,15; -10,-10; 0,0" dur="16s" repeatCount="indefinite" />
			</circle>
			<circle cx="1000" cy="200" r="120" fill="url(#sb-g2)" opacity="0.06">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -15,10; 10,-20; 0,0" dur="20s" repeatCount="indefinite" />
			</circle>

			{/* Connection lines between stat positions */}
			<path d="M200 150 Q400 120 600 150 T1000 140" stroke="url(#sb-line)" strokeWidth="0.6"
				fill="none" strokeDasharray="4 8" opacity="0.12">
				<animate attributeName="stroke-dashoffset" values="0;-24" dur="5s" repeatCount="indefinite" />
			</path>

			{/* Pulsing metric dots */}
			<circle cx="300" cy="150" r="2.5" fill="#6c56f0" opacity="0.2">
				<animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
			</circle>
			<circle cx="600" cy="140" r="2" fill="#4f8ef7" opacity="0.18">
				<animate attributeName="r" values="1.5;3;1.5" dur="4s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.08;0.22;0.08" dur="4s" repeatCount="indefinite" />
			</circle>
			<circle cx="900" cy="150" r="2" fill="#8b5cf6" opacity="0.15">
				<animate attributeName="r" values="1.5;2.5;1.5" dur="3.5s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.08;0.2;0.08" dur="3.5s" repeatCount="indefinite" />
			</circle>

			{/* Spinning accents */}
			<rect x="100" y="220" width="6" height="6" rx="1.5" fill="#6c56f0" opacity="0.06">
				<animateTransform attributeName="transform" type="rotate"
					values="0 103 223; 360 103 223" dur="18s" repeatCount="indefinite" />
			</rect>
			<rect x="1080" y="60" width="5" height="5" rx="1" fill="#4f8ef7" opacity="0.05">
				<animateTransform attributeName="transform" type="rotate"
					values="0 1083 63; -360 1083 63" dur="22s" repeatCount="indefinite" />
			</rect>

			<defs>
				<radialGradient id="sb-g1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#6c56f0" /><stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="sb-g2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#4f8ef7" /><stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="sb-line" x1="200" y1="150" x2="1000" y2="140" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" stopOpacity="0" />
					<stop offset="30%" stopColor="#6c56f0" />
					<stop offset="70%" stopColor="#4f8ef7" />
					<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

export const StatsBar = () => {
	return (
		<motion.section
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-80px" }}
			className="py-14 sm:py-16 px-4 bg-white relative overflow-hidden"
		>
			<StatsBackground />
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto relative z-10">
				{STATS.map((stat) => (
					<StatItem key={stat.label} {...stat} />
				))}
			</div>
		</motion.section>
	);
};
