import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  if (!title) return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });

  const media = await prisma.media.findFirst({
    where: {
      userId: session.user.id,
      title: { equals: title, mode: "insensitive" },
    },
  });

  return NextResponse.json({ media });
}
