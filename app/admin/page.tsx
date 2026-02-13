"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  Companion,
  Participant,
  ParticipantInsert,
} from "@/lib/db-models";

const PASSWORD = "amandaetetienne";
const STORAGE_KEY = "admin-auth";

type CompanionWithId = Companion & { id: string };

export default function AdminPage() {
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "yes" | "no" | "pending"
  >("all");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    lang: "fr" as "fr" | "en",
    accompanists: [] as CompanionWithId[],
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === PASSWORD) {
      setAuthed(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, PASSWORD);
      setAuthed(true);
      setError("");
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  const loadParticipants = async () => {
    setLoading(true);
    setFetchError("");
    const { data, error } = await supabase
      .from("awnsers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setFetchError(error.message);
      setParticipants([]);
    } else {
      const mapped = (data || []).map((row) => ({
        ...row,
        accompanists: (row.accompanists as Companion[]) || [],
      })) as Participant[];
      setParticipants(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) {
      loadParticipants();
    }
  }, [authed]);

  const comingCount = participants.filter((p) => p.attending === true).length;
  const notComingCount = participants.filter(
    (p) => p.attending === false,
  ).length;
  const pendingCount = participants.filter((p) => p.attending === null).length;

  const filteredParticipants = participants.filter((p) => {
    if (statusFilter === "yes") return p.attending === true;
    if (statusFilter === "no") return p.attending === false;
    if (statusFilter === "pending") return p.attending === null;
    return true;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    const exists = participants.some(
      (p) =>
        p.full_name.trim().toLowerCase() === form.fullName.trim().toLowerCase(),
    );
    if (exists) {
      setSaveError("Ce participant existe déjà.");
      setSaving(false);
      return;
    }

    const payload: ParticipantInsert = {
      full_name: form.fullName,
      attending: null,
      meal_choice: null,
      accompanists: form.accompanists.map(({ id, ...rest }) => rest),
      email: form.email,
      lang: form.lang,
    };

    const { error } = await supabase.from("awnsers").insert([payload]);

    if (error) {
      setSaveError(error.message);
    } else {
      setForm({ fullName: "", email: "", lang: "fr", accompanists: [] });
      loadParticipants();
    }

    setSaving(false);
  };

  const sendEmail = (participant: Participant) => {
    // Placeholder hook for integrating email send
    console.log("Send email to", participant.email || participant.full_name);
  };
  const addCompanion = () => {
    setForm((prev) => ({
      ...prev,
      accompanists: [
        ...prev.accompanists,
        {
          id: crypto.randomUUID(),
          fullName: "",
          meal: "meat",
          restrictions: "",
        },
      ],
    }));
  };

  const updateCompanionName = (id: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      accompanists: prev.accompanists.map((c) =>
        c.id === id ? { ...c, fullName: value } : c,
      ),
    }));
  };

  const removeCompanion = (id: string) => {
    setForm((prev) => ({
      ...prev,
      accompanists: prev.accompanists.filter((c) => c.id !== id),
    }));
  };

  const sendEmailAll = () => {
    // Placeholder hook for integrating bulk email send
    console.log("Send bulk emails to all participants");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-semibold text-foreground">Admin</h1>
            <p className="text-sm text-muted-foreground">Accès réservé</p>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
          >
            Continuer
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      <div className="w-full max-w-4xl space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Tableau de bord
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              onClick={sendEmailAll}
            >
              Envoyer un email à tous
            </button>
            <button
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              onClick={loadParticipants}
            >
              Rafraîchir
            </button>
            <button
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setAuthed(false);
                setInput("");
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-xl border border-border bg-background p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Participants
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                Ajouter un participant
              </h2>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Enregistrement..." : "Ajouter un participant"}
            </button>
          </div>

          {saveError && <p className="text-sm text-destructive">{saveError}</p>}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="fullName"
              >
                Nom complet
              </label>
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="email"
              >
                Courriel
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="lang"
              >
                Langue
              </label>
              <select
                id="lang"
                value={form.lang}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    lang: e.target.value as "fr" | "en",
                  }))
                }
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-card/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Accompagnateurs
              </p>
              <button
                type="button"
                onClick={addCompanion}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                Ajouter un accompagnateur
              </button>
            </div>

            {form.accompanists.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Ajoutez les accompagnateurs ici (nom requis).
              </p>
            )}

            <div className="space-y-3">
              {form.accompanists.map((acc, idx) => (
                <div
                  key={acc.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                >
                  <span className="text-xs text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <input
                    value={acc.fullName}
                    onChange={(e) =>
                      updateCompanionName(acc.id, e.target.value)
                    }
                    placeholder="Nom complet"
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeCompanion(acc.id)}
                    className="text-[11px] font-medium text-destructive hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Participants ({participants.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Présents: {comingCount} · Absents: {notComingCount} · En
                attente: {pendingCount}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tous</option>
                <option value="yes">Présents</option>
                <option value="no">Absents</option>
                <option value="pending">En attente</option>
              </select>
              {loading && (
                <span className="text-xs text-muted-foreground">
                  Chargement...
                </span>
              )}
            </div>
          </div>
          {fetchError && (
            <p className="text-sm text-destructive">{fetchError}</p>
          )}
          <div className="space-y-4">
            {filteredParticipants.map((p) => {
              const statusLabel =
                p.attending === true
                  ? "Présent"
                  : p.attending === false
                    ? "Absent"
                    : "En attente";
              const showDetails = p.attending !== null;
              return (
                <div
                  key={p.id}
                  className="space-y-2 rounded-xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {p.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {statusLabel}
                      </p>
                      {p.lang && (
                        <p className="text-xs text-muted-foreground">
                          Langue: {p.lang.toUpperCase()}
                        </p>
                      )}
                      {showDetails && p.meal_choice && (
                        <p className="text-xs text-muted-foreground">
                          Menu: {p.meal_choice}
                        </p>
                      )}
                    </div>
                    {p.created_at && (
                      <p className="text-xs text-muted-foreground">
                        Créé le {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                      onClick={() => sendEmail(p)}
                    >
                      Envoyer un email
                    </button>
                  </div>

                  {p.accompanists.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Accompagnateurs
                      </p>
                      <div className="space-y-1">
                        {p.accompanists.map((c, idx) => (
                          <p
                            key={`${p.id}-acc-${idx}`}
                            className="text-sm text-foreground"
                          >
                            - {c.fullName} ({c.meal}
                            {c.restrictions ? ` · ${c.restrictions}` : ""})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {!loading && participants.length === 0 && !fetchError && (
              <p className="text-sm text-muted-foreground">
                Aucun participant pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
