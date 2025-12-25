import { GameConcept, ScreenType } from "../types";

export const generateGameConcept = async (userIdea: string): Promise<GameConcept> => {
  try {
    const response = await fetch('/api/generate/concept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdea }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from ModelScope API");
    }

    // Try to extract JSON from the response
    let jsonStr = content;
    // If the response contains markdown code blocks, extract the JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const concept = JSON.parse(jsonStr) as GameConcept;

    // Validate required fields
    if (!concept.title || !concept.genre || !concept.artStyle ||
        !concept.visualDescription || !concept.colorPalette || !concept.gameplayMechanic) {
      throw new Error("Invalid concept format from API");
    }

    return concept;
  } catch (error) {
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

    // Handle URL format from server
    if (data.output_images && data.output_images.length > 0) {
      // Return the URL directly
      return data.output_images[0];
    } else {
      throw new Error("No image generated in response");
    }
  } catch (error) {
    throw error;
  }
};