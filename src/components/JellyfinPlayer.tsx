"use client";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

interface JellyfinPlayerProps {
  url: string;
  title?: string;
  onReady?: () => void;
  onError?: (msg: string) => void;
}

export default function JellyfinPlayer({ url, title, onReady, onError }: JellyfinPlayerProps) {
  return (
    <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
      <MediaPlayer
        title={title}
        src={url}
        controls
        autoPlay
        preload="metadata"
        onCanPlay={onReady}
        onError={() => onError?.("Falha ao carregar mídia Jellyfin.")}
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
