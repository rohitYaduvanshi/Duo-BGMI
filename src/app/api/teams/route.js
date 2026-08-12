import { NextResponse } from "next/server";

const SHEET_API = process.env.NEXT_PUBLIC_SHEET_API_URL || "";

const PRESET_TEAMS = ["SKY", "BK56"];

export async function GET() {
  if (!SHEET_API || SHEET_API.includes("PASTE_YOUR")) {
    return NextResponse.json({ teams: PRESET_TEAMS });
  }
  try {
    const res = await fetch(`${SHEET_API}?t=${Date.now()}`, {
      next: { revalidate: 10 },
    });
    const data = await res.json();
    const fetchedTeams = Array.isArray(data.teams) ? data.teams : [];
    const combined = Array.from(new Set([...PRESET_TEAMS, ...fetchedTeams]));
    return NextResponse.json({ teams: combined });
  } catch {
    return NextResponse.json({ teams: PRESET_TEAMS });
  }
}
