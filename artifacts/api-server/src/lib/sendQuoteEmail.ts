import { Resend } from "resend";

interface QuoteEmailParams {
  to: string | string[];
  name: string;
  phone: string;
  message: string;
  source: string;
}

interface QuoteSmsParams {
  phoneDigits: string;
  name: string;
  callerPhone: string;
  message: string;
  source: string;
}

const escapeHtml = (raw: string) =>
  raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getResend = () => {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it as a Replit secret to enable outbound email/SMS.",
    );
  }
  return new Resend(apiKey);
};

const getFromAddress = () =>
  process.env["RESEND_FROM"] ||
  "Elite Painting Solutions <onboarding@resend.dev>";

export const sendQuoteEmail = async ({
  to,
  name,
  phone,
  message,
  source,
}: QuoteEmailParams) => {
  const resend = getResend();
  const from = getFromAddress();

  const recipients = Array.isArray(to) ? to : [to];
  const subject = `New quote request — ${name}`;

  const text = [
    `New quote request from the website.`,
    ``,
    `Name:    ${name}`,
    `Phone:   ${phone}`,
    `Source:  ${source}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="margin: 0 0 12px; color: #111;">New quote request</h2>
      <p style="margin: 0 0 16px; color: #555;">Came in from the website (${escapeHtml(source)}).</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 12px; background: #f4f4f5; font-weight: 700; width: 110px;">Name</td>
          <td style="padding: 8px 12px; background: #fafafa;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f4f4f5; font-weight: 700;">Phone</td>
          <td style="padding: 8px 12px; background: #fafafa;">
            <a href="tel:${escapeHtml(phone.replace(/\D/g, ""))}" style="color: #111; text-decoration: underline;">${escapeHtml(phone)}</a>
          </td>
        </tr>
      </table>
      <h3 style="margin: 0 0 8px; color: #111;">Message</h3>
      <div style="white-space: pre-wrap; padding: 12px 16px; background: #fafafa; border-left: 3px solid #facc15; border-radius: 4px;">${escapeHtml(message)}</div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to: recipients,
    subject,
    text,
    html,
    replyTo: phone ? undefined : undefined,
  });

  if (error) {
    throw new Error(
      `Resend send failed: ${error.name || "error"} — ${error.message || JSON.stringify(error)}`,
    );
  }
};

/**
 * Send a short text-friendly notification to a US phone number using
 * carrier email-to-SMS gateways. Carrier-unknown numbers are blasted to
 * every major gateway; the wrong-carrier copies bounce silently and the
 * matching carrier delivers as a regular text.
 *
 * REQUIREMENT: Resend domain verification. Without a verified domain the
 * Resend free tier only sends to your account's signup email, so the
 * gateway addresses below are rejected. Verify your domain (e.g.
 * elitepaintingsolutions.com) in the Resend dashboard for SMS to flow.
 *
 * Best-effort: do NOT throw here, the calling route swallows failures.
 */
export const sendQuoteSmsViaGateway = async ({
  phoneDigits,
  name,
  callerPhone,
  message,
  source,
}: QuoteSmsParams) => {
  const resend = getResend();
  const from = getFromAddress();

  const ten = phoneDigits.replace(/\D/g, "").slice(-10);
  if (ten.length !== 10) return;

  const gateways = [
    "txt.att.net", // AT&T (SMS)
    "tmomail.net", // T-Mobile / Sprint (SMS+MMS)
    "vtext.com", // Verizon (legacy SMS)
    "vzwpix.com", // Verizon (MMS, current path)
    "messaging.sprintpcs.com", // legacy Sprint
    "sms.myboostmobile.com", // Boost
    "sms.cricketwireless.net", // Cricket
    "mymetropcs.com", // Metro PCS
    "email.uscc.net", // US Cellular
    "msg.fi.google.com", // Google Fi
    "vmobl.com", // Virgin
  ];

  const trimmed = message.trim().replace(/\s+/g, " ").slice(0, 220);
  const subject = `Quote: ${name}`.slice(0, 50);
  const body = [
    `New quote request`,
    `Name: ${name}`,
    `Tel:  ${callerPhone}`,
    `Src:  ${source}`,
    ``,
    trimmed,
  ].join("\n");

  await Promise.allSettled(
    gateways.map((gw) =>
      resend.emails.send({
        from,
        to: `${ten}@${gw}`,
        subject,
        text: body,
      }),
    ),
  );
};
