"use client";

import { useState } from "react";
import Carousel from "@/components/moviesCarrousel";
import PostInfo from "@/components/postInfo";

interface Post {
  id: string | number;
  titulo: string;
  genero: string;
  sinopse: string;
  qualityVideo: string;
  codecAudio: string;
  wallpaper: string;
  logoUrl?: string | null;
}

interface CarouselSectionProps {
  posts: Post[];
  disableAutoplay?: boolean;
}

export default function CarouselSection({ posts, disableAutoplay }: CarouselSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isSingle = posts.length <= 1;
  const activePost = posts[activeIndex] || posts;

  return (
    <div className="relative flex w-full h-3/6 items-center justify-center overflow-hidden">
      {/* Carrossel */}
      <div className="w-full h-full">
        <Carousel
          posts={posts}
          onSlideChange={setActiveIndex}
          disableAutoplay={disableAutoplay || isSingle}
        />
      </div>

      {/* Escurecimento */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-850/90 via-10% to-transparent z-10" />

      {/* Informações */}
      <div className="w-full h-full absolute bottom-10 z-20">
          <div className="flex w-3/6 h-full pt-32 pl-24">
            {activePost && <PostInfo key={activePost.id} post={activePost} />}
          </div>
      </div>
    </div>
  );
}
