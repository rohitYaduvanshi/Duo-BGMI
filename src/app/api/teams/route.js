import { NextResponse } from "next/server";

const SHEET_API = process.env.NEXT_PUBLIC_SHEET_API_URL || "";

export async function GET() {
  if (!SHEET_API || SHEET_API.includes("PASTE_YOUR")) {
    return NextResponse.json({ teams: [] });
  }
  try {
    const res = await fetch(`${SHEET_API}?t=${Date.now()}`, {
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return NextResponse.json({ teams: data.teams || [] });
  } catch {
    return NextResponse.json({ teams: [] });
  }
}
