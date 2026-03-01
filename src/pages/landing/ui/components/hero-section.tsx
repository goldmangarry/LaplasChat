import { Link } from "@tanstack/react-router";
import { Github, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

// ─── Animated SVG background — bright but behind text ───────────────────────

const HeroBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg
			className="absolute inset-0 w-full h-full"
			viewBox="0 0 1200 700"
			fill="none"
			preserveAspectRatio="xMidYMid slice"
		>
			{/* ── Large gradient blobs ─────────────────────────────── */}
			<circle cx="180" cy="120" r="200" fill="url(#gp)" opacity="0.18">
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; 30,40; -15,-20; 0,0"
					dur="16s"
					repeatCount="indefinite"
				/>
			</circle>
			<circle cx="1000" cy="180" r="240" fill="url(#gb)" opacity="0.14">
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; -40,25; 20,-35; 0,0"
					dur="20s"
					repeatCount="indefinite"
				/>
			</circle>
			<circle cx="550" cy="550" r="180" fill="url(#gg)" opacity="0.12">
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; 35,-25; -20,40; 0,0"
					dur="18s"
					repeatCount="indefinite"
				/>
			</circle>
			<circle cx="750" cy="100" r="120" fill="url(#gp)" opacity="0.10">
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; -20,30; 25,-15; 0,0"
					dur="14s"
					repeatCount="indefinite"
				/>
			</circle>

			{/* ── Shield — larger, more visible ────────────────────── */}
			<g opacity="0.18">
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; 3,-5; -2,3; 0,0"
					dur="8s"
					repeatCount="indefinite"
				/>
				<path
					d="M570 55 L570 35 L600 30 L630 35 L630 55 C630 95 600 120 600 120 C600 120 570 95 570 55Z"
					stroke="url(#shield-stroke)"
					strokeWidth="2"
					fill="url(#shield-fill)"
				/>
				<path
					d="M590 72 L596 80 L612 62"
					stroke="#6c56f0"
					strokeWidth="2.5"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					opacity="0.7"
				/>
			</g>

			{/* ── Data flow lines — curved paths with animated dashes ── */}
			<path
				d="M100 400 Q300 350 500 380 T900 350"
				stroke="url(#line-grad-1)"
				strokeWidth="1"
				fill="none"
				strokeDasharray="6 8"
				opacity="0.25"
			>
				<animate
					attributeName="stroke-dashoffset"
					values="0;-28"
					dur="4s"
					repeatCount="indefinite"
				/>
			</path>
			<path
				d="M150 480 Q400 430 600 460 T1050 420"
				stroke="url(#line-grad-2)"
				strokeWidth="0.8"
				fill="none"
				strokeDasharray="4 10"
				opacity="0.18"
			>
				<animate
					attributeName="stroke-dashoffset"
					values="0;28"
					dur="5s"
					repeatCount="indefinite"
				/>
			</path>

			{/* ── Node clusters — left ──────────────────────────────── */}
			<g opacity="0.35">
				<circle cx="120" cy="300" r="4" fill="#6c56f0">
					<animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
				</circle>
				<circle cx="200" cy="260" r="3" fill="#4f8ef7">
					<animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
				</circle>
				<circle cx="160" cy="370" r="3" fill="#22c55e">
					<animate attributeName="r" values="2;4;2" dur="3.5s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.4;1;0.4" dur="3.5s" repeatCount="indefinite" />
				</circle>
				<circle cx="80" cy="240" r="2.5" fill="#8b5cf6">
					<animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" />
				</circle>
				<line x1="120" y1="300" x2="200" y2="260" stroke="#6c56f0" strokeWidth="0.8" opacity="0.5">
					<animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
				</line>
				<line x1="120" y1="300" x2="160" y2="370" stroke="#22c55e" strokeWidth="0.8" opacity="0.5">
					<animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
				</line>
				<line x1="80" y1="240" x2="120" y2="300" stroke="#8b5cf6" strokeWidth="0.6" opacity="0.4">
					<animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
				</line>
				<line x1="80" y1="240" x2="200" y2="260" stroke="#4f8ef7" strokeWidth="0.6" opacity="0.3">
					<animate attributeName="opacity" values="0.1;0.4;0.1" dur="4.5s" repeatCount="indefinite" />
				</line>
			</g>

			{/* ── Node clusters — right ─────────────────────────────── */}
			<g opacity="0.35">
				<circle cx="1020" cy="320" r="4" fill="#4f8ef7">
					<animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" />
				</circle>
				<circle cx="1090" cy="270" r="3" fill="#6c56f0">
					<animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
				</circle>
				<circle cx="1060" cy="400" r="3" fill="#22c55e">
					<animate attributeName="r" values="2;4;2" dur="3.5s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.4;1;0.4" dur="3.5s" repeatCount="indefinite" />
				</circle>
				<circle cx="1120" cy="360" r="2.5" fill="#f59e0b">
					<animate attributeName="opacity" values="0.3;0.8;0.3" dur="4.5s" repeatCount="indefinite" />
				</circle>
				<line x1="1020" y1="320" x2="1090" y2="270" stroke="#4f8ef7" strokeWidth="0.8" opacity="0.5">
					<animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
				</line>
				<line x1="1020" y1="320" x2="1060" y2="400" stroke="#22c55e" strokeWidth="0.8" opacity="0.5">
					<animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite" />
				</line>
				<line x1="1090" y1="270" x2="1120" y2="360" stroke="#f59e0b" strokeWidth="0.6" opacity="0.4">
					<animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
				</line>
			</g>

			{/* ── Orbiting particles — larger, brighter ─────────────── */}
			<circle r="3.5" fill="#6c56f0" opacity="0.3">
				<animateMotion
					path="M600,350 m-220,0 a220,180 0 1,1 440,0 a220,180 0 1,1 -440,0"
					dur="25s"
					repeatCount="indefinite"
				/>
				<animate attributeName="opacity" values="0.15;0.4;0.15" dur="25s" repeatCount="indefinite" />
			</circle>
			<circle r="3" fill="#4f8ef7" opacity="0.25">
				<animateMotion
					path="M600,350 m-160,0 a160,130 0 1,0 320,0 a160,130 0 1,0 -320,0"
					dur="20s"
					repeatCount="indefinite"
				/>
				<animate attributeName="opacity" values="0.12;0.35;0.12" dur="20s" repeatCount="indefinite" />
			</circle>
			<circle r="2.5" fill="#22c55e" opacity="0.2">
				<animateMotion
					path="M600,350 m-280,0 a280,110 0 1,1 560,0 a280,110 0 1,1 -560,0"
					dur="32s"
					repeatCount="indefinite"
				/>
				<animate attributeName="opacity" values="0.1;0.3;0.1" dur="32s" repeatCount="indefinite" />
			</circle>
			<circle r="2" fill="#f59e0b" opacity="0.18">
				<animateMotion
					path="M600,350 m-180,0 a180,200 0 1,0 360,0 a180,200 0 1,0 -360,0"
					dur="28s"
					repeatCount="indefinite"
				/>
			</circle>

			{/* ── Geometric accents — spinning, bigger ──────────────── */}
			<rect x="330" y="100" width="12" height="12" rx="3" fill="#6c56f0" opacity="0.12"
				transform="rotate(45 336 106)">
				<animateTransform attributeName="transform" type="rotate"
					values="45 336 106; 225 336 106; 405 336 106" dur="18s" repeatCount="indefinite" />
			</rect>
			<rect x="870" y="480" width="10" height="10" rx="2" fill="#4f8ef7" opacity="0.10"
				transform="rotate(30 875 485)">
				<animateTransform attributeName="transform" type="rotate"
					values="30 875 485; 210 875 485; 390 875 485" dur="22s" repeatCount="indefinite" />
			</rect>
			<rect x="250" y="520" width="8" height="8" rx="2" fill="#22c55e" opacity="0.10"
				transform="rotate(15 254 524)">
				<animateTransform attributeName="transform" type="rotate"
					values="15 254 524; 195 254 524; 375 254 524" dur="15s" repeatCount="indefinite" />
			</rect>
			<polygon points="940,120 948,135 932,135" fill="#8b5cf6" opacity="0.08">
				<animateTransform attributeName="transform" type="rotate"
					values="0 940 128; 360 940 128" dur="30s" repeatCount="indefinite" />
			</polygon>

			{/* ── Defs ──────────────────────────────────────────────── */}
			<defs>
				<radialGradient id="gp" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#6c56f0" />
					<stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="gb" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#4f8ef7" />
					<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="gg" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#22c55e" />
					<stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="shield-stroke" x1="570" y1="30" x2="630" y2="120" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" />
					<stop offset="100%" stopColor="#4f8ef7" />
				</linearGradient>
				<linearGradient id="shield-fill" x1="570" y1="30" x2="630" y2="120" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" stopOpacity="0.06" />
					<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0.02" />
				</linearGradient>
				<linearGradient id="line-grad-1" x1="100" y1="400" x2="900" y2="350" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#6c56f0" stopOpacity="0" />
					<stop offset="30%" stopColor="#6c56f0" />
					<stop offset="70%" stopColor="#4f8ef7" />
					<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="line-grad-2" x1="150" y1="480" x2="1050" y2="420" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
					<stop offset="30%" stopColor="#22c55e" />
					<stop offset="70%" stopColor="#4f8ef7" />
					<stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

// ─── Hero section ───────────────────────────────────────────────────────────

export const HeroSection = () => {
	return (
		<section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 px-4 overflow-hidden">
			{/* Radial gradient base — brighter */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,86,240,0.12) 0%, transparent 70%)",
				}}
			/>

			{/* Animated SVG */}
			<HeroBackground />

			<div className="max-w-4xl mx-auto text-center relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" as const }}
					className="inline-flex items-center gap-2 bg-[#f0eeff] text-[#6c56f0] px-4 py-1.5 rounded-full text-sm font-medium mb-6"
				>
					<ShieldCheck className="w-4 h-4" />
					Built-in Secure Mode
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" as const }}
					className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0f0f0f] leading-tight"
				>
					AI Chat That{" "}
					<span
						className="text-[#6c56f0]"
						style={{
							textShadow: "0 0 40px rgba(108,86,240,0.15)",
						}}
					>
						Protects
					</span>
					<br />
					Your{" "}
					<span
						className="text-[#4f8ef7]"
						style={{
							textShadow: "0 0 40px rgba(79,142,247,0.15)",
						}}
					>
						Sensitive Data
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.7,
						ease: "easeOut" as const,
						delay: 0.15,
					}}
					className="text-base sm:text-lg text-gray-500 mt-4 max-w-2xl mx-auto"
				>
					Secure Mode anonymizes names, addresses, and PII before
					sending to any AI model. Chat with GPT, Claude, Gemini and
					20+ models — your confidential data never leaves your
					device.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.7,
						ease: "easeOut" as const,
						delay: 0.3,
					}}
					className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
				>
					<Link
						to="/onboarding"
						className="bg-[#6c56f0] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#5b46e0] transition w-full sm:w-auto text-center shadow-lg shadow-[#6c56f0]/20"
					>
						Get Started
					</Link>
					<a
						href="https://github.com/laplaschat/laplas"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center gap-2 border border-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition w-full sm:w-auto"
					>
						<Github className="w-4 h-4" />
						View on GitHub
					</a>
				</motion.div>
			</div>
		</section>
	);
};
