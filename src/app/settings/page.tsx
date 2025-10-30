import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { updateName, changePassword, clearData } from "./actions";
import { PreferencesForm } from "@/components/settings/PreferencesForm";

export default async function SettingsPage() {
	const session = await getServerSession(authConfig);
	if (!session?.user?.id) return <div className="p-6">Você precisa estar logado.</div>;
	const user = await prisma.user.findUnique({ where: { id: session.user.id as string }, select: { email: true, name: true, role: true } });
	const isAdmin = user?.role === "ADMIN";

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Configurações</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<h2 className="font-medium mb-3">Perfil</h2>
					<div className="text-sm text-muted-foreground mb-2">Email: {user?.email}</div>
					<form action={updateName} className="flex gap-2">
						<input name="name" defaultValue={user?.name ?? ""} className="border rounded-md px-3 py-2 flex-1" placeholder="Seu nome" />
						<button className="btn-gradient rounded-md px-4 py-2 text-primary-foreground">Salvar</button>
					</form>
				</Card>

				<Card>
					<h2 className="font-medium mb-3">Alterar senha</h2>
					<form action={changePassword} className="grid grid-cols-1 gap-2">
						<input name="current" type="password" className="border rounded-md px-3 py-2" placeholder="Senha atual" />
						<input name="password" type="password" className="border rounded-md px-3 py-2" placeholder="Nova senha" />
						<input name="confirm" type="password" className="border rounded-md px-3 py-2" placeholder="Confirmar nova senha" />
						<button className="btn-gradient rounded-md px-4 py-2 text-primary-foreground w-fit">Atualizar</button>
					</form>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<h2 className="font-medium mb-3">Aparência</h2>
					<PreferencesForm />
				</Card>

				<Card>
					<h2 className="font-medium mb-3">Dados</h2>
					<form action={clearData} className="flex items-center gap-3">
						<select name="scope" className="border rounded-md px-3 py-2">
							<option value="day">Limpar dados de hoje</option>
							<option value="month">Limpar dados do mês</option>
						</select>
						<button className="rounded-md px-4 py-2 border text-red-600">Limpar</button>
					</form>
				</Card>
			</div>

			{isAdmin ? (
				<Card>
					<h2 className="font-medium mb-3">Administração</h2>
					<div className="flex flex-wrap gap-2 text-sm">
						<a className="rounded-md border px-3 py-2" href="/foods">Gerenciar alimentos globais</a>
						<a className="rounded-md border px-3 py-2" href="/dashboard">Visão do Painel</a>
					</div>
				</Card>
			) : null}
		</div>
	);
}



