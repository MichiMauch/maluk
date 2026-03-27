"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, MaterialIcon } from "@/components/ui";
import Image from "next/image";

interface SponsorModalProps {
  open: boolean;
  onClose: () => void;
}

export function SponsorModal({ open, onClose }: SponsorModalProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    onClose();
    setTimeout(() => {
      setName("");
      setCompany("");
      setPhone("");
      setEmail("");
      setMessage("");
      setSubmitted(false);
      setError("");
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, phone, email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Senden");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Senden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {!submitted ? (
        <div className="space-y-8">
          {/* Section 1: Intro */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <MaterialIcon name="handshake" className="text-sm" filled />
              Leidenschaft, die bewegt
            </div>
            <h3 className="text-2xl font-black italic text-white">
              Gib mit mir gemeinsam{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Gas!
              </span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bergrennen in der Schweiz &ndash; das ist Adrenalin pur, Pr&auml;zision in jeder Kurve
              und eine unglaubliche Fangemeinde. Ich stecke jede freie Minute, viel Herzblut und
              jeden Franken in mein Rennauto, um am Berg Bestzeiten zu jagen.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Aber Motorsport ist ein Teamsport. Um in der kommenden Saison ganz vorne
              mitzufahren, suche ich Partner, die meine Leidenschaft teilen. Wenn du mich
              unterst&uuml;tzt, investierst du nicht nur in ein schnelles Auto, sondern in ein
              regionales Projekt mit Biss.
            </p>
          </div>

          {/* Section 2: Das Paket */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MaterialIcon name="verified" className="text-primary" filled />
              Dein Logo auf der &Uuml;berholspur
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Als Sponsor bist du f&uuml;r mich kein anonymer Geldgeber, sondern ein echter
              Partner. Ob mit einem finanziellen Beitrag (meist zwischen 500 und 1&apos;500 CHF) oder
              mit Material f&uuml;r das Auto &ndash; das bekommst du von mir zur&uuml;ck:
            </p>
            <ul className="space-y-2">
              {[
                { icon: "directions_car", text: "Pr\u00e4senz auf dem Rennwagen: Dein Logo ist bei jedem Rennen auf meinem Opel Kadett C GT/E und auf allen Pressefotos zu sehen." },
                { icon: "language", text: "Webseite & Social Media: Ich verlinke dich auf meiner Seite und stelle dich meinen Followern als offiziellen Partner vor." },
                { icon: "photo_camera", text: "Content f\u00fcr dein Marketing: Du erh\u00e4ltst Zugriff auf professionelle Action-Fotos und Videos. Nutze sie f\u00fcr deine eigene Werbung." },
                { icon: "garage", text: "Boxenfunk & Benzinluft: Du und deine Leute seid jederzeit im Fahrerlager willkommen. Erlebe Bergrennen hautnah an der Strecke." },
                { icon: "groups", text: "Netzwerk: Du wirst Teil einer Gemeinschaft von lokalen Unternehmern und Motorsport-Begeisterten." },
              ].map((item) => (
                <li key={item.icon} className="flex items-start gap-3 text-gray-300 text-sm">
                  <MaterialIcon name={item.icon} className="text-primary mt-0.5 shrink-0" filled />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Warum es sich lohnt */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MaterialIcon name="trending_up" className="text-primary" filled />
              Warum Partner werden?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Echte Sichtbarkeit", desc: "Tausende Fans an Schweizer Bergstrecken und online" },
                { label: "Image-Gewinn", desc: "Pr\u00e4zision, Technik und Durchhalteverm\u00f6gen f\u00fcr dein Unternehmen" },
                { label: "Einfach & Direkt", desc: "Ein Handschlag, ein Logo, eine gemeinsame Mission" },
                { label: "Steuer-Bonus", desc: "Voll abzugsf\u00e4hige Marketing-Leistung" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-3 gap-2 rounded-lg overflow-hidden">
            {[
              { src: "/images/gallery/lr1.webp", alt: "Auto in Fahrt" },
              { src: "/images/lukas-maurer-detail.webp", alt: "Fahrer am Auto" },
              { src: "/images/gallery/auto.webp", alt: "Logos auf dem Auto" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Section 4: Contact Form */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MaterialIcon name="mail" className="text-primary" filled />
              Hast du Lust auf eine Probefahrt?
            </h4>
            <p className="text-gray-300 text-sm">
              Lass uns unverbindlich quatschen! Ich zeige dir gerne das Auto und erkl&auml;re dir,
              was wir diese Saison vorhaben.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="sponsor-name" className="block text-sm font-medium text-gray-400 mb-1">
                  Dein Name
                </label>
                <input
                  id="sponsor-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Muster"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="sponsor-company" className="block text-sm font-medium text-gray-400 mb-1">
                  Firma (optional)
                </label>
                <input
                  id="sponsor-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Muster AG"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="sponsor-phone" className="block text-sm font-medium text-gray-400 mb-1">
                  Deine Telefonnummer
                </label>
                <input
                  id="sponsor-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="sponsor-email" className="block text-sm font-medium text-gray-400 mb-1">
                  Deine E-Mail
                </label>
                <input
                  id="sponsor-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.ch"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="sponsor-message" className="block text-sm font-medium text-gray-400 mb-1">
                  Nachricht (optional)
                </label>
                <textarea
                  id="sponsor-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ich interessiere mich f&uuml;r..."
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button variant="gradient" className="w-full" type="submit">
                {loading ? "Wird gesendet..." : "Jetzt Kontakt aufnehmen"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <MaterialIcon name="check_circle" className="text-3xl text-green-400" filled />
            <h3 className="text-2xl font-bold text-white">Vielen Dank!</h3>
          </div>
          <p className="text-gray-300">
            Deine Nachricht wurde gesendet. Lukas meldet sich so schnell wie m&ouml;glich bei dir!
          </p>
        </div>
      )}
    </Modal>
  );
}
