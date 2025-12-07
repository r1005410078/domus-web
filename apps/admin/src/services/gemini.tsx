import { GoogleGenAI, Type } from "@google/genai";
import { PropertyData } from "@/components/QuickNote/types";
import apiClient, { ResponseBody } from "./http";

const GEMINI_API_KEY =
  process.env.API_KEY || "sk-mH6M90p4io1JreghOnvnQ5Cq6PqegWW5IxIf9rUnzShoiBI5";

export const processPropertyInput = async (
  textInput: string
): Promise<PropertyData[]> => {
  const res = await apiClient.post<ResponseBody<PropertyData[]>>(
    "/api/gemini/processPropertyInput",
    { textInput }
  );

  return res.data.data;
};

/**
 * Extracts text from audio (transcription) or image (OCR/Description)
 */
export const extractTextFromMedia = async (
  mediaBlob: Blob,
  mimeType: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", mediaBlob, mimeType);

    const res = await apiClient.post<ResponseBody<string>>(
      "/api/gemini/extractTextFromMedia",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.data || "";
  } catch (error) {
    console.error("Gemini Media Extraction Error:", error);
    throw error;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64!);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
