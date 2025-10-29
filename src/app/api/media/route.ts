import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function extractInfoHash(magnet: string): string | null {
  const match = magnet.match(/btih:([A-F0-9]+)/i);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const infoHash = body.torrentMagnet ? extractInfoHash(body.torrentMagnet) : null;

    const media = await prisma.media.create({
      data: {
        userId: session.user.id, // agora é string
        title: body.title,
        tmdbId: body.tmdbId ? Number(body.tmdbId) : null,
        synopsis: body.synopsis,
        genres: body.genres,
        posterUrl: body.posterUrl,
        wallpaperUrl: body.wallpaperUrl,
        jellyfinUrl: body.jellyfinUrl,
        torrentMagnet: body.torrentMagnet,
        torrentInfoHash: infoHash,
        cloudSeedEnabled: false,
        cloudProvider: null,
        status: "pending",
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar mídia:", err);
    return NextResponse.json({ error: "Erro ao criar mídia" }, { status: 500 });
  }
}
