import type { PropsWithChildren, HTMLAttributes } from "react";

export function Container({ className = "", ...rest }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return <div className={`mx-auto w-full max-w-4xl px-4 md:px-6 ${className}`} {...rest} />;
}
