import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { language, scriptType } = req.body || {};

    if (!language || !scriptType) {
      return res.status(400).json({
        error: "Language or script type is missing."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured in Vercel."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are a professional movie recap script writer.

Create a ${scriptType} script.

Language: ${
      language === "myanmar"
        ? "Burmese (Myanmar)"
        : "English"
    }

Write an engaging, natural script suitable for voice-over.
Use clear storytelling and easy-to-understand language.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt
    });

    return res.status(200).json({
      script: response.output_text
    });

  } catch (error) {

    console.error("OpenAI Error:", error);

    return res.status(500).json({
      error: error?.message || "Unknown OpenAI API error."
    });
  }
}
