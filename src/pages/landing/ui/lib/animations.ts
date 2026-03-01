import type { Variants } from "motion/react";

export const fadeInUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" as const },
	},
};

export const fadeInLeft: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.7, ease: "easeOut" as const },
	},
};

export const fadeInRight: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.7, ease: "easeOut" as const },
	},
};

// Parallax-style: elements rise from below with depth feel
export const parallaxRise: Variants = {
	hidden: { opacity: 0, y: 80, scale: 0.92 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 },
	},
};

export const parallaxRiseDeep: Variants = {
	hidden: { opacity: 0, y: 120, scale: 0.88 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: "spring", stiffness: 40, damping: 18, mass: 1.2 },
	},
};

export const parallaxRiseShallow: Variants = {
	hidden: { opacity: 0, y: 50, scale: 0.96 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: "spring", stiffness: 60, damping: 22, mass: 0.8 },
	},
};

export const scaleInCenter: Variants = {
	hidden: { opacity: 0, scale: 0.85, y: 40 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 },
	},
};

export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.1 },
	},
};

export const staggerContainerSlow: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.2 },
	},
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.5, ease: "easeOut" as const },
	},
};

export const blurSwapIn: Variants = {
	hidden: { opacity: 0, filter: "blur(6px)", scale: 0.95 },
	visible: {
		opacity: 1,
		filter: "blur(0px)",
		scale: 1,
		transition: { duration: 0.35, ease: "easeOut" as const },
	},
	exit: {
		opacity: 0,
		filter: "blur(6px)",
		scale: 0.95,
		transition: { duration: 0.25, ease: "easeIn" as const },
	},
};

export const slideInFromBottom: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" as const },
	},
	exit: {
		opacity: 0,
		y: -12,
		transition: { duration: 0.25, ease: "easeIn" as const },
	},
};
