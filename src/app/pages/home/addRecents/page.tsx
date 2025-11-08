import { prisma } from "@/lib/prisma";
import { getTmdbDetailsMovie, searchTmdbByTitle } from "@/lib/tmdb";
import { UIPost } from "@/@types/UIPost";
import { PostCard } from "@/components/post-card";

type TMDBData = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  genres?: { name: string }[];
  poster_path?: string;
  backdrop_path?: string;
};

type MediaRecord = {
  id: string | number;
  tmdbId?: number | null;
  title?: string | null;
  synopsis?: string | null;
  genres?: string | null;
  posterUrl?: string | null;
  wallpaperUrl?: string | null;
  qualityVideo?: string | null;
  codecAudio?: string | null;
};

export default async function AddRecent() {
  const userMedias = await prisma.media.findMany({
    where: {
      tmdbId: { not: null }, // só mídias com TMDB ID
    },
    distinct: ["tmdbId"], // 🔹 evita duplicados do mesmo filme/série
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const posts: UIPost[] = await Promise.all(
    userMedias.map(async (media: MediaRecord) => {
      let tmdbData: TMDBData | null = null;

      if (media.tmdbId) {
        try {
          tmdbData = await getTmdbDetailsMovie(media.tmdbId);
        } catch {
          tmdbData = null;
        }
      }

      if (!tmdbData && media.title) {
        try {
          const search = await searchTmdbByTitle(media.title);
          if (search?.results?.length > 0) {
            const bestMatch = search.results[0];
            tmdbData = await getTmdbDetailsMovie(bestMatch.id);
          }
        } catch {
          tmdbData = null;
        }
      }

      const imageUrl =
        tmdbData?.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
          : tmdbData?.backdrop_path
          ? `https://image.tmdb.org/t/p/w500${tmdbData.backdrop_path}`
          : media.posterUrl ?? "/placeholder.png";

      const tmdbType =
        tmdbData?.title ? "movie" :
        tmdbData?.name ? "tv" :
        "movie"; // fallback

      return {
        id: media.id,
        titulo:
          tmdbData?.title ??
          tmdbData?.name ??
          media.title ??
          "Título desconhecido",
        sinopse:
          tmdbData?.overview ??
          media.synopsis ??
          "Sem descrição disponível.",
        genero:
          tmdbData?.genres?.map((g) => g.name).join(", ") ??
          media.genres ??
          "Desconhecido",
        image: imageUrl,
        qualityVideo: media.qualityVideo ?? "HD",
        codecAudio: media.codecAudio ?? "AAC",
        type: tmdbType,
        source: "local", // 👈 adiciona aqui
      };
    })
  );

  if (posts.length === 0) {
    return (
      <main className="flex justify-center items-center h-64 text-gray-400">
        Nenhuma mídia adicionada pelos usuários ainda 😢
      </main>
    );
  }

  return (
    <main className="flex w-full h-72 relative rounded-lg">
      {/* Fundo com efeito */}
      <div className="absolute inset-0 -z-10 flex p-3 gap-4 items-center justify-start rounded-lg">
        {posts.map((post: any) => (
          <PostCard key={`bg-${post.id}`} post={post} variant="background" />
        ))}
      </div>

      {/* Camada principal */}
      <div className="absolute inset-0 z-10 flex p-3 gap-4 items-center justify-start rounded-lg">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
