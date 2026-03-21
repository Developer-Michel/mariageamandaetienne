import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
const siteUrl = "https://amandaetienne.ca";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is missing.");
}

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are missing.");
}

const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const mealLabels: Record<"fr" | "en", Record<string, string>> = {
  fr: {
    meat: "Filet de porc (BBQ du Québec, romesco, PDT)",
    fish: "Surf & Turf (boeuf, chili crunch, acras de crevettes)",
    vegetarian: "Végétarien (polenta, légumes grillés, lentilles)",
    children: "Menu enfant",
  },
  en: {
    meat: "Pork filet (QC BBQ, romesco, potatoes)",
    fish: "Surf & Turf (beef, chili crunch, shrimp fritters)",
    vegetarian: "Vegetarian (polenta, grilled vegetables, lentils)",
    children: "Children's menu",
  },
};

const attendanceLabels: Record<
  "fr" | "en",
  { yes: string; no: string; pending: string }
> = {
  fr: { yes: "Présent", no: "Absent", pending: "En attente" },
  en: { yes: "Attending", no: "Not attending", pending: "Pending" },
};

const copyByLang = {
  fr: {
    subject: "Confirmation de ta réponse — Amanda & Étienne",
    hello: "Bonjour",
    declineOnly:
      "Ta réponse de ne pas être présent(e) est bien confirmée. Nous sommes désolés de l'apprendre.",
    introYes:
      "Merci d'avoir confirmé ta présence à notre mariage. Voici un récapitulatif de ta réponse.",
    introNo:
      "Nous avons bien reçu ton message. Voici un récapitulatif de ta réponse.",
    summary: "Résumé",
    attending: "Présence",
    meal: "Menu",
    allergies: "Allergies / restrictions",
    message: "Message",
    none: "Non précisé",
    noCompanions: "Aucun accompagnateur indiqué.",
    companions: "Accompagnateurs",
    companionAttendance: "Présence",
    companionMeal: "Menu",
    companionRestrictions: "Restrictions",
    hotelTitle: "Hébergement recommandé",
    hotelIntro:
      "Pour réserver à l'Hôtel Rive Gauche : appelle le 450-467-4477 ou réserve en ligne et mentionne le code groupe 195529.",
    hotelPhoneLabel: "Téléphone",
    hotelOnlineLabel: "Réservation en ligne",
    hotelCodeLabel: "Code groupe",
    edit: "Modifier ma réponse",
    farewell: "Avec amour, Amanda & Étienne",
  },
  en: {
    subject: "Your RSVP confirmation — Amanda & Étienne",
    hello: "Hello",
    declineOnly:
      "This confirms your response that you will not be attending. We are sorry to hear that.",
    introYes:
      "Thank you for confirming your attendance at our wedding. Here is a recap of your response.",
    introNo: "We received your message. Here is a recap of your response.",
    summary: "Summary",
    attending: "Attendance",
    meal: "Meal",
    allergies: "Allergies / restrictions",
    message: "Message",
    none: "Not provided",
    noCompanions: "No companion listed.",
    companions: "Companions",
    companionAttendance: "Attendance",
    companionMeal: "Meal",
    companionRestrictions: "Restrictions",
    hotelTitle: "Recommended accommodation",
    hotelIntro:
      "To book at Hôtel Rive Gauche: call 450-467-4477 or book online and mention the group code 195529.",
    hotelPhoneLabel: "Phone",
    hotelOnlineLabel: "Online booking",
    hotelCodeLabel: "Group code",
    edit: "Edit my response",
    farewell: "With love, Amanda & Étienne",
  },
};

const hotelPhone = "450-467-4477";
const hotelBookingUrl = "https://www.hotelrivegauche.ca/fr/reservations#/room";
const hotelGroupCode = "195529";
type Lang = "fr" | "en";

const resolveLang = (value: string | null | undefined): Lang =>
  value === "en" ? "en" : "fr";

const formatAttendance = (value: boolean | null, lang: "fr" | "en") => {
  if (value === true) return attendanceLabels[lang].yes;
  if (value === false) return attendanceLabels[lang].no;
  return attendanceLabels[lang].pending;
};

const formatMeal = (value: string | null, lang: "fr" | "en") => {
  if (!value) return copyByLang[lang].none;
  return mealLabels[lang][value] || copyByLang[lang].none;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

type ParticipantRow = Database["public"]["Tables"]["awnsers"]["Row"];

const buildHtml = (participant: ParticipantRow) => {
  const lang = resolveLang(participant.lang);
  const copy = copyByLang[lang];
  const inviteUrl = `${siteUrl}/?id=${encodeURIComponent(participant.id)}${participant.lang ? `&lang=${participant.lang}` : ""}`;

  if (participant.attending === false) {
    return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${copy.subject}</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f7f4ef; color:#1f1a17;">
  <div style="max-width:660px; margin:0 auto; padding:28px 20px;">
    <div style="background:#ffffff; border:1px solid #eadfd2; border-radius:18px; padding:26px 22px; box-shadow:0 12px 30px rgba(0,0,0,0.06);">
      <p style="margin:0 0 12px; font-size:15px; color:#1f1a17;">${copy.hello} ${escapeHtml(
        participant.full_name,
      )},</p>
      <p style="margin:0; font-size:15px; line-height:1.6; color:#312820;">${copy.declineOnly}</p>
    </div>
  </div>
</body>
</html>`;
  }

  const accompanists = Array.isArray(participant.accompanists)
    ? participant.accompanists
    : [];

  const companionsList =
    accompanists.length === 0
      ? `<p style="margin:0 0 12px; color:#444;">${copy.noCompanions}</p>`
      : `<ul style="padding-left:18px; margin:6px 0 14px; color:#1f1a17;">${accompanists
          .map((companion) => {
            const attendance = formatAttendance(
              companion.attending ?? null,
              lang,
            );
            const meal = formatMeal(companion.meal || null, lang);
            const restrictions = companion.restrictions?.trim();
            return `<li style="margin-bottom:10px;"><strong>${escapeHtml(
              companion.fullName,
            )}</strong><br/><span style="color:#555;">${copy.companionAttendance}: ${attendance}</span><br/><span style="color:#555;">${copy.companionMeal}: ${meal}</span><br/><span style="color:#555;">${copy.companionRestrictions}: ${escapeHtml(
              restrictions || copy.none,
            )}</span></li>`;
          })
          .join("")}</ul>`;

  const allergies = participant.allergies?.trim();
  const message = participant.message?.trim();

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${copy.subject}</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f7f4ef; color:#1f1a17;">
  <div style="max-width:660px; margin:0 auto; padding:28px 20px;">
    <div style="background:#ffffff; border:1px solid #eadfd2; border-radius:18px; padding:26px 22px; box-shadow:0 12px 30px rgba(0,0,0,0.06);">
      <p style="margin:0 0 12px; font-size:15px; color:#1f1a17;">${copy.hello} ${escapeHtml(
        participant.full_name,
      )},</p>
      <p style="margin:0 0 20px; font-size:15px; line-height:1.6; color:#312820;">${
        participant.attending ? copy.introYes : copy.introNo
      }</p>

      <h2 style="margin:0 0 10px; font-size:18px; color:#1f1a17;">${copy.summary}</h2>
      <div style="border:1px solid #eadfd2; border-radius:14px; padding:14px 14px 6px; margin-bottom:18px; background:#fdfaf5;">
        <p style="margin:0 0 10px; color:#1f1a17;"><strong>${copy.attending}:</strong> ${formatAttendance(
          participant.attending,
          lang,
        )}</p>
        <p style="margin:0 0 10px; color:#1f1a17;"><strong>${copy.meal}:</strong> ${formatMeal(
          participant.meal_choice,
          lang,
        )}</p>
        <p style="margin:0 0 10px; color:#1f1a17;"><strong>${copy.allergies}:</strong> ${escapeHtml(
          allergies || copy.none,
        )}</p>
        <p style="margin:0 0 10px; color:#1f1a17;"><strong>${copy.message}:</strong> ${escapeHtml(
          message || copy.none,
        )}</p>
      </div>

      <h3 style="margin:0 0 8px; font-size:16px; color:#1f1a17;">${copy.companions}</h3>
      ${companionsList}

      <h3 style="margin:12px 0 8px; font-size:16px; color:#1f1a17;">${copy.hotelTitle}</h3>
      <p style="margin:0 0 10px; color:#312820; line-height:1.5;">${copy.hotelIntro}</p>
      <p style="margin:0 0 6px; color:#1f1a17;"><strong>${copy.hotelPhoneLabel}:</strong> <a href="tel:${hotelPhone}" style="color:#1f1a17;">${hotelPhone}</a></p>
      <p style="margin:0 0 6px; color:#1f1a17;"><strong>${copy.hotelOnlineLabel}:</strong> <a href="${hotelBookingUrl}" style="color:#1f1a17;">${hotelBookingUrl}</a></p>
      <p style="margin:0 0 16px; color:#1f1a17;"><strong>${copy.hotelCodeLabel}:</strong> ${hotelGroupCode}</p>

      <div style="margin:18px 0 10px;">
        <a href="${inviteUrl}" style="display:inline-block; background:#1f1a17; color:#ffffff; text-decoration:none; padding:12px 16px; border-radius:10px; font-size:14px;">${copy.edit}</a>
      </div>

      <p style="margin:18px 0 0; color:#312820; font-size:14px;">${copy.farewell}</p>
    </div>
  </div>
</body>
</html>`;
};

type ConfirmPayload = { participantId?: string };

export async function POST(req: Request) {
  let payload: ConfirmPayload | null = null;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const participantId = payload?.participantId;
  if (!participantId) {
    return NextResponse.json(
      { error: "Identifiant de participant manquant." },
      { status: 400 },
    );
  }

  const { data: participant, error } = await supabase
    .from("awnsers")
    .select("*")
    .eq("id", participantId)
    .maybeSingle();

  if (error || !participant) {
    return NextResponse.json(
      { error: "Participant introuvable." },
      { status: 404 },
    );
  }

  if (!participant.email) {
    return NextResponse.json(
      { error: "Aucune adresse courriel enregistrée pour cet invité." },
      { status: 400 },
    );
  }

  const lang = resolveLang(participant.lang);
  const copy = copyByLang[lang];

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [participant.email],
      subject: copy.subject,
      html: buildHtml(participant),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Échec de l'envoi de la confirmation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
