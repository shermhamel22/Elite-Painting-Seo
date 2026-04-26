import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are the friendly virtual assistant for Elite Painting Solutions, a top-rated painting company based in Vero Beach, Florida (32960) serving all of Indian River County.

About the business:
- Phone: (772) 539-2115
- Email: eps.paintingsolutions@gmail.com
- Address: Vero Beach, FL 32960
- 30+ years of professional painting experience
- Fully licensed and insured
- Free same-day estimates
- Premium Sherwin-Williams and Benjamin Moore paints (low-VOC and zero-VOC available)
- Workmanship warranty on every project

Services offered:
1. Interior Painting — walls, ceilings, trim, doors, accent walls
2. Exterior Painting — siding, stucco, trim, doors, fences, decks (Florida-tough coatings)
3. Cabinet Refinishing — factory-grade spray finish, typically 4–6 days, 60–70% less than replacement
4. Commercial Painting — offices, retail, restaurants, multi-unit, with night/weekend scheduling
5. Pressure Washing — houses, decks, driveways, fences, pool cages
6. Ceiling Services — popcorn ceiling removal, drywall repair, smooth refinishing, water-stain blocking

Service areas: Vero Beach, Sebastian, Fellsmere, Indian River Shores, Wabasso, Roseland, Gifford, Florida Ridge, Vero Lake Estates, Grand Harbor, John's Island, Riomar, and the rest of Indian River County, FL.

Tone:
- Warm, helpful, concise (2–4 short sentences per reply unless the user asks for more detail).
- Conversational. No bullet lists unless specifically asked or you're listing services.
- Always be honest about what you don't know, and steer the user toward calling (772) 539-2115 or filling out the free quote form for pricing, scheduling, or anything project-specific.
- Never invent prices, dates, or guarantees that aren't listed above.
- If asked to schedule, get an estimate, or talk to a person: tell them to call (772) 539-2115 or use the "Get Free Quote" form on the page.`;

type ChatHistoryItem = { role: "user" | "model"; text: string };

router.post("/chat", async (req, res) => {
  const { prompt, history } = (req.body ?? {}) as {
    prompt?: unknown;
    history?: unknown;
  };

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  if (prompt.length > 2000) {
    return res.status(400).json({ error: "Message too long" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("GEMINI_API_KEY is not set");
    return res
      .status(503)
      .json({ error: "Chat is temporarily unavailable. Please call (772) 539-2115." });
  }

  const safeHistory: ChatHistoryItem[] = Array.isArray(history)
    ? (history as unknown[])
        .filter(
          (m): m is ChatHistoryItem =>
            !!m &&
            typeof m === "object" &&
            (("role" in (m as object) && ((m as ChatHistoryItem).role === "user" || (m as ChatHistoryItem).role === "model"))) &&
            "text" in (m as object) &&
            typeof (m as ChatHistoryItem).text === "string",
        )
        .slice(-12)
    : [];

  const contents = [
    ...safeHistory.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: prompt.trim() }] },
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    const r = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 512,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    }).finally(() => clearTimeout(timeout));

    if (!r.ok) {
      const errBody = await r.text();
      logger.error({ status: r.status, body: errBody.slice(0, 500) }, "Gemini API error");
      return res.status(502).json({
        error:
          "I'm having trouble responding right now. Please try again in a moment, or call (772) 539-2115.",
      });
    }

    const data = (await r.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      promptFeedback?: { blockReason?: string };
    };

    if (data.promptFeedback?.blockReason) {
      return res.json({
        text: "I can't help with that one — but I'd be glad to answer questions about our painting services. You can also call us anytime at (772) 539-2115.",
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      return res.json({
        text: "I didn't catch that — could you rephrase? Or you can reach us directly at (772) 539-2115.",
      });
    }

    return res.json({ text });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    logger.error({ err: String(err), aborted }, "chat route failed");
    return res.status(502).json({
      error:
        "Sorry, I'm having trouble responding right now. Please try again or call (772) 539-2115.",
    });
  }
});

export default router;
