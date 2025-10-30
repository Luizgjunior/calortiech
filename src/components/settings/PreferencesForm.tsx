"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

function readCookie(name: string): string | null {
	const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"));
	return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string) {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function PreferencesForm() {
	const { push } = useToast();
	const [theme, setTheme] = useState("light");
	const [density, setDensity] = useState("comfortable");
	const [bgicons, setBgicons] = useState(true);
	const [toasts, setToasts] = useState(true);
	const [lowmotion, setLowmotion] = useState(false);

	useEffect(() => {
		setTheme(readCookie("pref_theme") || "light");
		setDensity(readCookie("pref_density") || "comfortable");
		setBgicons((readCookie("pref_bgicons") || "1") === "1");
		setToasts((readCookie("pref_toasts") || "1") === "1");
		setLowmotion((readCookie("pref_lowmotion") || "0") === "1");
	}, []);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		writeCookie("pref_theme", theme);
		writeCookie("pref_density", density);
		writeCookie("pref_bgicons", bgicons ? "1" : "0");
		writeCookie("pref_toasts", toasts ? "1" : "0");
		writeCookie("pref_lowmotion", lowmotion ? "1" : "0");
		push({ title: "Preferências aplicadas", variant: "success" });
		setTimeout(() => window.location.reload(), 150);
	}

	return (
		<form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 items-center">
			<label className="text-sm">Tema</label>
			<select value={theme} onChange={(e) => setTheme(e.target.value)} className="border rounded-md px-3 py-2">
				<option value="light">Claro</option>
				<option value="dark">Escuro</option>
				<option value="system">Sistema</option>
			</select>
			<label className="text-sm">Densidade</label>
			<select value={density} onChange={(e) => setDensity(e.target.value)} className="border rounded-md px-3 py-2">
				<option value="comfortable">Confortável</option>
				<option value="compact">Compacta</option>
			</select>
			<label className="text-sm">Ícones de fundo</label>
			<input type="checkbox" checked={bgicons} onChange={(e) => setBgicons(e.target.checked)} className="h-5 w-5" />
			<label className="text-sm">Toasts</label>
			<input type="checkbox" checked={toasts} onChange={(e) => setToasts(e.target.checked)} className="h-5 w-5" />
			<label className="text-sm">Reduzir animações</label>
			<input type="checkbox" checked={lowmotion} onChange={(e) => setLowmotion(e.target.checked)} className="h-5 w-5" />
			<div className="col-span-2">
				<button className="btn-gradient rounded-md px-4 py-2 text-primary-foreground">Aplicar preferências</button>
			</div>
		</form>
	);
}


