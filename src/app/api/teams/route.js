import { NextResponse } from "next/server";

const SHEET_API = process.env.NEXT_PUBLIC_SHEET_API_URL || "";

// Manually confirmed teams per tournament ID
// Format: { "tournament-id": ["team1", "team2", ...] }
const PRESET_TEAMS_BY_TOURNAMENT = {
  "bgmi-duo-12-aug": ["SKY", "BK56"],
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tid = searchParams.get("tid") || "";

  const preset = PRESET_TEAMS_BY_TOURNAMENT[tid] || [];

  if (!SHEET_API || SHEET_API.includes("PASTE_YOUR")) {
    return NextResponse.json({ teams: preset });
  }

  try {
    const res = await fetch(`${SHEET_API}?t=${Date.now()}`, {
      next: { revalidate: 10 },
    });
    const data = await res.json();
    const fetched = Array.isArray(data.teams) ? data.teams : [];

    // Filter fetched teams to only those matching the requested tournament
    // (backend may return all teams — we dedupe with preset)
    const combined = Array.from(new Set([...preset, ...fetched]));
    return NextResponse.json({ teams: combined });
  } catch {
    return NextResponse.json({ teams: preset });
  }
}
