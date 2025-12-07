import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.API_KEY || "";

/**
 * Extracts text from audio (transcription) or image (OCR/Description)
 */
const extractTextFromMedia = async (
  mediaBlob: Buffer,
  mimeType: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const modelId = "gemini-2.5-flash-image";
  const base64Data = mediaBlob.toString("base64");

  const prompt = mimeType.startsWith("audio")
    ? "Please transcribe this audio accurately into text. Output ONLY the transcription, no additional commentary."
    : "Please analyze this image. If it contains text (like a flyer or screenshot), extract all text. If it is a photo of a property, describe the key visual details (e.g., layout, style, condition) that would be useful for a listing description. Output ONLY the extracted text or description.";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        httpOptions: {
          baseUrl: "https://api.openai-proxy.org/google",
        },
      },
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Media Extraction Error:", error);
    throw error;
  }
};

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const res = await extractTextFromMedia(buffer, file.type);
    return NextResponse.json({
      data: res,
    });
  } catch (error: Error | any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
