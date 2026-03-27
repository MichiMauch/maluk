import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum - MALUK Racing",
  description: "Impressum von MALUK Racing - Lukas Maurer, Bergrennen-Pilot aus der Schweiz.",
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-obsidian text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary text-sm hover:underline mb-8"
        >
          &larr; Zur&uuml;ck zur Startseite
        </Link>

        <h1 className="text-4xl font-black italic text-white mb-8">Impressum</h1>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">Kontaktadresse</h2>
            <p>
              Lukas Maurer<br />
              Schiltwald 156<br />
              5046 Walde<br />
              Schweiz
            </p>
            <p className="mt-2">
              E-Mail:{" "}
              <a href="mailto:lukas.maurer@gmail.com" className="text-primary hover:underline">
                lukas.maurer@gmail.com
              </a>
              <br />
              Telefon:{" "}
              <a href="tel:+41788639430" className="text-primary hover:underline">
                078 863 94 30
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Vertretungsberechtigte Person</h2>
            <p>Lukas Maurer, Inhaber</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Haftungsausschluss</h2>
            <p>
              Der Autor &uuml;bernimmt keinerlei Gew&auml;hr hinsichtlich der inhaltlichen Richtigkeit,
              Genauigkeit, Aktualit&auml;t, Zuverl&auml;ssigkeit und Vollst&auml;ndigkeit der Informationen.
            </p>
            <p className="mt-2">
              Haftungsanspr&uuml;che gegen den Autor wegen Sch&auml;den materieller oder immaterieller Art,
              welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der ver&ouml;ffentlichten
              Informationen, durch Missbrauch der Verbindung oder durch technische St&ouml;rungen
              entstanden sind, werden ausgeschlossen.
            </p>
            <p className="mt-2">
              Alle Angebote sind unverbindlich. Der Autor beh&auml;lt es sich ausdr&uuml;cklich vor,
              Teile der Seiten oder das gesamte Angebot ohne gesonderte Ank&uuml;ndigung zu
              ver&auml;ndern, zu erg&auml;nzen, zu l&ouml;schen oder die Ver&ouml;ffentlichung zeitweise oder
              endg&uuml;ltig einzustellen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Haftung f&uuml;r Links</h2>
            <p>
              Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres
              Verantwortungsbereichs. Es wird jegliche Verantwortung f&uuml;r solche Webseiten
              abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr
              des Nutzers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Urheberrechte</h2>
            <p>
              Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
              Dateien auf der Website geh&ouml;ren ausschliesslich Lukas Maurer oder den speziell
              genannten Rechtsinhabern. F&uuml;r die Reproduktion jeglicher Elemente ist die
              schriftliche Zustimmung des Urheberrechtstr&auml;gers im Voraus einzuholen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
