import { getUpcomingMovies } from "@/lib/tmdb";
import { PostCard } from "@/components/post-card";

export default async function Lancamentos() {
  const posts = await getUpcomingMovies(1, 10);

  return (
    <main className="flex w-full h-72 relative rounded-lg">
      {/* Fundo com efeito */}
      <div className="absolute inset-0 -z-10 flex p-3 gap-4 mt-2 rounded-lg">
        {posts.map((post: any) => (
          <PostCard key={`bg-${post.id}`} post={post} variant="background" />
        ))}
      </div>

      {/* Camada de blur */}
      <div className="w-screen h-screen bg-black/80 backdrop-blur-xl"/>

      {/* Camada principal */}
      <div className="absolute inset-0 z-10 flex p-3 gap-4 items-center justify-center rounded-lg">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>
    </main>
  );
}
