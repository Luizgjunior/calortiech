import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
	return (
		<nav className="text-xs text-muted-foreground" aria-label="breadcrumb">
			<ol className="flex items-center gap-2">
				{items.map((c, i) => (
					<li key={i} className="flex items-center gap-2">
						{i > 0 ? <span>/</span> : null}
						{c.href ? <Link href={c.href} className="hover:underline">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
					</li>
				))}
			</ol>
		</nav>
	);
}


