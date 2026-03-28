import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-obsidian">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-primary mb-2">404</div>
        <h1 className="text-2xl font-bold text-white mb-4">Falsche Abzweigung</h1>
        <p className="text-gray-300 mb-8">
          Diese Strecke gibt es nicht. Zurück auf die Hauptstrecke?
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Zur Startlinie
        </Link>
      </div>
    </div>
  );
}
