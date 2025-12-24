# DreamScreen AI

Transform your game ideas into visual screenshots using AI. Built with Next.js and ModelScope API.

## Features

- 🎮 Generate detailed game concepts from simple ideas
- 🖼️ Create mobile game screenshots with consistent visual style
- 📱 9:16 aspect ratio optimized for mobile games
- 🎨 Multiple screen types (Main Menu, Gameplay, Inventory, etc.)
- 💾 Download generated screenshots
- 🗑️ Delete unwanted screenshots

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **UI**: Tailwind CSS
- **AI Models**: ModelScope API (Qwen for text, Z-Image-Turbo for images)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Get your ModelScope API token from [ModelScope](https://modelscope.cn/my/myaccesstoken)

3. Create a `.env.local` file:
   ```env
   MODELSCOPE_API_TOKEN=your_modelscope_api_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MODELSCOPE_API_TOKEN` to the environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is configured to work with any platform that supports Next.js. Make sure to:
- Set the `MODELSCOPE_API_TOKEN` environment variable
- Use the build command: `npm run build`
- Set the output directory: `.next`

## API Routes

The application uses Next.js API routes to handle ModelScope API calls:

- `POST /api/generate/concept` - Generate game concept from user idea
- `POST /api/generate/image` - Generate screenshot from concept

This approach avoids CORS issues and keeps your API token secure.

## Migration from React/Vite

This project was migrated from React/Vite to Next.js. Key changes:
- Replaced Vite with Next.js build system
- Migrated from client-side Gemini API to server-side ModelScope API
- Added API routes for secure API calls
- Updated environment variable handling for Next.js
- Maintained identical UI and functionality
