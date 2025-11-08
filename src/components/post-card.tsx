"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useDominantColor } from "@/hooks/useDominantColor";
import { Play } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { UIPost } from "@/@types/UIPost";

type CSSWithVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

interface PostCardProps {
  post: UIPost;
  itemVariants?: any;
  variant?: "default" | "background";
}

export function PostCard({ post, itemVariants, variant = "default" }: PostCardProps) {
  const dominantColor = useDominantColor(post.image);

  const href =
  post.source === "local"
    ? `/dashboard/media/local-${post.id}`
    : `/dashboard/media/tmdb-${post.id}`;

  return (
    <Link href={href}>
      <motion.li
        style={
          {
            "--to-color": dominantColor || "rgb(231, 246, 255)",
            "--ice-white": "rgb(231, 246, 255, 0.3)",
          } as CSSWithVars
        }
        className={`group flex w-44 p-0.5 backdrop-blur-2xl cursor-pointer transition-all ease-in
          ${variant === "background"
            ? "opacity-30 blur-sm hover:opacity-60"
            : "hover:bg-[linear-gradient(to_right,var(--to-color))] rounded-md hover:shadow-[0_0_70px_-10px_var(--to-color)]"}
        `}
        variants={itemVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex w-full h-full relative">
          <Image
            src={post.image}
            alt={post.titulo}
            width={500}
            height={500}
            className="relative z-0 object-cover w-full h-full rounded-md"
          />

          {/* invisível, apenas para cálculo de cor */}
          <img src={post.image} alt="" crossOrigin="anonymous" className="hidden" />

          {variant === "default" && (
            <div className="absolute inset-0 flex p-2 items-start justify-between z-10 font-semibold">
              {/* Play Button */}
              <div
                className="
                absolute inset-0 flex items-end justify-end 
                opacity-0 
                group-hover:opacity-100
                transition-all duration-100 ease-in p-2
              "
              >
                <HoverCard>
                  <HoverCardTrigger>
                    <Badge className="p-2.5 rounded-full bg-neutral-500/50" variant="outline">
                      <Play className="scale-110" />
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-black/60 backdrop-blur-2xl">
                    <div className="flex justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{post.titulo}</h4>
                        <p className="text-sm">{post.genero}</p>
                        <div className="text-muted-foreground text-xs">
                          {post.sinopse}
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          )}
        </div>
      </motion.li>
    </Link>
  );
}
