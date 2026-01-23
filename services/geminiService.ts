
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, HelpCenter } from "../types";

// Initialize Gemini API with the API key from environment variables exclusively
// DO NOT use || fallback as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING },
    category: { type: Type.STRING },
    score: { type: Type.NUMBER },
    explanation: { type: Type.STRING },
    flags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          reason: { type: Type.STRING },
          severity: { type: Type.STRING }
        },
        required: ["category", "reason", "severity"]
      }
    },
    education: {
      type: Type.OBJECT,
      properties: {
        scamDescription: { type: Type.STRING },
        dangerReason: { type: Type.STRING },
        safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["scamDescription", "dangerReason", "safetyTips", "redFlags"]
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        urgencyLevel: { type: Type.STRING },
        isFinancialThreat: { type: Type.BOOLEAN },
        isImpersonation: { type: Type.BOOLEAN },
        domainAge: { type: Type.STRING }
      },
      required: ["urgencyLevel", "isFinancialThreat", "isImpersonation"]
    },
  },
  required: ["status", "category", "score", "explanation", "flags", "metadata"],
};

export async function analyzeContent(content: string, type: 'text' | 'url'): Promise<AnalysisResult> {
  // Use gemini-3-flash-preview for general text tasks
  const model = 'gemini-3-flash-preview';
  const prompt = type === 'url' ? `Analyze this URL: ${content}` : `Analyze this text: ${content}`;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are PhishShield AI. Analyze and educate users on scams.",
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });
    // response.text is a property, not a method
    return JSON.parse(response.text);
  } catch (error) {
    throw new Error("Analysis failed.");
  }
}

export async function findNearbyHelp(lat: number, lng: number): Promise<HelpCenter[]> {
  // Use gemini-2.5-flash for Maps grounding as per guidelines
  const model = 'gemini-2.5-flash';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "List the 3 closest Cyber Crime Police Stations or Cyber Cells near my location for reporting a digital scam.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });

    // Extract help centers from grounding chunks
    const centers: HelpCenter[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          centers.push({
            name: chunk.maps.title || "Cyber Cell",
            address: "Local Cyber Police Station",
            // Include Maps URI from grounding chunks
            mapUri: chunk.maps.uri || `https://www.google.com/maps/search/cyber+crime+cell/@${lat},${lng},15z`,
          });
        }
      });
    }

    // Fallback if no specific chunks returned
    if (centers.length === 0) {
      centers.push({
        name: "National Cyber Crime Helpline",
        address: "Dial 1930 (India) or visit cybercrime.gov.in",
        mapUri: "https://cybercrime.gov.in",
      });
    }

    return centers;
  } catch (error) {
    console.error("Maps search failed:", error);
    return [{
      name: "Emergency Helpline",
      address: "Please call 1930 for immediate assistance in India.",
      mapUri: "https://www.google.com/maps/search/cyber+crime+cell"
    }];
  }
}
