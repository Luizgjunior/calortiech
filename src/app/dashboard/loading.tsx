export default function Loading() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-7 w-40 rounded bg-white/10" />
			<div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="rounded-lg border bg-card p-4">
						<div className="h-3 w-20 bg-white/10 rounded mb-2" />
						<div className="h-6 w-24 bg-white/10 rounded" />
					</div>
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
				<div className="rounded-lg border bg-card h-40" />
				<div className="rounded-lg border bg-card h-40" />
			</div>
			<div className="rounded-lg border bg-card h-56" />
		</div>
	);
}


