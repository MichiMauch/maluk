import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import Script from "next/script";
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

const siteUrl = "https://malukracing.ch";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MALUK Racing - Schweizer Bergrennen mit Lukas Maurer",
  description:
    "Bergrennen-Pilot Lukas Maurer und sein Opel Kadett C GT/E. Erlebe Schweizer Motorsport hautnah – Rennkalender, Sponsoring und Club 100.",
  keywords: [
    "Bergrennen",
    "Schweizer Bergrennen",
    "Hillclimb",
    "Lukas Maurer",
    "MALUK Racing",
    "Opel Kadett C GT/E",
    "Motorsport Schweiz",
    "Slalom",
    "Rennkalender",
    "Sponsoring Motorsport",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "MALUK Racing - Schweizer Bergrennen mit Lukas Maurer",
    description:
      "Bergrennen-Pilot Lukas Maurer und sein Opel Kadett C GT/E. Präzision am Limit.",
    type: "website",
    url: siteUrl,
    siteName: "MALUK Racing",
    locale: "de_CH",
    images: [
      {
        url: "/images/hero-car.webp",
        width: 1200,
        height: 630,
        alt: "MALUK Racing - Opel Kadett C GT/E",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MALUK Racing - Schweizer Bergrennen",
    description:
      "Bergrennen-Pilot Lukas Maurer und sein Opel Kadett C GT/E.",
    images: ["/images/hero-car.webp"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "MALUK Racing",
                  url: siteUrl,
                  logo: `${siteUrl}/images/hero-car.webp`,
                  sameAs: [
                    "https://www.instagram.com/malukracing/",
                    "https://www.youtube.com/@malukracing",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    url: "https://malukracing.ch#contact",
                    contactType: "customer service",
                  },
                },
                {
                  "@type": "Person",
                  name: "Lukas Maurer",
                  alternateName: "Maluk",
                  jobTitle: "Bergrennen-Pilot",
                  url: siteUrl,
                  sameAs: [
                    "https://www.instagram.com/malukracing/",
                    "https://www.youtube.com/@malukracing",
                  ],
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Schiltwald 156",
                    addressLocality: "Walde",
                    postalCode: "5046",
                    addressCountry: "CH",
                  },
                },
                {
                  "@type": "WebSite",
                  name: "MALUK Racing",
                  url: siteUrl,
                  inLanguage: "de",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} antialiased bg-obsidian min-h-screen noise-overlay`}
      >
        {children}
        <Script
          id="matomo"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="https://matomo.kokomo.house/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '2']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
