import CarouselSection from "@/components/carouselSection";
import { getPostById } from "@/lib/posts";

export default async function Featured() {
  const post = await getPostById(1); // pega um post específico
  return (
    <CarouselSection posts={[post]} disableAutoplay />
  );
}
