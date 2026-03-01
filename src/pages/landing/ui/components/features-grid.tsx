import {
	ShieldCheck,
	Eye,
	EyeOff,
	Fingerprint,
	Search,
	Layers,
} from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "../lib/animations";

const features = [
	{
		icon: ShieldCheck,
		title: "Secure Mode",
		description:
			"Automatically detects and replaces personal names, company names, emails, phone numbers, and addresses with safe placeholders before any data reaches an AI provider.",
		color: "#6c56f0",
		gradient: "from-[#6c56f0] to-[#8b5cf6]",
		highlight: true,
	},
	{
		icon: EyeOff,
		title: "Zero Knowledge",
		description:
			"Your original data never leaves your browser. Only anonymized text is sent to AI models. Responses are decoded back locally on your device.",
		color: "#8b5cf6",
		gradient: "from-[#8b5cf6] to-[#a78bfa]",
	},
	{
		icon: Fingerprint,
		title: "PII Auto-Detection",
		description:
			"Intelligent detection of personally identifiable information: names, addresses, phone numbers, emails, IDs, and financial data — all masked automatically.",
		color: "#4f8ef7",
		gradient: "from-[#4f8ef7] to-[#60a5fa]",
	},
	{
		icon: Eye,
		title: "Transparent Processing",
		description:
			"See exactly what was anonymized and what the AI model received. Full visibility into every replacement made by Secure Mode.",
		color: "#06b6d4",
		gradient: "from-[#06b6d4] to-[#22d3ee]",
	},
	{
		icon: Search,
		title: "AI Fact-Checking",
		description:
			"One-click verification of facts and links. Powered by Perplexity Sonar for real-time accuracy checks and hallucination detection.",
		color: "#22c55e",
		gradient: "from-[#22c55e] to-[#4ade80]",
	},
	{
		icon: Layers,
		title: "20+ AI Models",
		description:
			"Switch between GPT, Claude, Gemini, DeepSeek, Llama and more. One interface for all major AI providers with your own API keys.",
		color: "#f59e0b",
		gradient: "from-[#f59e0b] to-[#fbbf24]",
	},
];

// ─── Animated background — security shield mesh ─────────────────────────────

const FeaturesBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" preserveAspectRatio="xMidYMid slice">
			{/* Gradient blobs */}
			<circle cx="100" cy="150" r="180" fill="url(#fg-g1)" opacity="0.06">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 25,30; -15,-20; 0,0" dur="18s" repeatCount="indefinite" />
			</circle>
			<circle cx="1100" cy="600" r="200" fill="url(#fg-g2)" opacity="0.05">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -20,15; 15,-30; 0,0" dur="22s" repeatCount="indefinite" />
			</circle>
			<circle cx="600" cy="100" r="140" fill="url(#fg-g3)" opacity="0.04">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 15,-20; -10,15; 0,0" dur="16s" repeatCount="indefinite" />
			</circle>

			{/* Security mesh lines */}
			<path d="M80 300 Q350 250 600 280 T1150 260" stroke="url(#fg-line1)" strokeWidth="0.7"
				fill="none" strokeDasharray="5 9" opacity="0.1">
				<animate attributeName="stroke-dashoffset" values="0;-28" dur="5s" repeatCount="indefinite" />
			</path>
			<path d="M0 550 Q300 500 600 530 T1200 500" stroke="url(#fg-line2)" strokeWidth="0.5"
				fill="none" strokeDasharray="3 10" opacity="0.08">
				<animate attributeName="stroke-dashoffset" values="0;26" dur="6s" repeatCount="indefinite" />
			</path>

			{/* Shield node cluster — left */}
			<g opacity="0.25">
				<circle cx="80" cy="400" r="3" fill="#6c56f0">
					<animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
				</circle>
				<circle cx="140" cy="350" r="2" fill="#4f8ef7">
					<animate attributeName="r" values="1.5;3;1.5" dur="4s" repeatCount="indefinite" />
				</circle>
				<circle cx="120" cy="460" r="2.5" fill="#8b5cf6">
					<animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />
				</circle>
				<line x1="80" y1="400" x2="140" y2="350" stroke="#6c56f0" strokeWidth="0.5" opacity="0.3">
					<animate attributeName="opacity" values="0.15;0.4;0.15" dur="3s" repeatCount="indefinite" />
				</line>
				<line x1="80" y1="400" x2="120" y2="460" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.25">
					<animate attributeName="opacity" values="0.1;0.35;0.1" dur="4s" repeatCount="indefinite" />
				</line>
			</g>

			{/* Shield node cluster — right */}
			<g opacity="0.25">
				<circle cx="1100" cy="300" r="3" fill="#4f8ef7">
					<animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
				</circle>
				<circle cx="1050" cy="240" r="2" fill="#6c56f0">
					<animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
				</circle>
				<circle cx="1080" cy="380" r="2.5" fill="#8b5cf6">
					<animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite" />
				</circle>
				<line x1="1100" y1="300" x2="1050" y2="240" stroke="#4f8ef7" strokeWidth="0.5" opacity="0.3">
					<animate attributeName="opacity" values="0.15;0.4;0.15" dur="4s" repeatCount="indefinite" />
				</line>
				<line x1="1100" y1="300" x2="1080" y2="380" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.25">
					<animate attributeName="opacity" values="0.1;0.35;0.1" dur="3.5s" repeatCount="indefinite" />
				</line>
			</g>

			{/* Orbiting particles */}
			<circle r="2.5" fill="#6c56f0" opacity="0.15">
				<animateMotion path="M600,400 m-250,0 a250,150 0 1,1 500,0 a250,150 0 1,1 -500,0"
					dur="28s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.08;0.2;0.08" dur="28s" repeatCount="indefinite" />
			</circle>
			<circle r="2" fill="#4f8ef7" opacity="0.12">
				<animateMotion path="M600,400 m-180,0 a180,100 0 1,0 360,0 a180,100 0 1,0 -360,0"
					dur="22s" repeatCount="indefinite" />
			</circle>

			{/* Spinning geometric accents */}
			<rect x="300" y="100" width="8" height="8" rx="2" fill="#6c56f0" opacity="0.06">
				<animateTransform attributeName="transform" type="rotate"
					values="0 304 104; 360 304 104" dur="20s" repeatCount="indefinite" />
			</rect>
			<polygon points="950,650 957,664 943,664" fill="#8b5cf6" opacity="0.05">
				<animateTransform attributeName="transform" type="rotate"
					values="0 950 657; 360 950 657" dur="25s" repeatCount="indefinite" />
			</polygon>

			<defs>
				<radialGradient id="fg-g1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#6c56f0" /><stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="fg-g2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="fg-g3" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#4f8ef7" /><stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="fg-line1" x1="80" y1="300" x2="1150" y2="260" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" stopOpacity="0" />
					<stop offset="30%" stopColor="#6c56f0" />
					<stop offset="70%" stopColor="#8b5cf6" />
					<stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="fg-line2" x1="0" y1="550" x2="1200" y2="500" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#4f8ef7" stopOpacity="0" />
					<stop offset="30%" stopColor="#4f8ef7" />
					<stop offset="70%" stopColor="#6c56f0" />
					<stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

export const FeaturesGrid = () => {
	return (
		<motion.section
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-80px" }}
			className="py-14 sm:py-20 px-4 bg-[#f8f7fc] relative overflow-hidden"
		>
			<FeaturesBackground />

			<div className="max-w-5xl mx-auto relative z-10">
				<h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0f0f0f] mb-3">
					Security-First AI Chat
				</h2>
				<p className="text-center text-gray-500 text-sm sm:text-base mb-10 max-w-2xl mx-auto">
					Secure Mode ensures your confidential data stays private
					while you use the most powerful AI models available.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
					{features.map((feature) => (
						<motion.div
							key={feature.title}
							variants={fadeInUp}
							whileHover={{
								y: -4,
								boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
							}}
							className={`rounded-2xl border bg-white p-6 shadow-sm transition-shadow cursor-default ${
								feature.highlight
									? "border-[#6c56f0]/30 ring-1 ring-[#6c56f0]/10"
									: "border-[#ebebeb]"
							}`}
						>
							<div
								className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-sm`}
							>
								<feature.icon className="w-5 h-5 text-white" />
							</div>
							{feature.highlight && (
								<span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#6c56f0] bg-[#f0eeff] px-2 py-0.5 rounded-full mb-2">
									Key Feature
								</span>
							)}
							<h3 className="font-semibold text-lg text-[#0f0f0f] mb-2">
								{feature.title}
							</h3>
							<p className="text-sm text-gray-500 leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
};
