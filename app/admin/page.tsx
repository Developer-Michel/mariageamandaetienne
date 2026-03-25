"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  Companion,
  Participant,
  ParticipantInsert,
} from "@/lib/db-models";
import { CheckCircle2, Clock3, XCircle, Loader2 } from "lucide-react";

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
  const [emailSendingId, setEmailSendingId] = useState<string | null>(null);
  const [bulkSending, setBulkSending] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    lang: "fr" as "fr" | "en",
    attending: null as boolean | null,
    accompanists: [] as Companion[],
    meal_choice: "meat" as "meat" | "fish" | "vegetarian" | "children" | null,
  });

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

  const setSending = (id: string, sending: boolean) => {
    setSendingIds((prev) => {
      const next = new Set(prev);
      if (sending) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const updateEmailStatusLocal = (id: string, status: boolean | null) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, email_sent_success: status } : p)),
    );
  };

  const formatStatus = (status: boolean | null | undefined) =>
    status === true ? "Présent" : status === false ? "Absent" : "En attente";

  const aggregateCounts = participants.reduce(
    (acc, participant) => {
      const add = (status: boolean | null | undefined) => {
        if (status === true) acc.present += 1;
        else if (status === false) acc.absent += 1;
        else acc.pending += 1;
      };

      add(participant.attending);
      (participant.accompanists || []).forEach((companion) =>
        add(companion.attending),
      );
      return acc;
    },
    { present: 0, absent: 0, pending: 0 } as {
      present: number;
      absent: number;
      pending: number;
    },
  );

  const participantFilterCounts = useMemo(
    () =>
      participants.reduce(
        (acc, p) => {
          acc.all += 1;
          if (p.attending === true) acc.yes += 1;
          else if (p.attending === false) acc.no += 1;
          else acc.pending += 1;
          return acc;
        },
        { all: 0, yes: 0, no: 0, pending: 0 },
      ),
    [participants],
  );

  const renderEmailStatus = (
    status: boolean | null | undefined,
    isSending: boolean,
  ) => {
    if (isSending) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-primary">
          <Loader2 className="h-4 w-4 animate-spin" /> Envoi...
        </span>
      );
    }
    if (status === true) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Envoyé
        </span>
      );
    }
    if (status === false) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-destructive">
          <XCircle className="h-4 w-4" /> Echec
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Clock3 className="h-4 w-4" /> Non envoyé
      </span>
    );
  };

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
      id: crypto.randomUUID(),
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

  const sendEmail = async (participant: Participant) => {
    if (!participant.email) {
      setEmailFeedback("");
      setEmailError(`Aucun courriel pour ${participant.full_name}.`);
      return;
    }

    setEmailError("");
    setEmailFeedback("");
    setEmailSendingId(participant.id);
    setSending(participant.id, true);
    updateEmailStatusLocal(participant.id, null);

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: [participant.email],
          names: [participant.full_name],
          participantIds: [participant.id],
          participants: [
            {
              id: participant.id,
              name: participant.full_name,
              lang: participant.lang,
            },
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Echec de l'envoi de l'email.");
      }

      setEmailFeedback(`Email envoye a ${participant.full_name}.`);
      updateEmailStatusLocal(participant.id, true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Echec de l'envoi de l'email.";
      setEmailError(message);
      updateEmailStatusLocal(participant.id, false);
    } finally {
      setSending(participant.id, false);
      setEmailSendingId(null);
    }
  };

  const startEdit = (participant: Participant) => {
    setEditError("");
    setEditingId(participant.id);
    setEditForm({
      fullName: participant.full_name,
      email: participant.email || "",
      lang: participant.lang,
      attending: participant.attending,
      accompanists: participant.accompanists || [],
      meal_choice: participant.meal_choice || null,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const updateEditCompanion = (index: number, updates: Partial<Companion>) => {
    setEditForm((prev) => ({
      ...prev,
      accompanists: prev.accompanists.map((companion, i) =>
        i === index ? { ...companion, ...updates } : companion,
      ),
    }));
  };

  const removeEditCompanion = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      accompanists: prev.accompanists.filter((_, i) => i !== index),
    }));
  };

  const addEditCompanion = () => {
    setEditForm((prev) => ({
      ...prev,
      accompanists: [
        ...prev.accompanists,
        {
          fullName: "",
          meal: "meat",
          restrictions: "",
          attending: null,
        },
      ],
    }));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setEditError("");
    setEditSaving(true);

    const payload = {
      full_name: editForm.fullName.trim(),
      email: editForm.email.trim() || undefined,
      lang: editForm.lang,
      attending: editForm.attending,
      meal_choice:
        editForm.attending === true && editForm.meal_choice
          ? editForm.meal_choice
          : undefined,
      accompanists: editForm.accompanists.map(({ ...rest }) => rest),
    } satisfies Partial<ParticipantInsert>;

    try {
      const { error } = await supabase
        .from("awnsers")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        throw new Error(error.message);
      }

      await loadParticipants();
      setEditingId(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Echec de la mise a jour.";
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const deleteParticipant = async (participant: Participant) => {
    const confirmed = window.confirm(
      `Supprimer ${participant.full_name} ? Cette action est irreversible.`,
    );
    if (!confirmed) return;

    setFetchError("");
    setEditError("");
    setDeletingId(participant.id);

    try {
      const { error } = await supabase
        .from("awnsers")
        .delete()
        .eq("id", participant.id);

      if (error) {
        throw new Error(error.message);
      }

      if (editingId === participant.id) {
        setEditingId(null);
      }

      await loadParticipants();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Echec de la suppression.";
      if (editingId === participant.id) {
        setEditError(message);
      } else {
        setFetchError(message);
      }
    } finally {
      setDeletingId(null);
    }
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
          attending: null,
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

  const toCsvValue = (value: unknown) => {
    if (value === undefined || value === null) return "";
    const str = String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const downloadCsv = () => {
    const headers = [
      "accompanist_of",
      "full_name",
      "email",
      "lang",
      "attending",
      "meal_choice",
      "allergies",
      "message",
    ];

    const lines = [headers.map(toCsvValue).join(",")];

    const formatAttend = (value: boolean | null | undefined) =>
      value === true ? "yes" : value === false ? "no" : "pending";

    participants.forEach((p) => {
      lines.push(
        [
          "",
          p.full_name,
          p.email,
          p.lang,
          formatAttend(p.attending),
          p.meal_choice,
          p.allergies,
          p.message,
        ]
          .map(toCsvValue)
          .join(","),
      );

      (p.accompanists || []).forEach((c, idx) => {
        lines.push(
          [
            p.full_name,
            c.fullName,
            "",
            p.lang,
            formatAttend(c.attending),
            c.meal,
            c.restrictions,
            "",
          ]
            .map(toCsvValue)
            .join(","),
        );
      });
    });

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "participants.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const sendEmailAll = async () => {
    const targets = participants.filter(
      (p) =>
        p.email?.trim() &&
        (p.email_sent_success === null || p.email_sent_success === false),
    );

    if (targets.length === 0) {
      setEmailFeedback("");
      setEmailError("Aucun courriel en attente d'envoi.");
      return;
    }

    setEmailError("");
    setEmailFeedback("");
    setBulkSending(true);

    let successCount = 0;
    for (let i = 0; i < targets.length; i += 1) {
      const target = targets[i];
      setEmailFeedback(`Envoi ${i + 1}/${targets.length}...`);
      setSending(target.id, true);
      updateEmailStatusLocal(target.id, null);

      try {
        const response = await fetch("/api/admin/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipients: [target.email!.trim()],
            names: [target.full_name],
            participantIds: [target.id],
            participants: [
              {
                id: target.id,
                name: target.full_name,
                lang: target.lang,
              },
            ],
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Echec de l'envoi.");
        }

        successCount += 1;
        updateEmailStatusLocal(target.id, true);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Echec de l'envoi.";
        setEmailError(message);
        updateEmailStatusLocal(target.id, false);
      } finally {
        setSending(target.id, false);
      }
    }

    setEmailFeedback(
      `Emails envoyes: ${successCount}/${targets.length} participant(s).`,
    );
    setBulkSending(false);
    await loadParticipants();
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
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              onClick={sendEmailAll}
              disabled={bulkSending}
            >
              {bulkSending ? "Envoi..." : "Envoyer un email à tous"}
            </button>
            <button
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              onClick={downloadCsv}
              disabled={participants.length === 0}
            >
              Exporter CSV
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

        {(emailFeedback || emailError) && (
          <div className="rounded-lg border border-border bg-background p-3">
            {emailFeedback && (
              <p className="text-sm text-emerald-600">{emailFeedback}</p>
            )}
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>
        )}

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
                Présents: {aggregateCounts.present} · Absents:{" "}
                {aggregateCounts.absent} · En attente: {aggregateCounts.pending}{" "}
                (participants et accompagnateurs)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  {
                    key: "all",
                    label: "Tous",
                    count: participantFilterCounts.all,
                  },
                  {
                    key: "yes",
                    label: "Présents",
                    count: participantFilterCounts.yes,
                  },
                  {
                    key: "no",
                    label: "Absents",
                    count: participantFilterCounts.no,
                  },
                  {
                    key: "pending",
                    label: "En attente",
                    count: participantFilterCounts.pending,
                  },
                ] as const
              ).map((filter) => {
                const active = statusFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setStatusFilter(filter.key)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"}`}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={`rounded-full px-2 py-[2px] text-[11px] ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
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
              const statusLabel = formatStatus(p.attending);
              const showDetails = p.attending !== null;
              const isEditing = editingId === p.id;
              return (
                <div
                  key={p.id}
                  className="space-y-2 rounded-xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      {isEditing ? (
                        <>
                          <input
                            value={editForm.fullName}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="Courriel"
                            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <select
                              value={editForm.lang}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  lang: e.target.value as "fr" | "en",
                                }))
                              }
                              className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="fr">FR</option>
                              <option value="en">EN</option>
                            </select>
                            <select
                              value={
                                editForm.attending === true
                                  ? "yes"
                                  : editForm.attending === false
                                    ? "no"
                                    : ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditForm((prev) => ({
                                  ...prev,
                                  attending:
                                    val === "yes"
                                      ? true
                                      : val === "no"
                                        ? false
                                        : null,
                                }));
                              }}
                              className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="">En attente</option>
                              <option value="yes">Présent</option>
                              <option value="no">Absent</option>
                            </select>
                            <select
                              value={editForm.meal_choice || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  meal_choice: e.target.value
                                    ? (e.target.value as
                                        | "meat"
                                        | "fish"
                                        | "vegetarian")
                                    : null,
                                }))
                              }
                              disabled={editForm.attending !== true}
                              className="flex-1 min-w-[120px] rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <option
                                value=""
                                aria-placeholder="select an option"
                              ></option>
                              <option value="meat">Viande</option>
                              <option value="fish">Poisson</option>
                              <option value="vegetarian">Vegetarien</option>
                            </select>
                          </div>
                          <div className="mt-3 space-y-2 rounded-lg border border-border bg-background p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                Accompagnateurs
                              </p>
                              <button
                                type="button"
                                onClick={addEditCompanion}
                                disabled={editSaving || deletingId === p.id}
                                className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Ajouter
                              </button>
                            </div>
                            {editForm.accompanists.length === 0 && (
                              <p className="text-xs text-muted-foreground">
                                Aucun accompagnateur. Ajoutez-en un.
                              </p>
                            )}
                            <div className="space-y-2">
                              {editForm.accompanists.map((c, idx) => (
                                <div
                                  key={`${p.id}-edit-acc-${idx}`}
                                  className="grid gap-2 rounded-lg border border-border bg-card p-2 md:grid-cols-4"
                                >
                                  <input
                                    value={c.fullName || ""}
                                    onChange={(e) =>
                                      updateEditCompanion(idx, {
                                        fullName: e.target.value,
                                      })
                                    }
                                    placeholder="Nom"
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                                  />
                                  <select
                                    value={c.meal || "meat"}
                                    onChange={(e) =>
                                      updateEditCompanion(idx, {
                                        meal: e.target.value as
                                          | "meat"
                                          | "fish"
                                          | "vegetarian"
                                          | "children",
                                      })
                                    }
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                                  >
                                    <option value="">select menu</option>
                                    <option value="meat">Viande</option>
                                    <option value="fish">Poisson</option>
                                    <option value="vegetarian">
                                      Vegetarien
                                    </option>
                                    <option value="children">Enfant</option>
                                  </select>
                                  <select
                                    value={
                                      c.attending === true
                                        ? "yes"
                                        : c.attending === false
                                          ? "no"
                                          : ""
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateEditCompanion(idx, {
                                        attending:
                                          val === "yes"
                                            ? true
                                            : val === "no"
                                              ? false
                                              : null,
                                      });
                                    }}
                                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                                  >
                                    <option value="">En attente</option>
                                    <option value="yes">Présent</option>
                                    <option value="no">Absent</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => removeEditCompanion(idx)}
                                    disabled={editSaving || deletingId === p.id}
                                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    Retirer
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-foreground">
                            {p.full_name}
                          </p>
                          {p.email && (
                            <p className="text-xs text-muted-foreground">
                              {p.email}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {renderEmailStatus(
                              p.email_sent_success,
                              sendingIds.has(p.id),
                            )}
                          </div>
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
                          {p.allergies && (
                            <p className="text-xs text-muted-foreground">
                              Restriction/allergies : {p.allergies}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    {p.created_at && (
                      <p className="text-xs text-muted-foreground">
                        Créé le {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={cancelEdit}
                            disabled={editSaving || deletingId === p.id}
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={saveEdit}
                            disabled={editSaving || deletingId === p.id}
                          >
                            {editSaving ? "Sauvegarde..." : "Enregistrer"}
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-destructive/40 px-3 py-1 text-[11px] font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => deleteParticipant(p)}
                            disabled={editSaving || deletingId === p.id}
                          >
                            {deletingId === p.id
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                            onClick={() => startEdit(p)}
                            disabled={deletingId === p.id}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => sendEmail(p)}
                            disabled={
                              emailSendingId === p.id ||
                              bulkSending ||
                              sendingIds.has(p.id) ||
                              deletingId === p.id
                            }
                          >
                            {emailSendingId === p.id
                              ? "Envoi..."
                              : "Envoyer un email"}
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-destructive/40 px-3 py-1 text-[11px] font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => deleteParticipant(p)}
                            disabled={deletingId === p.id}
                          >
                            {deletingId === p.id
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing && editError && (
                    <p className="text-sm text-destructive">{editError}</p>
                  )}

                  {!isEditing && p.accompanists.length > 0 && (
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
                            - {c.fullName} ({c.attending ? c.meal : ""}
                            {c.restrictions
                              ? ` · Restriction: ${c.restrictions}`
                              : ""}
                            ) - {formatStatus(c.attending)}
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
