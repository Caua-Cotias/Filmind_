"use client";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

interface IPFSPlayerProps {
  cid: string;
  title?: string;
  onReady?: () => void;
  onError?: (msg: string) => void;
}

export default function IPFSPlayer({ cid, title, onReady, onError }: IPFSPlayerProps) {
  const gateway = "https://ipfs.io/ipfs/";
  const src = `${gateway}${cid.replace("ipfs://", "")}`;

  return (
    <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
      <MediaPlayer
        title={title}
        src={src}
        controls
        preload="metadata"
        onCanPlay={onReady}
        onError={() => onError?.("Erro ao carregar mídia IPFS.")}
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
