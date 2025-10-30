"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
	const { data } = useSession();
	const [open, setOpen] = useState(false);
	return (
		<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<Container className="flex h-14 items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<button className="md:hidden rounded-md border px-2 py-1" onClick={() => setOpen((v) => !v)}>☰</button>
					<Link href="/" className="font-semibold">Controle de Calorias</Link>
					<nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
						<Link href="/dashboard">Dashboard</Link>
						<Link href="/foods">Alimentos</Link>
						<Link href="/meals">Refeições</Link>
					</nav>
				</div>
				<div className="flex items-center gap-2">
					{data?.user ? (
						<>
							<span className="hidden sm:inline text-sm text-muted-foreground">{data.user.email}</span>
							<Button variant="secondary" onClick={() => signOut({ callbackUrl: "/login" })}>Sair</Button>
						</>
					) : (
						<div className="flex gap-2">
							<Link href="/login"><Button>Entrar</Button></Link>
							<Link href="/register"><Button variant="secondary">Registrar</Button></Link>
						</div>
					)}
				</div>
			</Container>
			{open ? (
				<div className="md:hidden border-t">
					<Container className="py-2 flex flex-col gap-2">
						<Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
						<Link href="/foods" onClick={() => setOpen(false)}>Alimentos</Link>
						<Link href="/meals" onClick={() => setOpen(false)}>Refeições</Link>
					</Container>
				</div>
			) : null}
		</header>
	);
}
