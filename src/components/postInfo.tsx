"use client";

import { motion } from "framer-motion";
import { Badge } from "./ui/badge";


interface Post {
  id: number | string;
  titulo: string;
  genero: string;
  sinopse: string;
  qualityVideo: string;
  codecAudio: string;
}

export default function PostInfo({ post }: { post: Post }) {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.98 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col w-full h-full items-start justify-center text-white"
    >
      <h1 className="text-3xl font-bold mb-3">{post.titulo}</h1>

      <div className="flex flex-wrap gap-3 text-sm text-gray-300">
        <span>{post.genero}</span>

        <Badge className="backdrop-blur-lg" variant="outline">{post.qualityVideo}</Badge>
        <Badge className="backdrop-blur-lg" variant="outline">{post.codecAudio}</Badge>
      </div>

      <p className="mt-4 text-gray-400 leading-relaxed">{post.sinopse}</p>
    </motion.div>
  );
}
