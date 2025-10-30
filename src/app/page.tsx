export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <main className="w-full max-w-2xl p-6">
        <h1 className="text-3xl font-semibold mb-2">Controle de Calorias</h1>
        <p className="text-muted-foreground mb-6">Faça login para acessar o dashboard e registrar suas refeições.</p>
        <div className="flex gap-3">
          <a href="/login" className="rounded-md bg-primary text-primary-foreground px-4 py-2">Entrar</a>
          <a href="/register" className="rounded-md border px-4 py-2">Criar conta</a>
        </div>
      </main>
    </div>
  );
}
