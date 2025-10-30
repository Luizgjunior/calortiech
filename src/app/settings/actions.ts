"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { cookies } from "next/headers";
import { hash, compare } from "bcrypt";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function updateName(formData: FormData) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");
	const name = String(formData.get("name") || "").trim();
	await prisma.user.update({ where: { id: session.user.id as string }, data: { name } });
	revalidatePath("/settings");
}

const ChangePasswordSchema = z.object({
	current: z.string().min(6),
	password: z.string().min(6),
	confirm: z.string().min(6),
});

export async function changePassword(formData: FormData) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");
	const parsed = ChangePasswordSchema.parse({
		current: formData.get("current"),
		password: formData.get("password"),
		confirm: formData.get("confirm"),
	});
	if (parsed.password !== parsed.confirm) throw new Error("Senhas não conferem");
	const user = await prisma.user.findUnique({ where: { id: session.user.id as string } });
	if (!user) throw new Error("Usuário não encontrado");
	const ok = await compare(parsed.current, user.passwordHash);
	if (!ok) throw new Error("Senha atual inválida");
	await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hash(parsed.password, 10) } });
	revalidatePath("/settings");
}

export async function setPrefs(formData: FormData) {
	const theme = String(formData.get("theme") || "light");
	const density = String(formData.get("density") || "comfortable");
	const bgicons = formData.get("bgicons") === "on" ? "1" : "0";
	const toasts = formData.get("toasts") === "on" ? "1" : "0";
	const lowmotion = formData.get("lowmotion") === "on" ? "1" : "0";
	const c = cookies();
	c.set("pref_theme", theme, { path: "/" });
	c.set("pref_density", density, { path: "/" });
	c.set("pref_bgicons", bgicons, { path: "/" });
	c.set("pref_toasts", toasts, { path: "/" });
	c.set("pref_lowmotion", lowmotion, { path: "/" });
	revalidatePath("/settings");
}

export async function clearData(formData: FormData) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");
	const scope = String(formData.get("scope") || "day");
	const today = new Date();
	today.setHours(0,0,0,0);
	let start = new Date(today);
	let end = new Date(today);
	end.setHours(23,59,59,999);
	if (scope === "month") {
		start = new Date(today.getFullYear(), today.getMonth(), 1);
		end = new Date(today.getFullYear(), today.getMonth()+1, 0, 23,59,59,999);
	}
	await prisma.meal.deleteMany({ where: { userId: session.user.id as string, date: { gte: start, lte: end } } });
	revalidatePath("/settings");
}


