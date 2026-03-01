import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1500, startOnView = true) {
	const [count, setCount] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!startOnView) {
			setHasStarted(true);
			return;
		}

		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasStarted) {
					setHasStarted(true);
				}
			},
			{ threshold: 0.3 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [startOnView, hasStarted]);

	useEffect(() => {
		if (!hasStarted) return;

		const startTime = Date.now();
		const step = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - (1 - progress) ** 3; // easeOut cubic
			setCount(Math.round(eased * target));

			if (progress < 1) {
				requestAnimationFrame(step);
			}
		};

		requestAnimationFrame(step);
	}, [hasStarted, target, duration]);

	return { count, ref };
}
