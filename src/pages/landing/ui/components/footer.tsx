import { Link } from "@tanstack/react-router";

// ─── Animated background — subtle dark particles ────────────────────────────

const FooterBackground = () => (
	<div className="absolute inset-0 overflow-hidden pointer-events-none">
		<svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" fill="none" preserveAspectRatio="xMidYMid slice">
			{/* Soft gradient blobs */}
			<circle cx="100" cy="80" r="120" fill="url(#ft-g1)" opacity="0.05">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; 15,20; -10,-10; 0,0" dur="16s" repeatCount="indefinite" />
			</circle>
			<circle cx="1050" cy="300" r="140" fill="url(#ft-g2)" opacity="0.04">
				<animateTransform attributeName="transform" type="translate"
					values="0,0; -18,12; 10,-18; 0,0" dur="20s" repeatCount="indefinite" />
			</circle>

			{/* Subtle flow line */}
			<path d="M0 200 Q300 170 600 190 T1200 180" stroke="url(#ft-line)" strokeWidth="0.5"
				fill="none" strokeDasharray="4 10" opacity="0.08">
				<animate attributeName="stroke-dashoffset" values="0;-28" dur="6s" repeatCount="indefinite" />
			</path>

			{/* Soft pulsing dots */}
			<circle cx="200" cy="150" r="2" fill="#a78bfa" opacity="0.12">
				<animate attributeName="r" values="1.5;2.5;1.5" dur="4s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.06;0.15;0.06" dur="4s" repeatCount="indefinite" />
			</circle>
			<circle cx="800" cy="100" r="1.5" fill="#6c56f0" opacity="0.1">
				<animate attributeName="r" values="1;2;1" dur="3.5s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.05;0.12;0.05" dur="3.5s" repeatCount="indefinite" />
			</circle>
			<circle cx="1000" cy="250" r="1.5" fill="#4f8ef7" opacity="0.08">
				<animate attributeName="opacity" values="0.04;0.1;0.04" dur="5s" repeatCount="indefinite" />
			</circle>

			<defs>
				<radialGradient id="ft-g1" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#6c56f0" /><stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</radialGradient>
				<radialGradient id="ft-g2" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#4f8ef7" /><stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="ft-line" x1="0" y1="200" x2="1200" y2="180" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
					<stop offset="30%" stopColor="#a78bfa" />
					<stop offset="70%" stopColor="#6c56f0" />
					<stop offset="100%" stopColor="#6c56f0" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	</div>
);

export const Footer = () => {
	return (
		<footer className="bg-[#0c0a1d] pt-12 sm:pt-16 pb-8 px-4 overflow-hidden relative">
			<FooterBackground />
			<div className="max-w-5xl mx-auto relative z-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
					{/* Product */}
					<div>
						<h4 className="font-semibold text-sm text-white mb-3">Product</h4>
						<ul className="space-y-2">
							<li>
								<Link to="/onboarding" className="text-white/50 hover:text-white text-sm transition">
									Get Started
								</Link>
							</li>
							<li>
								<a href="https://github.com/laplaschat/laplas" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									Source Code
								</a>
							</li>
						</ul>
					</div>

					{/* Developer */}
					<div>
						<h4 className="font-semibold text-sm text-white mb-3">Developer</h4>
						<ul className="space-y-2">
							<li>
								<a href="https://github.com/laplaschat/laplas" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									GitHub
								</a>
							</li>
							<li>
								<a href="https://github.com/laplaschat/laplas/issues" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									Issues
								</a>
							</li>
							<li>
								<a href="https://github.com/laplaschat/laplas/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									Documentation
								</a>
							</li>
						</ul>
					</div>

					{/* Providers */}
					<div>
						<h4 className="font-semibold text-sm text-white mb-3">Providers</h4>
						<ul className="space-y-2">
							<li>
								<a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									OpenRouter
								</a>
							</li>
							<li>
								<a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									OpenAI
								</a>
							</li>
							<li>
								<a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									Anthropic
								</a>
							</li>
							<li>
								<a href="https://deepmind.google" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									Google
								</a>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="font-semibold text-sm text-white mb-3">Legal</h4>
						<ul className="space-y-2">
							<li>
								<a href="https://github.com/laplaschat/laplas/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition">
									MIT License
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/10">
					<div className="flex items-center gap-2 mb-2 sm:mb-0">
						<img src="/logo.svg" alt="LaplasChat" className="w-5 h-5 brightness-200" />
						<span className="text-sm text-white/50">LaplasChat</span>
					</div>
					<span className="text-xs text-white/30">&copy; 2026 LaplasChat. MIT License.</span>
				</div>
			</div>
		</footer>
	);
};
