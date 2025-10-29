import Featured from "@/components/featured";
import Lancamentos from "./lancamentos/page";
import Filmes from "./filmes/page";
import Series from "./series/page";
import CarouselSection from "@/components/carouselSection";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="flex w-full h-screen bg-black text-white overflow-hidden">
      <CarouselSection posts={posts} />

      <div className="flex flex-col w-full h-full bg-linear-to-t items-center justify-center from-black to-transparent absolute z-20 overflow-y-scroll">
        <div className="w-full h-2/5">

        </div>

        <div className="w-full h-3/6">
          <div className="">
            <h2 className="font-bold py-2 relative pl-4">Lançamentos</h2>
            <Lancamentos />
          </div>


          <div className="">
            <h2 className="font-bold py-2 relative pl-4">Filmes</h2>
            <Filmes />
          </div>

          <div className="">
            <h2 className="font-bold py-2 relative pl-4">Series</h2>
            <Series />
          </div>

          
        </div>

      </div>
    </main>
  );
}
