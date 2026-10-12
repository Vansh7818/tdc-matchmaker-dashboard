'use client';

import React, { useState, useEffect } from 'react';
import { CustomerProfile, ScoredMatch, SentMatchRecord } from '@/types/customer';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { generateAiPersonalizedEmailPitch } from '@/lib/aiService';
import confetti from 'canvas-confetti';
import { 
  X, Mail, Send, Sparkles, CheckCircle2, Copy, RefreshCw, 
  MapPin, Briefcase, GraduationCap, IndianRupee, ShieldCheck
} from 'lucide-react';

interface SendMatchModalProps {
  client: CustomerProfile;
  match: ScoredMatch;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (record: SentMatchRecord) => void;
}

export function SendMatchModal({
  client,
  match,
  isOpen,
  onClose,
  onSuccess,
}: SendMatchModalProps) {
  const { customApiKey, recordSentMatch } = useMatchmaker();
  
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const candidate = match.profile;

  // Generate initial pitch when opened
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGeneratingAi(true);

    generateAiPersonalizedEmailPitch(client, candidate, match.score, customApiKey)
      .then((res) => {
        if (isMounted) {
          setSubject(res.subject);
          setEmailBody(res.emailBody);
          setIsGeneratingAi(false);
        }
      })
      .catch((err) => {
        console.error('Error generating email pitch:', err);
        if (isMounted) setIsGeneratingAi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, client.id, candidate.id, customApiKey]);

  if (!isOpen) return null;

  const handleRegenerate = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await generateAiPersonalizedEmailPitch(client, candidate, match.score, customApiKey);
      setSubject(res.subject);
      setEmailBody(res.emailBody);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    setIsSending(true);

    setTimeout(() => {
      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#f59e0b', '#3b82f6'],
      });

      const record: SentMatchRecord = {
        matchId: candidate.id,
        matchName: `${candidate.firstName} ${candidate.lastName}`,
        dateSent: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        introEmailSubject: subject,
        introEmailBody: emailBody,
        status: 'Sent',
      };

      recordSentMatch(client.id, record);
      setIsSending(false);
      onSuccess(record);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-tdc-900 via-rose-800 to-amber-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">
                Dispatch Match Introduction
              </h2>
              <p className="text-xs text-rose-100/90">
                Personalized introduction for {client.firstName} {client.lastName} ({client.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Candidate Profile Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={candidate.photoUrl}
                alt={candidate.firstName}
                className="w-14 h-14 rounded-xl object-cover border-2 border-rose-200"
              />
              <div className="text-xs space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">{candidate.firstName} {candidate.lastName}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {match.score.totalScore}% Match
                  </span>
                </div>
                <p className="text-slate-600">
                  {candidate.age} yrs • {candidate.city} • {candidate.designation} at {candidate.currentCompany}
                </p>
                <p className="text-[11px] text-slate-500">
                  {candidate.undergraduateCollege} • {candidate.incomeFormatted} • {candidate.diet}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Ref</span>
              <span className="text-xs font-mono text-slate-700">{candidate.id}</span>
            </div>
          </div>

          {/* Email Composer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI-Crafted Personalized Introduction Email</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isGeneratingAi}
                  className="text-[11px] font-semibold text-tdc-700 hover:text-tdc-900 flex items-center gap-1 p-1 hover:bg-rose-50 rounded transition-colors disabled:opacity-50"
                  title="Regenerate with AI"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>Regenerate AI Pitch</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Recipient */}
            <div className="flex items-center text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <span className="text-slate-400 font-semibold w-16">To:</span>
              <span className="font-semibold text-slate-800">{client.firstName} {client.lastName} &lt;{client.email}&gt;</span>
            </div>

            {/* Subject */}
            <div>
              <div className="flex items-center text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-slate-400 font-semibold w-16">Subject:</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Introductory Subject Line"
                  className="w-full bg-transparent font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Body */}
            <div>
              <textarea
                rows={11}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Personalized Matchmaker pitch..."
                disabled={isGeneratingAi}
                className="w-full p-4 text-xs font-sans text-slate-800 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-tdc-600 leading-relaxed disabled:opacity-50"
              />
              {isGeneratingAi && (
                <p className="text-[11px] text-tdc-700 animate-pulse mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Synthesizing personalized match pitch...
                </p>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            Dispatches preview email & logs to client's matchmaking timeline
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSendEmail}
              disabled={isSending || isGeneratingAi || !subject.trim()}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-tdc-700 to-rose-600 hover:from-tdc-800 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Dispatching...
                </span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Match to {client.firstName}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
