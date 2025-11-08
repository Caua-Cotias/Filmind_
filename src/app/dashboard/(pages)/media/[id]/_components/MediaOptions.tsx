"use client";

import { Play, Server } from "lucide-react";

interface MediaOptionsProps {
  userMedias: any[];
  selectedMedia: any;
  onSelect: (media: any) => void;
}

export default function MediaOptions({ userMedias, selectedMedia, onSelect }: MediaOptionsProps) {
  if (userMedias.length === 0)
    return <p className="text-gray-400 mt-10">Nenhuma mídia disponível 😢</p>;

  return (
    <section>
      <h2 className="font-semibold text-gray-600 mb-4">Opções enviadas por usuários:</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userMedias.map((media, index) => (
          <li
            key={media.id}
            onClick={() => onSelect(media)}
            className={`flex rounded-full justify-center gap-1 items-center w-full py-2 px-4 cursor-pointer border transition ${
              selectedMedia?.id === media.id
                ? "bg-gray-100 border-gray-500"
                : "bg-gray-950 border-gray-900"
            }`}
          >
              <div className="flex font-semibold text-gray-800">
                {/* index + 1 */ } Mídia #{media.id}
              </div>
              <span className="text-xs text-gray-400">
                { /* {media.user?.email || "Usuário desconhecido"} */}
              </span>
            <div className="flex items-center justify-center gap-2">
              <Server className="flex text-gray-800" size={22} />
              <p className="text-md font-semibold text-gray-800">
              {media.jellyfinUrl && "Jellyfin "}
              {media.ipfsCid && "🌐 IPFS "}
              {media.torrentMagnet && "🧲 Magnet "}
              {!media.jellyfinUrl && !media.ipfsCid && !media.torrentMagnet && "Sem fontes"}
            </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
