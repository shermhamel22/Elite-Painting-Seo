import { Router, type IRouter } from "express";
import { sendQuoteEmail, sendQuoteSmsViaGateway } from "../lib/sendQuoteEmail";

const router: IRouter = Router();

// Email recipients that always get a copy of every quote request.
// Override with QUOTE_EMAIL_TO env var (comma-separated). Default falls
// back to the Resend account's verified signup email so this works out of
// the box on the Resend free tier (which only delivers to your own email
// until you verify a domain).
const QUOTE_EMAIL_RECIPIENTS = (
  process.env["QUOTE_EMAIL_TO"] || "sherm3@mailfence.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// US phone number that should receive an SMS for every quote request, via
// carrier email-to-SMS gateways. Best effort — wrong-carrier copies bounce
// silently, the matching carrier delivers a regular text message.
// Requires a verified domain on Resend (set RESEND_FROM) for the gateway
// addresses to be accepted.
const QUOTE_SMS_PHONE = process.env["QUOTE_SMS_PHONE"] || "3214629989";

router.post("/quote", async (req, res) => {
  const { name, phone, message, source } = req.body ?? {};

  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !phone.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    return res.status(400).json({ error: "Phone must be 10 digits" });
  }

  const sourceLabel = typeof source === "string" ? source : "Quote Form";

  try {
    // Email is the primary, reliable delivery channel.
    await sendQuoteEmail({
      to: QUOTE_EMAIL_RECIPIENTS,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      source: sourceLabel,
    });

    // Best-effort SMS to the owner's phone via carrier gateways. Don't fail
    // the whole request if this side channel fails.
    sendQuoteSmsViaGateway({
      phoneDigits: QUOTE_SMS_PHONE,
      name: name.trim(),
      callerPhone: phone.trim(),
      message: message.trim(),
      source: sourceLabel,
    }).catch((err) => {
      req.log.warn({ err }, "SMS gateway notification failed");
    });

    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send quote email");
    return res
      .status(500)
      .json({ error: "Could not send your request right now." });
  }
});

export default router;
