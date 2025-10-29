"use client";

// ui/post-card.tsx

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useDominantColor } from "@/hooks/useDominantColor";

import { Play } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type CSSWithVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

export function PostCard({ post, itemVariants }: any) {
  const dominantColor = useDominantColor(post.image);

  return (
    <motion.li
      style={
        {
          "--to-color": dominantColor || "rgb(231, 246, 255)", // cor dominante sólida
          "--ice-white": "rgb(231, 246, 255, 0.3)", // branco gelo suave
        } as CSSWithVars
      }
      className="group flex p-0.5 hover:bg-[linear-gradient(to_right,var(--to-color))]
      hover:shadow-[0_0_70px_-10px_var(--to-color)] transition-all ease-in items-center justify-center backdrop-blur-2xl rounded-xl cursor-pointer"
      variants={itemVariants}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex w-full h-full relative">
        {/* Imagem visível */}
        <Image
          src={post.image}
          alt={post.titulo}
          width={500}
          height={500}
          className="relative z-0 rounded-xl object-cover w-full h-full"
        />

        {/* Imagem invisível (usada só pelo ColorThief) */}
        <img
          src={post.image}
          alt=""
          crossOrigin="anonymous"
          className="hidden"
        />


        <div className="absolute inset-0 flex p-2 items-start justify-between z-10 font-semibold">


          {/*Play button*/}
          <div className="
            absolute inset-0 flex items-end justify-end 
            opacity-0 
            group-hover:opacity-100
            transition-all duration-100 ease-in p-2
          ">
            <HoverCard>
              <HoverCardTrigger><Badge className="p-2.5 rounded-full bg-neutral-500/50 " variant="outline"><Play className="scale-110" /></Badge></HoverCardTrigger>
              <HoverCardContent className="bg-black/60 backdrop-blur-2xl">
                <div className="flex justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{post.titulo}</h4>
                    <p className="text-sm">
                      {post.genero}
                    </p>
                    <div className="text-muted-foreground text-xs">
                      {post.sinopse}
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
