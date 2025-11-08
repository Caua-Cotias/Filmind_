"use client";

import PlayerRouter from "../PlayerRouter";

interface MediaPlayerProps {
  media: any;
  title: string;
}

export default function MediaPlayer({ media, title }: MediaPlayerProps) {
  if (!media) return null;

  return (
    <section className="flex w-full h-full bg-black">
      <PlayerRouter media={media} title={title} />
    </section>
  );
}
