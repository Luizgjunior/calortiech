import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = PropsWithChildren<{
	variant?: Variant;
	className?: string;
}> & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
	const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
	const styles: Record<Variant, string> = {
		primary: "btn-gradient text-primary-foreground hover:shadow-[0_0_24px_rgba(167,139,250,0.35)]",
		secondary: "border bg-card hover:bg-accent",
		ghost: "hover:bg-accent",
	};
	return (
		<motion.button whileTap={{ scale: 0.98 }} className={`${base} ${styles[variant]} ${className}`} {...props}>
			{children}
		</motion.button>
	);
}
