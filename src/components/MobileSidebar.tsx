"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export function MobileSidebar() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button
				className="fixed left-3 top-3 z-50 md:hidden rounded-xl border px-3 py-2 text-sm backdrop-blur btn-gradient text-primary-foreground"
				onClick={() => setOpen(true)}
			>
				Menu
			</button>
			{open ? (
				<div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
					<div className="absolute inset-0 bg-black/40" />
					<div className="absolute left-0 top-0 h-full w-[75%] max-w-80" onClick={(e) => e.stopPropagation()}>
						<Sidebar />
					</div>
				</div>
			) : null}
		</>
	);
}


