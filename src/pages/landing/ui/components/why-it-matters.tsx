import { useState } from "react";
import {
	AlertTriangle,
	ChevronDown,
	Scale,
	Users,
	Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, staggerContainer } from "../lib/animations";

// ─── 2 compact stat blocks ──────────────────────────────────────────────────

const STATS_DATA = [
	{
		value: "77%",
		label: "of employees leak data via AI",
		source: "LayerX 2025",
	},
	{
		value: "3M+",
		label: "sensitive records exposed per organization in 6 months",
		source: "HelpNetSecurity 2025",
	},
];

// ─── Collapsible cards ──────────────────────────────────────────────────────

const RESEARCH_CARDS = [
	{
		icon: Scale,
		title: "Courts Override Vendor Privacy Promises",
		conclusion:
			"A court order can force any AI provider to permanently store your conversations — overriding deletion policies and enterprise contracts.",
		details: [
			"In May 2025, a US court ordered OpenAI to retain all ChatGPT conversations, including deleted \"temporary\" chats.",
			"Metadata (timestamps, session IDs, behavior patterns) is also retained indefinitely.",
			"Vendor privacy promises are only as strong as the next legal challenge.",
		],
	},
	{
		icon: Users,
		title: "Employees Massively Leak Data Through AI",
		conclusion:
			"Over half of all data pasted into chatbots contains PII, financials, or proprietary code — mostly from unmanaged personal accounts.",
		details: [
			"45% of corporate users use GenAI; 77% leak sensitive data through these tools.",
			"AI assistants like Copilot expose ~3M sensitive records per organization in 6 months.",
			"Shadow AI — personal accounts with no DLP — is the primary leak vector.",
		],
	},
	{
		icon: Eye,
		title: "Governments Build AI Surveillance at Scale",
		conclusion:
			"70%+ of public servants use AI, while regulatory frameworks lag behind. Commercial AI models are being deployed in classified government networks.",
		details: [
			"China runs real-time AI surveillance: face recognition, social media monitoring, behavioral analysis.",
			"In Feb 2026, OpenAI struck a deal with the Pentagon for classified network use.",
			"Without independent audit mechanisms, mass surveillance risk grows.",
		],
	},
];

// ─── Card component ─────────────────────────────────────────────────────────

const ResearchCard = ({
	icon: Icon,
	title,
	conclusion,
	details,
}: (typeof RESEARCH_CARDS)[number] & { index: number }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			variants={fadeInUp}
			whileHover={{ y: -2 }}
			className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full text-left p-4"
			>
				<div className="flex items-start gap-3">
					<div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
						<Icon className="w-4 h-4 text-red-600" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-sm text-[#0f0f0f] mb-1 pr-6">
							{title}
						</h3>
						<p className="text-xs text-gray-500 leading-relaxed">
							{conclusion}
						</p>
					</div>
					<motion.div
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={{ duration: 0.25 }}
						className="shrink-0 mt-0.5"
					>
						<ChevronDown className="w-4 h-4 text-gray-400" />
					</motion.div>
				</div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 pt-0 pl-[3.25rem]">
							<div className="h-px bg-[#e5e7eb] mb-3" />
							<ul className="space-y-2">
								{details.map((d, i) => (
									<li
										key={i}
										className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed"
									>
										<div className="w-1 h-1 rounded-full bg-red-600 shrink-0 mt-1.5" />
										{d}
									</li>
								))}
							</ul>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

// ─── Animated background — warning/data-leak theme ──────────────────────────

const WarningBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg
			className="absolute inset-0 w-full h-full"
			viewBox="0 0 1200 500"
			fill="none"
			preserveAspectRatio="xMidYMid slice"
		>
			{/* Pulsing warning blobs */}
			<circle cx="100" cy="80" r="120" fill="url(#wm-r1)" opacity="0.08">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 15,20; -10,-10; 0,0" dur="14s" repeatCount="indefinite" />
			</circle>
			<circle cx="1050" cy="350" r="150" fill="url(#wm-r2)" opacity="0.06">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -20,15; 10,-25; 0,0" dur="18s" repeatCount="indefinite" />
			</circle>
			<circle cx="600" cy="250" r="100" fill="url(#wm-r3)" opacity="0.05">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 10,-15; -15,10; 0,0" dur="16s" repeatCount="indefinite" />
			</circle>

			{/* Data leak flow lines */}
			<path d="M50 200 Q300 150 550 180 T1100 160" stroke="url(#wm-line1)"
				strokeWidth="0.8" fill="none" strokeDasharray="5 8" opacity="0.15">
				<animate attributeName="stroke-dashoffset" values="0;-26" dur="4s" repeatCount="indefinite" />
			</path>
			<path d="M0 350 Q250 300 500 330 T1000 310" stroke="url(#wm-line2)"
				strokeWidth="0.6" fill="none" strokeDasharray="4 10" opacity="0.12">
				<animate attributeName="stroke-dashoffset" values="0;28" dur="5s" repeatCount="indefinite" />
			</path>

			{/* Pulsing alert nodes */}
			<circle cx="200" cy="120" r="3" fill="#ef4444" opacity="0.25">
				<animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
			</circle>
			<circle cx="900" cy="100" r="2.5" fill="#dc2626" opacity="0.2">
				<animate attributeName="r" values="2;3.5;2" dur="4s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.12;0.3;0.12" dur="4s" repeatCount="indefinite" />
			</circle>
			<circle cx="500" cy="400" r="2" fill="#ef4444" opacity="0.18">
				<animate attributeName="r" values="1.5;3;1.5" dur="3.5s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.1;0.25;0.1" dur="3.5s" repeatCount="indefinite" />
			</circle>
			<circle cx="750" cy="80" r="2" fill="#f87171" opacity="0.15">
				<animate attributeName="opacity" values="0.08;0.22;0.08" dur="5s" repeatCount="indefinite" />
			</circle>

			{/* Floating warning triangles */}
			<polygon points="350,60 356,72 344,72" fill="#ef4444" opacity="0.08">
				<animateTransform attributeName="transform" type="rotate"
					values="0 350 66; 360 350 66" dur="20s" repeatCount="indefinite" />
			</polygon>
			<polygon points="850,380 858,396 842,396" fill="#dc2626" opacity="0.06">
				<animateTransform attributeName="transform" type="rotate"
					values="0 850 388; -360 850 388" dur="25s" repeatCount="indefinite" />
			</polygon>

			{/* Orbiting particle */}
			<circle r="2" fill="#ef4444" opacity="0.2">
				<animateMotion path="M600,250 m-200,0 a200,120 0 1,1 400,0 a200,120 0 1,1 -400,0"
					dur="22s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.1;0.25;0.1" dur="22s" repeatCount="indefinite" />
			</circle>

			<defs>
				<radialGradient id="wm-r1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#ef4444" />
					<stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="wm-r2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#dc2626" />
					<stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="wm-r3" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#f87171" />
					<stop offset="100%" stopColor="#f87171" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="wm-line1" x1="50" y1="200" x2="1100" y2="160" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
					<stop offset="30%" stopColor="#ef4444" />
					<stop offset="70%" stopColor="#dc2626" />
					<stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="wm-line2" x1="0" y1="350" x2="1000" y2="310" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
					<stop offset="30%" stopColor="#f87171" />
					<stop offset="70%" stopColor="#ef4444" />
					<stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

// ─── Main ───────────────────────────────────────────────────────────────────

export const WhyItMatters = () => {
	return (
		<motion.section
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-60px" }}
			className="py-10 sm:py-14 px-4 bg-white relative overflow-hidden"
		>
			<WarningBackground />
			<div className="max-w-3xl mx-auto relative z-10">
				{/* Header + stats inline */}
				<motion.div
					variants={fadeInUp}
					className="text-center mb-6"
				>
					<div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
						<AlertTriangle className="w-3 h-3" />
						Why This Matters
					</div>
					<h2 className="text-xl sm:text-2xl font-bold text-[#0f0f0f]">
						AI Privacy Is Not Optional
					</h2>
				</motion.div>

				{/* 2 compact stats */}
				<motion.div
					variants={fadeInUp}
					className="grid grid-cols-2 gap-3 mb-6"
				>
					{STATS_DATA.map((stat) => (
						<div
							key={stat.value}
							className="rounded-xl border border-red-100 bg-red-50/30 p-3 sm:p-4 text-center"
						>
							<div className="text-2xl sm:text-3xl font-bold text-red-600">
								{stat.value}
							</div>
							<div className="text-[11px] sm:text-xs text-gray-600 mt-0.5 leading-snug">
								{stat.label}
							</div>
							<div className="text-[9px] text-gray-400 mt-0.5">
								{stat.source}
							</div>
						</div>
					))}
				</motion.div>

				{/* 3 collapsible cards */}
				<div className="space-y-3">
					{RESEARCH_CARDS.map((card, i) => (
						<ResearchCard key={card.title} {...card} index={i} />
					))}
				</div>
			</div>
		</motion.section>
	);
};
