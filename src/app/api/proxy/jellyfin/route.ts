import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const videoUrl = req.nextUrl.searchParams.get("url");
  if (!videoUrl) {
    return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
  }

  try {
    // 🔐 Se precisar incluir token fixo (ou variável), adicione aqui
    const JELLYFIN_TOKEN = process.env.JELLYFIN_API_KEY;

    const response = await fetch(videoUrl, {
      headers: {
        Authorization: JELLYFIN_TOKEN ? `MediaBrowser Token=${JELLYFIN_TOKEN}` : "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.status}` },
        { status: response.status }
      );
    }

    // 🔄 Passa o vídeo adiante (streaming)
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(response.body, { headers });
  } catch (err) {
    console.error("Erro no proxy Jellyfin:", err);
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
