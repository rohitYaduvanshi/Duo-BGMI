import "./globals.css";

export const metadata = {
  title: "DS CLAN — BGMI Duo Tournament Portal",
  description: "Official registration and tracking portal for DS Clan BGMI Duo tournaments. Book your slots, see live registered teams, prize pools, match timings, winners, and stream highlights.",
  keywords: ["BGMI", "Tournament", "DS Clan", "Duo Tournament", "Esports", "Slot Booking", "Register"],
  authors: [{ name: "DS Clan Admin" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
