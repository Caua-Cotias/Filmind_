"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

interface Post {
  id: string | number;
  wallpaper: string;
  titulo: string;
}

interface CarouselProps {
  posts: Post[];
  onSlideChange?: (index: number) => void;
  disableAutoplay?: boolean;
}

export default function Carousel({ posts, onSlideChange, disableAutoplay }: CarouselProps) {
  const isSingle = posts.length <= 1;

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={isSingle ? false : { clickable: true }}
      autoplay={isSingle || disableAutoplay ? false : { delay: 5000 }}
      loop={!isSingle}
      onSlideChange={(swiper) => onSlideChange?.(swiper.realIndex)}
      className="w-full h-full"
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id}>
          <Image
            src={post.wallpaper}
            alt={post.titulo}
            width={1920}
            height={1080}
            className="object-cover w-full h-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
