"use client";

import { createContext, useContext, useState, useCallback, PropsWithChildren } from "react";

type Toast = { id: number; title: string; variant?: "success" | "error" | "info" };

const ToastCtx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const push = useCallback((t: Omit<Toast, "id">) => {
		const toast: Toast = { id: Date.now() + Math.random(), ...t };
		setToasts((s) => [...s, toast]);
		setTimeout(() => setToasts((s) => s.filter((x) => x.id !== toast.id)), 3500);
	}, []);
	return (
		<ToastCtx.Provider value={{ push }}>
			{children}
			<div className="fixed right-4 bottom-4 z-[60] space-y-2">
				{toasts.map((t) => (
					<div key={t.id} className={`min-w-64 rounded-md border px-3 py-2 text-sm shadow-xl elevated ${
						t.variant === "success" ? "border-[var(--success)]" : t.variant === "error" ? "border-[var(--danger)]" : "border-[var(--primary)]"
					}`}>{t.title}</div>
				))}
			</div>
		</ToastCtx.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastCtx);
	if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
	return ctx;
}


