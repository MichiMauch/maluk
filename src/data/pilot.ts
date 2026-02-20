export interface Pilot {
  name: string;
  nickname?: string;
  image: { url: string; alt: string };
  bio: string;
  detailedBio: string;
  stats: { label: string; value: string }[];
}

export interface Car {
  name: string;
  image: { url: string; alt: string };
  video?: { url: string };
  description: string;
  techSpecs: { label: string; value: string }[];
}

export const pilot: Pilot = {
  name: "Lukas Maurer",
  nickname: "Maluk",
  image: { url: "/images/lukas-maurer.webp", alt: "Lukas Maurer" },
  bio: "Bergrennen-Pilot mit Leidenschaft für Motoren und Geschwindigkeit.",
  detailedBio: "Ich bin Lukas Maurer, in der Schweiz aufgewachsen und seit jeher vom Rennsport-Virus infiziert. Für mich geht es beim Slalom und am Berg nicht nur um Geschwindigkeit, sondern vor allem um Präzision und das richtige Gespür für die Technik. Nach viel Arbeit und Herzblut bin ich seit 2023 mit meinem neu aufgebauten Opel Kadett C GT/E am Start. Mein Ziel? Aus jedem Lauf das Beste rauszuholen und die Leidenschaft für den Sport bei jedem Kilometer zu spüren. Dabei schätze ich die Unterstützung meiner Partner, Freunden, Verwandten, Gönner und Fans, die diesen Weg gemeinsam mit mir gehen.",
  stats: [
    { label: "Saisons", value: "5" },
    { label: "Starts", value: "32" },
    { label: "Podestplätze", value: "12" },
    { label: "Siege", value: "4" },
  ],
};

export const car: Car = {
  name: "Opel Kadett C GT/E Gruppe Interswiss",
  image: { url: "/images/car.webp", alt: "Opel Kadett C GT/E Gruppe Interswiss" },
  video: { url: "/videos/car.mp4" },
  description: "1994–2006 CH-Meisterschaft mit Roger Kissling. 2020–2023 Neuaufbau in über 1000 Arbeitsstunden. Ab 2023 Slalom und Bergrennen mit Lukas Maurer.",
  techSpecs: [
    { label: "Baujahr", value: "1979" },
    { label: "Motor", value: "2.0 16V BEWA-Technik" },
    { label: "Getriebe", value: "Drenth 6 Gang sequentiell" },
    { label: "Fahrwerk", value: "Bilstein" },
    { label: "Räder", value: "BBS 10x15\"" },
    { label: "Gewicht", value: "905 kg inkl. Fahrer" },
  ],
};
