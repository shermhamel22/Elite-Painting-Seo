import { Router, type IRouter } from "express";
import { sendQuoteEmail } from "../lib/sendQuoteEmail";

const router: IRouter = Router();

const QUOTE_RECIPIENT = "sprintfast2xx@gmail.com";

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

  try {
    await sendQuoteEmail({
      to: QUOTE_RECIPIENT,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      source: typeof source === "string" ? source : "Quote Form",
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
