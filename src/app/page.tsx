import {
  Header,
  Hero,
  RaceCalendar,
  PitLaneGallery,
  PilotMaschine,
  Club100Section,
  GameSection,
  Sponsors,
  Footer,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />

      <main className="relative flex min-h-screen w-full flex-col bg-obsidian font-[var(--font-display)]">
        <Hero />

        {/* Content Sections with Carbon Pattern */}
        <div className="carbon-pattern w-full flex flex-col items-center py-6 overflow-x-clip">
          <PilotMaschine />
          <RaceCalendar />
          <PitLaneGallery />
          <Club100Section />
          <GameSection />
          <Sponsors />
        </div>
      </main>

      <Footer />
    </>
  );
}
