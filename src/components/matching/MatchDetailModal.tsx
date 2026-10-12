'use client';

import React, { useState, useEffect } from 'react';
import { CustomerProfile, ScoredMatch } from '@/types/customer';
import { generateAiMatchAnalysis, AiMatchAnalysisResponse } from '@/lib/aiService';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { 
  X, Sparkles, ShieldCheck, Heart, MapPin, Briefcase, 
  GraduationCap, IndianRupee, Baby, Compass, Utensils, 
  Send, AlertTriangle, CheckCircle2, MessageSquare, Lightbulb
} from 'lucide-react';

interface MatchDetailModalProps {
  client: CustomerProfile;
  match: ScoredMatch;
  isOpen: boolean;
  onClose: () => void;
  onSendMatch: (match: ScoredMatch) => void;
}

export function MatchDetailModal({
  client,
  match,
  isOpen,
  onClose,
  onSendMatch,
}: MatchDetailModalProps) {
  const { customApiKey } = useMatchmaker();
  const [aiAnalysis, setAiAnalysis] = useState<AiMatchAnalysisResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const candidate = match.profile;
  const score = match.score;

  // Generate AI Match Analysis on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingAi(true);

    generateAiMatchAnalysis(client, candidate, score, customApiKey)
      .then((res) => {
        if (isMounted) {
          setAiAnalysis(res);
          setIsLoadingAi(false);
        }
      })
      .catch((err) => {
        console.error('Error generating AI analysis:', err);
        if (isMounted) setIsLoadingAi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, client.id, candidate.id, customApiKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-900 via-tdc-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                {score.tier}
              </span>
              <span className="text-xs text-rose-200">
                Compatibility Rating: <strong>{score.totalScore}%</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Deep Compatibility Inspection
            </h2>
            <p className="text-xs text-rose-100/80">
              Comparing {client.firstName} {client.lastName} & {candidate.firstName} {candidate.lastName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Side-by-Side Profiles Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            
            {/* Primary Client */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <img
                src={client.photoUrl}
                alt={client.firstName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-rose-200"
              />
              <div className="text-xs space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tdc-700">Client Profile</span>
                <p className="text-sm font-bold text-slate-900">{client.firstName} {client.lastName}</p>
                <p className="text-slate-600">{client.age} yrs • {client.city}</p>
                <p className="text-slate-600 truncate">{client.designation} ({client.incomeFormatted})</p>
              </div>
            </div>

            {/* Suggested Candidate */}
            <div className="flex items-center gap-4 bg-rose-50/60 p-4 rounded-xl border border-rose-200">
              <img
                src={candidate.photoUrl}
                alt={candidate.firstName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-rose-300"
              />
              <div className="text-xs space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Suggested Match</span>
                <p className="text-sm font-bold text-slate-900">{candidate.firstName} {candidate.lastName}</p>
                <p className="text-slate-600">{candidate.age} yrs • {candidate.city}</p>
                <p className="text-slate-600 truncate">{candidate.designation} ({candidate.incomeFormatted})</p>
              </div>
            </div>

          </div>

          {/* Algorithmic Scoring Dimension Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Multi-Factor Algorithmic Score Breakdown
              </h3>
              <span className="text-sm font-bold text-tdc-700 font-mono">
                {score.totalScore} / 100 pts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Age Alignment</span>
                  <span className="font-bold text-slate-800">{score.ageScore} / 20</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tdc-600 h-full rounded-full" style={{ width: `${(score.ageScore / 20) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Height Synergy</span>
                  <span className="font-bold text-slate-800">{score.heightScore} / 15</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tdc-600 h-full rounded-full" style={{ width: `${(score.heightScore / 15) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Career & Pedigree</span>
                  <span className="font-bold text-slate-800">{score.careerScore} / 20</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tdc-600 h-full rounded-full" style={{ width: `${(score.careerScore / 20) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Financial Harmony</span>
                  <span className="font-bold text-slate-800">{score.incomeScore} / 15</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tdc-600 h-full rounded-full" style={{ width: `${(score.incomeScore / 15) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Lifestyle & Kids</span>
                  <span className="font-bold text-slate-800">{score.lifestyleScore} / 20</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tdc-600 h-full rounded-full" style={{ width: `${(score.lifestyleScore / 20) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Location & Move</span>
                  <span className="font-bold text-slate-800">{score.locationScore} / 10</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tdc-600 h-full rounded-full" style={{ width: `${(score.locationScore / 10) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Strengths & Friction Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                <p className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Alignment Strengths
                </p>
                <ul className="space-y-1 text-emerald-800 text-[11px]">
                  {score.positiveReasons.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <p className="font-bold text-amber-900 mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Friction Points & Variances
                </p>
                {score.frictionPoints.length === 0 ? (
                  <p className="text-[11px] text-amber-800">No major dealbreakers identified.</p>
                ) : (
                  <ul className="space-y-1 text-amber-800 text-[11px]">
                    {score.frictionPoints.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* AI MATCHMAKER COPILOT REASONING */}
          <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl border border-rose-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-tdc-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Matchmaker Copilot: Qualitative Reasoning</span>
              </h3>
              <span className="text-[10px] bg-rose-100 text-tdc-800 px-2 py-0.5 rounded font-mono">
                {customApiKey ? 'Live OpenAI Model' : 'Built-in TDC AI Engine'}
              </span>
            </div>

            {isLoadingAi ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <div className="w-6 h-6 border-2 border-tdc-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p>Synthesizing matrimonial compatibility analysis and conversation prompts...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-white border border-rose-100 text-slate-800 font-medium">
                  {aiAnalysis.summary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                    <p className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-tdc-600" />
                      Why This Relationship Works
                    </p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {aiAnalysis.whyItWorks}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                    <p className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Counseling Points & Watch-Outs
                    </p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {aiAnalysis.watchOuts}
                    </p>
                  </div>
                </div>

                {/* Icebreakers */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <p className="font-bold text-amber-950 mb-1.5 flex items-center gap-1.5 text-[11px]">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    Recommended First Date Icebreakers & Conversation Catalysts:
                  </p>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {aiAnalysis.recommendedIcebreakers.map((ib, i) => (
                      <li key={i} className="italic">💡 {ib}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          {/* Candidate Detailed Biodata Snippet */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              {candidate.firstName}'s Biodata Dossier
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Education</span>
                <span className="font-semibold text-slate-800">{candidate.undergraduateDegree}</span>
                <p className="text-[10px] text-slate-500">{candidate.undergraduateCollege}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Religion & Caste</span>
                <span className="font-semibold text-slate-800">{candidate.religion}</span>
                <p className="text-[10px] text-slate-500">{candidate.caste}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Diet & Habits</span>
                <span className="font-semibold text-slate-800">{candidate.diet}</span>
                <p className="text-[10px] text-slate-500">Drinks: {candidate.drinking}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Want Kids / Pets</span>
                <span className="font-semibold text-slate-800">Kids: {candidate.wantKids}</span>
                <p className="text-[10px] text-slate-500">Pets: {candidate.openToPets}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px]">In Their Own Words:</span>
              <p className="italic text-slate-700 mt-0.5">"{candidate.aboutMe}"</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Suggested by Matchmaking Logic for <strong>{client.firstName}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onSendMatch(match);
              }}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-tdc-700 to-rose-600 hover:from-tdc-800 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Match to {client.firstName}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
