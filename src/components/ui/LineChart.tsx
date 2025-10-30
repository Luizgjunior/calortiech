type Props = {
	points: number[]; // 0..max
	max?: number;
};

export function LineChart({ points, max }: Props) {
	const w = 520;
	const h = 140;
	const pad = 20;
	const n = points.length || 1;
	const maxY = max ?? Math.max(1, ...points);
	const toX = (i: number) => pad + (i * (w - 2 * pad)) / (n - 1);
	const toY = (v: number) => h - pad - (v * (h - 2 * pad)) / maxY;
	const d = points.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
	return (
		<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[160px]">
			<rect x={0} y={0} width={w} height={h} fill="transparent" />
			<path d={d} fill="none" stroke="var(--primary)" strokeWidth={2} />
		</svg>
	);
}


