"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, MaterialIcon, Modal } from "@/components/ui";
import { club100Stats } from "@/data/partners";
import Image from "next/image";

export function Club100Section() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setOpen(false);
    // Reset form when modal closes
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
      setError("");
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/club100", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    <section id="club100" className="w-full max-w-[1280px] px-4 md:px-10 py-16">
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-[#1a0f0a] to-[#0f0506]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full" />

        <div className="grid lg:grid-cols-2 gap-10 p-8 md:p-12 relative z-10">
          {/* Left Column - Info */}
          <div className="space-y-6">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <MaterialIcon name="star" className="text-sm" filled />
              Exklusiv
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-black italic text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              CLUB{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pr-1">
                100
              </span>
            </motion.h2>

            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Werde Teil des inneren Zirkels. Unterstütze das Team direkt und
              erhalte exklusiven Zugang zum Fahrerlager.
            </motion.p>

            <motion.div
              className="mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {/* Benefits */}
              <ul className="grid grid-cols-2 gap-4 mt-6">
                {club100Stats.benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit.label}
                    className="flex items-center gap-3 text-gray-300 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <MaterialIcon
                      name="check_circle"
                      className="text-primary"
                      filled
                    />
                    {benefit.label}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              <Button variant="gradient" className="mt-6 w-full md:w-auto" onClick={() => setOpen(true)}>
                Member werden
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden">
            <Image
              src="/images/club100.webp"
              alt="Club 100"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* Club 100 Modal */}
      <Modal open={open} onClose={handleClose}>
        {!submitted ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic text-white">
              CLUB{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                100
              </span>
            </h3>

            <p className="text-gray-300">
              Werde Teil des inneren Zirkels. Unterstütze das Team direkt mit CHF
              100.00 pro Saison und erhalte exklusiven Zugang zum Fahrerlager,
              Getränke, exklusive News und eine persönliche Führung durchs
              Fahrerlager.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="club100-email" className="block text-sm font-medium text-gray-400 mb-1">
                  E-Mail-Adresse
                </label>
                <input
                  id="club100-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.ch"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <Button
                variant="gradient"
                className="w-full"
              >
                {loading ? "Wird gesendet..." : "Absenden"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MaterialIcon name="check_circle" className="text-3xl text-green-400" filled />
              <h3 className="text-2xl font-bold text-white">Vielen Dank!</h3>
            </div>

            <p className="text-gray-300">
              Deine E-Mail wurde registriert. Hier sind die Zahlungsinformationen:
            </p>

            <div className="space-y-4">
              {/* Bank Transfer */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <MaterialIcon name="account_balance" className="text-xl" />
                  Banküberweisung
                </div>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>Bank Leerau</p>
                  <p className="font-mono text-white">IBAN CH74 0658 8221 1334 7370 8</p>
                </div>
              </div>

              {/* Twint */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <MaterialIcon name="smartphone" className="text-xl" />
                  Twint
                </div>
                <p className="text-gray-300 text-sm font-mono">078 863 94 30</p>
              </div>

              {/* Amount */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-white font-bold text-center">
                  Betrag: CHF 100.00 pro Saison
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
