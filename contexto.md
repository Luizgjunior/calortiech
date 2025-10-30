# NaLinha – Contexto do Projeto

Este documento consolida o que já foi implementado até agora no sistema de controle de calorias "NaLinha".

## Stack e Infra
- Framework: Next.js 16 (App Router) + TypeScript
- UI: Tailwind CSS (tokens custom em `src/app/globals.css`)
- Animações: Framer Motion (microinterações leves)
- Auth: NextAuth (Credentials – email/senha), roles ADMIN e USER
- ORM: Prisma 6
- Banco: Postgres (Neon) integrado via `DATABASE_URL`
- Deploy alvo: Vercel (com `prisma migrate deploy` em produção)

## Modelo de Dados (Prisma)
- `User` (role: ADMIN/USER, auth por email/senha hash)
- `Food` (nome, porção padrão: valor/unidade, kcal/macros por porção, `isGlobal` para ADMIN)
- `Meal` (refeições por dia, por usuário)
- `MealItem` (itens dentro da refeição, quantidade em porções do alimento)
- `DailyTarget` (meta diária: modo MANUAL/AUTO, kcal e macros opcionais, data efetiva)

Arquivos principais:
- `prisma/schema.prisma`, `prisma.config.ts`
- Cliente Prisma gerado em `src/generated/prisma`

## Autenticação e Sessão
- NextAuth com `Credentials` em `src/lib/auth.ts`
- Endpoints: `src/app/api/auth/[...nextauth]/route.ts`
- Registro: `POST /api/register` cria primeiro usuário como ADMIN
- Tipagem de sessão estendida em `src/types/next-auth.d.ts`

## Páginas e Fluxos
- Login: `src/app/login/page.tsx`
- Registro: `src/app/register/page.tsx`
- Dashboard: `src/app/dashboard/page.tsx`
  - Cards KPI (kcal, meta, saldo, macros) com contagem animada
  - Gráfico de linha (SVG) e radial de progresso
  - Filtros Dia/Semana/Mês via querystring
  - Tabela "Itens recentes" (zebra + sticky header + empty state)
  - Formulário de meta diária (server action)
- Alimentos: `src/app/foods/page.tsx`
  - Formulário de criação (unidade: GRAM/ML/PIECE/SERVING)
  - Lista com ícones por unidade e remoção
- Refeições: `src/app/meals/page.tsx`
  - Criar refeição do dia, adicionar itens, remover itens/refeição
 - Configurações: `src/app/settings/page.tsx`
  - Perfil (editar nome) e alterar senha
  - Aparência (tema claro/escuro/sistema, densidade, ícones de fundo, toasts, reduzir animações)
  - Dados (limpar dados do dia/mês)
  - Administração (atalhos para ADMIN)

## Server Actions
- Dashboard: `src/app/dashboard/actions.ts` (salvar meta diária)
- Alimentos: `src/app/foods/actions.ts` (criar/remover com `redirect` para toasts)
- Refeições: `src/app/meals/actions.ts` (criar refeição, adicionar/remover item, `redirect` para toasts)
 - Configurações: `src/app/settings/actions.ts` (updateName, changePassword, clearData)

## UI, Layout e Componentes
- Layout com **Sidebar** fixa (desktop) e **MobileSidebar** (overlay no mobile)
- Tema claro suave (NaLinha):
  - Fundo #F7F8FB, cartões brancos, primária indigo #4F46E5, sucesso #10B981
  - Gradientes leves no background
- Plano de fundo com ícones (pratos, talheres, prato de sopa) via SVG data-URI em `.food-icons-bg` (posicionados e discretos)
- Componentes base em `src/components/ui/`:
  - `Button` (gradiente primário)
  - `Input`, `Card`, `Badge`, `FormField`, `Container`
  - `StatCard` (aceita `rightIcon`), `CountUp`, `LineChart`, `RadialProgress`
  - `Toast` (Provider + hook) e `ToastOnQuery` para feedback pós-ação
- Auxiliares: `Breadcrumbs`, `FoodBackground`
 - Preferências de tema/densidade: `ThemeClient` aplica `data-theme` pelo cookie `pref_theme`; formulário client `PreferencesForm` grava cookies

## UX e Detalhes
- Microinterações (hover, press scale, focus-ring)
- KPIs com contagem animada e scroll-snap no mobile
- Tabela com cabeçalho fixo e zebra
- Empty states amigáveis e toasts em ações (login/registro, foods/meals)
- Breadcrumbs e header de página no Dashboard

## Middleware e Proteções
- `middleware.ts`: protege `/dashboard` (exigindo autenticação)

## Variáveis de Ambiente
- `DATABASE_URL` (Neon – Postgres)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (dev: `http://localhost:3000`; prod: URL Vercel)

## Usuários Criados (dev)
- ADMIN: `admin@admin.com.br` / `88499351`
- USER: `usuario@usuario.com.br` / `88499351`

## Estado de Banco e Migrações
- Migrações executadas contra o Neon (reset e `migrate dev` aplicados)
- Produção: usar `prisma migrate deploy`

## Próximos Passos (sugeridos)
- Publicar no GitHub e conectar à Vercel
- Ajustes finos de tema claro (tonalidade da primária e contraste de subtítulos)
- Busca e ordenação em Alimentos; edição inline
- Totais por refeição e badges por macro
- Logs/telemetria básica (Web Vitals)

---
Atualizado automaticamente após as últimas alterações visuais e de UX.

