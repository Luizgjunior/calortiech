"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

export function ToastOnQuery({ ok, msgSuccess = "Ação concluída!" }: { ok?: string | null; msgSuccess?: string }) {
	const { push } = useToast();
	useEffect(() => {
		if (ok) push({ title: msgSuccess, variant: "success" });
	}, [ok, msgSuccess, push]);
	return null;
}


