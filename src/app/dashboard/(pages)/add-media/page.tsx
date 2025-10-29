"use client";

import { useState } from "react";
import Image from "next/image";

type Preview = {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type?: string;
};

export default function AddMediaPage() {
  const [title, setTitle] = useState("");
  const [jellyfinUrl, setJellyfinUrl] = useState("");
  const [magnet, setMagnet] = useState("");
  const [cloudSeed, setCloudSeed] = useState(false);
  const [quotaGb, setQuotaGb] = useState(10);
  const [previewResults, setPreviewResults] = useState<Preview[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<Preview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Digite o título para buscar");
      return;
    }
    setLoadingPreview(true);
    setMessage(null);
    try {
      const res = await fetch("/api/media/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setPreviewResults(data.results || []);
    } catch (err) {
      setMessage("Erro ao buscar preview");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      title: selectedPreview ? selectedPreview.title : title,
      jellyfinUrl: jellyfinUrl || undefined,
      magnet: magnet || undefined,
      cloudSeed,
      cloudProvider: cloudSeed ? "user-s3" : undefined,
      // ownerId: 1 // in prod, server should get user from auth session
    };

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Erro");
      setMessage("Mídia adicionada com sucesso!");
      // limpar formulário
      setTitle("");
      setJellyfinUrl("");
      setMagnet("");
      setSelectedPreview(null);
      setPreviewResults([]);
    } catch (err: any) {
      setMessage(err.message || "Erro ao criar mídia");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-4">Adicionar mídia à biblioteca</h1>

      <form onSubmit={handlePreview} className="mb-4">
        <label className="block mb-2">
          <span className="text-sm font-medium">Título</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-900 text-white"
            placeholder="Nome do filme / série / desenho"
          />
        </label>

        <div className="flex gap-2 items-center">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500"
            disabled={loadingPreview}
          >
            {loadingPreview ? "Buscando..." : "Buscar no TMDB"}
          </button>

          <button
            type="button"
            onClick={() => {
              // pula preview e abre o formulário de criação direto
              setPreviewResults([]);
              setSelectedPreview(null);
            }}
            className="px-3 py-2 rounded border"
          >
            Criar sem buscar
          </button>
        </div>
      </form>

      {previewResults.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {previewResults.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPreview(p)}
              className={`cursor-pointer p-3 rounded border ${selectedPreview?.id === p.id ? "border-sky-500" : "border-transparent"}`}
            >
              {p.poster_path ? (
                // TMDB image host base
                // Note: next/image requires remotePatterns config for these domains
                // We will show <img> fallback to avoid config here
                <img src={`https://image.tmdb.org/t/p/w300${p.poster_path}`} alt={p.title} className="w-full h-40 object-cover rounded" />
              ) : (
                <div className="w-full h-40 bg-neutral-800 rounded" />
              )}
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-3">{p.overview}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900 p-6 rounded">
        <div>
          <label className="block text-sm">Título (final)</label>
          <input
            value={selectedPreview?.title ?? title}
            onChange={(e) => {
              // if user edits after selecting preview, deselect
              if (selectedPreview) setSelectedPreview(null);
              setTitle(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-800 text-white"
            placeholder="Título que será exibido"
          />
        </div>

        <div>
          <label className="block text-sm">Jellyfin URL (opcional)</label>
          <input
            value={jellyfinUrl}
            onChange={(e) => setJellyfinUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-800 text-white"
            placeholder="https://meu-jellyfin.example.com/..."
          />
          <p className="text-xs text-gray-400 mt-1">Se o seu conteúdo estiver no Jellyfin, insira a URL pública ou item playback API.</p>
        </div>

        <div>
          <label className="block text-sm">Magnet / Torrent (opcional)</label>
          <input
            value={magnet}
            onChange={(e) => setMagnet(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 bg-neutral-800 text-white"
            placeholder="magnet:?xt=urn:btih:..."
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={cloudSeed} onChange={(e) => setCloudSeed(e.target.checked)} />
            <span className="text-sm">Ativar seed via nuvem (se disponível)</span>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-sm">Quota (GB)</span>
            <input type="number" min={1} max={200} value={quotaGb} onChange={(e)=>setQuotaGb(Number(e.target.value))} className="w-20 text-black px-2 rounded"/>
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 rounded">
            {submitting ? "Salvando..." : "Adicionar mídia"}
          </button>
          <button type="button" onClick={() => {
            setTitle(""); setJellyfinUrl(""); setMagnet(""); setSelectedPreview(null); setPreviewResults([]);
          }} className="px-3 py-2 border rounded">
            Limpar
          </button>
        </div>

        {message && <div className="text-sm text-gray-300 mt-2">{message}</div>}
      </form>
    </div>
  );
}
