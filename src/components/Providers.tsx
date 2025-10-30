"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
	return (
		<SessionProvider>
			<ToastProvider>{children}</ToastProvider>
		</SessionProvider>
	);
}


