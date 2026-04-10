"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Section, SectionHeader } from "./section";

export function MusicRecommendation() {
  const { t } = useI18n();
  const [songName, setSongName] = useState("");
  const [recommendedBy, setRecommendedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const trimmedSong = songName.trim();
    const trimmedBy = recommendedBy.trim();

    if (!trimmedSong || !trimmedBy) {
      setError(t("music.form.error.required"));
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/music-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songName: trimmedSong,
          recommendedBy: trimmedBy,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error || t("music.form.error.send"));
        setSubmitting(false);
        return;
      }

      setSongName("");
      setRecommendedBy("");
      setSuccess(true);
    } catch {
      setError(t("music.form.error.send"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="music" reveal="up" alt>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
        <SectionHeader title={t("music.title")} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="songName"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {t("music.form.song")}
            </label>
            <input
              id="songName"
              name="songName"
              type="text"
              value={songName}
              onChange={(event) => setSongName(event.target.value)}
              placeholder={t("music.form.song.placeholder")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="recommendedBy"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {t("music.form.name")}
            </label>
            <input
              id="recommendedBy"
              name="recommendedBy"
              type="text"
              value={recommendedBy}
              onChange={(event) => setRecommendedBy(event.target.value)}
              placeholder={t("music.form.name.placeholder")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-primary">{t("music.form.success")}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t("music.form.sending") : t("music.form.send")}
          </button>
        </form>
      </div>
    </Section>
  );
}
