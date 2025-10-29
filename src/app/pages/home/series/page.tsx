import { getPopularSeries } from "@/lib/tmdb";
import { PostCard } from "@/components/post-card";

export default async function Series() {
  const posts = await getPopularSeries(1, 10);

  return (
    <main className="flex w-full h-72 relative rounded-lg">
          {/* Fundo com efeito */}
          <div className="absolute inset-0 -z-10 flex p-3 gap-4 mt-2 rounded-lg">
            {posts.map((post: any) => (
              <PostCard key={`bg-${post.id}`} post={post} variant="background" />
            ))}
          </div>
    
    
          {/* Camada principal */}
          <div className="absolute inset-0 z-10 flex p-3 gap-4 items-center justify-center rounded-lg">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
    </main>
  );
}
