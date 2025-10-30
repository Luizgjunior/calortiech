import type { PropsWithChildren, HTMLAttributes } from "react";

export function Card({ children, className = "", ...rest }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div className={`rounded-lg border bg-card p-4 shadow-sm elevated ${className}`} {...rest}>
			{children}
		</div>
	);
}
