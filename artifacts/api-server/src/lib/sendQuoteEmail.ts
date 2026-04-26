import { getUncachableGmailClient } from "./gmailClient";

interface QuoteEmailParams {
  to: string;
  name: string;
  phone: string;
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
  html: string;
}) => {
  const boundary = `----=_Part_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
  const encodedSubject = `=?utf-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;

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
  const fromAddress = profile.data.emailAddress ?? to;

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

  const raw = buildRawMessage({
    to,
    from: fromAddress,
    subject,
    text,
    html,
  });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
};
