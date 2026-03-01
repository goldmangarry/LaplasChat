import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, staggerContainer } from "../lib/animations";

const faqs = [
	{
		question: "How does Secure Mode protect my data?",
		answer:
			"Secure Mode scans your messages locally in the browser, detects personally identifiable information (names, emails, addresses, phone numbers, company names), and replaces them with neutral placeholders like [NAME_1], [EMAIL_1] before the text is sent to any AI model. The AI response is then decoded back with your original values — all on your device.",
		color: "#6c56f0",
	},
	{
		question: "What types of data does Secure Mode detect?",
		answer:
			"Secure Mode automatically detects and anonymizes: personal names, company/organization names, email addresses, phone numbers, physical addresses, and other PII patterns. You can also customize the anonymization rules in the settings.",
		color: "#7c6af0",
	},
	{
		question: "Can I use my own API keys?",
		answer:
			"Yes! LaplasChat supports OpenRouter as the primary provider (giving you access to 20+ models with one key), plus optional direct API keys from OpenAI (ChatGPT), Anthropic (Claude), and Google (Gemini).",
		color: "#8b5cf6",
	},
	{
		question: "Is my data stored anywhere?",
		answer:
			"API keys are stored locally in your browser's localStorage. With Secure Mode enabled, your original data never leaves your device — only the anonymized version is sent to AI providers. No telemetry, no tracking.",
		color: "#4f8ef7",
	},
	{
		question: "What models are supported?",
		answer:
			"LaplasChat supports models from 9+ providers: OpenAI (GPT-4o, GPT-5, o3, o4), Anthropic (Claude Opus, Sonnet, Haiku), Google (Gemini 2.5/3 Pro/Flash), Meta (Llama 4), DeepSeek, Mistral, Perplexity, Qwen, and xAI (Grok). Models are loaded dynamically from your API provider.",
		color: "#5b6cf0",
	},
	{
		question: "Is LaplasChat free?",
		answer:
			"LaplasChat is 100% free and open source (MIT license). You only pay for AI model usage through your own API keys — no platform fees, no subscriptions, no hidden costs.",
		color: "#9b7ef6",
	},
];

const FAQItem = ({
	question,
	answer,
	color,
}: {
	question: string;
	answer: string;
	color: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			variants={fadeInUp}
			className="border-b border-[#e5e7eb] last:border-b-0"
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between py-4 sm:py-5 text-left group"
			>
				<div className="flex items-center gap-3 pr-4">
					<div
						className="w-1 h-6 rounded-full shrink-0 transition-all duration-300"
						style={{
							backgroundColor: isOpen ? color : "#e5e7eb",
						}}
					/>
					<span className="font-medium text-[#0f0f0f] text-sm sm:text-base group-hover:text-[#6c56f0] transition-colors">
						{question}
					</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 text-gray-400 transition-transform shrink-0 duration-300 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<p className="text-sm text-gray-500 pb-5 pl-6 leading-relaxed">
							{answer}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

// ─── Animated background — knowledge/questions theme ─────────────────────────

const FAQBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 700" fill="none" preserveAspectRatio="xMidYMid slice">
			{/* Gradient blobs */}
			<circle cx="150" cy="100" r="150" fill="url(#fq-g1)" opacity="0.06">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 18,22; -10,-15; 0,0" dur="15s" repeatCount="indefinite" />
			</circle>
			<circle cx="1050" cy="550" r="180" fill="url(#fq-g2)" opacity="0.05">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -22,14; 12,-20; 0,0" dur="19s" repeatCount="indefinite" />
			</circle>
			<circle cx="500" cy="600" r="100" fill="url(#fq-g3)" opacity="0.04">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 14,-12; -8,16; 0,0" dur="17s" repeatCount="indefinite" />
			</circle>

			{/* Flow lines */}
			<path d="M50 250 Q300 200 600 230 T1150 210" stroke="url(#fq-line1)" strokeWidth="0.6"
				fill="none" strokeDasharray="4 9" opacity="0.1">
				<animate attributeName="stroke-dashoffset" values="0;-26" dur="5s" repeatCount="indefinite" />
			</path>
			<path d="M0 500 Q250 460 500 480 T1050 450" stroke="url(#fq-line2)" strokeWidth="0.5"
				fill="none" strokeDasharray="3 10" opacity="0.07">
				<animate attributeName="stroke-dashoffset" values="0;26" dur="6.5s" repeatCount="indefinite" />
			</path>

			{/* Pulsing knowledge dots */}
			<circle cx="120" cy="350" r="2.5" fill="#6c56f0" opacity="0.18">
				<animate attributeName="r" values="2;3.5;2" dur="3.5s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.1;0.25;0.1" dur="3.5s" repeatCount="indefinite" />
			</circle>
			<circle cx="1080" cy="200" r="2" fill="#8b5cf6" opacity="0.15">
				<animate attributeName="r" values="1.5;3;1.5" dur="4s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.08;0.2;0.08" dur="4s" repeatCount="indefinite" />
			</circle>
			<circle cx="900" cy="400" r="2" fill="#4f8ef7" opacity="0.15">
				<animate attributeName="r" values="1.5;2.5;1.5" dur="3s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.08;0.2;0.08" dur="3s" repeatCount="indefinite" />
			</circle>

			{/* Orbiting particle */}
			<circle r="2" fill="#8b5cf6" opacity="0.12">
				<animateMotion path="M600,350 m-200,0 a200,130 0 1,1 400,0 a200,130 0 1,1 -400,0"
					dur="26s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.06;0.16;0.06" dur="26s" repeatCount="indefinite" />
			</circle>

			{/* Question mark shaped accent — floating */}
			<text x="80" y="500" fontSize="20" fill="#6c56f0" opacity="0.04" fontFamily="sans-serif" fontWeight="bold">?
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 5,-8; -3,4; 0,0" dur="12s" repeatCount="indefinite" />
			</text>
			<text x="1100" y="120" fontSize="16" fill="#8b5cf6" opacity="0.03" fontFamily="sans-serif" fontWeight="bold">?
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -4,6; 3,-5; 0,0" dur="14s" repeatCount="indefinite" />
			</text>

			{/* Spinning accents */}
			<rect x="250" y="80" width="6" height="6" rx="1.5" fill="#6c56f0" opacity="0.05">
				<animateTransform attributeName="transform" type="rotate"
					values="0 253 83; 360 253 83" dur="20s" repeatCount="indefinite" />
			</rect>
			<polygon points="1000,600 1006,612 994,612" fill="#4f8ef7" opacity="0.04">
				<animateTransform attributeName="transform" type="rotate"
					values="0 1000 606; 360 1000 606" dur="28s" repeatCount="indefinite" />
			</polygon>

			<defs>
				<radialGradient id="fq-g1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#6c56f0" /><stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="fq-g2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="fq-g3" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#4f8ef7" /><stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="fq-line1" x1="50" y1="250" x2="1150" y2="210" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" stopOpacity="0" />
					<stop offset="30%" stopColor="#6c56f0" />
					<stop offset="70%" stopColor="#8b5cf6" />
					<stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="fq-line2" x1="0" y1="500" x2="1050" y2="450" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#4f8ef7" stopOpacity="0" />
					<stop offset="30%" stopColor="#4f8ef7" />
					<stop offset="70%" stopColor="#6c56f0" />
					<stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

export const FAQSection = () => {
	return (
		<motion.section
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-80px" }}
			className="py-14 sm:py-20 px-4 bg-[#f8f7fc] relative overflow-hidden"
		>
			<FAQBackground />

			<div className="max-w-2xl mx-auto relative z-10">
				<div className="flex items-center justify-center gap-2 mb-3">
					<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6c56f0] to-[#8b5cf6] flex items-center justify-center">
						<HelpCircle className="w-4.5 h-4.5 text-white" />
					</div>
				</div>
				<h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0f0f0f] mb-2">
					Frequently Asked Questions
				</h2>
				<p className="text-center text-gray-500 text-sm mb-8 sm:mb-10">
					Everything you need to know about LaplasChat
				</p>
				<div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm px-5 sm:px-6">
					{faqs.map((faq) => (
						<FAQItem key={faq.question} {...faq} />
					))}
				</div>
			</div>
		</motion.section>
	);
};
