import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Listicle Video Generator - Create TikTok & Shorts Videos",
  description: "Generate professional listicle videos for TikTok and YouTube Shorts. Turn your text into engaging video content in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
