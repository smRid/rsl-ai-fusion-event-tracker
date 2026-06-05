import { GoogleGenAI } from "@google/genai";
import { FUSION_EXTRACTION_PROMPT } from "./fusion-prompt";

export async function extractCalendarJsonFromImage({
  apiKey,
  base64Image,
  mimeType
}: {
  apiKey: string;
  base64Image: string;
  mimeType: string;
}): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: FUSION_EXTRACTION_PROMPT },
          {
            inlineData: {
              mimeType,
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  return response.text ?? "";
}
