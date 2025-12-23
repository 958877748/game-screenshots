import React, { useState, useCallback } from 'react';
import { GameConcept, GeneratedImage, LoadingState, ScreenType } from './types';
import { generateGameConcept, generateGameScreenshot } from './services/geminiService';
import ConceptCard from './components/ConceptCard';
import ScreenshotGallery from './components/ScreenshotGallery';
import Button from './components/Button';
import { Wand2, Plus, Smartphone, Sparkles, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [userIdea, setUserIdea] = useState('');
  const [concept, setConcept] = useState<GameConcept | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isGeneratingConcept: false,
    isGeneratingImage: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleGenerateConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdea.trim()) return;

    setLoading(prev => ({ ...prev, isGeneratingConcept: true, currentAction: 'Dreaming up a concept...' }));
    setError(null);
    setConcept(null);
    setImages([]); // Reset images on new concept

    try {
      const newConcept = await generateGameConcept(userIdea);
      setConcept(newConcept);
    } catch (err: any) {
      setError(err.message || 'Failed to generate concept. Please check your API key.');
    } finally {
      setLoading(prev => ({ ...prev, isGeneratingConcept: false, currentAction: undefined }));
    }
  };

  const handleGenerateScreenshot = async (screenType: ScreenType) => {
    if (!concept) return;

    setLoading(prev => ({ ...prev, isGeneratingImage: true, currentAction: `Rendering ${screenType}...` }));
    setError(null);

    try {
      const base64Image = await generateGameScreenshot(concept, screenType);
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        screenType,
        imageUrl: base64Image,
        timestamp: Date.now(),
      };
      setImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, isGeneratingImage: false, currentAction: undefined }));
    }
  };

  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-white/10 pb-6">
          <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DreamScreen AI</h1>
            <p className="text-slate-400">Turn vague ideas into consistent mobile game screenshots</p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Concept */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Input Section */}
            <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-xl">
              <form onSubmit={handleGenerateConcept} className="space-y-4">
                <div>
                  <label htmlFor="idea" className="block text-sm font-medium text-slate-300 mb-2">
                    Describe your game idea
                  </label>
                  <textarea
                    id="idea"
                    rows={4}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="e.g., A cozy puzzle game about sorting magical potions in a witch's hut..."
                    value={userIdea}
                    onChange={(e) => setUserIdea(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  isLoading={loading.isGeneratingConcept} 
                  disabled={!userIdea.trim()}
                  className="w-full py-3"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  {concept ? 'Regenerate Concept' : 'Dream It Up'}
                </Button>
              </form>
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
            </section>

            {/* Concept Display & Actions */}
            {concept && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ConceptCard concept={concept} />
                
                <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-indigo-400" />
                    Generate Screens
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.values(ScreenType).map((type) => (
                      <Button
                        key={type}
                        variant="secondary"
                        onClick={() => handleGenerateScreenshot(type)}
                        disabled={loading.isGeneratingImage}
                        className="justify-between group"
                      >
                        <span>{type}</span>
                        <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      </Button>
                    ))}
                  </div>
                  {loading.isGeneratingImage && (
                     <div className="mt-4 text-center text-sm text-indigo-300 animate-pulse">
                        {loading.currentAction}
                     </div>
                  )}
                </section>
              </div>
            )}
          </div>

          {/* Right Column: Gallery */}
          <div className="lg:col-span-8">
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Screenshot Gallery
                </h2>
                <span className="text-sm text-slate-500">
                  {images.length} generated
                </span>
              </div>
              <ScreenshotGallery images={images} onDelete={handleDeleteImage} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;