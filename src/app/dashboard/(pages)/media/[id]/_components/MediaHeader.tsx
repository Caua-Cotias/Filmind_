"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MediaHeaderProps {
  title: string;
  sinopse: string;
  poster: string;
}

import { Fullscreen } from 'lucide-react';




export default function MediaHeader({ title, sinopse, poster }: MediaHeaderProps) {
  return (
    <section className="flex w-full h-full flex-col items-center justify-center md:flex-row gap-6">
        <div className="flex w-auto h-full items-center justify-center px-7">
            <div className="flex w-60 h-96">
                <Image
                    width={500}
                    height={500}
                    src={poster}
                    alt={title}
                    className="w-full h-full"
                />
            </div>
        </div>

      <div className="flex flex-col w-auto h-full items-center justify-around px-7 py-16">
        <div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-400">{sinopse}</p>
        </div>

        <div className="flex w-full items-center justify-start gap-4">
          <Button  className="cursor-pointer">Assistir Agora</Button>
          <Button variant="outline" className="cursor-pointer">Adicionar à Minha Lista</Button>
        </div>

        <div className="flex w-full items-center justify-start">
          <Button variant="outline" className="rounded-full cursor-pointer py-5"><Fullscreen /></Button>
          
        </div>
      </div>
    </section>
  );
}
