import { GameConcept, ScreenType } from "../types";

// ModelScope API configuration
const MODELSCOPE_API_BASE = "https://api-inference.modelscope.cn/v1";

// In Next.js, environment variables need to be accessed differently
const getModelScopeToken = () => {
  // Try to get from process.env first (server-side)
  if (typeof process !== 'undefined' && process.env.MODELSCOPE_API_TOKEN) {
    return process.env.MODELSCOPE_API_TOKEN;
  }

  // For client-side, we need to expose it through next.config.js
  if (typeof window !== 'undefined' && (window as any).ENV?.MODELSCOPE_API_TOKEN) {
    return (window as any).ENV.MODELSCOPE_API_TOKEN;
  }

  return null;
};

// Helper function to make API calls
async function modelScopeAPICall(endpoint: string, data: any) {
  const token = getModelScopeToken();
  if (!token || token === 'your_modelscope_api_token_here') {
    throw new Error("Please configure your ModelScope API token in .env.local file");
  }

  try {
    const response = await fetch(`${MODELSCOPE_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ModelScope API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Failed to connect to ModelScope API. Please check your internet connection and API configuration.");
    }
    throw error;
  }
}

export const generateGameConcept = async (userIdea: string): Promise<GameConcept> => {
  try {
    console.log('Generating concept for idea:', userIdea);
    const response = await fetch('/api/generate/concept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdea }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API Error response:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in response:', data);
      throw new Error("No response content from ModelScope API");
    }

    // Try to extract JSON from the response
    let jsonStr = content;
    // If the response contains markdown code blocks, extract the JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    console.log('Extracted JSON string:', jsonStr);
    const concept = JSON.parse(jsonStr) as GameConcept;

    // Validate required fields
    if (!concept.title || !concept.genre || !concept.artStyle ||
        !concept.visualDescription || !concept.colorPalette || !concept.gameplayMechanic) {
      throw new Error("Invalid concept format from API");
    }

    return concept;
  } catch (error) {
    console.error("Error generating concept:", error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new Error("Failed to parse concept response. Please try again.");
    }
    throw error;
  }
};

export const generateGameScreenshot = async (
  concept: GameConcept,
  screenType: ScreenType
): Promise<string> => {
  try {
    const response = await fetch('/api/generate/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ concept, screenType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    const data = await response.json();

    // Handle both URL and base64 formats
    if (data.data && data.data[0] && data.data[0].b64_json) {
      // Base64 format
      return `data:image/png;base64,${data.data[0].b64_json}`;
    } else if (data.output_images && data.output_images.length > 0) {
      // URL format - need to fetch and convert to base64
      const imageUrl = data.output_images[0];
      console.log('Converting image URL to base64:', imageUrl);

      // Fetch the image and convert to base64
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      return `data:image/png;base64,${base64}`;
    } else {
      throw new Error("No image generated in response");
    }
  } catch (error) {
    console.error("Error generating screenshot:", error);
    throw error;
  }
};