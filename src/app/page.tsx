import { Suspense, lazy } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { PilotMaschine } from "@/components/sections/PilotMaschine";
import { RaceCalendar } from "@/components/sections/RaceCalendar";
import { LiveTicker } from "@/components/sections/LiveTicker";
import { Club100Section } from "@/components/sections/Club100Section";
import { Sponsors } from "@/components/sections/Sponsors";
import { MobileBottomBar } from "@/components/sections/MobileBottomBar";
import { Footer } from "@/components/sections/Footer";
import { raceEvents2026 } from "@/data/calendar";

const PitLaneGallery = lazy(() =>
  import("@/components/sections/PitLaneGallery").then((m) => ({ default: m.PitLaneGallery }))
);

const GameSection = lazy(() =>
  import("@/components/sections/GameSection").then((m) => ({ default: m.GameSection }))
);

function getEventSchemaMarkup() {
  const siteUrl = "https://malukracing.ch";

  return raceEvents2026
    .filter((event) => event.status !== "cancelled")
    .map((event) => ({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: event.name,
      description: event.description,
      startDate: event.dateStart,
      ...(event.dateEnd && { endDate: event.dateEnd }),
      eventStatus:
        event.status === "completed"
          ? "https://schema.org/EventPast"
          : "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: event.location,
        address: {
          "@type": "PostalAddress",
          addressCountry: "CH",
          addressLocality: event.location.split(",")[0].trim(),
        },
      },
      organizer: {
        "@type": "Organization",
        name: "MALUK Racing",
        url: siteUrl,
      },
      performer: {
        "@type": "Person",
        name: "Lukas Maurer",
        alternateName: "Maluk",
      },
      sport: "Hillclimb Racing",
      url: siteUrl,
      image: event.image?.url ?? `${siteUrl}/images/hero-car.webp`,
    }));
}

export default function Home() {
  const eventSchemas = getEventSchemaMarkup();

  return (
    <>
      {eventSchemas.map((schema, i) => (
        <script
          key={`event-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header />

      <main className="relative flex min-h-screen w-full flex-col bg-obsidian font-[var(--font-display)]">
        <Hero />

        {/* Content Sections with Carbon Pattern */}
        <div className="carbon-pattern w-full flex flex-col items-center py-6 overflow-x-clip">
          <PilotMaschine />
          <Suspense>
            <RaceCalendar />
          </Suspense>
          <Suspense>
            <LiveTicker />
          </Suspense>
          <PitLaneGallery />
          <Club100Section />
          <Suspense>
            <GameSection />
          </Suspense>
          <Sponsors />
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </>
  );
}
