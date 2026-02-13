"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useGuest } from "@/lib/guest";
import { supabase } from "@/lib/supabase";
import { Section, SectionHeader } from "./section";
import { Check } from "lucide-react";
import type { Companion, ParticipantUpdate } from "@/lib/db-models";

type CompanionWithId = Companion & { id: number };

export function RSVPForm() {
  const { t } = useI18n();
  const { guestToken, guestName, hasInvite, loading, error, participant } =
    useGuest();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [mealChoice, setMealChoice] = useState<string>("");
  const [companions, setCompanions] = useState<CompanionWithId[]>([]);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    if (!participant) return;
    const hasResponse = participant.attending !== null;
    setEditing(!hasResponse);
    setAttending(
      participant.attending === null
        ? null
        : participant.attending
          ? "yes"
          : "no",
    );
    setMealChoice(participant.meal_choice ?? "");
    setCompanions(
      (participant.accompanists || []).map((c, index) => ({
        ...c,
        id: index + 1,
        restrictions: c.restrictions || "",
      })),
    );
  }, [participant]);

  const updateCompanion = (
    id: number,
    field: "fullName" | "meal" | "restrictions",
    value: string,
  ) => {
    setCompanions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!hasInvite || !guestToken) {
      setSubmitError(
        "Veuillez utiliser votre lien personnalisé pour répondre.",
      );
      return;
    }

    const payload: ParticipantUpdate = {
      attending: attending === "yes" ? true : attending === "no" ? false : null,
      meal_choice: attending === "yes" ? mealChoice : null,
      accompanists:
        attending === "yes" ? companions.map(({ id, ...rest }) => rest) : [],
    };

    setSubmitting(true);
    const { error: updateError } = await supabase
      .from("awnsers")
      .update(payload)
      .eq("id", guestToken);

    if (updateError) {
      setSubmitError(updateError.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
    setEditing(false);
  };

  if (!hasInvite && !loading) {
    return (
      <Section id="rsvp" reveal="scale">
        <SectionHeader title={t("rsvp.title")} subtitle={t("rsvp.subtitle")} />
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Veuillez utiliser votre lien personnalisé pour confirmer votre
            présence.
          </p>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
      </Section>
    );
  }

  if (loading) {
    return (
      <Section id="rsvp" reveal="scale">
        <SectionHeader title={t("rsvp.title")} subtitle={t("rsvp.subtitle")} />
        <p className="mx-auto max-w-lg text-center text-sm text-muted-foreground">
          Chargement de votre invitation...
        </p>
      </Section>
    );
  }

  const alreadySubmitted = participant?.attending !== null || submitted;

  if (alreadySubmitted && !editing) {
    return (
      <Section id="rsvp" reveal="scale">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="mb-2 font-serif text-3xl font-light text-foreground">
            {t("rsvp.success")}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Votre réponse a déjà été reçue. Merci!
          </p>
          <button
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-foreground"
            onClick={() => setEditing(true)}
          >
            Modifier ma réponse
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section id="rsvp" reveal="scale">
      <SectionHeader
        title={t("rsvp.title")}
        subtitle={
          guestName ? `${t("rsvp.subtitle")}, ${guestName}` : t("rsvp.subtitle")
        }
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        {/* Hidden guest token */}
        <input type="hidden" name="guestToken" value={guestToken || ""} />

        {/* Attending */}
        <fieldset className="mb-8">
          <legend className="mb-4 text-sm font-medium text-foreground">
            {t("rsvp.attending")}
          </legend>
          <div className="flex gap-4">
            <label
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-4 text-center text-sm transition-all ${
                attending === "yes"
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value="yes"
                className="sr-only"
                onChange={() => setAttending("yes")}
                required
              />
              <span>{t("rsvp.yes")}</span>
            </label>
            <label
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-4 text-center text-sm transition-all ${
                attending === "no"
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value="no"
                className="sr-only"
                onChange={() => setAttending("no")}
              />
              <span>{t("rsvp.no")}</span>
            </label>
          </div>
        </fieldset>

        {/* Only show remaining fields when attending */}
        {attending === "yes" && (
          <>
            {/* Meal choice */}
            <div className="mb-6">
              <label
                htmlFor="meal"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("rsvp.meal")}
              </label>
              <select
                id="meal"
                name="meal"
                value={mealChoice}
                onChange={(e) =>
                  setMealChoice(e.target.value as Companion["meal"])
                }
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                <option value="porc">{t("rsvp.meal.meat")}</option>
                <option value="surfnturf">{t("rsvp.meal.fish")}</option>
                <option value="vegetarian">{t("rsvp.meal.vegetarian")}</option>
                <option value="children">{t("rsvp.meal.enfant")}</option>
              </select>
            </div>

            {/* Allergies */}
            <div className="mb-6">
              <label
                htmlFor="allergies"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("rsvp.allergies")}
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Companions */}
            <div className="mb-8 space-y-4">
              <p className="text-sm font-medium text-foreground">
                {t("rsvp.companions.title")}
              </p>

              {companions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  {t("rsvp.companions.none")}
                </p>
              )}

              <div className="space-y-4">
                {companions.map((companion, index) => (
                  <div
                    key={companion.id}
                    className="rounded-lg border border-border bg-card/60 p-4 shadow-sm"
                  >
                    <div className="mb-4 text-xs text-muted-foreground">
                      <span>
                        {t("rsvp.companions.label")} #{index + 1}
                      </span>
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 block text-xs font-medium text-foreground">
                        {t("rsvp.companions.fullName")}
                      </label>
                      <input
                        type="text"
                        name={`companions[${index}].fullName`}
                        value={companion.fullName}
                        onChange={(e) =>
                          updateCompanion(
                            companion.id,
                            "fullName",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 block text-xs font-medium text-foreground">
                        {t("rsvp.companions.meal")}
                      </label>
                      <select
                        name={`companions[${index}].meal`}
                        value={companion.meal}
                        onChange={(e) =>
                          updateCompanion(companion.id, "meal", e.target.value)
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      >
                        <option value="meat">{t("rsvp.meal.meat")}</option>
                        <option value="fish">{t("rsvp.meal.fish")}</option>
                        <option value="vegetarian">
                          {t("rsvp.meal.vegetarian")}
                        </option>
                        <option value="children">
                          {t("rsvp.meal.enfant")}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-foreground">
                        {t("rsvp.companions.restrictions")}
                      </label>
                      <textarea
                        name={`companions[${index}].restrictions`}
                        value={companion.restrictions}
                        onChange={(e) =>
                          updateCompanion(
                            companion.id,
                            "restrictions",
                            e.target.value,
                          )
                        }
                        rows={2}
                        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder={t(
                          "rsvp.companions.restrictionsPlaceholder",
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Message */}
        <div className="mb-8">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {t("rsvp.message")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!attending || submitting}
          className="w-full rounded-full shadow-xl shadow-black/20 ring-1 ring-white/5 bg-primary py-4 text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Envoi..." : t("rsvp.submit")}
        </button>

        {submitError && (
          <p className="mt-3 text-sm text-destructive text-center">
            {submitError}
          </p>
        )}
      </form>
    </Section>
  );
}
