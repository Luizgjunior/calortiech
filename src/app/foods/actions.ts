"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FoodSchema = z.object({
	name: z.string().min(1),
	servingValue: z.coerce.number().positive(),
	servingUnit: z.enum(["GRAM", "MILLILITER", "PIECE", "SERVING"]),
	kcalPerServing: z.coerce.number().nonnegative(),
	proteinPerServing: z.coerce.number().nonnegative().default(0),
	carbsPerServing: z.coerce.number().nonnegative().default(0),
	fatPerServing: z.coerce.number().nonnegative().default(0),
	isGlobal: z.coerce.boolean().optional().default(false),
});

export async function createFood(formData: FormData) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");

	const parsed = FoodSchema.parse({
		name: formData.get("name"),
		servingValue: formData.get("servingValue"),
		servingUnit: formData.get("servingUnit"),
		kcalPerServing: formData.get("kcalPerServing"),
		proteinPerServing: formData.get("proteinPerServing") ?? 0,
		carbsPerServing: formData.get("carbsPerServing") ?? 0,
		fatPerServing: formData.get("fatPerServing") ?? 0,
		isGlobal: formData.get("isGlobal") === "on",
	});

	await prisma.food.create({
		data: {
			...parsed,
			userId: parsed.isGlobal ? null : (session.user.id as string),
			isGlobal: parsed.isGlobal && (session.user as any).role === "ADMIN",
		},
	});

	revalidatePath("/foods");
	redirect("/foods?ok=1");
}

export async function deleteFood(id: string) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");
	await prisma.food.delete({ where: { id } });
	revalidatePath("/foods");
	redirect("/foods?ok=1");
}


