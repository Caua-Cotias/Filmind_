import CarouselSection from "../../../components/carouselSection"; // componente client
import { getPosts } from "@/lib/posts";
import Movies from "@/app/movies/page";
import Featured from "@/components/featured";

export default async function Home() {
  const posts = await getPosts(); // isso roda no servidor

  return (
    <main className="flex w-full h-screen bg-black text-white overflow-hidden">
      <Featured />

      <div className="flex flex-col w-full h-full bg-linear-to-t items-center justify-center from-black to-transparent absolute z-20">
        <div className="w-full h-2/5">

        </div>
        <div className="w-full h-3/6">
          <div className="pl-20">
            <h2 className="font-bold mb-5">Lançamentos</h2>
            <Movies />
          </div>
        </div>
      </div>
    </main>
  );
}
