import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
	label?: string;
	error?: string | null;
}>;

export function FormField({ label, error, children }: Props) {
	return (
		<div className="space-y-1">
			{label ? <label className="text-sm">{label}</label> : null}
			{children}
			{error ? <p className="text-xs text-red-500">{error}</p> : null}
		</div>
	);
}
