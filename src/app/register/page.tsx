"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/ui/Toast";

const Schema = z.object({
	name: z.string().min(1, "Informe seu nome"),
	email: z.string().email(),
	password: z.string().min(6),
});

type FormData = z.infer<typeof Schema>;

export default function RegisterPage() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(Schema) });
  const { push } = useToast();

	const onSubmit = async (data: FormData) => {
		setError(null);
		setSuccess(null);
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const j = await res.json();
				setError(j.error || "Erro ao registrar");
				push({ title: j.error || "Erro ao registrar", variant: "error" });
				return;
			}
			setSuccess("Registrado com sucesso! Agora você pode entrar.");
			push({ title: "Conta criada com sucesso!", variant: "success" });
		} catch (e) {
			setError("Erro inesperado");
		}
	};

	return (
		<div className="min-h-[70vh] grid place-items-center">
			<Card className="w-full max-w-sm">
				<h1 className="text-2xl font-semibold mb-4">Criar conta</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<FormField label="Nome" error={formState.errors.name?.message ?? null}>
						<Input {...register("name")} />
					</FormField>
					<FormField label="Email" error={formState.errors.email?.message ?? null}>
						<Input type="email" {...register("email")} />
					</FormField>
					<FormField label="Senha" error={formState.errors.password?.message ?? null}>
						<Input type="password" {...register("password")} />
					</FormField>
					{error && <p className="text-sm text-red-500">{error}</p>}
					{success && <p className="text-sm text-green-600">{success}</p>}
					<Button type="submit" disabled={formState.isSubmitting} className="w-full">
						{formState.isSubmitting ? "Registrando..." : "Registrar"}
					</Button>
				</form>
				<p className="text-sm text-muted-foreground mt-3">
					Já tem conta? <Link className="underline" href="/login">Entrar</Link>
				</p>
			</Card>
		</div>
	);
}


