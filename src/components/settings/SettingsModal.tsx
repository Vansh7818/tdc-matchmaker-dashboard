'use client';

import React, { useState } from 'react';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { 
  X, Key, Sparkles, RotateCcw, CheckCircle2, Shield, 
  Cpu, SlidersHorizontal, Info 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { customApiKey, setCustomApiKey, resetAllData } = useMatchmaker();
  const [keyInput, setKeyInput] = useState(customApiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(keyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all mock client notes, stages, and sent matches back to default?')) {
      resetAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold">Platform & AI Engine Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* OpenAI API Key configuration */}
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-tdc-700" />
                <span>OpenAI API Key (Optional)</span>
              </label>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                keyInput.startsWith('sk-') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {keyInput.startsWith('sk-') ? 'Custom API Active' : 'Built-in Engine Mode'}
              </span>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Supply your own OpenAI key to route qualitative reasoning and intro emails directly through <code>gpt-4o-mini</code>. If left empty, our zero-dependency high-accuracy NLP Engine automatically powers all features out of the box!
            </p>

            <div className="relative">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full p-2.5 pr-20 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-tdc-600 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>

            {saveSuccess && (
              <p className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> API configuration successfully updated!
              </p>
            )}
          </form>

          {/* AI Usage Architecture Highlights */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Multi-Tier AI Architecture:</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li>• <strong>Scoring & Explanation:</strong> Natural language rationale detailing why each match works, friction points, and tier classification.</li>
              <li>• <strong>Personalized Email Pitch:</strong> Dynamic introduction generator crafting warm, custom emails for clients with one click.</li>
              <li>• <strong>Conversation Catalysts:</strong> AI-recommended first-date icebreakers based on mutual interests.</li>
            </ul>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Reset Demo Data</p>
              <p className="text-slate-500 text-[11px]">Restore initial demo customers, notes, and stages.</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-tdc-700 font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {resetSuccess && (
            <p className="text-emerald-600 font-semibold text-center">
              All demo customers and notes have been reset to pristine defaults.
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
