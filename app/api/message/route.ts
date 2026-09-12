import nodemailer from "nodemailer";
import { put } from "@vercel/blob";

/* the composer posts here. two independent ways the note reaches
   suhana, and it only counts as lost if both are unavailable:
     1. archive — written to the project's blob store the moment it
        arrives (BLOB_READ_WRITE_TOKEN, added by connecting a store in
        the vercel dashboard). readable there any time, even if mail
        is down or never configured.
     2. mail — sent on to her gmail through smtp with an app password
        (GMAIL_USER / GMAIL_APP_PASSWORD in vercel's env).
   secrets live in vercel's environment, never in the repo. */
export const runtime = "nodejs";

const TO = "suhanagrewal0407@gmail.com";
const MAX = 1000;

async function archive(message: string): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await put(`messages/${stamp}.txt`, `${new Date().toISOString()}\n\n${message}\n`, {
      access: "private",
      contentType: "text/plain; charset=utf-8",
    });
    return true;
  } catch (err) {
    console.error("[message] archive failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

async function mail(message: string): Promise<boolean> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;
  try {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transport.sendMail({
      from: `"suhanagrewal.work" <${user}>`,
      to: TO,
      subject: "hi from your website",
      text: message,
    });
    return true;
  } catch (err) {
    console.error("[message] mail failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

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
  const text = message.trim();

  // a trace in the function logs too, for the window vercel keeps them
  console.log("[message] received:", JSON.stringify(text));

  const [archived, mailed] = await Promise.all([archive(text), mail(text)]);
  if (archived || mailed) return Response.json({ ok: true, archived, mailed });
  return Response.json({ ok: false, error: "no delivery path configured" }, { status: 503 });
}
