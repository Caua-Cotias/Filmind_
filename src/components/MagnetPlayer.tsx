"use client";

import { useEffect, useState } from "react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster, Track, TrackProps } from "@vidstack/react"
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';


interface MagnetPlayerProps {
  magnet: string;
  title?: string;
  onReady?: () => void;
  onError?: (msg: string) => void;
}

export default function MagnetPlayer({ magnet, title, onReady, onError }: MagnetPlayerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    let client: any;
    let isMounted = true;

    const loadWebTorrent = async () => {
      try {
        const WebTorrent = (await import("webtorrent/dist/webtorrent.min.js")).default;
        client = new WebTorrent();

        client.add(magnet, (torrent: any) => {
          const file = torrent.files.find((f: any) => f.name.endsWith(".mp4"));
          if (!file) {
            onError?.("Nenhum arquivo .mp4 encontrado neste torrent.");
            return;
          }

          file.getBlobURL((err: any, url: string) => {
            if (err || !url) {
              onError?.("Erro ao gerar URL do vídeo.");
              return;
            }

            if (isMounted) {
              setStreamUrl(url);
              onReady?.();
            }
          });
        });
      } catch (err) {
        console.error("Erro ao carregar WebTorrent:", err);
        onError?.("Erro ao carregar o player de torrent.");
      }
    };

    loadWebTorrent();

    return () => {
      isMounted = false;
      if (client) client.destroy();
    };
  }, [magnet]);

  if (!streamUrl) {
    return (
      <div className="flex items-center justify-center text-gray-400 h-64">
        Iniciando o streaming do torrent...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
      <MediaPlayer
        src={`/api/proxy/jellyfin?url=${encodeURIComponent(
        `${streamUrl}`
        )}`}
        viewType='video'
        streamType='on-demand'
        logLevel='warn'
        crossOrigin
        playsInline
        title={title}
        poster=''
        >
          <MediaProvider>
            <Poster className="vds-poster" />
          </MediaProvider>
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
          />
        </MediaPlayer>
    </div>
  );
}
