import { Fragment } from "react";
import { motion } from "motion/react";
import {
	ShieldCheck,
	Paperclip,
	Globe,
	ArrowUp,
	ChevronDown,
	Settings,
	PanelLeft,
	MonitorSmartphone,
	Lock,
	Unlock,
	Send,
	Eye,
} from "lucide-react";
import {
	fadeInUp,
	parallaxRise,
	parallaxRiseDeep,
	parallaxRiseShallow,
	scaleInCenter,
} from "../lib/animations";

// ─── Data ───────────────────────────────────────────────────────────────────

const MESSAGE_SEGMENTS: Array<{
	text: string;
	piiType?: string;
	placeholder?: string;
}> = [
	{ text: "Hi, I need help drafting an NDA.\n\nMy name is " },
	{ text: "Sarah Chen", piiType: "NAME", placeholder: "[NAME_1]" },
	{ text: ", " },
	{ text: "CEO", piiType: "TITLE", placeholder: "[TITLE_1]" },
	{ text: " of " },
	{ text: "Nextera Dynamics", piiType: "COMPANY", placeholder: "[COMPANY_1]" },
	{ text: ".\nOur office is at " },
	{
		text: "742 Innovation Drive, San Francisco, CA 94105",
		piiType: "ADDRESS",
		placeholder: "[ADDRESS_1]",
	},
	{ text: ".\nContact: " },
	{
		text: "sarah.chen@nextera.io",
		piiType: "EMAIL",
		placeholder: "[EMAIL_1]",
	},
	{ text: ", " },
	{
		text: "+1 (415) 555-0192",
		piiType: "PHONE",
		placeholder: "[PHONE_1]",
	},
	{ text: ".\n\nThe other party is " },
	{ text: "James Miller", piiType: "NAME", placeholder: "[NAME_2]" },
	{ text: " from " },
	{ text: "Apex Solutions", piiType: "COMPANY", placeholder: "[COMPANY_2]" },
	{ text: "." },
];

const AI_RESPONSE_SEGMENTS: Array<{
	text: string;
	piiType?: string;
	placeholder?: string;
	original?: string;
}> = [
	{ text: "Here is a draft NDA between " },
	{
		text: "Sarah Chen",
		piiType: "NAME",
		placeholder: "[NAME_1]",
		original: "Sarah Chen",
	},
	{ text: " (" },
	{
		text: "CEO",
		piiType: "TITLE",
		placeholder: "[TITLE_1]",
		original: "CEO",
	},
	{ text: ", " },
	{
		text: "Nextera Dynamics",
		piiType: "COMPANY",
		placeholder: "[COMPANY_1]",
		original: "Nextera Dynamics",
	},
	{ text: ") and " },
	{
		text: "James Miller",
		piiType: "NAME",
		placeholder: "[NAME_2]",
		original: "James Miller",
	},
	{ text: " (" },
	{
		text: "Apex Solutions",
		piiType: "COMPANY",
		placeholder: "[COMPANY_2]",
		original: "Apex Solutions",
	},
	{
		text: "):\n\nThis Non-Disclosure Agreement is entered into by the parties at ",
	},
	{
		text: "742 Innovation Drive, San Francisco, CA 94105",
		piiType: "ADDRESS",
		placeholder: "[ADDRESS_1]",
		original: "742 Innovation Drive, San Francisco, CA 94105",
	},
	{ text: "..." },
];

const STEPS = [
	{ label: "Type Message", number: 1, icon: Eye },
	{ label: "Encrypt & Anonymize", number: 2, icon: Lock },
	{ label: "AI Processes Safely", number: 3, icon: Send },
	{ label: "Decrypt Response", number: 4, icon: Unlock },
	{ label: "Read Result", number: 5, icon: ShieldCheck },
] as const;

// Parallax: shallow → deep → medium → deep → center (creates depth rhythm)
const STEP_VARIANTS = [
	parallaxRiseShallow,
	parallaxRiseDeep,
	parallaxRise,
	parallaxRiseDeep,
	scaleInCenter,
];

// ─── Chat shell pieces ──────────────────────────────────────────────────────

const ChatHeader = ({ local }: { local?: boolean }) => (
	<div className="flex items-center justify-between px-3 py-2.5 border-b border-[#e5e7eb]">
		<div className="flex items-center gap-2">
			<PanelLeft className="w-4 h-4 text-gray-400" />
			{local ? (
				<div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
					<div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center">
						<MonitorSmartphone className="w-2.5 h-2.5 text-white" />
					</div>
					Llama 3.1 8B
					<ChevronDown className="w-3 h-3 text-gray-400" />
					<span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
						Ollama · Local
					</span>
				</div>
			) : (
				<div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
					<div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#6c56f0] to-[#4f8ef7] flex items-center justify-center">
						<span className="text-[7px] text-white font-bold">AI</span>
					</div>
					Claude Sonnet
					<ChevronDown className="w-3 h-3 text-gray-400" />
				</div>
			)}
		</div>
		<div className="flex items-center gap-1 text-[10px] text-gray-400">
			<Settings className="w-3 h-3" />
			<span className="hidden sm:inline">Settings</span>
		</div>
	</div>
);

const ChatInputBar = ({ glowing }: { glowing: boolean }) => (
	<div className="px-3 sm:px-4 pb-3">
		<div className="rounded-xl border border-[#e5e7eb] bg-white px-3 py-2">
			<div className="text-[10px] sm:text-xs text-gray-300 mb-2">
				Ask something...
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Paperclip className="w-3.5 h-3.5 text-gray-300" />
					<motion.div
						className="flex items-center gap-1 bg-[#f0eeff] rounded-full px-2 py-0.5"
						animate={{
							boxShadow: glowing
								? [
										"0 0 0 0px rgba(108,86,240,0)",
										"0 0 0 3px rgba(108,86,240,0.25)",
										"0 0 0 0px rgba(108,86,240,0)",
									]
								: "0 0 0 0px rgba(108,86,240,0)",
						}}
						transition={
							glowing
								? {
										repeat: Number.POSITIVE_INFINITY,
										duration: 2,
										ease: "easeInOut",
									}
								: { duration: 0.3 }
						}
					>
						<div className="w-3 h-[7px] rounded-full bg-[#6c56f0] relative">
							<div className="absolute right-[1px] top-[1px] w-[5px] h-[5px] bg-white rounded-full" />
						</div>
						<span className="text-[9px] sm:text-[10px] font-medium text-[#6c56f0]">
							Secure
						</span>
					</motion.div>
					<div className="flex items-center gap-1 text-gray-300">
						<Globe className="w-3 h-3" />
						<span className="text-[9px] sm:text-[10px]">Web</span>
					</div>
				</div>
				<div className="w-5 h-5 rounded-md bg-[#c4b5fd] flex items-center justify-center">
					<ArrowUp className="w-3 h-3 text-white" />
				</div>
			</div>
		</div>
	</div>
);

const AiAvatar = ({ local }: { local?: boolean }) => (
	<div className="flex items-center gap-2 mb-2">
		{local ? (
			<>
				<div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center">
					<MonitorSmartphone className="w-2.5 h-2.5 text-white" />
				</div>
				<span className="text-[10px] text-gray-500">Llama 3.1 8B</span>
				<span className="text-[8px] bg-green-100 text-green-700 px-1 py-0.5 rounded-full font-medium">
					Local
				</span>
			</>
		) : (
			<>
				<div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#6c56f0] to-[#4f8ef7] flex items-center justify-center">
					<span className="text-[6px] text-white font-bold">AI</span>
				</div>
				<span className="text-[10px] text-gray-500">Claude Sonnet</span>
			</>
		)}
	</div>
);

// ─── Chat mockup wrapper ────────────────────────────────────────────────────

const ChatMockup = ({
	children,
	glowing = false,
	local = false,
}: { children: React.ReactNode; glowing?: boolean; local?: boolean }) => (
	<div className="w-full max-w-xl mx-auto">
		<div
			className={`rounded-2xl border bg-white shadow-lg overflow-hidden ${
				local
					? "border-green-200 ring-1 ring-green-100"
					: "border-[#e5e7eb]"
			}`}
		>
			<ChatHeader local={local} />
			<div className="px-3 sm:px-4 py-4">{children}</div>
			<ChatInputBar glowing={glowing} />
		</div>
	</div>
);

// ─── Step label ─────────────────────────────────────────────────────────────

const StepLabel = ({
	number,
	label,
	isActive,
	local,
	icon: Icon,
}: {
	number: number;
	label: string;
	isActive?: boolean;
	local?: boolean;
	icon: React.ComponentType<{ className?: string }>;
}) => (
	<div className="flex items-center gap-3 mb-4">
		<div
			className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
				local
					? "bg-gradient-to-br from-green-500 to-emerald-600"
					: isActive
						? "bg-gradient-to-br from-[#6c56f0] to-[#4f8ef7] shadow-[0_0_20px_rgba(108,86,240,0.4)]"
						: "bg-gradient-to-br from-[#6c56f0] to-[#4f8ef7]"
			}`}
		>
			<Icon className="w-4.5 h-4.5 text-white" />
		</div>
		<div>
			<div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
				Step {number}
			</div>
			<h3 className="text-base sm:text-lg font-semibold text-white leading-tight">
				{label}
			</h3>
		</div>
	</div>
);

// ─── Step contents ──────────────────────────────────────────────────────────

const Step1Content = () => (
	<div className="bg-[#f4f4f5] rounded-xl px-3 py-2.5 text-[11px] sm:text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">
		{MESSAGE_SEGMENTS.map((segment, i) => {
			if (segment.piiType) {
				return (
					<span
						key={i}
						className="font-medium rounded px-0.5 bg-red-100 text-red-700"
					>
						{segment.text}
					</span>
				);
			}
			return <span key={i}>{segment.text}</span>;
		})}
	</div>
);

const Step2Content = () => (
	<div className="bg-[#f4f4f5] rounded-xl px-3 py-2.5 text-[11px] sm:text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">
		{MESSAGE_SEGMENTS.map((segment, i) => {
			if (segment.piiType) {
				return (
					<span
						key={i}
						className="font-medium rounded px-0.5 bg-[#f0eeff] text-[#6c56f0]"
					>
						{segment.placeholder}
					</span>
				);
			}
			return <span key={i}>{segment.text}</span>;
		})}
	</div>
);

const Step3Content = () => (
	<div className="space-y-3">
		<div className="bg-[#f4f4f5] rounded-xl px-3 py-2 text-[10px] leading-relaxed text-gray-500 whitespace-pre-wrap opacity-60">
			{MESSAGE_SEGMENTS.map((seg, i) => (
				<span
					key={i}
					className={
						seg.piiType
							? "font-medium bg-[#f0eeff] text-[#6c56f0] rounded px-0.5"
							: ""
					}
				>
					{seg.piiType ? seg.placeholder : seg.text}
				</span>
			))}
		</div>
		<div className="bg-white border border-[#e5e7eb] rounded-xl px-3 py-2.5 text-[11px] sm:text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">
			<AiAvatar />
			{AI_RESPONSE_SEGMENTS.map((segment, i) => {
				if (segment.piiType) {
					return (
						<span
							key={i}
							className="font-medium rounded px-0.5 bg-[#f0eeff] text-[#6c56f0]"
						>
							{segment.placeholder}
						</span>
					);
				}
				return <span key={i}>{segment.text}</span>;
			})}
		</div>
	</div>
);

const Step4Content = () => (
	<div className="space-y-3">
		<div className="bg-[#f4f4f5] rounded-xl px-3 py-2 text-[10px] leading-relaxed text-gray-400 whitespace-pre-wrap opacity-40">
			Hi, I need help drafting an NDA...
		</div>
		<div className="bg-white border border-green-200 rounded-xl px-3 py-2.5 text-[11px] sm:text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">
			<AiAvatar local />
			{AI_RESPONSE_SEGMENTS.map((segment, i) => (
				<span key={i}>{segment.original ?? segment.text}</span>
			))}
		</div>
	</div>
);

const Step5Content = () => (
	<div className="space-y-3">
		<div className="bg-[#f4f4f5] rounded-xl px-3 py-2 text-[10px] leading-relaxed text-gray-500 whitespace-pre-wrap opacity-50">
			{MESSAGE_SEGMENTS.map((seg, i) => (
				<span key={i}>{seg.text}</span>
			))}
		</div>
		<div className="bg-white border border-green-200 rounded-xl px-3 py-2.5 text-[11px] sm:text-xs leading-relaxed text-gray-700 whitespace-pre-wrap shadow-sm">
			<div className="flex items-center gap-2 mb-2">
				<div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#6c56f0] to-[#4f8ef7] flex items-center justify-center">
					<span className="text-[6px] text-white font-bold">AI</span>
				</div>
				<span className="text-[10px] text-gray-500">Claude Sonnet</span>
				<div className="ml-auto flex items-center gap-1">
					<ShieldCheck className="w-3 h-3 text-green-500" />
					<span className="text-[9px] text-green-600 font-medium">
						Secure
					</span>
				</div>
			</div>
			{AI_RESPONSE_SEGMENTS.map((seg, i) => (
				<span key={i}>{seg.original ?? seg.text}</span>
			))}
		</div>
	</div>
);

// ─── Step bar ───────────────────────────────────────────────────────────────

const StepBarOverview = () => (
	<div className="flex items-center justify-center gap-0 mb-14">
		{STEPS.map((step, i) => {
			const Icon = step.icon;
			const isLocal = i === 1 || i === 3;
			return (
				<Fragment key={i}>
					<div className="flex flex-col items-center gap-1.5">
						<div
							className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
								isLocal
									? "bg-green-500/20 border border-green-500/30"
									: "bg-[#6c56f0]/20 border border-[#6c56f0]/30"
							}`}
						>
							<Icon
								className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
									isLocal ? "text-green-400" : "text-[#a78bfa]"
								}`}
							/>
						</div>
						<span className="text-[8px] sm:text-[10px] text-white/40 font-medium text-center max-w-[55px] sm:max-w-[75px] leading-tight">
							{step.label}
						</span>
					</div>
					{i < STEPS.length - 1 && (
						<div className="w-4 sm:w-8 h-px bg-gradient-to-r from-white/10 to-white/10 mb-4 shrink-0 mx-1" />
					)}
				</Fragment>
			);
		})}
	</div>
);

// ─── Step descriptions ──────────────────────────────────────────────────────

const STEP_DESCRIPTIONS: React.ReactNode[] = [
	<>
		You type your message naturally.{" "}
		<span className="text-red-400 font-medium">Sensitive data</span> is
		automatically detected.
	</>,
	<>
		A{" "}
		<span className="text-green-400 font-medium">
			local LLM via Ollama
		</span>{" "}
		detects and replaces all PII with{" "}
		<span className="text-[#a78bfa] font-medium">
			anonymous placeholders
		</span>
		. Your real data never leaves your device.
	</>,
	<>
		The anonymized message is sent to{" "}
		<span className="text-[#a78bfa] font-medium">
			any model via OpenRouter
		</span>{" "}
		— Claude, GPT, Gemini, and 20+ others. The AI only sees placeholders.
	</>,
	<>
		The{" "}
		<span className="text-green-400 font-medium">
			local Ollama model
		</span>{" "}
		swaps placeholders back to your real data{" "}
		<span className="font-medium text-white/80">on the client</span>. No
		PII ever left your machine.
	</>,
	<>
		You get a{" "}
		<span className="text-green-400 font-medium">
			complete, personalized response
		</span>{" "}
		— and no sensitive data was ever exposed.
	</>,
];

const STEP_CONFIG = [
	{ local: false, glowing: false, isActive: false },
	{ local: true, glowing: true, isActive: false },
	{ local: false, glowing: true, isActive: false },
	{ local: true, glowing: true, isActive: false },
	{ local: false, glowing: false, isActive: true },
];

const STEP_CONTENT = [
	Step1Content,
	Step2Content,
	Step3Content,
	Step4Content,
	Step5Content,
];

// ─── Main exported component ────────────────────────────────────────────────

export const SecureModeDemo = () => {
	return (
		<section
			className="py-20 sm:py-28 px-4 relative overflow-hidden"
			style={{
				background:
					"linear-gradient(170deg, #13111c 0%, #171428 35%, #131a28 65%, #111318 100%)",
			}}
		>
			{/* Animated SVG background — dark encryption theme */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 1400" fill="none" preserveAspectRatio="xMidYMid slice">
					{/* Large gradient blobs */}
					<circle cx="200" cy="200" r="200" fill="url(#sd-g1)" opacity="0.08">
						<animateTransform attributeName="transform" type="translate"
							values="0,0; 25,35; -15,-20; 0,0" dur="18s" repeatCount="indefinite" />
					</circle>
					<circle cx="1000" cy="600" r="180" fill="url(#sd-g2)" opacity="0.06">
						<animateTransform attributeName="transform" type="translate"
							values="0,0; -20,15; 15,-30; 0,0" dur="22s" repeatCount="indefinite" />
					</circle>
					<circle cx="500" cy="1000" r="220" fill="url(#sd-g3)" opacity="0.05">
						<animateTransform attributeName="transform" type="translate"
							values="0,0; 18,-22; -12,18; 0,0" dur="20s" repeatCount="indefinite" />
					</circle>
					<circle cx="800" cy="300" r="150" fill="url(#sd-g1)" opacity="0.04">
						<animateTransform attributeName="transform" type="translate"
							values="0,0; -15,20; 10,-15; 0,0" dur="16s" repeatCount="indefinite" />
					</circle>

					{/* Encryption flow lines */}
					<path d="M80 400 Q350 350 600 380 T1150 350" stroke="url(#sd-line1)" strokeWidth="0.8"
						fill="none" strokeDasharray="6 8" opacity="0.15">
						<animate attributeName="stroke-dashoffset" values="0;-28" dur="4s" repeatCount="indefinite" />
					</path>
					<path d="M50 800 Q300 750 600 780 T1100 750" stroke="url(#sd-line2)" strokeWidth="0.6"
						fill="none" strokeDasharray="4 10" opacity="0.1">
						<animate attributeName="stroke-dashoffset" values="0;26" dur="5s" repeatCount="indefinite" />
					</path>
					<path d="M100 1100 Q400 1060 700 1080 T1150 1050" stroke="url(#sd-line1)" strokeWidth="0.5"
						fill="none" strokeDasharray="3 10" opacity="0.08">
						<animate attributeName="stroke-dashoffset" values="0;-22" dur="6s" repeatCount="indefinite" />
					</path>

					{/* Node cluster — left */}
					<g opacity="0.4">
						<circle cx="80" cy="500" r="3" fill="#a78bfa">
							<animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
							<animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
						</circle>
						<circle cx="150" cy="440" r="2.5" fill="#6c56f0">
							<animate attributeName="r" values="2;3.5;2" dur="4s" repeatCount="indefinite" />
						</circle>
						<circle cx="120" cy="580" r="2" fill="#22c55e">
							<animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite" />
						</circle>
						<line x1="80" y1="500" x2="150" y2="440" stroke="#a78bfa" strokeWidth="0.5" opacity="0.3">
							<animate attributeName="opacity" values="0.15;0.4;0.15" dur="3s" repeatCount="indefinite" />
						</line>
						<line x1="80" y1="500" x2="120" y2="580" stroke="#22c55e" strokeWidth="0.5" opacity="0.25">
							<animate attributeName="opacity" values="0.1;0.35;0.1" dur="4s" repeatCount="indefinite" />
						</line>
					</g>

					{/* Node cluster — right */}
					<g opacity="0.4">
						<circle cx="1100" cy="900" r="3" fill="#4f8ef7">
							<animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
							<animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
						</circle>
						<circle cx="1050" cy="840" r="2.5" fill="#a78bfa">
							<animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
						</circle>
						<circle cx="1080" cy="980" r="2" fill="#6c56f0">
							<animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
						</circle>
						<line x1="1100" y1="900" x2="1050" y2="840" stroke="#4f8ef7" strokeWidth="0.5" opacity="0.3">
							<animate attributeName="opacity" values="0.15;0.4;0.15" dur="4s" repeatCount="indefinite" />
						</line>
						<line x1="1100" y1="900" x2="1080" y2="980" stroke="#a78bfa" strokeWidth="0.5" opacity="0.25">
							<animate attributeName="opacity" values="0.1;0.35;0.1" dur="3.5s" repeatCount="indefinite" />
						</line>
					</g>

					{/* Orbiting particles */}
					<circle r="3" fill="#a78bfa" opacity="0.2">
						<animateMotion path="M600,700 m-280,0 a280,200 0 1,1 560,0 a280,200 0 1,1 -560,0"
							dur="30s" repeatCount="indefinite" />
						<animate attributeName="opacity" values="0.1;0.3;0.1" dur="30s" repeatCount="indefinite" />
					</circle>
					<circle r="2.5" fill="#4f8ef7" opacity="0.15">
						<animateMotion path="M600,700 m-200,0 a200,150 0 1,0 400,0 a200,150 0 1,0 -400,0"
							dur="24s" repeatCount="indefinite" />
						<animate attributeName="opacity" values="0.08;0.2;0.08" dur="24s" repeatCount="indefinite" />
					</circle>
					<circle r="2" fill="#22c55e" opacity="0.12">
						<animateMotion path="M600,700 m-320,0 a320,120 0 1,1 640,0 a320,120 0 1,1 -640,0"
							dur="35s" repeatCount="indefinite" />
					</circle>

					{/* Spinning geometric accents */}
					<rect x="150" y="700" width="10" height="10" rx="2.5" fill="#a78bfa" opacity="0.06">
						<animateTransform attributeName="transform" type="rotate"
							values="0 155 705; 360 155 705" dur="18s" repeatCount="indefinite" />
					</rect>
					<rect x="1050" y="350" width="8" height="8" rx="2" fill="#4f8ef7" opacity="0.05">
						<animateTransform attributeName="transform" type="rotate"
							values="0 1054 354; -360 1054 354" dur="22s" repeatCount="indefinite" />
					</rect>
					<polygon points="300,1200 308,1216 292,1216" fill="#22c55e" opacity="0.05">
						<animateTransform attributeName="transform" type="rotate"
							values="0 300 1208; 360 300 1208" dur="25s" repeatCount="indefinite" />
					</polygon>

					<defs>
						<radialGradient id="sd-g1" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#6c56f0" /><stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
						</radialGradient>
						<radialGradient id="sd-g2" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
						</radialGradient>
						<radialGradient id="sd-g3" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#4f8ef7" /><stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
						</radialGradient>
						<linearGradient id="sd-line1" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
							<stop offset="30%" stopColor="#a78bfa" />
							<stop offset="70%" stopColor="#6c56f0" />
							<stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
						</linearGradient>
						<linearGradient id="sd-line2" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
							<stop offset="30%" stopColor="#22c55e" />
							<stop offset="70%" stopColor="#4f8ef7" />
							<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
						</linearGradient>
					</defs>
				</svg>
			</div>

			{/* Section title */}
			<motion.div
				className="text-center mb-8 sm:mb-10 relative z-10"
				variants={fadeInUp}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
			>
				<div className="inline-flex items-center gap-2 bg-white/[0.06] text-[#a78bfa] px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 border border-white/[0.08]">
					<ShieldCheck className="w-3.5 h-3.5" />
					How Secure Mode Works
				</div>
				<h2 className="text-2xl sm:text-4xl font-bold text-white">
					Your Data Stays Private
				</h2>
				<p className="text-sm sm:text-base text-white/40 mt-3 max-w-lg mx-auto">
					5 steps between your message and a safe AI response
				</p>
			</motion.div>

			{/* Step overview bar */}
			<motion.div
				variants={fadeInUp}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				className="relative z-10"
			>
				<StepBarOverview />
			</motion.div>

			{/* Steps with parallax */}
			<div className="max-w-2xl mx-auto space-y-14 sm:space-y-20 relative z-10">
				{STEPS.map((step, i) => {
					const config = STEP_CONFIG[i];
					const Content = STEP_CONTENT[i];
					return (
						<motion.div
							key={step.number}
							variants={STEP_VARIANTS[i]}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.15 }}
						>
							<StepLabel
								number={step.number}
								label={step.label}
								isActive={config.isActive}
								local={config.local}
								icon={step.icon}
							/>
							<ChatMockup
								glowing={config.glowing}
								local={config.local}
							>
								<Content />
							</ChatMockup>
							<p className="text-xs sm:text-sm text-white/40 mt-4 text-center leading-relaxed">
								{STEP_DESCRIPTIONS[i]}
							</p>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
};
