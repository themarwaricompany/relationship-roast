import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joru Ka Gulaam 🫡 — Couple's Quiz | Who's the REAL Gulaam?",
  description:
    "India's most viral couple's quiz! Take the Hinglish quiz with your partner, get AI-powered roast verdicts, and share your Gulaam score. 🫡",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Joru Ka Gulaam 🫡 — Who's the REAL Gulaam?",
    description:
      "Take this couple's quiz with your partner — AI roasts your relationship in Hinglish! Share your Gulaam score.",
    type: "website",
    url: "https://jorukagulaam.com",
    siteName: "Joru Ka Gulaam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joru Ka Gulaam 🫡 — Couple's Quiz",
    description: "AI-powered Hinglish couple's quiz. Find out who's the REAL Gulaam!",
  },
  metadataBase: new URL("https://jorukagulaam.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
