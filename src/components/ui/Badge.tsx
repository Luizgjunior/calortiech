import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...rest }: HTMLAttributes<HTMLSpanElement>) {
	return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${className}`} {...rest} />;
}
