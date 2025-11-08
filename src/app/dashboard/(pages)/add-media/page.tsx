"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { create } from "@storacha/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type MediaType = "MOVIE" | "TV";

type Preview = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
};

type TMDBSeason = {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
};

type TMDBEpisode = {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
};

// Episode form data stored locally per season
type EpisodeForm = {
  episode_number: number;
  name: string;
  overview?: string;
  // per-episode sources
  jellyfinUrl?: string;
  fileMoonUrl?: string;
  magnet?: string;
  ipfsCid?: string; // result of upload (optional)
  torrentFile?: File | null; // local File before upload
  include: boolean; // checkbox whether this episode should be included in payload
};

export default function AddMediaPage() {
  const [type, setType] = useState<MediaType>("MOVIE");
  const [query, setQuery] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewResults, setPreviewResults] = useState<Preview[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<Preview | null>(null);

  const [jellyfinUrl, setJellyfinUrl] = useState("");
  const [fileMoonUrl, setFileMoonUrl] = useState("");
  const [magnet, setMagnet] = useState("");
  const [torrentFile, setTorrentFile] = useState<File | null>(null); // global torrent
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // seasons + episodes local form state
  const [seasons, setSeasons] = useState<TMDBSeason[]>([]);
  // map seasonNumber -> EpisodeForm[]
  const [seasonForm, setSeasonForm] = useState<Record<number, EpisodeForm[]>>({});
  const [expandedSeasons, setExpandedSeasons] = useState<number[]>([]);

  // availability map from backend (optional)
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, Record<number, boolean>> | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilitySupported, setAvailabilitySupported] = useState<boolean | null>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setPreviewResults([]);
      return;
    }

    const id = setTimeout(async () => {
      setLoadingPreview(true);
      try {
        const endpoint = type === "MOVIE" ? "https://api.themoviedb.org/3/search/movie" : "https://api.themoviedb.org/3/search/tv";
        const res = await fetch(`${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`);
        const json = await res.json();
        setPreviewResults(json.results || []);
      } catch (err) {
        console.error("TMDB search failed", err);
        setPreviewResults([]);
      } finally {
        setLoadingPreview(false);
      }
    }, 350);

    return () => clearTimeout(id);
  }, [query, type]);

  // When preview selected, fetch seasons if TV
  useEffect(() => {
    if (!selectedPreview) {
      setSeasons([]);
      setSeasonForm({});
      setAvailabilityMap(null);
      setAvailabilitySupported(null);
      return;
    }

    const fetchSeasons = async () => {
      if (type !== "TV") return;
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${selectedPreview.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`);
        const json = await res.json();
        const s: TMDBSeason[] = (json.seasons || []).map((ss: any) => ({
          id: ss.id,
          season_number: ss.season_number,
          name: ss.name,
          episode_count: ss.episode_count,
        }));
        setSeasons(s);

        // try to fetch availability map from backend (optional)
        setCheckingAvailability(true);
        try {
          const avRes = await fetch(`/api/media/episodes-status?tmdbId=${selectedPreview.id}`);
          if (avRes.ok) {
            const avJson = await avRes.json();
            setAvailabilityMap(avJson || null);
            setAvailabilitySupported(true);
          } else {
            setAvailabilityMap(null);
            setAvailabilitySupported(false);
          }
        } catch (err) {
          setAvailabilityMap(null);
          setAvailabilitySupported(false);
        } finally {
          setCheckingAvailability(false);
        }
      } catch (err) {
        console.error("Erro ao buscar temporadas TMDB:", err);
        setSeasons([]);
      }
    };

    fetchSeasons();
  }, [selectedPreview, type]);

  // fetch episodes for season and initialize seasonForm entries
  const fetchEpisodesForSeason = useCallback(async (seasonNumber: number) => {
    if (!selectedPreview || type !== "TV") return;
    if (seasonForm[seasonNumber]?.length) return; // already fetched

    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${selectedPreview.id}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`);
      const json = await res.json();
      const eps: TMDBEpisode[] = (json.episodes || []).map((e: any) => ({
        id: e.id,
        episode_number: e.episode_number,
        name: e.name,
        overview: e.overview,
      }));

      // prepare form rows for this season (auto-include all episodes when season selected)
      setSeasonForm(prev => ({
        ...prev,
        [seasonNumber]: eps.map(ep => ({
          episode_number: ep.episode_number,
          name: ep.name,
          overview: ep.overview,
          jellyfinUrl: "",
          fileMoonUrl: "",
          magnet: "",
          ipfsCid: "",
          torrentFile: null,
          include: true, // default include when season chosen
        })),
      }));
    } catch (err) {
      console.error("Erro ao buscar episódios:", err);
      setSeasonForm(prev => ({ ...prev, [seasonNumber]: [] }));
    }
  }, [selectedPreview, type, seasonForm]);

  // toggle expand
  const toggleExpandSeason = async (seasonNumber: number) => {
    if (!seasonForm[seasonNumber]) await fetchEpisodesForSeason(seasonNumber);
    setExpandedSeasons(prev => prev.includes(seasonNumber) ? prev.filter(s => s !== seasonNumber) : [...prev, seasonNumber]);
  };

  // season selection: selecting a season only means we will include its episodes in payload
  const toggleSelectSeason = async (seasonNumber: number) => {
    // ensure episodes are fetched
    if (!seasonForm[seasonNumber]) await fetchEpisodesForSeason(seasonNumber);

    // flip include flag for all episodes in that season: if all included -> unselect all, else select all
    setSeasonForm(prev => {
      const copy = { ...prev };
      const arr = copy[seasonNumber] ?? [];
      const newArr = arr.map(ep => ({ ...ep, include: !arr.every(a => a.include) }));
      copy[seasonNumber] = newArr;
      return copy;
    });

    // expand for convenience
    if (!expandedSeasons.includes(seasonNumber)) setExpandedSeasons(prev => [...prev, seasonNumber]);
  };

  // helper: whether episode is allowed to be edited/selected based on availability map
  function canEditEpisode(seasonNumber: number, episodeIndex: number) {
    // if no availability map, allow editing
    if (!availabilityMap) return true;

    // first episode always allowed
    if (episodeIndex === 0) return true;

    const seasonAvailability = availabilityMap[seasonNumber] ?? {};
    // require previous episode be available according to availabilityMap
    return !!seasonAvailability[episodeIndex];
  }

  // handle per-episode field change
  const setEpisodeField = (seasonNumber: number, idx: number, patch: Partial<EpisodeForm>) => {
    setSeasonForm(prev => {
      const copy = { ...prev };
      const arr = (copy[seasonNumber] || []).slice();
      arr[idx] = { ...arr[idx], ...patch };
      copy[seasonNumber] = arr;
      return copy;
    });
  };

  // upload helper for per-episode torrent files using storacha (if provided)
  async function uploadEpisodeTorrents(allSeasons: Record<number, EpisodeForm[]>) {
    const client = await create();
    const results: Record<number, (string | null)[]> = {};

    // keep explicit season numbers (Object.keys may be unordered; we use Number)
    const seasonNumbers = Object.keys(allSeasons).map(k => Number(k));
    for (const s of seasonNumbers) {
      const eps = allSeasons[s] || [];
      results[s] = [];

      for (let i = 0; i < eps.length; i++) {
        const ep = eps[i];
        if (ep?.torrentFile) {
          try {
            const r = await client.uploadFile(ep.torrentFile);
            results[s].push(r?.toString?.() ?? null);
          } catch (err) {
            console.warn("Falha upload ep torrent:", err);
            results[s].push(null);
          }
        } else {
          results[s].push(null);
        }
      }
    }

    return results;
  }

  // submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedPreview) {
      setMessage("Selecione um conteúdo do TMDB primeiro.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // optional top-level torrent upload
      let globalIpfs: string | null = null;
      if (torrentFile) {
        try {
          const client = await create();
          const r = await client.uploadFile(torrentFile);
          globalIpfs = r.toString();
        } catch (err) {
          console.warn("Upload global torrent falhou:", err);
        }
      }

      // upload per-episode torrents first and attach ipfsCid into seasonForm copy
      const epUploadResults = await uploadEpisodeTorrents(seasonForm);
      // epUploadResults: { [seasonNumber]: [ ipfsCid|null, ipfsCid|null, ... ] } matching indexes of seasonForm[seasonNumber]

      // create payload seasons array
      const seasonsPayload: any[] = [];
      // iterate season numbers in numeric order (optional)
      const seasonNumbers = Object.keys(seasonForm).map(k => Number(k)).sort((a, b) => a - b);
      for (const sNum of seasonNumbers) {
        const eps = seasonForm[sNum] || [];
        // build episodesPayload using original indexes so ipfs matches correctly
        const episodesPayload = [];
        for (let i = 0; i < eps.length; i++) {
          const ep = eps[i];
          if (!ep.include) continue;
          episodesPayload.push({
            episode_number: ep.episode_number,
            name: ep.name,
            overview: ep.overview,
            jellyfinUrl: ep.jellyfinUrl?.trim() ? ep.jellyfinUrl : undefined,
            fileMoonUrl: ep.fileMoonUrl?.trim() ? ep.fileMoonUrl : undefined,
            torrentMagnet: ep.magnet?.trim() ? ep.magnet : undefined,
            ipfsCid: (epUploadResults[sNum] && epUploadResults[sNum][i]) ? epUploadResults[sNum][i] : undefined,
          });
        }

        if (episodesPayload.length) {
          seasonsPayload.push({ seasonNumber: sNum, episodes: episodesPayload });
        }
      }

      const payload: any = {
        title: selectedPreview.title ?? selectedPreview.name ?? "",
        tmdbId: selectedPreview.id,
        synopsis: selectedPreview.overview ?? null,
        posterUrl: selectedPreview.poster_path ? `https://image.tmdb.org/t/p/w500${selectedPreview.poster_path}` : null,
        wallpaperUrl: selectedPreview.backdrop_path ? `https://image.tmdb.org/t/p/original${selectedPreview.backdrop_path}` : null,
        jellyfinUrl: jellyfinUrl || undefined,
        fileMoonUrl: fileMoonUrl || undefined,
        torrentMagnet: magnet || undefined,
        ipfsCid: globalIpfs ?? undefined,
        type,
        seasons: type === "TV" ? seasonsPayload : undefined,
      };

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.error || "Erro ao adicionar mídia");
        setSubmitting(false);
        return;
      }

      setMessage("✅ Mídia adicionada/atualizada com sucesso!");

      // reset
      setQuery("");
      setPreviewResults([]);
      setSelectedPreview(null);
      setSeasonForm({});
      setSeasons([]);
      setExpandedSeasons([]);
      setJellyfinUrl("");
      setMagnet("");
      setTorrentFile(null);
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message ?? "Erro desconhecido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Adicionar mídia à biblioteca</h1>

      {/* Search */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-2 mb-3">
          <Input className="flex-1" placeholder="Buscar título no TMDB (min 2 letras)..." value={query} onChange={(e) => setQuery(e.target.value)} />

          <Select value={type} onValueChange={(v) => setType(v as MediaType)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MOVIE">Filme</SelectItem>
              <SelectItem value="TV">Série</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => {/* botão estético: busca já é debounced pelo input */}} disabled={loadingPreview}>{loadingPreview ? "Buscando..." : "Buscar"}</Button>
        </div>
      </form>

      {/* Results */}
      {previewResults.length > 0 && !selectedPreview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-6">
          {previewResults.map((p) => (
            <div key={p.id} onClick={() => setSelectedPreview(p)} className="cursor-pointer p-3 rounded border border-transparent hover:border-sky-500 transition bg-neutral-800">
              {p.poster_path ? (
                <Image src={`https://image.tmdb.org/t/p/w300${p.poster_path}`} alt={`${p.title ?? p.name}`} width={300} height={420} className="rounded" />
              ) : (
                <div className="w-full h-40 bg-neutral-700 rounded" />
              )}
              <h3 className="mt-2 font-semibold text-white">{p.title ?? p.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-3">{p.overview}</p>
            </div>
          ))}
        </div>
      )}

      {/* Selected preview details */}
      {selectedPreview && (
        <div className="bg-neutral-900 p-6 rounded space-y-4">
          <div className="flex gap-4">
            {selectedPreview.poster_path && (
              <Image src={`https://image.tmdb.org/t/p/w300${selectedPreview.poster_path}`} alt={`${selectedPreview.title ?? selectedPreview.name}`} width={150} height={225} className="rounded" />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{selectedPreview.title ?? selectedPreview.name}</h2>
              <p className="text-gray-400 mt-2">{selectedPreview.overview}</p>
            </div>
          </div>

          {/* Seasons (TV) */}
          {type === "TV" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Temporadas</h3>

              {seasons.length === 0 ? (
                <div className="text-sm text-gray-400">Carregando temporadas...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {seasons.map((s) => {
                    const seasonEpisodes = seasonForm[s.season_number] ?? [];
                    const allIncluded = seasonEpisodes.length > 0 && seasonEpisodes.every(ep => ep.include);

                    return (
                      <div key={s.id} className="p-3 bg-neutral-800 rounded flex items-start justify-between">
                        <div>
                          <div className="font-medium text-white">{s.name}</div>
                          <div className="text-xs text-gray-400">{s.episode_count} episódios</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleSelectSeason(s.season_number)} className={`px-3 py-1 rounded ${allIncluded ? "bg-sky-600 text-white" : "bg-white/5 text-gray-200"}`}>
                            {allIncluded ? "Selecionada" : "Selecionar temporada"}
                          </button>

                          <button onClick={() => toggleExpandSeason(s.season_number)} className="px-2 py-1 rounded bg-white/5 text-gray-200">
                            {expandedSeasons.includes(s.season_number) ? "Fechar" : "Ver episódios"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Episodes UI (per season) */}
          {type === "TV" && Object.keys(seasonForm).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Episódios (temporadas selecionadas)</h3>

              {Object.keys(seasonForm).map(sk => {
                const sn = Number(sk);
                const eps = seasonForm[sn] || [];
                if (!eps.length) return null;
                const shown = expandedSeasons.includes(sn);

                return (
                  <div key={sn} className="bg-neutral-800 p-3 rounded">
                    <div className="font-medium text-white mb-2">Temporada {sn}</div>

                    <div className="space-y-2">
                      {eps.map((ep, idx) => {
                        const disabled = !canEditEpisode(sn, idx);

                        return (
                          <div key={ep.episode_number} className={`p-2 rounded ${disabled ? "opacity-40" : ""}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" checked={ep.include} disabled={disabled} onChange={() => setEpisodeField(sn, idx, { include: !ep.include })} />
                                <div>
                                  <div className="text-sm text-white font-medium">Ep {ep.episode_number} — {ep.name}</div>
                                  <div className="text-xs text-gray-400 line-clamp-2">{ep.overview}</div>
                                </div>
                              </div>

                              <div className="text-xs text-gray-300">
                                {availabilityMap ? (availabilityMap[sn]?.[ep.episode_number] ? "Disponível" : "Sem mídia") : (availabilitySupported === false ? "Sem checagem" : "—")}
                              </div>
                            </div>

                            {/* inputs grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Input placeholder="Jellyfin URL" value={ep.jellyfinUrl || ""} disabled={disabled} onChange={(e) => setEpisodeField(sn, idx, { jellyfinUrl: e.target.value })} />
                              <Input placeholder="FileMoon URL" value={ep.fileMoonUrl || ""} disabled={disabled} onChange={(e) => setEpisodeField(sn, idx, { fileMoonUrl: e.target.value })} />
                              <Input placeholder="Magnet link" value={ep.magnet || ""} disabled={disabled} onChange={(e) => setEpisodeField(sn, idx, { magnet: e.target.value })} />
                              <Input placeholder="IPFS CID / gateway" value={ep.ipfsCid || ""} disabled={disabled} onChange={(e) => setEpisodeField(sn, idx, { ipfsCid: e.target.value })} />
                              <input type="file" accept=".torrent" disabled={disabled} onChange={(e) => setEpisodeField(sn, idx, { torrentFile: e.target.files?.[0] || null })} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}

            </div>
          )}

          {/* Inputs: jellyfin, magnet, torrent — ONLY FOR MOVIES */}
          {type === "MOVIE" && (
            <>
              <div>
                <label className="block text-sm text-white">M3U8 URL</label>
                <Input value={fileMoonUrl} required onChange={(e) => setFileMoonUrl(e.target.value)} className="mt-1" placeholder="https://m3u8..." />
              </div>


              <div>
                <label className="block text-sm text-white">Jellyfin URL (opcional)</label>
                <Input value={jellyfinUrl} onChange={(e) => setJellyfinUrl(e.target.value)} className="mt-1" placeholder="https://seu-jellyfin/..." />
              </div>



              <div>
                <label className="block text-sm text-white">Magnet (opcional)</label>
                <Input value={magnet} onChange={(e) => setMagnet(e.target.value)} className="mt-1" placeholder="magnet:?xt=urn:btih:..." />
              </div>

              <div>
                <label className="block text-sm text-white">Arquivo .torrent (opcional)</label>
                <input type="file" accept=".torrent" onChange={(e) => setTorrentFile(e.target.files?.[0] || null)} className="mt-1 text-sm text-gray-300" />
              </div>
            </>
          )}

          <div className="mt-4 flex gap-3">
            <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Salvando..." : "Adicionar mídia"}</Button>
            <Button onClick={() => {
              setSelectedPreview(null);
              setSeasonForm({});
              setSeasons([]);
              setExpandedSeasons([]);
              setJellyfinUrl("");
              setMagnet("");
              setTorrentFile(null);
              setMessage(null);
            }} variant="outline">Cancelar</Button>
          </div>

          {message && <div className="text-sm text-gray-300 mt-2">{message}</div>}
        </div>
      )}
    </div>
  );
}
