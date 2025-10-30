export default function Loading() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-7 w-44 bg-white/10 rounded" />
			<div className="rounded-lg border bg-card p-4">
				<div className="grid grid-cols-2 md:grid-cols-8 gap-3">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="h-9 bg-white/10 rounded" />
					))}
				</div>
			</div>
			<div className="rounded-lg border bg-card p-4 h-56" />
		</div>
	);
}


