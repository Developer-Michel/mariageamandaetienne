import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
const recommendationRecipient = "guy.belliveau@teska.ca";
const recommendationSubject = "wedding amanda etienne song recommendation";

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is missing.");
}

const resend = new Resend(resendApiKey);

type MusicRecommendationRequest = {
  songName?: string;
  recommendedBy?: string;
};

export async function POST(req: Request) {
  let payload: MusicRecommendationRequest | null = null;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const songName = payload?.songName?.trim();
  const recommendedBy = payload?.recommendedBy?.trim();

  if (!songName || !recommendedBy) {
    return NextResponse.json(
      { error: "Song name and recommender name are required." },
      { status: 400 },
    );
  }

  const html = `
    <h2>New music recommendation</h2>
    <p><strong>Song:</strong> ${songName}</p>
    <p><strong>Recommended by:</strong> ${recommendedBy}</p>
  `;

  const text = `New music recommendation\nSong: ${songName}\nRecommended by: ${recommendedBy}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recommendationRecipient,
      subject: recommendationSubject,
      html,
      text,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send recommendation email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unexpected error while sending recommendation.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
