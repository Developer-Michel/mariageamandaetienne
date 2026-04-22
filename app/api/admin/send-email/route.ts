import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
const defaultSubject = "Mariage Amanda & Étienne - 22 août 2026";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amandaetienne.ca";
const defaultMessage =
  "Merci d'avoir confirmé ta présence. Nous partagerons les détails pratiques très bientôt. Si tu as des questions, réponds simplement à ce message.";

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

const storageBaseUrl = `${supabaseUrl}/storage/v1/object/public/wedding/Main`;
const iconUrl = `${storageBaseUrl}/icon.png`;
const logoUrl = `${storageBaseUrl}/logo-ae.PNG`;

const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type SendEmailRequest = {
  recipients?: string[];
  names?: string[];
  participantIds?: string[];
  participants?: { id: string; name?: string; lang?: string }[];
  subject?: string;
  message?: string;
};

const buildHtml = (opts: {
  name?: string;
  lang?: string;
  inviteUrl: string;
  iconUrl: string;
  logoUrl: string;
}) => {
  const isEn = opts.lang === "en";
  const name = opts.name || (isEn ? "friend" : "ami(e)");

  const copy = {
    headline: isEn ? "Invitation" : "Invitation",
    subtitle: isEn
      ? `Dear <strong>${name}</strong>,<br/>We are thrilled to invite you to our wedding celebration.`
      : `Chèr(e) <strong>${name}</strong>,<br/>Nous avons la joie de t’inviter à célébrer notre mariage.`,
    date: isEn ? "Saturday, August 22, 2026" : "Samedi 22 Août 2026",
    time: isEn
      ? "Arrival: 14:45 PM • Ceremony: 15:30 PM"
      : "Arrivée : 14h45 • Cérémonie : 15h30",
    venueTitle: "Mouton Village",
    venueAddress: "12 Chem. des Patriotes, Saint-Charles-sur-Richelieu, QC",
    dressCode: isEn ? "Cocktail / Chic" : "Élégant / Cocktail",
    gift: isEn ? "Cash only" : "Argent comptant seulement",
    cocktail: isEn ? "Cocktail" : "Cocktail",
    dinner: isEn ? "Dinner" : "Souper",
    party: isEn ? "Party" : "Soirée",
    rsvp: isEn
      ? "Continue to the website to confirm the invitation"
      : "Continuer vers le site pour confirmer l'invitation",
    fallback: isEn
      ? "If the button does not work, copy this link:"
      : "Si le bouton ne fonctionne pas, copie-colle ce lien :",
    note: isEn
      ? "Please reply at least six weeks before the wedding (by July 11, 2026) and include any allergies or dietary needs."
      : "Merci de répondre au moins six semaines avant le mariage (d’ici le 11 juillet 2026) et d’indiquer allergies ou restrictions alimentaires.",
    footerLove: isEn ? "With love" : "Avec amour",
  };

  return `<!doctype html>
<html lang="${isEn ? "en" : "fr"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Invitation — Amanda & Étienne</title>
  <style>
    body { margin:0; padding:0; background:#ffffff; font-family: "Times New Roman", Georgia, serif; color:#1f1a17; }
    .wrapper { width:100%; padding:32px 14px; background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.84)), url('${storageBaseUrl}/5.JPG') center/cover no-repeat; }
    .card { max-width: 680px; margin: 0 auto; background: rgba(255, 255, 255, 0.2); border: 1px solid #e8e0d6; border-radius: 20px; overflow: hidden; box-shadow: 0 14px 38px rgba(17, 12, 8, 0.08); }
    .topbar { height: 10px; background: linear-gradient(90deg,#1f1a17,#3c2e27,#1f1a17); }
    .content { padding: 38px 30px 30px; text-align:center; color:#1f1a17; }
    .brand { display:flex; align-items:center; justify-content:center; gap:16px; margin: 10px auto 22px; }
    .icon { width: 56px; height: 56px; border-radius: 14px; border: 1px solid #e8e0d6; padding: 8px; object-fit: cover; box-shadow: 0 6px 18px rgba(0,0,0,0.06); background:#fff; }
    .logo { width: 180px; height: auto; display:block; }
    .kicker { letter-spacing: 0.16em; text-transform: uppercase; font-size: 12px; color:#7a6f64; margin: 0 0 12px; }
    h1 { margin: 0 0 12px; font-size: 36px; font-weight: 600; color:#1f1a17; }
    .subtitle { margin: 0 0 24px; font-size: 16px; color:#3b3129; line-height: 1.65; }
    .divider { width: 120px; height: 1px; background: #e6ddd2; margin: 20px auto; }
    .details { margin: 20px auto 12px; max-width: 540px; text-align: left; border: 1px solid #e9dfd4; border-radius: 16px; padding: 18px 18px 10px; }
    .row { display:flex; gap: 14px; padding: 10px 0; border-bottom: 1px solid #e9dfd4; color:#1f1a17; }
    .row:last-child { border-bottom:none; }
    .label { width: 110px; color:#7a6f64; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; }
    .value { flex:1; color:#1f1a17; font-size: 15px; line-height: 1.55; }
    .pill { display:inline-block; border: 1px solid #e6ddd2; border-radius: 999px; padding: 10px 14px; margin: 12px 6px 0; font-size: 14px; color:#1f1a17; background:#fff; box-shadow: 0 6px 18px rgba(0,0,0,0.04); }
    .cta-wrap { margin: 24px 0 12px; }
    .cta { display:inline-block; background:#1f1a17; color:#fff !important; text-decoration:none; padding: 14px 20px; border-radius: 12px; font-size: 15px; letter-spacing: 0.02em; box-shadow: 0 10px 24px rgba(31,26,23,0.18); }
    .cta:hover { background:#2b241f; }
    .note { margin: 16px 0 0; font-size: 13px; color:#6f655b; line-height: 1.65; }
    .footer { padding: 18px 18px 24px; text-align:center; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color:#4d443c; background:#f7f1e8; }
    .smalllink { color:#2b241f; text-decoration: underline; }
    @media (max-width: 480px) { .content { padding: 30px 18px 24px; } h1 { font-size: 30px; } .label { width: 92px; } .row { display:block; } .label { margin-bottom: 4px; } }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="card">
      <div class="topbar"></div>

      <div class="content">
        <div class="brand">
          <img class="icon" src="${opts.iconUrl}" alt="Amanda et Étienne" />
        </div>

        <p class="kicker">${copy.headline}</p>
        <h1>Amanda & Étienne</h1>
        <p class="subtitle">${copy.subtitle}</p>

        <div class="divider"></div>

        <div class="details">
          <div class="row">
            <div class="label">${isEn ? "Date" : "Date"}</div>
            <div class="value"><strong>${copy.date}</strong></div>
          </div>
          <div class="row">
            <div class="label">${isEn ? "Time" : "Heure"}</div>
            <div class="value">${copy.time}</div>
          </div>
          <div class="row">
            <div class="label">${isEn ? "Venue" : "Lieu"}</div>
            <div class="value">
              <strong>${copy.venueTitle}</strong><br/>
              ${copy.venueAddress}<br/>
              Saint-Charles-sur-Richelieu, QC
            </div>
          </div>
          <div class="row">
            <div class="label">${isEn ? "Dress code" : "Tenue"}</div>
            <div class="value">${copy.dressCode}</div>
          </div>
        </div>


        <div class="cta-wrap">
          <a class="cta" href="${opts.inviteUrl}" target="_blank" rel="noopener">${copy.rsvp}</a>
        </div>

        <p class="note">${copy.note}</p>
      </div>

      <div class="footer">
        ${copy.fallback}<br/>
        <a class="smalllink" href="${opts.inviteUrl}" target="_blank" rel="noopener">${opts.inviteUrl}</a>
        <br/><br/>
        ${copy.footerLove}, <strong>Amanda & Étienne</strong>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export async function POST(req: Request) {
  let payload: SendEmailRequest | null = null;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const recipients = Array.isArray(payload?.recipients)
    ? payload!.recipients.filter(
        (email) => typeof email === "string" && email.includes("@"),
      )
    : [];

  const participantsMeta = Array.isArray(payload?.participants)
    ? payload!.participants
    : [];

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "Aucun destinataire fourni." },
      { status: 400 },
    );
  }

  const subject =
    payload?.subject && payload.subject.trim().length > 0
      ? payload.subject.trim()
      : defaultSubject;
  const message =
    payload?.message && payload.message.trim().length > 0
      ? payload.message.trim()
      : defaultMessage;

  const participantIds = Array.isArray(payload?.participantIds)
    ? payload!.participantIds.filter((id) => typeof id === "string" && id)
    : participantsMeta
        .map((p) => p.id)
        .filter((id) => typeof id === "string" && id);

  const markEmailStatus = async (status: boolean | null) => {
    if (participantIds.length === 0) return;
    await supabase
      .from("awnsers")
      .update({ email_sent_success: status })
      .in("id", participantIds);
  };

  const primaryParticipant = participantsMeta[0];
  const inviteUrl = `${siteUrl}/?id=${encodeURIComponent(primaryParticipant?.id || "")}${primaryParticipant?.lang ? `&lang=${encodeURIComponent(primaryParticipant.lang)}` : ""}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject,
      html: buildHtml({
        name: primaryParticipant?.name || payload?.names?.[0],
        lang: primaryParticipant?.lang,
        inviteUrl,
        iconUrl,
        logoUrl,
      }),
    });

    if (error) {
      await markEmailStatus(false);
      return NextResponse.json(
        { error: error.message || "Échec de l'envoi de l'email." },
        { status: 500 },
      );
    }

    await markEmailStatus(true);
    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    await markEmailStatus(false);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Échec inattendu de l'envoi de l'email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
