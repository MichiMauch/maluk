"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/mail";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(redirect);
      } else {
        setError("Falsches Passwort");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1a1a1a",
          padding: "32px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        <h1
          style={{
            color: "#e53e3e",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "2px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          MALUK RACING ADMIN
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoFocus
          required
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #333",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "16px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ color: "#e53e3e", fontSize: "14px", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "..." : "Anmelden"}
        </button>
      </form>
    </div>
  );
}
