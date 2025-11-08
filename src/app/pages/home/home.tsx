import Lancamentos from "./lancamentos/page";
import Filmes from "./filmes/page";
import Series from "./series/page";
import CarouselSection from "@/components/carouselSection";
import { getPosts } from "@/lib/posts";
import AddRecent from "./addRecents/page";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="w-screen h-screen">
      <CarouselSection posts={posts} />




        <div className="w-full  bg-linear-to-t from-gray-900  to-gray-950">
          <div className="">
            <AddRecent />
          </div>

          <div className="">
            <Lancamentos />
          </div>

          <div className="">
            <Filmes />
          </div>

          <div className="">
            <Series />
          </div>
        </div>

    </main>
  );
}
