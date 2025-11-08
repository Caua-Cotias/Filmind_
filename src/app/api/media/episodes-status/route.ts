import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tmdbId = Number(url.searchParams.get("tmdbId"));
    if (!tmdbId) return NextResponse.json({}, { status: 400 });

    // find all media rows that match tmdbId (multiple users may have added)
    const medias = await prisma.media.findMany({
      where: { tmdbId },
      select: { id: true },
    });

    if (!medias || medias.length === 0) {
      return NextResponse.json({}, { status: 200 });
    }

    // get episodes for those medias
    const mediaIds = medias.map((m) => m.id);

    const episodes = await prisma.episode.findMany({
      where: { mediaId: { in: mediaIds } },
      select: {
        season: true,
        episodeNumber: true,
        // require these columns exist in schema: jellyfinUrl, torrentMagnet, ipfsCid
        jellyfinUrl: true,
        torrentMagnet: true,
        ipfsCid: true,
      },
    });

    // build availability map: season -> { episode -> true/false }
    const map: Record<number, Record<number, boolean>> = {};
    for (const ep of episodes) {
      const s = ep.season;
      const e = ep.episodeNumber;
      const available = !!(ep.jellyfinUrl || ep.torrentMagnet || ep.ipfsCid);
      if (!map[s]) map[s] = {};
      // if multiple medias provide availability, keep true if any is true
      map[s][e] = map[s][e] || available;
    }

    return NextResponse.json(map);
  } catch (err) {
    console.error("Erro episodes-status:", err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
