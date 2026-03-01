import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Github, Menu, X } from "lucide-react";
import { motion } from "motion/react";

export const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<motion.nav
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
			className={`sticky top-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-white/85 backdrop-blur-xl border-b border-[#e5e7eb]"
					: "bg-white/60 backdrop-blur-sm"
			}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/landing" className="flex items-center gap-2">
						<img src="/logo.svg" alt="LaplasChat" className="w-7 h-7" />
						<span className="font-semibold text-[#0f0f0f] text-lg">LaplasChat</span>
					</Link>

					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-4">
						<a
							href="https://github.com/laplaschat/laplas"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
						>
							<Github className="w-4 h-4" />
							GitHub
						</a>
						<Link
							to="/onboarding"
							className="bg-[#6c56f0] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#5b46e0] transition"
						>
							Get Started
						</Link>
					</div>

					{/* Mobile burger */}
					<button
						className="md:hidden p-2"
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
				</div>

				{/* Mobile menu */}
				{mobileOpen && (
					<div className="md:hidden pb-4 space-y-3">
						<a
							href="https://github.com/laplaschat/laplas"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-gray-600 px-2 py-2"
						>
							<Github className="w-4 h-4" />
							GitHub
						</a>
						<Link
							to="/onboarding"
							className="block bg-[#6c56f0] text-white px-5 py-2 rounded-lg text-sm font-medium text-center"
						>
							Get Started
						</Link>
					</div>
				)}
			</div>
		</motion.nav>
	);
};
