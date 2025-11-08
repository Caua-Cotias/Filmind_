import MediaClient from "./MediaClient";
import { prisma } from "@/lib/prisma";
import { getPostById, getPostByIdTV } from "@/lib/posts";
import { MediaType } from "../../../../../generated/prisma/client";

export default async function MediaPage({ params }: { params: { id: string } }) {
  let source: "tmdb" | "local" | null = null;
  let numericId: number;

  if (params.id.includes("-")) {
    const [prefix, rawId] = params.id.split("-");
    source = prefix === "local" ? "local" : "tmdb";
    numericId = Number(rawId);
  } else {
    source = "tmdb";
    numericId = Number(params.id);
  }

  let tmdbData: any = null;
  let userMedias: any[] = [];

  if (source === "local") {
    const media = await prisma.media.findUnique({
      where: { id: numericId },
      include: { user: true },
    });

    if (media?.tmdbId) {
      tmdbData =
        media.type === MediaType.TV
          ? await getPostByIdTV(media.tmdbId)
          : await getPostById(media.tmdbId);

      userMedias = await prisma.media.findMany({
        where: { tmdbId: media.tmdbId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    } else if (media) {
      userMedias = [media];
    }
  } else {
    tmdbData = await getPostById(numericId).catch(() => null);
    if (!tmdbData?.titulo) tmdbData = await getPostByIdTV(numericId).catch(() => null);

    userMedias = await prisma.media.findMany({
      where: {
        OR: [
          { tmdbId: numericId },
          { title: { contains: tmdbData?.titulo || "", mode: "insensitive" } },
        ],
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return <MediaClient tmdbData={tmdbData} userMedias={userMedias} />;
}
