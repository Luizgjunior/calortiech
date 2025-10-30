"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function startOfDay(date = new Date()) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

export async function saveDailyTarget(formData: FormData) {
	const session = (await getServerSession(authConfig)) as any;
	const userId = session?.user?.id as string | undefined;
	if (!userId) throw new Error("Não autenticado");

	const mode = (formData.get("mode") as string) || "MANUAL";
	const kcal = Number(formData.get("kcal") || 0);
	const protein = formData.get("protein") ? Number(formData.get("protein")) : null;
	const carbs = formData.get("carbs") ? Number(formData.get("carbs")) : null;
	const fat = formData.get("fat") ? Number(formData.get("fat")) : null;

	const effectiveDate = startOfDay();

	await prisma.dailyTarget.create({
		data: {
			userId,
			mode: mode === "AUTO" ? "AUTO" : "MANUAL",
			kcal: Math.round(kcal),
			protein: protein != null ? Math.round(protein) : null,
			carbs: carbs != null ? Math.round(carbs) : null,
			fat: fat != null ? Math.round(fat) : null,
			effectiveDate,
		},
	});

	revalidatePath("/dashboard");
}
