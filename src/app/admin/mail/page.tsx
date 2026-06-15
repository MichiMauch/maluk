"use client";

import { useState, useEffect, useCallback } from "react";

interface MailEntry {
  id: number;
  email: string;
  name: string | null;
  createdAt: string | null;
}

export default function AdminMailPage() {
  const [entries, setEntries] = useState<MailEntry[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [sendSlug, setSendSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/mail");
      if (res.status === 401) {
        window.location.href = "/admin/login?redirect=/admin/mail";
        return;
      }
      const data = await res.json();
      setEntries(data);
    } catch {
      setMessage({ text: "Fehler beim Laden", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail) return;

    const res = await fetch("/api/admin/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, name: newName || undefined }),
    });

    if (res.ok) {
      setNewEmail("");
      setNewName("");
      setMessage({ text: "Hinzugefügt", type: "success" });
      loadEntries();
    } else {
      const data = await res.json();
      setMessage({ text: data.error || "Fehler", type: "error" });
    }
  }

  async function handleRemove(email: string) {
    if (!confirm(`${email} wirklich entfernen?`)) return;

    const res = await fetch("/api/admin/mail", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage({ text: "Entfernt", type: "success" });
      loadEntries();
    } else {
      setMessage({ text: "Fehler beim Entfernen", type: "error" });
    }
  }

  async function handleSend() {
    if (!sendSlug) return;
    if (!confirm(`Rennbericht an ${entries.length} Empfänger senden?`)) return;

    setSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: sendSlug }),
      });

      const data = await res.json();
      if (res.ok) {
        const errMsg = data.errors?.length
          ? ` (${data.errors.length} Fehler)`
          : "";
        setMessage({
          text: `Rennbericht an ${data.sent} Empfänger gesendet${errMsg}`,
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Fehler", type: "error" });
      }
    } catch {
      setMessage({ text: "Verbindungsfehler", type: "error" });
    } finally {
      setSending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      color: "#d4d4d4",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "24px",
    } as const,
    container: {
      maxWidth: "800px",
      margin: "0 auto",
    } as const,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    } as const,
    title: {
      color: "#e53e3e",
      fontSize: "20px",
      fontWeight: 700,
      letterSpacing: "2px",
    } as const,
    card: {
      background: "#1a1a1a",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "24px",
    } as const,
    input: {
      padding: "10px 12px",
      backgroundColor: "#2a2a2a",
      border: "1px solid #333",
      borderRadius: "4px",
      color: "#fff",
      fontSize: "14px",
    } as const,
    btnPrimary: {
      padding: "10px 20px",
      backgroundColor: "#e53e3e",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
    } as const,
    btnDanger: {
      padding: "6px 12px",
      backgroundColor: "transparent",
      color: "#e53e3e",
      border: "1px solid #e53e3e",
      borderRadius: "4px",
      fontSize: "12px",
      cursor: "pointer",
    } as const,
    btnGhost: {
      padding: "8px 16px",
      backgroundColor: "transparent",
      color: "#888",
      border: "1px solid #333",
      borderRadius: "4px",
      fontSize: "13px",
      cursor: "pointer",
    } as const,
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    th: {
      textAlign: "left" as const,
      padding: "8px 12px",
      borderBottom: "1px solid #333",
      color: "#888",
      fontSize: "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
    },
    td: {
      padding: "10px 12px",
      borderBottom: "1px solid #1f1f1f",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>MAILINGLISTE</h1>
          <button onClick={handleLogout} style={styles.btnGhost}>
            Abmelden
          </button>
        </div>

        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              borderRadius: "4px",
              backgroundColor:
                message.type === "success" ? "#1a3a1a" : "#3a1a1a",
              color: message.type === "success" ? "#4ade80" : "#f87171",
              fontSize: "14px",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Add entry */}
        <div style={styles.card}>
          <h2 style={{ color: "#fff", fontSize: "16px", marginBottom: "16px" }}>
            Empfänger hinzufügen
          </h2>
          <form
            onSubmit={handleAdd}
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
          >
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="E-Mail"
              required
              style={{ ...styles.input, flex: "1", minWidth: "200px" }}
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name (optional)"
              style={{ ...styles.input, width: "180px" }}
            />
            <button type="submit" style={styles.btnPrimary}>
              Hinzufügen
            </button>
          </form>
        </div>

        {/* Send report */}
        <div style={styles.card}>
          <h2 style={{ color: "#fff", fontSize: "16px", marginBottom: "16px" }}>
            Rennbericht versenden
          </h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="text"
              value={sendSlug}
              onChange={(e) => setSendSlug(e.target.value)}
              placeholder="Rennen-Slug (z.B. gurnigel-2026)"
              style={{ ...styles.input, flex: "1", minWidth: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !sendSlug}
              style={{
                ...styles.btnPrimary,
                opacity: sending || !sendSlug ? 0.5 : 1,
                cursor: sending || !sendSlug ? "not-allowed" : "pointer",
              }}
            >
              {sending ? "Wird gesendet..." : `An ${entries.length} senden`}
            </button>
          </div>
        </div>

        {/* Entry list */}
        <div style={styles.card}>
          <h2 style={{ color: "#fff", fontSize: "16px", marginBottom: "16px" }}>
            Empfänger ({entries.length})
          </h2>
          {loading ? (
            <p style={{ color: "#888" }}>Laden...</p>
          ) : entries.length === 0 ? (
            <p style={{ color: "#888" }}>Keine Empfänger</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>E-Mail</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td style={styles.td}>{entry.email}</td>
                    <td style={{ ...styles.td, color: "#888" }}>
                      {entry.name || "—"}
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        onClick={() => handleRemove(entry.email)}
                        style={styles.btnDanger}
                      >
                        Entfernen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
