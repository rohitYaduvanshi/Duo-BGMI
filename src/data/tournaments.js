export const tournaments = [
  {
    id: "bgmi-duo-12-aug",
    title: "BGMI DUO TOURNAMENT",
    eyebrow: "DS CLAN PRESENTS · Mobile Battle Royale",
    subtitle: "Tournament Day · 12 August",
    tagline: "Drop in with your duo. 2 intense matches, one map — Erangel — and one squad walks away champions. Limited to 20 teams. Book your slot before the lobby fills.",
    date: "12 AUG",
    time: "8:00 PM Onwards",
    mode: "DUO",
    map: "ERANGEL",
    slots: 20,
    entryFee: "₹40",
    prizePool: "₹800",
    status: "active", // "active" represents the current registering tournament
    prizes: {
      first: "₹350",
      second: "₹250",
      third: "₹200"
    },
    matches: [
      {
        tag: "Match 01",
        title: "First Drop",
        time: "8:00 PM",
        map: "Erangel",
        perspective: "TPP"
      },
      {
        tag: "Match 02",
        title: "Final Circle",
        time: "Right After Match 1",
        map: "Erangel",
        perspective: "TPP"
      }
    ]
  },
  {
    id: "bgmi-duo-weekly-clash",
    title: "WEEKLY DUO CLASH",
    eyebrow: "DS CLAN · WEEKLY CHALLENGE",
    subtitle: "Upcoming · 19 August",
    tagline: "Prepare your strategy for the next week. New map configuration, same intense action. Register early to book your spot.",
    date: "19 AUG",
    time: "8:00 PM Onwards",
    mode: "DUO",
    map: "MIRAMAR",
    slots: 20,
    entryFee: "₹40",
    prizePool: "₹800",
    status: "upcoming",
    prizes: {
      first: "₹350",
      second: "₹250",
      third: "₹200"
    },
    matches: [
      {
        tag: "Match 01",
        title: "Sandy Dunes",
        time: "8:00 PM",
        map: "Miramar",
        perspective: "TPP"
      },
      {
        tag: "Match 02",
        title: "Dust Bowl",
        time: "Right After Match 1",
        map: "Miramar",
        perspective: "TPP"
      }
    ]
  }
];
