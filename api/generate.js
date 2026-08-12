import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { language, scriptType } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are a professional movie recap script writer.

Write a ${scriptType} script.

Language: ${language === "myanmar" ? "Burmese (Myanmar)" : "English"}

Make the script engaging, natural, and suitable for voice-over.
Use clear storytelling.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt
    });

    return res.status(200).json({
      script: response.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "AI script generation failed."
    });
  }
  }
