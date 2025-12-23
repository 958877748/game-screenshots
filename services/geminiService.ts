import { GoogleGenAI, Type } from "@google/genai";
import { GameConcept, ScreenType } from "../types";

// Helper to initialize AI client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGameConcept = async (userIdea: string): Promise<GameConcept> => {
  const ai = getAiClient();
  
  const prompt = `
    You are a visionary game designer. Create a cohesive mobile game concept based on this idea: "${userIdea}".
    If the idea is vague, fill in the details creatively. 
    Focus heavily on the 'artStyle' and 'visualDescription' as these will be used to generate images.
    The visual description should be detailed enough to ensure consistency across multiple screenshots.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          genre: { type: Type.STRING },
          artStyle: { type: Type.STRING, description: "e.g., Low poly, Pixel art, Cyberpunk neon, Watercolor, Hyper-realistic" },
          visualDescription: { type: Type.STRING, description: "Detailed description of the visual atmosphere, lighting, and textures." },
          colorPalette: { type: Type.STRING, description: "e.g., Gold and Black, Pastel Pink and Blue" },
          gameplayMechanic: { type: Type.STRING }
        },
        required: ["title", "genre", "artStyle", "visualDescription", "colorPalette", "gameplayMechanic"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No concept generated");
  
  return JSON.parse(text) as GameConcept;
};

export const generateGameScreenshot = async (
  concept: GameConcept,
  screenType: ScreenType
): Promise<string> => {
  const ai = getAiClient();

  // Construct a rich prompt to ensure consistency and quality
  const prompt = `
    Mobile game screenshot for a game titled "${concept.title}".
    
    Context:
    - Genre: ${concept.genre}
    - Screen Type: ${screenType}
    - Art Style: ${concept.artStyle}
    - Visual Vibes: ${concept.visualDescription}
    - Color Palette: ${concept.colorPalette}
    
    Specific Instructions:
    - Aspect Ratio: 9:16 (Vertical Phone Screen).
    - Ensure the UI elements (buttons, HUD, text) appropriate for a ${screenType} are visible and match the art style.
    - High quality, professional concept art, trending on ArtStation.
    - Make it look like a real, playable mobile game.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      // 9:16 aspect ratio for mobile screens
      imageConfig: {
        aspectRatio: "9:16"
      }
    }
  });

  // Iterate to find the image part
  for (const candidate of response.candidates || []) {
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image generated in response");
};