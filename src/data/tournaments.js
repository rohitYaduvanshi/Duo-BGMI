export const tournaments = [
  // ── ENDED ──────────────────────────────────────────────────────────────
  {
    id: "bgmi-duo-05-aug",
    title: "BGMI DUO TOURNAMENT",
    subtitle: "5 August 2026",
    tagline: "The inaugural DS AXTERN tournament. Erangel, two matches, one winner takes all.",
    date: "05 AUG",
    isoDate: "2026-08-05",
    time: "8:00 PM",
    mode: "DUO",
    map: "ERANGEL",
    slots: 16,
    filledSlots: 16,
    entryFee: "₹40",
    prizePool: "₹640",
    status: "ended",
    winner: { team: "TEAM VORTEX", kills: 18, prize: "₹280" },
    prizes: { first: "₹280", second: "₹200", third: "₹160" },
    matches: [
      { tag: "Match 01", title: "First Drop", time: "8:00 PM", map: "Erangel", perspective: "TPP" },
      { tag: "Match 02", title: "Final Circle", time: "Right After Match 1", map: "Erangel", perspective: "TPP" }
    ]
  },
  {
    id: "bgmi-duo-12-aug",
    title: "BGMI DUO TOURNAMENT",
    subtitle: "12 August 2026",
    tagline: "Drop in with your duo. 2 intense matches on Erangel — one squad walks away champions.",
    date: "12 AUG",
    isoDate: "2026-08-12",
    time: "8:00 PM",
    mode: "DUO",
    map: "ERANGEL",
    slots: 20,
    filledSlots: 20,
    entryFee: "₹40",
    prizePool: "₹800",
    status: "ended",
    winner: { team: "SKY", kills: 14, prize: "₹350" },
    prizes: { first: "₹350", second: "₹250", third: "₹200" },
    matches: [
      { tag: "Match 01", title: "First Drop", time: "8:00 PM", map: "Erangel", perspective: "TPP" },
      { tag: "Match 02", title: "Final Circle", time: "Right After Match 1", map: "Erangel", perspective: "TPP" }
    ]
  },

  // ── UPCOMING ────────────────────────────────────────────────────────────
  {
    id: "bgmi-duo-19-aug",
    title: "WEEKLY DUO CLASH",
    subtitle: "19 August 2026",
    tagline: "Miramar. Sandy dunes, deadly snipers and brutal rotations. Two matches decide your fate.",
    date: "19 AUG",
    isoDate: "2026-08-19",
    time: "8:00 PM Onwards",
    mode: "DUO",
    map: "MIRAMAR",
    slots: 20,
    filledSlots: 0,
    entryFee: "₹40",
    prizePool: "₹800",
    status: "upcoming",
    prizes: { first: "₹350", second: "₹250", third: "₹200" },
    matches: [
      { tag: "Match 01", title: "Sandy Dunes", time: "8:00 PM", map: "Miramar", perspective: "TPP" },
      { tag: "Match 02", title: "Dust Bowl", time: "Right After Match 1", map: "Miramar", perspective: "TPP" }
    ]
  },
  {
    id: "bgmi-duo-26-aug",
    title: "SANHOK SPRINT",
    subtitle: "26 August 2026",
    tagline: "Sanhok's jungle arena awaits. Fast circles, close-quarters fights and maximum kills.",
    date: "26 AUG",
    isoDate: "2026-08-26",
    time: "8:00 PM Onwards",
    mode: "DUO",
    map: "SANHOK",
    slots: 20,
    filledSlots: 0,
    entryFee: "₹40",
    prizePool: "₹800",
    status: "upcoming",
    prizes: { first: "₹350", second: "₹250", third: "₹200" },
    matches: [
      { tag: "Match 01", title: "Jungle Rush", time: "8:00 PM", map: "Sanhok", perspective: "TPP" },
      { tag: "Match 02", title: "Boot Camp Clash", time: "Right After Match 1", map: "Sanhok", perspective: "TPP" }
    ]
  },
  {
    id: "bgmi-squad-02-sep",
    title: "SQUAD SHOWDOWN",
    subtitle: "2 September 2026",
    tagline: "DS AXTERN's first SQUAD tournament. Four-man squads, Erangel chaos. Build your team and register now.",
    date: "02 SEP",
    isoDate: "2026-09-02",
    time: "8:00 PM Onwards",
    mode: "SQUAD",
    map: "ERANGEL",
    slots: 16,
    filledSlots: 0,
    entryFee: "₹80",
    prizePool: "₹1280",
    status: "upcoming",
    prizes: { first: "₹560", second: "₹400", third: "₹320" },
    matches: [
      { tag: "Match 01", title: "Grand Entry", time: "8:00 PM", map: "Erangel", perspective: "TPP" },
      { tag: "Match 02", title: "Last Squad Standing", time: "Right After Match 1", map: "Erangel", perspective: "TPP" }
    ]
  }
];
