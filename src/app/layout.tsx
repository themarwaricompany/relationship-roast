import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joru Ka Gulaam 🫡 — Find the REAL Gulaam",
  description:
    "A fun Hinglish couple's quiz that reveals who's REALLY whipped in your relationship. Take the quiz with your partner!",
  openGraph: {
    title: "Joru Ka Gulaam 🫡 — Who's the REAL Gulaam?",
    description:
      "Take this fun couple's quiz and find out who's really whipped in your relationship!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
