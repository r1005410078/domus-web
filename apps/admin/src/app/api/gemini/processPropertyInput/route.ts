import { GoogleGenAI, Type } from "@google/genai";
import { PropertyData } from "@/components/QuickNote/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const GEMINI_API_KEY = process.env.API_KEY || "";

// Define the response schema for strict JSON output
// We now expect a root object containing an array of listings
const propertySchema = {
  type: Type.OBJECT,
  properties: {
    listings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          communityName: {
            type: Type.STRING,
            description:
              "Name of the residential community (e.g., 天通苑, 阳光花园)",
          },
          sale_price: {
            type: Type.NUMBER,
            description:
              "Price of the property for sale (e.g., 100000, 150000)",
          },
          sale_low_price: {
            type: Type.NUMBER,
            description:
              "Low price of the property for sale (e.g., 80000, 100000)",
          },
          rent_price: {
            type: Type.NUMBER,
            description:
              "Price of the property for rent (e.g., 100000, 150000)",
          },
          rent_low_price: {
            type: Type.NUMBER,
            description:
              "Low price of the property for rent (e.g., 80000, 100000)",
          },
          rentOrSale: {
            type: Type.STRING,
            enum: ["Rent", "Sale"],
            description: "Rent (出租) or Sale (出售)",
          },
          layout: {
            type: Type.OBJECT,
            properties: {
              room: {
                type: Type.NUMBER,
                description: "Number of rooms (e.g., 2)",
              },
              hall: {
                type: Type.NUMBER,
                description: "Number of halls (e.g., 1)",
              },
              bathroom: {
                type: Type.NUMBER,
                description: "Number of bathrooms (e.g., 1)",
              },
              terrace: {
                type: Type.NUMBER,
                description: "Number of terraces (e.g., 1)",
              },
            },
          },
          area: {
            type: Type.NUMBER,
            description: "Size of the property in square meters",
          },
          floor: {
            type: Type.NUMBER,
            description: "Floor level (e.g., 1, 5)",
          },
          orientation: {
            type: Type.STRING,
            description:
              "Facing direction (e.g., 东西|南北|东|南|西|北|金角|银角|南北通透)",
          },
          contactName: {
            type: Type.STRING,
            description: "Contact person name (e.g., 王先生)",
          },
          contactPhone: {
            type: Type.STRING,
            description: "Phone number extracted",
          },
          additionalNotes: {
            type: Type.STRING,
            description: "Any other details in Chinese",
          },
          address: {
            type: Type.STRING,
            description: "Complete address (e.g., 2栋2单元5O3室)",
          },
        },
        required: ["communityName", "rentOrSale"],
      },
    },
  },
};

export const processPropertyInput = async (
  textInput: string
): Promise<PropertyData[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const modelId = "gemini-2.5-flash";

  const parts: any[] = [];

  // 1. Add System Instruction / Prompt (Optimized for Chinese & Multiple Items)
  const prompt = `
    你是一个专业的房地产数据助手。
    请分析提供的输入（文本、图片或音频），提取房源关键信息。
    
    规则：
    1. 输入可能包含 **多个** 房源信息，请务必将它们全部分开提取。
    2. 如果缺少某个字段，请使用合理的默认值（例如空字符串或0）。
    3. rentOrSale 字段必须严格对应 "Rent" (出租/租房) 或 "Sale" (出售/卖房)。
    4. 如果是中文输入，提取的内容（如朝向、户型）请保持中文。
    5. 如果提供了音频，请先在内部转录音频内容，然后提取数据。
  `;

  if (textInput) {
    parts.push({ text: prompt + `\n\n用户描述: ${textInput}` });
  } else {
    parts.push({ text: prompt });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: propertySchema,
        httpOptions: {
          baseUrl: "https://api.openai-proxy.org/google",
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");

    const parsedResponse = JSON.parse(jsonText);

    if (parsedResponse && Array.isArray(parsedResponse.listings)) {
      return parsedResponse.listings;
    }

    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const BodySchema = z.object({
  textInput: z.string(),
});

/**
测试数据
瓜园小区，2栋2单元5O3室，面积123平方，三室两厅两卫，家电家具齐全，毫华装修，报价49.8万元。18255695238

联富花园，4栋205室，面积96平米，两室两厅，精装，家具齐全，报价46.8万元。18255695238

梦歺南苑，7号楼二单元，203室，面积111平方，三室二厅一卫，毫华装修，家电家具齐全，还有平台，报价56.8万元。18255695238

金星小区，15栋502室，面积137平方，三室二厅二卫，毫华装修，家具齐全，报价49.8万元。18255695238
 */
export async function POST(req: Request) {
  const json = await req.json();
  const body = BodySchema.parse(json);

  try {
    const res = await processPropertyInput(body.textInput);
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
