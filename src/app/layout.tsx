import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MALUK Racing - Swiss Hillclimb Championship",
  description: "Professional Hillclimb Racing Driver. Precision at the Peak. Swiss Mountain Racing with unmatched technical mastery.",
  keywords: ["hillclimb", "racing", "switzerland", "motorsport", "bergrennen"],
  openGraph: {
    title: "MALUK Racing - Precision at the Peak",
    description: "Professional Swiss Hillclimb Racing",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} antialiased bg-obsidian min-h-screen overflow-x-hidden noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}
