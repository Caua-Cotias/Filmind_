import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Lê o conteúdo do arquivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define o diretório de upload
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Garante que a pasta existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Cria um nome único para o arquivo
    const fileName = `${session.user.id}-${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Salva o arquivo localmente
    fs.writeFileSync(filePath, buffer);

    // Gera uma URL acessível publicamente
    const imageUrl = `/uploads/${fileName}`;

    // Atualiza o usuário no banco
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return NextResponse.json({ url: imageUrl });
  } catch (err) {
    console.error("Erro ao enviar avatar:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
