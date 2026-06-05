import { NextResponse } from "next/server";
import { extractCalendarJsonFromImage } from "@/lib/gemini";
import { normalizeExtractedFusion } from "@/lib/fusion-schema";

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return jsonError("Missing GEMINI_API_KEY on the server.", 500);
  }

  let image: FormDataEntryValue | null = null;
  try {
    const formData = await request.formData();
    image = formData.get("image");
  } catch {
    return jsonError("Could not read the uploaded image.", 400);
  }

  if (!(image instanceof File)) {
    return jsonError("No image was uploaded.", 400);
  }

  if (!image.type.startsWith("image/")) {
    return jsonError("Please upload a valid image file.", 400);
  }

  if (image.size > MAX_IMAGE_SIZE) {
    return jsonError("Image must be under 20MB.", 400);
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const rawText = await extractCalendarJsonFromImage({
      apiKey,
      base64Image: buffer.toString("base64"),
      mimeType: image.type
    });
    const parsed = parseJsonOnly(rawText);
    const tracker = normalizeExtractedFusion(parsed);

    if (tracker.events.length === 0) {
      return jsonError("AI could not detect events from this calendar. Try a clearer image.", 422);
    }

    return NextResponse.json(tracker);
  } catch (error) {
    const message = error instanceof SyntaxError
      ? "AI returned invalid JSON. Try a clearer official calendar image."
      : "Gemini could not process this calendar image.";
    return jsonError(message, 500);
  }
}

function parseJsonOnly(text: string): unknown {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");
  return JSON.parse(trimmed);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}
