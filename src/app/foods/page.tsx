import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { createFood, deleteFood } from "./actions";
import { Apple, Wheat, FlaskConical, Beef } from "lucide-react";
import { ToastOnQuery } from "@/components/ToastOnQuery";

async function getFoods(userId: string, isAdmin: boolean) {
	return prisma.food.findMany({
		where: {
			OR: [{ userId }, { isGlobal: true }],
		},
		orderBy: { name: "asc" },
	});
}

export default async function FoodsPage({ searchParams }: { searchParams?: { ok?: string } }) {
	const session = await getServerSession(authConfig);
	const userId = (session?.user as any)?.id as string | undefined;
	const isAdmin = (session?.user as any)?.role === "ADMIN";
	if (!userId) return <div className="p-6">Você precisa estar logado.</div>;

	const foods = await getFoods(userId, isAdmin);

	return (
		<div className="space-y-6">
			<ToastOnQuery ok={searchParams?.ok ?? null} msgSuccess="Alimentos atualizados" />
			<h1 className="text-2xl font-semibold">Alimentos</h1>
			<Card>
				<h2 className="font-medium mb-2">Novo alimento</h2>
				<form action={createFood} className="grid grid-cols-2 md:grid-cols-8 gap-3">
					<input name="name" placeholder="Nome" className="border rounded-md px-3 py-2 col-span-2" required />
					<input name="servingValue" type="number" step="0.1" placeholder="Porção" className="border rounded-md px-3 py-2" required />
					<select name="servingUnit" className="border rounded-md px-3 py-2">
						<option value="GRAM">g</option>
						<option value="MILLILITER">ml</option>
						<option value="PIECE">unid</option>
						<option value="SERVING">porção</option>
					</select>
					<input name="kcalPerServing" type="number" step="0.1" placeholder="Kcal" className="border rounded-md px-3 py-2" required />
					<input name="proteinPerServing" type="number" step="0.1" placeholder="Prot (g)" className="border rounded-md px-3 py-2" />
					<input name="carbsPerServing" type="number" step="0.1" placeholder="Carb (g)" className="border rounded-md px-3 py-2" />
					<input name="fatPerServing" type="number" step="0.1" placeholder="Gord (g)" className="border rounded-md px-3 py-2" />
					{isAdmin ? (
						<label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isGlobal" /> Global</label>
					) : null}
					<button className="rounded-md bg-primary text-primary-foreground px-4 py-2 col-span-2 md:col-span-1">Salvar</button>
				</form>
			</Card>

			<Card>
				<h2 className="font-medium mb-2">Meus alimentos</h2>
				<div className="divide-y">
					{foods.length === 0 ? (
						<p className="text-sm text-muted-foreground py-6">Nenhum alimento cadastrado. Preencha o formulário acima para adicionar.</p>
					) : foods.map((f) => (
						<form key={f.id} action={async () => { "use server"; await deleteFood(f.id); }} className="flex items-center justify-between py-2">
							<div className="text-sm flex items-start gap-2">
								<span className="mt-0.5 opacity-60">
									{f.servingUnit === "GRAM" ? <Beef size={16} /> : f.servingUnit === "MILLILITER" ? <FlaskConical size={16} /> : f.servingUnit === "PIECE" ? <Apple size={16} /> : <Wheat size={16} />}
								</span>
								<p className="font-medium">{f.name} {f.isGlobal ? <span className="text-xs text-muted-foreground">(global)</span> : null}</p>
								<p className="text-muted-foreground">{f.servingValue} {f.servingUnit.toLowerCase()} — {f.kcalPerServing} kcal · P {f.proteinPerServing} · C {f.carbsPerServing} · G {f.fatPerServing}</p>
							</div>
							<button className="text-sm text-red-500">Remover</button>
						</form>
					))}
				</div>
			</Card>
		</div>
	);
}


