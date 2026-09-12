import nodemailer from "nodemailer";

/* the composer posts here; this sends the note on to suhana's inbox.
   it goes out through gmail's smtp with an app password, so nothing
   opens on the visitor's side — the two secrets live in vercel's env,
   never in the repo. without them the route says so rather than
   pretending. */
export const runtime = "nodejs";

const TO = "suhanagrewal0407@gmail.com";
const MAX = 1000;

export async function POST(req: Request) {
  let message: unknown;
  try {
    ({ message } = await req.json());
  } catch {
    return Response.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim() || message.length > MAX) {
    return Response.json({ ok: false, error: "bad message" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return Response.json({ ok: false, error: "mail not configured" }, { status: 503 });
  }

  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transport.sendMail({
      from: `"suhanagrewal.work" <${user}>`,
      to: TO,
      subject: "hi from your website",
      text: message.trim(),
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[message] send failed:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: "send failed" }, { status: 502 });
  }
}
