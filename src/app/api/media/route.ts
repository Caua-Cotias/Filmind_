import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { create } from "@storacha/client";

// 🔹 Helper para extrair o infoHash de um magnet link
function extractInfoHash(magnet?: string | null) {
  if (!magnet) return null;
  const match = magnet.match(/btih:([A-F0-9]+)/i);
  return match ? match[1] : null;
}

// ===================================
// 🔹 POST — Criar ou atualizar mídia
// ===================================
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      tmdbId,
      synopsis,
      genres,
      posterUrl,
      wallpaperUrl,
      jellyfinUrl,
      fileMoonUrl,
      torrentMagnet,
      torrentFile,
      type,
      seasons, // [{ seasonNumber, episodes: [{ episode_number, name, overview }] }]
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });
    }

    // 🔹 Upload torrent para Storacha, se existir
    let ipfsCid: string | null = null;
    if (torrentFile) {
      try {
        const client = await create();
        const res = await client.uploadFile(torrentFile);
        ipfsCid = res.toString();
      } catch (err) {
        console.warn("❌ Falha ao enviar arquivo para Storacha:", err);
      }
    }

    const infoHash = extractInfoHash(torrentMagnet);

    // 🔹 Verifica se mídia já existe (mesmo user + tmdbId ou título igual)
    const orConditions: any[] = [];
    if (tmdbId) orConditions.push({ tmdbId: Number(tmdbId) });
    orConditions.push({ title: { equals: title, mode: "insensitive" } });

    const existingMedia = await prisma.media.findFirst({
      where: {
        userId: session.user.id,
        OR: orConditions,
      },
    });

    // ===================================
    // 🔹 Atualizar mídia existente
    // ===================================
    if (existingMedia) {
      const updated = await prisma.media.update({
        where: { id: existingMedia.id },
        data: {
          jellyfinUrl: jellyfinUrl ?? existingMedia.jellyfinUrl,
          torrentMagnet: torrentMagnet ?? existingMedia.torrentMagnet,
          torrentInfoHash: infoHash ?? existingMedia.torrentInfoHash,
          ipfsCid: ipfsCid ?? existingMedia.ipfsCid,
          fileMoonUrl: fileMoonUrl ?? existingMedia.fileMoonUrl,
          posterUrl: posterUrl ?? existingMedia.posterUrl,
          wallpaperUrl: wallpaperUrl ?? existingMedia.wallpaperUrl,
          synopsis: synopsis ?? existingMedia.synopsis,
          genres: genres ?? existingMedia.genres,
          type: type ?? existingMedia.type,
          status: "pending",
          updatedAt: new Date(),
        },
      });

      // 🔹 Se for série, atualizar temporadas/episódios
      if ((type === "TV" || type === "SERIES") && Array.isArray(seasons)) {
        for (const s of seasons) {
          const seasonNumber = Number(s.seasonNumber);
          if (!seasonNumber) continue;

          const season = await prisma.season.upsert({
            where: {
              mediaId_seasonNumber: {
                mediaId: updated.id,
                seasonNumber,
              },
            },
            update: {},
            create: {
              mediaId: updated.id,
              seasonNumber,
            },
          });

          if (Array.isArray(s.episodes)) {
            for (const ep of s.episodes) {
              const episodeNumber = Number(ep.episode_number);
              if (!episodeNumber) continue;

              await prisma.episode.upsert({
                where: {
                  mediaId_season_episodeNumber: {
                    mediaId: updated.id,
                    season: seasonNumber,
                    episodeNumber,
                  },
                },
                update: {
                  title: ep.name ?? ep.title ?? `Episódio ${episodeNumber}`,
                  synopsis: ep.overview ?? null,
                  jellyfinUrl: ep.jellyfinUrl ?? jellyfinUrl ?? null,
                  fileMoonUrl: ep.fileMoonUrl ?? fileMoonUrl ?? null,
                  torrentMagnet: ep.torrentMagnet ?? torrentMagnet ?? null,
                  ipfsCid: ep.ipfsCid ?? ipfsCid ?? null,
                },
                create: {
                  mediaId: updated.id,
                  season: seasonNumber,
                  episodeNumber,
                  title: ep.name ?? ep.title ?? `Episódio ${episodeNumber}`,
                  synopsis: ep.overview ?? null,
                  jellyfinUrl: ep.jellyfinUrl ?? jellyfinUrl ?? null,
                  fileMoonUrl: ep.fileMoonUrl ?? fileMoonUrl ?? null,
                  torrentMagnet: ep.torrentMagnet ?? torrentMagnet ?? null,
                  ipfsCid: ep.ipfsCid ?? ipfsCid ?? null,
                },
              });

            }
          }
        }
      }

      return NextResponse.json({ message: "Mídia atualizada", media: updated }, { status: 200 });
    }

    // ===================================
    // 🔹 Criar nova mídia
    // ===================================
    const created = await prisma.media.create({
      data: {
        userId: session.user.id,
        title,
        tmdbId: tmdbId ? Number(tmdbId) : null,
        synopsis: synopsis ?? null,
        genres: genres ?? null,
        posterUrl: posterUrl ?? null,
        wallpaperUrl: wallpaperUrl ?? null,
        jellyfinUrl: jellyfinUrl ?? null,
        fileMoonUrl: fileMoonUrl ?? null,
        torrentMagnet: torrentMagnet ?? null,
        torrentInfoHash: infoHash ?? null,
        ipfsCid: ipfsCid ?? null,
        type: type ?? "MOVIE",
        status: "pending",
      },
    });

    // 🔹 Criar temporadas e episódios se for série
    if ((type === "TV" || type === "SERIES") && Array.isArray(seasons)) {
      for (const s of seasons) {
        const seasonNumber = Number(s.seasonNumber);
        if (!seasonNumber) continue;

        await prisma.season.create({
          data: {
            mediaId: created.id,
            seasonNumber,
          },
        });

        if (Array.isArray(s.episodes) && s.episodes.length > 0) {
          await prisma.episode.createMany({
            data: s.episodes.map((ep: any) => ({
              mediaId: created.id,
              season: seasonNumber,
              episodeNumber: Number(ep.episode_number),
              title: ep.name ?? ep.title ?? `Episódio ${ep.episode_number}`,
              synopsis: ep.overview ?? null,
              jellyfinUrl: ep.jellyfinUrl ?? jellyfinUrl ?? null,
              fileMoonUrl: ep.fileMoonUrl ?? fileMoonUrl ?? null,
              torrentMagnet: ep.torrentMagnet ?? torrentMagnet ?? null,
              ipfsCid: ep.ipfsCid ?? ipfsCid ?? null,
            })),
            skipDuplicates: true,
          });
        }
      }
    }

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("❌ Erro /api/media:", err);
    return NextResponse.json({ error: "Erro interno ao adicionar mídia" }, { status: 500 });
  }
}

// ===================================
// 🔹 GET — Listar todas as mídias
// ===================================
export async function GET() {
  try {
    const medias = await prisma.media.findMany({
      include: {
        seasons: {
          include: {
            episodes: true,
          },
        },
        episodes: true, // episódios independentes (caso existam)
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(medias);
  } catch (err) {
    console.error("❌ Erro GET /api/media:", err);
    return NextResponse.json({ error: "Erro ao buscar mídias" }, { status: 500 });
  }
}
