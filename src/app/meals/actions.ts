"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const MealSchema = z.object({
	name: z.string().min(1),
	date: z.coerce.date(),
});

export async function createMeal(formData: FormData) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");
	const { name, date } = MealSchema.parse({ name: formData.get("name"), date: formData.get("date") });
	await prisma.meal.create({ data: { name, date, userId: session.user.id as string } });
	revalidatePath("/meals");
	redirect("/meals?ok=1");
}

const ItemSchema = z.object({
	mealId: z.string().min(1),
	foodId: z.string().min(1),
	quantity: z.coerce.number().positive(),
});

export async function addItem(formData: FormData) {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) throw new Error("Não autenticado");
	const { mealId, foodId, quantity } = ItemSchema.parse({
		mealId: formData.get("mealId"),
		foodId: formData.get("foodId"),
		quantity: formData.get("quantity"),
	});
	await prisma.mealItem.create({ data: { mealId, foodId, quantity } });
	revalidatePath("/meals");
	redirect("/meals?ok=1");
}

export async function deleteItem(id: string) {
	await prisma.mealItem.delete({ where: { id } });
	revalidatePath("/meals");
	redirect("/meals?ok=1");
}

export async function deleteMeal(id: string) {
	await prisma.meal.delete({ where: { id } });
	revalidatePath("/meals");
}


