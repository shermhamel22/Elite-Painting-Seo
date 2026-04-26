import { getUncachableGmailClient } from "./gmailClient";

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

const buildRawMessage = ({
  to,
  from,
  subject,
  text,
  html,
}: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  const encodedSubject = `=?utf-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;

  if (!html) {
    const lines = [
      `To: ${to}`,
      `From: ${from}`,
      `Subject: ${encodedSubject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      text,
      "",
    ];
    return Buffer.from(lines.join("\r\n"), "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const boundary = `----=_Part_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
  const lines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
    `--${boundary}--`,
    "",
  ];

  return Buffer.from(lines.join("\r\n"), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const sendQuoteEmail = async ({
  to,
  name,
  phone,
  message,
  source,
}: QuoteEmailParams) => {
  const gmail = await getUncachableGmailClient();

  const profile = await gmail.users.getProfile({ userId: "me" });
  const fromAddress = profile.data.emailAddress ?? (Array.isArray(to) ? to[0] : to);

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

  const recipients = Array.isArray(to) ? to : [to];

  for (const recipient of recipients) {
    const raw = buildRawMessage({
      to: recipient,
      from: fromAddress,
      subject,
      text,
      html,
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
  }
};

/**
 * Send a short text-friendly notification to a US phone number using
 * carrier email-to-SMS gateways. Carrier-unknown numbers are blasted to
 * every major gateway; the wrong-carrier ones bounce silently and the
 * one matching the phone's carrier delivers as a regular text.
 *
 * This is a best-effort free fallback. For guaranteed delivery use Twilio
 * or another paid SMS API.
 */
export const sendQuoteSmsViaGateway = async ({
  phoneDigits,
  name,
  callerPhone,
  message,
  source,
}: QuoteSmsParams) => {
  const gmail = await getUncachableGmailClient();

  const profile = await gmail.users.getProfile({ userId: "me" });
  const fromAddress = profile.data.emailAddress ?? "noreply@example.com";

  // Normalize to last 10 digits.
  const ten = phoneDigits.replace(/\D/g, "").slice(-10);
  if (ten.length !== 10) return;

  // Common US carrier email-to-SMS gateways. We send to all of them; only
  // the carrier matching the destination phone delivers, others bounce.
  const gateways = [
    "txt.att.net", // AT&T (SMS)
    "tmomail.net", // T-Mobile / Sprint (SMS+MMS)
    "vtext.com", // Verizon (SMS, mostly retired but still routes for some)
    "vzwpix.com", // Verizon (MMS, currently the working path)
    "messaging.sprintpcs.com", // legacy Sprint
    "sms.myboostmobile.com", // Boost
    "sms.cricketwireless.net", // Cricket
    "mymetropcs.com", // Metro PCS
    "email.uscc.net", // US Cellular
    "msg.fi.google.com", // Google Fi
    "vmobl.com", // Virgin
  ];

  // Texts must be SHORT to fit in a single SMS segment.
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
    gateways.map((gw) => {
      const raw = buildRawMessage({
        to: `${ten}@${gw}`,
        from: fromAddress,
        subject,
        text: body,
      });
      return gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
      });
    }),
  );
};
