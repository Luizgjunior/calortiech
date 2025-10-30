import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { createMeal, addItem, deleteItem, deleteMeal } from "./actions";
import { ToastOnQuery } from "@/components/ToastOnQuery";

function startOfDay(date = new Date()) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

async function getData(userId: string) {
	const start = startOfDay();
	const foods = await prisma.food.findMany({ where: { OR: [{ userId }, { isGlobal: true }] }, orderBy: { name: "asc" } });
	const meals = await prisma.meal.findMany({ where: { userId, date: { gte: start } }, include: { items: { include: { food: true } } }, orderBy: { createdAt: "asc" } });
	return { foods, meals };
}

export default async function MealsPage({ searchParams }: { searchParams?: { ok?: string } }) {
	const session = await getServerSession(authConfig);
	const userId = (session?.user as any)?.id as string | undefined;
	if (!userId) return <div className="p-6">Você precisa estar logado.</div>;
	const { foods, meals } = await getData(userId);

	return (
		<div className="space-y-6">
			<ToastOnQuery ok={searchParams?.ok ?? null} msgSuccess="Refeições atualizadas" />
			<h1 className="text-2xl font-semibold">Refeições de hoje</h1>
			<Card>
				<h2 className="font-medium mb-2">Nova refeição</h2>
				<form action={createMeal} className="grid grid-cols-2 md:grid-cols-6 gap-3">
					<input name="name" placeholder="Nome (ex.: Almoço)" className="border rounded-md px-3 py-2 col-span-2" required />
					<input type="date" name="date" defaultValue={new Date().toISOString().slice(0, 10)} className="border rounded-md px-3 py-2" />
					<button className="rounded-md bg-primary text-primary-foreground px-4 py-2">Criar</button>
				</form>
			</Card>

				{meals.length === 0 ? (
					<Card className="text-sm text-muted-foreground">Sem refeições no dia. Crie uma acima.</Card>
				) : meals.map((m) => (
				<Card key={m.id} className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="font-medium">{m.name}</h3>
						<form action={async () => { "use server"; await deleteMeal(m.id); }}><button className="text-sm text-red-500">Excluir</button></form>
					</div>
					<form action={addItem} className="grid grid-cols-2 md:grid-cols-6 gap-2">
						<input type="hidden" name="mealId" value={m.id} />
						<select name="foodId" className="border rounded-md px-3 py-2 col-span-2">
							{foods.map((f) => (
								<option key={f.id} value={f.id}>{f.name}</option>
							))}
						</select>
						<input name="quantity" type="number" step="0.1" defaultValue={1} className="border rounded-md px-3 py-2" />
						<button className="rounded-md bg-primary text-primary-foreground px-4 py-2">Adicionar</button>
					</form>
					<div className="divide-y">
						{m.items.map((it) => (
							<form key={it.id} action={async () => { "use server"; await deleteItem(it.id); }} className="flex items-center justify-between py-2 text-sm">
								<span>{it.quantity} × {it.food.name} — {Math.round(it.quantity * it.food.kcalPerServing)} kcal</span>
								<button className="text-red-500">Remover</button>
							</form>
						))}
					</div>
				</Card>
				))}
		</div>
	);
}


