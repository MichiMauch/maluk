import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: "Datenschutz - MALUK Racing",
  description: "Datenschutzerklärung von MALUK Racing gemäss Schweizer Datenschutzgesetz (DSG).",
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-obsidian text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary text-sm hover:underline mb-8"
        >
          &larr; Zur&uuml;ck zur Startseite
        </Link>

        <h1 className="text-4xl font-black italic text-white mb-8">
          Datenschutzerkl&auml;rung
        </h1>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Verantwortliche Stelle</h2>
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
            <h2 className="text-lg font-bold text-white mb-3">2. Allgemeines</h2>
            <p>
              Gest&uuml;tzt auf Artikel 13 der Schweizerischen Bundesverfassung und die
              datenschutzrechtlichen Bestimmungen des Schweizer Datenschutzgesetzes (DSG) hat jede
              Person Anspruch auf Schutz ihrer Privatsph&auml;re sowie auf Schutz vor Missbrauch
              ihrer pers&ouml;nlichen Daten. Wir halten diese Bestimmungen ein.
            </p>
            <p className="mt-2">
              Pers&ouml;nliche Daten werden streng vertraulich behandelt und weder an Dritte
              verkauft noch weitergegeben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Erhebung von Daten</h2>
            <p>
              Beim Besuch unserer Website werden folgende Daten automatisch erhoben:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>IP-Adresse (anonymisiert)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Aufgerufene Seiten</li>
              <li>Verwendeter Browser und Betriebssystem</li>
              <li>Referrer-URL</li>
            </ul>
            <p className="mt-2">
              Diese Daten werden ausschliesslich zu statistischen Zwecken erhoben und lassen keine
              R&uuml;ckschl&uuml;sse auf Ihre Person zu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Webanalyse mit Matomo</h2>
            <p>
              Diese Website verwendet Matomo, eine Open-Source-Software zur statistischen
              Auswertung von Besucherzugriffen. Matomo wird auf einem eigenen Server betrieben
              (Self-Hosting). Ihre Daten werden <strong className="text-white">nicht an Dritte
              weitergegeben</strong>.
            </p>
            <p className="mt-2">
              Die IP-Adresse wird vor der Speicherung anonymisiert. Die Auswertung erfolgt
              ausschliesslich zur Verbesserung des Webangebots.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. YouTube-Einbettungen</h2>
            <p>
              Auf unserer Website sind Videos von YouTube (Google Ireland Limited, Gordon House,
              Barrow Street, Dublin 4, Irland) eingebettet. Beim Abspielen eines Videos wird eine
              Verbindung zu den Servern von YouTube hergestellt. Dabei werden Cookies gesetzt, die
              das Nutzerverhalten erfassen k&ouml;nnen.
            </p>
            <p className="mt-2">
              Weitere Informationen finden Sie in der{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datenschutzerkl&auml;rung von Google
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Kontaktformulare</h2>
            <p>
              Wenn Sie &uuml;ber unsere Kontaktformulare (Sponsoring-Anfrage, Club 100) mit uns in
              Kontakt treten, werden Ihre Angaben (Name, E-Mail-Adresse, Telefonnummer, Nachricht)
              zur Bearbeitung der Anfrage gespeichert. Diese Daten werden nicht an Dritte
              weitergegeben.
            </p>
            <p className="mt-2">
              F&uuml;r den E-Mail-Versand von Benachrichtigungen verwenden wir den Dienst Resend
              (Resend Inc.). Dabei wird ausschliesslich die eingegebene E-Mail-Adresse an Resend
              &uuml;bermittelt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. SSL/TLS-Verschl&uuml;sselung</h2>
            <p>
              Diese Website nutzt aus Sicherheitsgr&uuml;nden eine SSL/TLS-Verschl&uuml;sselung.
              Eine verschl&uuml;sselte Verbindung erkennen Sie an dem Schloss-Symbol in der
              Adressleiste Ihres Browsers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Cloudflare</h2>
            <p>
              Wir nutzen den Dienst Cloudflare (Cloudflare Inc., 101 Townsend St, San Francisco,
              CA 94107, USA) als Content Delivery Network (CDN) und zum Schutz vor Angriffen.
              Dabei werden Zugriffsdaten &uuml;ber Cloudflare-Server geleitet. Cloudflare speichert
              tempor&auml;r Zugriffsdaten zu Sicherheits- und Optimierungszwecken.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Ihre Rechte</h2>
            <p>
              Sie haben gem&auml;ss dem Schweizer Datenschutzgesetz folgende Rechte:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-white">Auskunftsrecht:</strong> Sie k&ouml;nnen jederzeit Auskunft &uuml;ber Ihre gespeicherten Daten verlangen.</li>
              <li><strong className="text-white">Berichtigungsrecht:</strong> Sie k&ouml;nnen die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong className="text-white">L&ouml;schungsrecht:</strong> Sie k&ouml;nnen die L&ouml;schung Ihrer Daten verlangen.</li>
              <li><strong className="text-white">Widerspruchsrecht:</strong> Sie k&ouml;nnen der Datenverarbeitung jederzeit widersprechen.</li>
            </ul>
            <p className="mt-2">
              Bitte wenden Sie sich hierf&uuml;r an die oben genannte Kontaktadresse.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. &Auml;nderungen</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerkl&auml;rung jederzeit anzupassen. Die
              aktuelle Version gilt ab dem Zeitpunkt der Ver&ouml;ffentlichung auf der Website.
            </p>
            <p className="mt-2 text-gray-500">Stand: M&auml;rz 2026</p>
          </section>
        </div>
      </div>
    </main>
  );
}
