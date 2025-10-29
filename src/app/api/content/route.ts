import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import { Readable } from "stream";
import { create } from "@storacha/client"; // ✅ CORRETO

export const config = {
  api: { bodyParser: false },
};

// 🔧 Converte o Request (Next.js Web API) para stream Node.js
async function requestToStream(req: Request): Promise<NodeJS.ReadableStream> {
  const arrayBuffer = await req.arrayBuffer();
  return Readable.from(Buffer.from(arrayBuffer));
}

/* =====================
   📤 POST /api/content
   Upload de mídia (.torrent ou magnet) para Storacha IPFS
   ===================== */
export async function POST(req: Request) {
  try {
    // 🔐 Autenticação
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers),
    });

    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // 🧩 Parse do form-data com formidable
    const nodeReq = await requestToStream(req);
    const form = formidable({ multiples: false });

    const [fields, files]: [Fields, Files] = await new Promise((resolve, reject) => {
      form.parse(nodeReq as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    const magnet = Array.isArray(fields.magnet) ? fields.magnet[0] : fields.magnet;

    let ipfsCid: string | null = null;
    let uploadType: "file" | "magnet" | null = null;

    // 🗂️ Upload para Storacha se for arquivo
    if (files.torrent && Array.isArray(files.torrent) && files.torrent[0]) {
      const filePath = (files.torrent[0] as any).filepath;
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer]); // ✅ converte Buffer → Blob

      // 🚀 Upload para Storacha
      const client = await create();
      const result = await client.uploadFile(blob); // ✅ sem wrapWithDirectory
      ipfsCid = result.toString(); // ✅ converte AnyLink → string

      uploadType = "file";
    }

    // 💡 Caso tenha enviado só o magnet link
    if (!ipfsCid && magnet) {
      uploadType = "magnet";
    }

    if (!uploadType) {
      return NextResponse.json(
        { error: "Nenhum arquivo .torrent ou link magnet fornecido" },
        { status: 400 }
      );
    }

    // 💾 Salva no banco via Prisma
    const media = await prisma.mediaTorrent.create({
      data: {
        title: title || "Untitled",
        description: description || null,
        ownerId: session.user.id,
        magnet: uploadType === "magnet" ? magnet : null,
        ipfsCid,
      },
    });

    return NextResponse.json({
      success: true,
      type: uploadType,
      media,
    });
  } catch (err: any) {
    console.error("Erro no upload:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor", details: err.message },
      { status: 500 }
    );
  }
}

/* =====================
   📥 GET /api/content
   Lista todos os conteúdos
   ===================== */
export async function GET() {
  try {
    const media = await prisma.mediaTorrent.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    console.error("Erro ao listar:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor", details: error.message },
      { status: 500 }
    );
  }
}
