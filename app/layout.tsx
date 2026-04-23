import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Slay the Spire Combat Planner",
  description: "Plan your 'unwinnable' combats for Slay the Spire like Puzzles",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional (for Tailwind)
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} bg-indigo-50`}>
      <body>{children}</body>
    </html>
  );
}