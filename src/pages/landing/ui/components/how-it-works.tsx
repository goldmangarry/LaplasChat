import { Key, ToggleRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainerSlow } from "../lib/animations";

const steps = [
	{
		step: 1,
		title: "Get an API Key",
		description:
			"Sign up at OpenRouter.ai for a single key that covers all AI models. Or bring direct keys from OpenAI, Anthropic, or Google.",
		icon: Key,
		color: "#6c56f0",
		gradient: "from-[#6c56f0] to-[#8b5cf6]",
		illustration: (
			<div className="mt-4 rounded-xl border border-[#ebebeb] bg-white p-4 text-xs space-y-2.5 shadow-sm">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6c56f0] to-[#8b5cf6] flex items-center justify-center text-[8px] font-bold text-white">
						OR
					</div>
					<span className="text-gray-700 font-medium">
						OpenRouter
					</span>
					<span className="text-[10px] bg-[#f0eeff] text-[#6c56f0] px-1.5 py-0.5 rounded-full font-medium ml-auto">
						Recommended
					</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">
						OA
					</div>
					<span className="text-gray-400">OpenAI</span>
					<span className="text-[10px] text-gray-300 ml-auto">
						Optional
					</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">
						AN
					</div>
					<span className="text-gray-400">Anthropic</span>
					<span className="text-[10px] text-gray-300 ml-auto">
						Optional
					</span>
				</div>
			</div>
		),
	},
	{
		step: 2,
		title: "Enable Secure Mode",
		description:
			"Toggle Secure Mode on for any conversation. Your messages are automatically anonymized before reaching AI models.",
		icon: ToggleRight,
		color: "#22c55e",
		gradient: "from-[#22c55e] to-[#4ade80]",
		illustration: (
			<div className="mt-4 rounded-xl border border-[#ebebeb] bg-white p-4 text-xs space-y-3 shadow-sm">
				<div className="flex items-center justify-between">
					<span className="text-gray-700 font-medium">
						Secure Mode
					</span>
					<div className="w-9 h-5 bg-[#22c55e] rounded-full relative shadow-inner">
						<div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
					</div>
				</div>
				<div className="text-[10px] text-gray-400 leading-relaxed">
					PII detected: names, emails, addresses
				</div>
				<div className="flex gap-1.5 flex-wrap">
					<span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-medium">
						Sarah Chen
					</span>
					<span className="bg-[#f0eeff] text-[#6c56f0] px-2 py-0.5 rounded text-[10px] font-medium">
						→ [NAME_1]
					</span>
				</div>
				<div className="flex gap-1.5 flex-wrap">
					<span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-medium">
						sarah@email.com
					</span>
					<span className="bg-[#f0eeff] text-[#6c56f0] px-2 py-0.5 rounded text-[10px] font-medium">
						→ [EMAIL_1]
					</span>
				</div>
			</div>
		),
	},
	{
		step: 3,
		title: "Chat Safely",
		description:
			"Choose any model and chat freely. Secure Mode protects your data transparently — the AI sees only anonymized text.",
		icon: MessageCircle,
		color: "#4f8ef7",
		gradient: "from-[#4f8ef7] to-[#60a5fa]",
		illustration: (
			<div className="mt-4 rounded-xl border border-[#ebebeb] bg-white p-4 text-xs space-y-2 shadow-sm">
				<div className="flex items-center gap-2 mb-2">
					<div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6c56f0] to-[#4f8ef7]" />
					<span className="text-gray-700 font-medium">
						Claude Sonnet 4
					</span>
					<div className="ml-auto flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-green-400" />
						<span className="text-[10px] text-green-600 font-medium">
							Secure
						</span>
					</div>
				</div>
				<div className="bg-[#f4f4f5] rounded-lg px-3 py-2 text-gray-500">
					Draft an NDA for{" "}
					<span className="text-[#6c56f0] font-medium">
						[NAME_1]
					</span>{" "}
					at{" "}
					<span className="text-[#6c56f0] font-medium">
						[COMPANY_1]
					</span>
					...
				</div>
				<div className="bg-gradient-to-r from-[#f0eeff] to-[#e8f4fd] rounded-lg px-3 py-2 text-gray-700">
					Here is the NDA for Sarah Chen at Nextera...
				</div>
			</div>
		),
	},
];

// ─── Animated background — step flow theme ──────────────────────────────────

const StepsBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" fill="none" preserveAspectRatio="xMidYMid slice">
			{/* Gradient blobs */}
			<circle cx="200" cy="100" r="140" fill="url(#hw-g1)" opacity="0.06">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 20,25; -12,-15; 0,0" dur="17s" repeatCount="indefinite" />
			</circle>
			<circle cx="1000" cy="500" r="160" fill="url(#hw-g2)" opacity="0.05">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -18,12; 10,-25; 0,0" dur="21s" repeatCount="indefinite" />
			</circle>
			<circle cx="600" cy="650" r="120" fill="url(#hw-g3)" opacity="0.04">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 12,-18; -8,12; 0,0" dur="15s" repeatCount="indefinite" />
			</circle>

			{/* Flowing step-connection path */}
			<path d="M150 350 Q400 300 600 350 T1050 320" stroke="url(#hw-line1)" strokeWidth="0.8"
				fill="none" strokeDasharray="6 8" opacity="0.12">
				<animate attributeName="stroke-dashoffset" values="0;-28" dur="4.5s" repeatCount="indefinite" />
			</path>
			<path d="M100 500 Q350 450 600 480 T1100 460" stroke="url(#hw-line2)" strokeWidth="0.5"
				fill="none" strokeDasharray="3 10" opacity="0.08">
				<animate attributeName="stroke-dashoffset" values="0;26" dur="6s" repeatCount="indefinite" />
			</path>

			{/* Step indicator dots — 3 positions matching the grid */}
			<circle cx="200" cy="200" r="3" fill="#6c56f0" opacity="0.2">
				<animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.12;0.28;0.12" dur="3s" repeatCount="indefinite" />
			</circle>
			<circle cx="600" cy="180" r="3" fill="#22c55e" opacity="0.18">
				<animate attributeName="r" values="2;4;2" dur="3.5s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.1;0.25;0.1" dur="3.5s" repeatCount="indefinite" />
			</circle>
			<circle cx="1000" cy="200" r="3" fill="#4f8ef7" opacity="0.18">
				<animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.1;0.25;0.1" dur="4s" repeatCount="indefinite" />
			</circle>

			{/* Connecting lines between step dots */}
			<line x1="200" y1="200" x2="600" y2="180" stroke="#6c56f0" strokeWidth="0.4" opacity="0.08" strokeDasharray="4 6">
				<animate attributeName="opacity" values="0.04;0.12;0.04" dur="3s" repeatCount="indefinite" />
			</line>
			<line x1="600" y1="180" x2="1000" y2="200" stroke="#22c55e" strokeWidth="0.4" opacity="0.08" strokeDasharray="4 6">
				<animate attributeName="opacity" values="0.04;0.12;0.04" dur="4s" repeatCount="indefinite" />
			</line>

			{/* Floating accents */}
			<rect x="400" y="80" width="7" height="7" rx="2" fill="#6c56f0" opacity="0.05">
				<animateTransform attributeName="transform" type="rotate"
					values="0 404 84; 360 404 84" dur="18s" repeatCount="indefinite" />
			</rect>
			<rect x="850" y="600" width="6" height="6" rx="1.5" fill="#4f8ef7" opacity="0.04">
				<animateTransform attributeName="transform" type="rotate"
					values="0 853 603; -360 853 603" dur="24s" repeatCount="indefinite" />
			</rect>
			<polygon points="100,580 106,592 94,592" fill="#22c55e" opacity="0.05">
				<animateTransform attributeName="transform" type="rotate"
					values="0 100 586; 360 100 586" dur="22s" repeatCount="indefinite" />
			</polygon>

			<defs>
				<radialGradient id="hw-g1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#6c56f0" /><stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="hw-g2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#4f8ef7" /><stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="hw-g3" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="hw-line1" x1="150" y1="350" x2="1050" y2="320" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" stopOpacity="0" />
					<stop offset="30%" stopColor="#6c56f0" />
					<stop offset="70%" stopColor="#4f8ef7" />
					<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="hw-line2" x1="100" y1="500" x2="1100" y2="460" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
					<stop offset="30%" stopColor="#22c55e" />
					<stop offset="70%" stopColor="#6c56f0" />
					<stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

export const HowItWorks = () => {
	return (
		<motion.section
			variants={staggerContainerSlow}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-80px" }}
			className="py-14 sm:py-20 px-4 bg-white relative overflow-hidden"
		>
			<StepsBackground />
			<div className="max-w-5xl mx-auto relative z-10">
				<h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0f0f0f] mb-3">
					How It Works
				</h2>
				<p className="text-center text-gray-500 text-sm sm:text-base mb-10 sm:mb-12 max-w-lg mx-auto">
					Get started in three simple steps
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
					{steps.map((item) => {
						const Icon = item.icon;
						return (
							<motion.div key={item.step} variants={fadeInUp}>
								<div
									className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 shadow-sm`}
								>
									<Icon className="w-5 h-5 text-white" />
								</div>
								<div className="flex items-center gap-2 mb-2">
									<span
										className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
										style={{
											backgroundColor: `${item.color}12`,
											color: item.color,
										}}
									>
										Step {item.step}
									</span>
								</div>
								<h3 className="font-semibold text-lg text-[#0f0f0f] mb-2">
									{item.title}
								</h3>
								<p className="text-sm text-gray-500 leading-relaxed">
									{item.description}
								</p>
								{item.illustration}
							</motion.div>
						);
					})}
				</div>
			</div>
		</motion.section>
	);
};
