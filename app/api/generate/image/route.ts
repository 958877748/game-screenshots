import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { concept, screenType } = await request.json();

    if (!concept || !screenType) {
      return NextResponse.json({ error: 'Concept and screenType are required' }, { status: 400 });
    }

    const token = process.env.MODELSCOPE_API_TOKEN;
    if (!token || token === 'your_modelscope_api_token_here') {
      return NextResponse.json({
        error: 'ModelScope API token not configured. Please add MODELSCOPE_API_TOKEN to your .env.local file.'
      }, { status: 500 });
    }

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
      - Aspect Ratio: 9:16 (Vertical Phone Screen)
      - Ensure the UI elements (buttons, HUD, text) appropriate for a ${screenType} are visible and match the art style
      - High quality, professional concept art, trending on ArtStation
      - Make it look like a real, playable mobile game
      - Clean, polished mobile game interface
    `;

    console.log('Sending request to ModelScope API for image generation...');
    const response = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-ModelScope-Async-Mode': 'true', // Enable async mode
      },
      body: JSON.stringify({
        model: "Tongyi-MAI/Z-Image-Turbo",
        prompt: prompt,
        size: "512x896", // 9:16 aspect ratio
        n: 1,
        response_format: "url" // Ensure we get URL format
      }),
    });

    console.log('ModelScope API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ModelScope API error:', errorText);
      return NextResponse.json({
        error: `ModelScope API error: ${response.status} ${response.statusText} - ${errorText}`
      }, { status: response.status });
    }

    const submitData = await response.json();
    console.log('Task submitted:', submitData);

    // Poll for completion
    const taskId = submitData.task_id;
    console.log('Polling task:', taskId);

    let imageUrl = null;
    const maxRetries = 30; // Max 60 seconds (30 * 2s)
    let retries = 0;

    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const pollResponse = await fetch(`https://api-inference.modelscope.cn/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-ModelScope-Task-Type': 'image_generation',
        },
      });

      if (!pollResponse.ok) {
        throw new Error(`Polling failed: ${pollResponse.status}`);
      }

      const pollData = await pollResponse.json();
      console.log('Poll response:', pollData);

      if (pollData.task_status === 'SUCCEED' && pollData.output_images && pollData.output_images.length > 0) {
        imageUrl = pollData.output_images[0];
        break;
      } else if (pollData.task_status === 'FAILED' || pollData.task_status === 'CANCELED') {
        throw new Error(`Task failed with status: ${pollData.task_status}`);
      }

      retries++;
      console.log(`Retry ${retries}/${maxRetries}`);
    }

    if (!imageUrl) {
      throw new Error('Image generation timed out');
    }

    // Fetch the image and convert to base64 on the server side to avoid CORS issues
    try {
      console.log('Fetching image from URL:', imageUrl);
      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');

      console.log('Image converted to base64 successfully');

      // Return the base64 encoded image directly
      return NextResponse.json({
        data: [{ b64_json: base64 }]
      });
    } catch (imageFetchError) {
      console.error('Error fetching image:', imageFetchError);

      // If we can't fetch the image, return the URL and let the client handle it
      return NextResponse.json({
        output_images: [imageUrl]
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({
      error: 'Failed to generate screenshot'
    }, { status: 500 });
  }
}