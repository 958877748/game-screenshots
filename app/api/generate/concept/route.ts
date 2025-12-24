import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userIdea } = await request.json();
    console.log('Received request with idea:', userIdea);

    if (!userIdea) {
      return NextResponse.json({ error: 'User idea is required' }, { status: 400 });
    }

    const token = process.env.MODELSCOPE_API_TOKEN;
    console.log('Token exists:', !!token);
    if (!token || token === 'your_modelscope_api_token_here') {
      return NextResponse.json({
        error: 'ModelScope API token not configured. Please add MODELSCOPE_API_TOKEN to your .env.local file.'
      }, { status: 500 });
    }

    const prompt = `
      You are a visionary game designer. Create a cohesive mobile game concept based on this idea: "${userIdea}".
      If the idea is vague, fill in the details creatively.
      Focus heavily on the 'artStyle' and 'visualDescription' as these will be used to generate images.
      The visual description should be detailed enough to ensure consistency across multiple screenshots.

      Return the response in JSON format with these exact fields:
      - title: Game title
      - genre: Game genre
      - artStyle: Art style (e.g., Low poly, Pixel art, Cyberpunk neon, Watercolor, Hyper-realistic)
      - visualDescription: Detailed description of the visual atmosphere, lighting, and textures
      - colorPalette: Color palette (e.g., Gold and Black, Pastel Pink and Blue)
      - gameplayMechanic: Core gameplay mechanic
    `;

    console.log('Sending request to ModelScope API...');
    const response = await fetch('https://api-inference.modelscope.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "Qwen/Qwen3-VL-235B-A22B-Instruct",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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

    const data = await response.json();
    console.log('ModelScope API response data:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating concept:', error);
    return NextResponse.json({
      error: 'Failed to generate game concept'
    }, { status: 500 });
  }
}