import type { HTMLAttributes } from "react";
import { CountUp } from "@/components/ui/CountUp";
import type { ComponentType } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
	label: string;
	value: string | number;
	sub?: string;
	rightIcon?: ComponentType<{ size?: number; className?: string }>;
};

export function StatCard({ label, value, sub, rightIcon: RightIcon, className = "", ...rest }: Props) {
	return (
		<div className={`relative overflow-hidden rounded-lg border bg-card p-4 accent-stripe ${className}`} {...rest}>
			<p className="text-sm text-muted-foreground">{label}</p>
			<p className="text-2xl font-semibold">{
				typeof value === "number" ? <CountUp value={value} /> : value
			}</p>
			{sub ? <p className="text-xs text-muted-foreground mt-1">{sub}</p> : null}
			{RightIcon ? <RightIcon size={20} className="absolute right-3 top-3 opacity-40" /> : null}
		</div>
	);
}


