"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Salad, Soup, Settings } from "lucide-react";

const links = [
	{ href: "/dashboard", label: "Painel", Icon: Gauge },
	{ href: "/foods", label: "Alimentos", Icon: Salad },
	{ href: "/meals", label: "Refeições", Icon: Soup },
	{ href: "/settings", label: "Configurações", Icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="hidden md:flex md:w-64 flex-col border bg-background ml-6 my-5 rounded-2xl shadow-xl" style={{
			background: "linear-gradient(180deg, rgba(238,242,255,0.8) 0%, rgba(255,255,255,0.9) 100%)",
			backdropFilter: "saturate(120%) blur(6px)",
		}}>
			<div className="h-14 flex items-center px-4 text-lg font-semibold">NaLinha</div>
			<nav className="flex-1 px-2 py-2 space-y-1">
				{links.map((l) => {
					const active = pathname.startsWith(l.href);
					return (
						<Link
							key={l.href}
							href={l.href}
							className={`sidebar-link sidebar-indicator flex items-center justify-between rounded-md px-3 py-2 text-sm ${active ? "active" : ""}`}
						>
							<span className="flex items-center gap-2">
								<l.Icon size={18} className={active ? "text-[var(--success)]" : "text-[var(--foreground)]/70"} />
								{l.label}
							</span>
						</Link>
					);
				})}
			</nav>
			<div className="p-4">
				<div className="rounded-lg border p-3 text-sm elevated">
					<p className="font-medium">Upgrade</p>
					<p className="text-muted-foreground">Obtenha mais métricas e insights.</p>
				</div>
			</div>
		</aside>
	);
}


