import { NextResponse } from "next/server";
import { searchTmdbByTitle } from "@/lib/tmdb";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const data = await searchTmdbByTitle(title);
    // return top 5 matches simplified
    const matches = (data.results || []).slice(0, 5).map((r: any) => ({
      id: r.id,
      title: r.title || r.name,
      media_type: r.media_type,
      overview: r.overview,
      poster_path: r.poster_path,
      backdrop_path: r.backdrop_path,
      release_date: r.release_date || r.first_air_date,
    }));

    return NextResponse.json({ results: matches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "error" }, { status: 500 });
  }
}




