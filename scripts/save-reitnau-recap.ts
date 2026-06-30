// One-off: save the manually written race recap for Reitnau 2026.
//
// The Telegram live ticker was not used during this race, so there are no
// ticker_messages to auto-generate a summary from. This stores the hand-written
// recap directly via saveSummary so it shows up on the website.
//
// Usage:
//   npx tsx --env-file=.env.local scripts/save-reitnau-recap.ts

import { saveSummary, getSummary } from "../src/lib/ticker";

const RACE_ID = "reitnau-2026";

const SUMMARY = `Am 28. Juni stand für mich das 57. Bergrennen Reitnau im Aargau auf dem Programm — und der Tag meinte es heiss mit uns. Bei brütender Hitze haben wir das Fahrerlager aufgebaut, und mein Kadett stand mit der Startnummer 334 bereit. Die Strecke ist speziell: Nur 1620 Meter lang, 111 Höhenmeter, keine High-Speed-Passagen, dafür technisch knifflig. Vom Dorfausgang an der Bergstrasse geht es hoch zur Stockrüti auf Höhe Grüterhof, und nach dem Schützenhaus entschärft eine Bremsschikane die folgende Rechtskurve — da muss man die Bremspunkte sitzen haben.

Mein klares Ziel war es, die Minutengrenze zu unterbieten. Im ersten Training tastete ich mich mit 1:01.96 heran, im zweiten Training lag ich mit 1:00.60 schon deutlich näher dran. Die Marke war zum Greifen nah.

Dann die Rennläufe: Im ersten Lauf drückte ich die Zeit auf 1:00.09 — neun lächerliche Hundertstel über der Minute! So nah und doch nicht ganz drüber. Im zweiten Lauf legte ich mit 1:00.25 nochmals einen sauberen Lauf hin, aber die magische Null vor dem Komma blieb mir an diesem Tag verwehrt. Ärgerlich knapp, aber Reitnau ist eben kein Streckenprofil, das man geschenkt bekommt.

Am Ende sprang in der Kategorie Interswiss bis 2 Liter Rang 6 von 22 heraus, und in der Tagesrangliste klassierte ich mich auf Rang 39 von 139 national lizenzierten Teilnehmern. Ein solides Resultat, auch wenn die Minute selbst um Haaresbreite stehen blieb.

Das grösste Highlight war für mich aber gar nicht die Stoppuhr: Trotz der Affenhitze hatten wir im Fahrerlager den ganzen Tag viele Besucher, die vorbeikamen, fachsimpelten und den Kadett bestaunten. Genau dafür machen wir das. Reitnau, die Minute kriege ich beim nächsten Mal — versprochen.`;

async function main() {
  await saveSummary(RACE_ID, SUMMARY);
  const stored = await getSummary(RACE_ID);
  console.log(`✅ Rennbericht gespeichert für ${RACE_ID}:\n`);
  console.log(stored?.summary);
}

main().catch((err) => {
  console.error("Fehler:", err);
  process.exit(1);
});
