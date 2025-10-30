export default function Loading() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-7 w-56 bg-white/10 rounded" />
			<div className="rounded-lg border bg-card p-4">
				<div className="grid grid-cols-2 md:grid-cols-6 gap-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-9 bg-white/10 rounded" />
					))}
				</div>
			</div>
			{Array.from({ length: 2 }).map((_, i) => (
				<div key={i} className="rounded-lg border bg-card h-48" />
			))}
		</div>
	);
}


