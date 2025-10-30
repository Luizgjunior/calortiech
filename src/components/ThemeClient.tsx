"use client";

import { useEffect } from "react";

function readCookie(name: string): string | null {
	const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"));
	return m ? decodeURIComponent(m[1]) : null;
}

export function ThemeClient() {
	useEffect(() => {
		const theme = readCookie("pref_theme") || "light";
		document.documentElement.setAttribute("data-theme", theme);
	}, []);
	return null;
}



