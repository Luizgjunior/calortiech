import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { saveDailyTarget } from "./actions";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { RadialProgress } from "@/components/ui/RadialProgress";
import { LineChart } from "@/components/ui/LineChart";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Apple, Beef, Wheat, Flame, Utensils, FlaskConical } from "lucide-react";

function startOfDay(date = new Date()) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function endOfDay(date = new Date()) {
	const d = new Date(date);
	d.setHours(23, 59, 59, 999);
	return d;
}

function subDays(date: Date, days: number) {
	const d = new Date(date);
	d.setDate(d.getDate() - days);
	return d;
}

type Period = "day" | "week" | "month";

async function getData(userId: string, period: Period) {
	const start = startOfDay();
	const end = endOfDay();
	const rangeStart = period === "day" ? start : period === "week" ? startOfDay(subDays(start, 6)) : startOfDay(subDays(start, 29));

	const target = await prisma.dailyTarget.findFirst({
		where: { userId, effectiveDate: { lte: start } },
		orderBy: { effectiveDate: "desc" },
	});

	const meals = await prisma.meal.findMany({
		where: { userId, date: { gte: start, lte: end } },
		include: { items: { include: { food: true } } },
	});

	const recentItems = await prisma.mealItem.findMany({
		where: { meal: { userId, date: { gte: rangeStart, lte: end } } },
		include: { food: true, meal: true },
		orderBy: { id: "desc" },
		take: 10,
	});

	let totalKcal = 0;
	let totalProtein = 0;
	let totalCarbs = 0;
	let totalFat = 0;
	for (const meal of meals) {
		for (const item of meal.items) {
			const qty = item.quantity;
			totalKcal += qty * item.food.kcalPerServing;
			totalProtein += qty * item.food.proteinPerServing;
			totalCarbs += qty * item.food.carbsPerServing;
			totalFat += qty * item.food.fatPerServing;
		}
	}

	return { target, totals: { kcal: totalKcal, protein: totalProtein, carbs: totalCarbs, fat: totalFat }, meals, recentItems };
}

type SearchParams = { period?: Period };

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
	const session = (await getServerSession(authConfig)) as any;
	const userId = session?.user?.id as string | undefined;
	if (!userId) {
		return (
			<div className="min-h-[60vh] grid place-items-center">
				<p>Você precisa estar logado.</p>
			</div>
		);
	}

	const period: Period = searchParams?.period ?? "day";
	const { target, totals, recentItems } = await getData(userId, period);
	const saldo = target ? target.kcal - Math.round(totals.kcal) : null;
  const percentTarget = target ? Math.min(100, (totals.kcal / target.kcal) * 100) : 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Breadcrumbs items={[{ label: "Início", href: "/dashboard" }, { label: "Painel" }]} />
					<h1 className="text-2xl font-semibold mt-1">Painel</h1>
				</div>
				<div className="flex gap-2 text-sm">
					<Link className={`rounded-md px-3 py-1 border ${period === "day" ? "bg-accent" : ""}`} href="/dashboard?period=day">Dia</Link>
					<Link className={`rounded-md px-3 py-1 border ${period === "week" ? "bg-accent" : ""}`} href="/dashboard?period=week">Semana</Link>
					<Link className={`rounded-md px-3 py-1 border ${period === "month" ? "bg-accent" : ""}`} href="/dashboard?period=month">Mês</Link>
				</div>
			</div>
			<div className="kpi-snap lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible">
				<div className="flex gap-3 lg:contents">
					<StatCard label="Consumido" value={Math.round(totals.kcal)} rightIcon={Flame} />
					<StatCard label="Meta" value={target ? target.kcal : 0} rightIcon={Utensils} />
					<StatCard label="Saldo" value={saldo != null ? saldo : 0} className={saldo != null && saldo < 0 ? "text-red-500" : ""} rightIcon={Apple} />
					<StatCard label="Proteína" value={Math.round(totals.protein)} rightIcon={Beef} />
					<StatCard label="Carbo" value={Math.round(totals.carbs)} rightIcon={Wheat} />
					<StatCard label="Gordura" value={Math.round(totals.fat)} rightIcon={Apple} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
				<Card className="col-span-2">
					<p className="font-medium mb-2">Consumo ao longo do dia</p>
					<LineChart points={[
						Math.round(totals.kcal * 0.1),
						Math.round(totals.kcal * 0.2),
						Math.round(totals.kcal * 0.3),
						Math.round(totals.kcal * 0.15),
						Math.round(totals.kcal * 0.25),
					]} />
				</Card>
				<Card>
					<p className="font-medium mb-2">Meta do dia</p>
					<RadialProgress percent={percentTarget} label="Progresso da meta" />
				</Card>
			</div>

			<Card>
				<h2 className="font-medium mb-2">Meta diária</h2>
				<form action={saveDailyTarget} className="grid grid-cols-2 md:grid-cols-6 gap-3">
					<select name="mode" defaultValue={target?.mode ?? "MANUAL"} className="border rounded-md px-3 py-2 col-span-2">
						<option value="MANUAL">Manual</option>
						<option value="AUTO">Automática</option>
					</select>
					<input name="kcal" type="number" placeholder="Kcal" defaultValue={target?.kcal} className="border rounded-md px-3 py-2" />
					<input name="protein" type="number" placeholder="Proteína (g)" defaultValue={target?.protein ?? undefined} className="border rounded-md px-3 py-2" />
					<input name="carbs" type="number" placeholder="Carbo (g)" defaultValue={target?.carbs ?? undefined} className="border rounded-md px-3 py-2" />
					<input name="fat" type="number" placeholder="Gord (g)" defaultValue={target?.fat ?? undefined} className="border rounded-md px-3 py-2" />
					<button type="submit" className="rounded-md bg-primary text-primary-foreground px-4 py-2">Salvar</button>
				</form>
				<p className="text-xs text-muted-foreground mt-2">Salvar cria um novo registro de meta válido a partir de hoje.</p>
			</Card>

			<Card>
				<h2 className="font-medium mb-2">Itens recentes</h2>
				<div className="overflow-x-auto">
					<table className="w-full text-sm table-zebra">
						<thead className="text-left text-muted-foreground">
							<tr>
								<th className="py-2"></th>
								<th>Refeição</th>
								<th>Alimento</th>
								<th>Qtd</th>
								<th>Kcal</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5">
							{recentItems.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-8 text-center text-muted-foreground">Sem itens no período selecionado. <a className="underline" href="/meals">Adicionar refeição</a></td>
								</tr>
							) : recentItems.map((it) => (
								<tr key={it.id}>
									<td className="py-2 opacity-60">
										{it.food.servingUnit === "GRAM" ? <Beef size={16} /> : it.food.servingUnit === "MILLILITER" ? <FlaskConical size={16} /> : it.food.servingUnit === "PIECE" ? <Apple size={16} /> : <Wheat size={16} />}
									</td>
									<td className="py-2">{it.meal.name}</td>
									<td>{it.food.name}</td>
									<td>{it.quantity}</td>
									<td>{Math.round(it.quantity * it.food.kcalPerServing)} kcal</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}
