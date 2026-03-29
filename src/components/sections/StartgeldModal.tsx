"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, MaterialIcon } from "@/components/ui";
import { trackEvent } from "@/lib/tracking";

interface StartgeldModalProps {
  open: boolean;
  onClose: () => void;
  raceName: string;
}

export function StartgeldModal({ open, onClose, raceName }: StartgeldModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    onClose();
    setTimeout(() => {
      setName("");
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
        body: JSON.stringify({
          name,
          company: "",
          phone: "",
          email,
          message: `[Startgeldsponsor für ${raceName}] ${message}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Senden");
      }

      trackEvent("Startgeld", "Inquiry", raceName);
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
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/50 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-3">
              <MaterialIcon name="volunteer_activism" className="text-sm" filled />
              Startgeldsponsor
            </div>
            <h3 className="text-2xl font-black italic text-white pt-1">
              {raceName}
            </h3>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            Mit <strong className="text-white">CHF 300.00</strong> ermöglichst du Lukas den Start an diesem Rennen.
            Das Startgeld ist einer der grössten Kostenpunkte pro Rennen — dein Beitrag macht den Unterschied.
          </p>

          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MaterialIcon name="verified" className="text-accent" filled />
              Das bekommst du zurück
            </h4>
            <ul className="space-y-2">
              {[
                { icon: "directions_car", text: "Dein Logo als Kleber auf dem Rennwagen an diesem Rennevent" },
                { icon: "language", text: "Dein Logo auf der Webseite beim Renneintrag" },
                { icon: "cell_tower", text: "Erwähnung im Live-Rennticker während des Rennens" },
                { icon: "garage", text: "Zugang zum Fahrerlager — erlebe das Rennen hautnah mit dem Team" },
              ].map((item) => (
                <li key={item.icon} className="flex items-start gap-3 text-gray-300 text-sm">
                  <MaterialIcon name={item.icon} className="text-accent mt-0.5 shrink-0" filled />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-white font-bold text-center">
              Betrag: CHF 300.00 pro Rennen
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="startgeld-name" className="block text-sm font-medium text-gray-400 mb-1">
                Dein Name
              </label>
              <input
                id="startgeld-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Max Muster"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="startgeld-email" className="block text-sm font-medium text-gray-400 mb-1">
                Deine E-Mail
              </label>
              <input
                id="startgeld-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.ch"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="startgeld-message" className="block text-sm font-medium text-gray-400 mb-1">
                Nachricht (optional)
              </label>
              <textarea
                id="startgeld-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ich unterstütze gerne..."
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button variant="gradient" className="w-full" type="submit">
              {loading ? "Wird gesendet..." : "Startgeldsponsor werden"}
            </Button>

            <p className="text-gray-500 text-xs text-center">
              Lukas meldet sich persönlich bei dir mit den Zahlungsdetails.
            </p>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <MaterialIcon name="check_circle" className="text-3xl text-green-400" filled />
            <h3 className="text-2xl font-bold text-white">Vielen Dank!</h3>
          </div>
          <p className="text-gray-300">
            Deine Anfrage als Startgeldsponsor für <strong className="text-white">{raceName}</strong> wurde gesendet.
            Lukas meldet sich so schnell wie möglich bei dir!
          </p>
        </div>
      )}
    </Modal>
  );
}
