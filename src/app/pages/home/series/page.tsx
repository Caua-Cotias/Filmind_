import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";

export default async function SeriesPage() {
  const series = await prisma.media.findMany({
    where: { type: "TV" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Séries Adicionadas</h1>

      {series.length === 0 ? (
        <p className="text-gray-400">Nenhuma série adicionada ainda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {series.map((s) => (
            <PostCard
              key={s.id}
              post={{
                id: s.id,
                titulo: s.title,
                sinopse: s.synopsis || "",
                genero: s.genres || "",
                image: s.posterUrl || "",
                source: "local",
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
