import React from 'react';
import { GeneratedImage, ScreenType } from '../types';
import { Download, Maximize2, Trash2 } from 'lucide-react';

interface ScreenshotGalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ images, onDelete }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-500 bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-700">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <Maximize2 className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-lg">No screenshots generated yet</p>
        <p className="text-sm opacity-60">Create a concept and generate screens to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <div key={img.id} className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 transition-transform hover:-translate-y-1">
          {/* Label Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 bg-black/60 backdrop-blur text-xs font-bold text-white rounded">
              {img.screenType}
            </span>
          </div>

          {/* Image Container with Aspect Ratio 9:16 */}
          <div className="relative w-full pb-[177%] bg-slate-900">
            <img 
              src={img.imageUrl} 
              alt={`${img.screenType} screenshot`}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <a 
              href={img.imageUrl} 
              download={`dream-screen-${img.id}.png`}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              onClick={() => onDelete(img.id)}
              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScreenshotGallery;