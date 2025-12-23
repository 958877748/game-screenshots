import React from 'react';
import { GameConcept } from '../types';
import { Gamepad2, Palette, Sparkles, MonitorSmartphone } from 'lucide-react';

interface ConceptCardProps {
  concept: GameConcept;
  className?: string;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, className = '' }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          {concept.title}
        </h2>
        <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300 uppercase tracking-wider">
          {concept.genre}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Art Style</h3>
            <p className="text-slate-200">{concept.artStyle}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Visuals & Palette</h3>
            <p className="text-slate-200">{concept.visualDescription}</p>
            <p className="text-xs text-slate-400 mt-1">Palette: {concept.colorPalette}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Gamepad2 className="w-5 h-5 text-green-400 mt-1 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Core Mechanic</h3>
            <p className="text-slate-200">{concept.gameplayMechanic}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptCard;