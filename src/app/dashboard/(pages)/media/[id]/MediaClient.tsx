"use client";

import { useState } from "react";
import MediaHeader from "./_components/MediaHeader";
import MediaOptions from "./_components/MediaOptions";
import MediaPlayer from "./_components/MediaPlayer";
import Image from "next/image";

export default function MediaClient({ tmdbData, userMedias }: any) {
  const [selectedMedia, setSelectedMedia] = useState<any>(userMedias[0] ?? null);

  const title = tmdbData?.titulo ?? selectedMedia?.title ?? "Título não encontrado";
  const sinopse = tmdbData?.sinopse ?? selectedMedia?.synopsis ?? "Sem descrição disponível.";
  const poster = tmdbData?.poster || selectedMedia?.posterUrl || "/placeholder.png";
  const wallpaper = tmdbData?.wallpaper || selectedMedia?.backdropUrl || "/fallbackPlayer.png";
  const trailers = tmdbData?.trailers || [];
  return (
    <main className="flex flex-col w-screen h-screen overflow-y-hidden relative text-white">
      <div className="absolute inset-0 -z-10">
        <Image src={wallpaper} alt={title} width={1920} height={1080} className="object-cover" />
      </div>

      <div className="flex w-full h-3/6">
        <div className="flex w-3/6 h-full bg-gray-950/90 backdrop-blur-2xl">
          <MediaHeader title={title} sinopse={sinopse} poster={poster} />
        </div>

        <div className="flex w-3/6 h-full items-center justify-center bg-gray-950/90">
          <MediaPlayer media={selectedMedia} title={title} />
        </div>
      </div>

      <div className="flex p-10 w-full h-3/6 items-start justify-start bg-gray-950">
        <MediaOptions
          userMedias={userMedias}
          selectedMedia={selectedMedia}
          onSelect={setSelectedMedia}
        />
      </div>
    </main>
  );
}
