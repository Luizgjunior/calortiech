type Props = {
	percent: number; // 0..100
	label?: string;
};

export function RadialProgress({ percent, label }: Props) {
	const size = 120;
	const stroke = 10;
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	const dash = Math.max(0, Math.min(100, percent)) / 100 * c;
	return (
		<div className="flex items-center gap-4">
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
				<circle cx={size/2} cy={size/2} r={r} stroke="var(--primary)" strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
				<text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-current" fontSize="16" fontWeight="600">{Math.round(percent)}%</text>
			</svg>
			{label ? <div className="text-sm text-muted-foreground">{label}</div> : null}
		</div>
	);
}


