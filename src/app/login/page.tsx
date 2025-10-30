"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";

const Schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type FormData = z.infer<typeof Schema>;

export default function LoginPage() {
	const [error, setError] = useState<string | null>(null);
	const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(Schema) });
  const { push } = useToast();

	const onSubmit = async (data: FormData) => {
		setError(null);
		const res = await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: true,
			callbackUrl: "/dashboard",
		});
		if (res?.error) {
			setError("Credenciais inválidas");
			push({ title: "Falha no login", variant: "error" });
		} else {
			push({ title: "Login realizado!", variant: "success" });
		}
	};

	return (
		<div className="min-h-[70vh] grid place-items-center">
			<Card className="w-full max-w-sm">
				<h1 className="text-2xl font-semibold mb-4">Entrar</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<FormField label="Email" error={formState.errors.email?.message ?? null}>
						<Input type="email" {...register("email")} />
					</FormField>
					<FormField label="Senha" error={formState.errors.password?.message ?? null}>
						<Input type="password" {...register("password")} />
					</FormField>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<Button type="submit" disabled={formState.isSubmitting} className="w-full">
						{formState.isSubmitting ? "Entrando..." : "Entrar"}
					</Button>
				</form>
				<p className="text-sm text-muted-foreground mt-3">
					Não tem conta? <Link className="underline" href="/register">Registre-se</Link>
				</p>
			</Card>
		</div>
	);
}


