// app/movies/page.tsx
import { PostCard } from "@/components/post-card";
import { getPopularMovies } from "@/lib/tmdb";



export default async function Filmes() {
  const posts = await getPopularMovies(1, 10);
  

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

    