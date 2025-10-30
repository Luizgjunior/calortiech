import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, name } = RegisterSchema.parse(data);

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const usersCount = await prisma.user.count();
    const role = usersCount === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: await hash(password, 10),
        name,
        role: role as any,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map((e) => e.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao registrar" }, { status: 500 });
  }
}


