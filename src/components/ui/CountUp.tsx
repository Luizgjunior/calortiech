"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ value, duration = 500, format = (n: number) => Math.round(n).toString() }: { value: number; duration?: number; format?: (n: number) => string }) {
	const [display, setDisplay] = useState(0);
	const startRef = useRef<number | null>(null);
	const fromRef = useRef(0);

	useEffect(() => {
		fromRef.current = display;
		startRef.current = null;
		let raf = 0;
		const step = (ts: number) => {
			if (startRef.current === null) startRef.current = ts;
			const p = Math.min(1, (ts - startRef.current) / duration);
			const val = fromRef.current + (value - fromRef.current) * p;
			setDisplay(val);
			if (p < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return <span>{format(display)}</span>;
}


