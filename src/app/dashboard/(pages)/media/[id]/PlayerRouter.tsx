"use client";

import { useEffect, useState } from "react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { Film, HardDrive, Magnet, Network, PlaySquare, Video } from "lucide-react";
import MagnetPlayer from "@/components/MagnetPlayer";

//
// ===============================
// 🎬 Componente Principal
// ===============================
export default function PlayerRouter({ media, title }: {
  media: {
    jellyfinUrl?: string;
    fileMoonUrl?: string;
    ipfsCid?: string;
    torrentMagnet?: string;
    title?: string;
    posterUrl?: string;
  };
  title?: string;
}) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isVidstack, setIsVidstack] = useState<boolean>(true);

  // --- Seleção automática da melhor fonte ---
  useEffect(() => {
    if (!media) return;

    if (media.jellyfinUrl) {
      handleSelect("jellyfin");
    } else if (media.ipfsCid) {
      handleSelect("ipfs");
    } else if (media.torrentMagnet) {
      handleSelect("magnet");
    } else if (media.fileMoonUrl) {
      handleSelect("filemoon");
    }
  }, [media]);

  // --- Troca manual da fonte ---
  const handleSelect = (type: string) => {
    if (type === "jellyfin" && media.jellyfinUrl) {
      setSelectedSource(media.jellyfinUrl);
      setActiveType("jellyfin");
      setIsVidstack(!media.jellyfinUrl.endsWith(".mkv"));
    } else if (type === "ipfs" && media.ipfsCid) {
      const ipfsUrl = media.ipfsCid.startsWith("ipfs://")
        ? `https://ipfs.io/ipfs/${media.ipfsCid.replace("ipfs://", "")}`
        : `https://ipfs.io/ipfs/${media.ipfsCid}`;
      setSelectedSource(ipfsUrl);
      setActiveType("ipfs");
      setIsVidstack(true);
    } else if (type === "magnet" && media.torrentMagnet) {
      setSelectedSource(media.torrentMagnet);
      setActiveType("magnet");
      setIsVidstack(false);
    } else if (type === "filemoon" && media.fileMoonUrl) {
      setSelectedSource(media.fileMoonUrl);
      setActiveType("filemoon");
      setIsVidstack(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-black">
      {/* 📺 Player */}
      <VideoPlayer
        selectedSource={selectedSource}
        activeType={activeType}
        isVidstack={isVidstack}
        title={title}
        poster={media.posterUrl}
      />

      {/* 🧭 Seletor de Fontes */}
      <SourceSelector
        media={media}
        activeType={activeType}
        onSelect={handleSelect}
      />
    </div>
  );
}


//
// ===============================
// 🧭 Seletor de Fontes
// ===============================
function SourceSelector({
  media,
  activeType,
  onSelect,
}: {
  media: any;
  activeType: string | null;
  onSelect: (type: string) => void;
}) {
  const sources = [
    { icon: Film, label: "Jellyfin", type: "jellyfin", available: !!media.jellyfinUrl },
    { icon: Network, label: "IPFS", type: "ipfs", available: !!media.ipfsCid },
    { icon: Magnet, label: "Magnet", type: "magnet", available: !!media.torrentMagnet },
    { icon: Video, label: "FileMoon", type: "filemoon", available: !!media.fileMoonUrl },
    { icon: HardDrive, label: "Local (Em breve)", type: "local", available: false },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 top-3/6 mt-10 fixed z-10">
      {sources.map((src) => (
        <button
          key={src.type}
          disabled={!src.available}
          onClick={() => src.available && onSelect(src.type)}
          className={`flex items-center gap-2 px-4 py-2 text-sm transition-all 
          ${
            activeType === src.type
              ? "bg-gray-100 font-semibold text-gray-800 rounded-md"
              : "bg-transparent font-semibold text-gray-100 border-2 border-gray-500/30 rounded-md"
          }
          ${!src.available ? "opacity-40 cursor-not-allowed" : "hover:border-gray-500/50 cursor-pointer"}
        `}
        >
          <src.icon size={16} />
          {src.label}
        </button>
      ))}
    </div>
  );
}

//
// ===============================
// 📺 Player de Vídeo
// ===============================
function VideoPlayer({
  selectedSource,
  activeType,
  isVidstack,
  title,
  poster,
}: {
  selectedSource: string | null;
  activeType: string | null;
  isVidstack: boolean;
  title?: string;
  poster?: string;
}) {
  if (!selectedSource) {
    return (
      <div className="">
        Nenhuma fonte selecionada.
      </div>
    );
  }

  if (activeType === "magnet") {
    return <MagnetPlayer magnet={selectedSource} title={title} />;
  }

  if (!isVidstack) {
    return (
      <div className="relative w-full h-full">
        <video
          src={selectedSource}
          autoPlay
          controls
          playsInline
          className="w-full h-full object-contain bg-black rounded-xl"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
    );
  }

  // --- Vidstack Player (Jellyfin, IPFS, FileMoon etc.)
  const videoSrc =
    activeType === "jellyfin"
      ? `/api/proxy/jellyfin?url=${encodeURIComponent(selectedSource)}`
      : selectedSource;

  return (
    <div className="flex w-full h-full aspect-video">
      <MediaPlayer
        src={videoSrc}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        crossOrigin
        playsInline
        title={title}
        poster="/fallbackPlayer.png"
        className="flex w-full h-full"
      >
        <MediaProvider>
          <Poster className="vds-poster object-cover" />
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
