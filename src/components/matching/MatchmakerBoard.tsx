'use client';

import React, { useState, useMemo } from 'react';
import { CustomerProfile, ScoredMatch, SentMatchRecord } from '@/types/customer';
import { getRankedMatches, MatchFilterOptions } from '@/lib/matchAlgorithm';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { MatchDetailModal } from './MatchDetailModal';
import { SendMatchModal } from './SendMatchModal';
import { 
  Sparkles, Filter, Sliders, Heart, ShieldCheck, MapPin, 
  Briefcase, GraduationCap, IndianRupee, Send, Eye, 
  CheckCircle2, AlertCircle, Info, ChevronRight, UserCheck, Check
} from 'lucide-react';

interface MatchmakerBoardProps {
  customer: CustomerProfile;
}

export function MatchmakerBoard({ customer }: MatchmakerBoardProps) {
  const { candidatePool } = useMatchmaker();

  // Filters state
  const [minScore, setMinScore] = useState<number>(60);
  const [sameCityOnly, setSameCityOnly] = useState<boolean>(false);
  const [sameReligionOnly, setSameReligionOnly] = useState<boolean>(false);
  const [dietPreferenceMatch, setDietPreferenceMatch] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'score' | 'income' | 'age'>('score');

  // Modals state
  const [selectedInspectionMatch, setSelectedInspectionMatch] = useState<ScoredMatch | null>(null);
  const [selectedSendMatch, setSelectedSendMatch] = useState<ScoredMatch | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Compute matches
  const filterOptions: MatchFilterOptions = useMemo(() => ({
    minScore,
    sameCityOnly,
    sameReligionOnly,
    dietPreferenceMatch,
    sortBy,
  }), [minScore, sameCityOnly, sameReligionOnly, dietPreferenceMatch, sortBy]);

  const rankedMatches = useMemo(() => {
    return getRankedMatches(customer, candidatePool, filterOptions);
  }, [customer, candidatePool, filterOptions]);

  // Total opposite gender pool count for audit/compliance
  const totalOppositeGenderPoolCount = useMemo(() => {
    return candidatePool.filter(c => {
      if (customer.gender === 'Male') return c.gender === 'Female';
      if (customer.gender === 'Female') return c.gender === 'Male';
      return c.gender !== customer.gender;
    }).length;
  }, [customer.gender, candidatePool]);

  const handleMatchSentSuccess = (record: SentMatchRecord) => {
    setSuccessToast(`Successfully dispatched introductory match email for ${record.matchName}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div id="matching-board-section" className="space-y-6 pt-4">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Board Header Banner with Gender-Specific Logic Transparency */}
      <div className="bg-gradient-to-br from-white via-rose-50/50 to-amber-50/40 rounded-3xl border border-rose-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-tdc-700 text-white shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gender-Specific Algorithm Active</span>
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                Opposite Gender Pool: <strong>{totalOppositeGenderPoolCount} Verified Profiles</strong>
              </span>

              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Matches Qualified: <strong>{rankedMatches.length}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Curated Candidate Pool for {customer.firstName}
            </h2>

            {/* Clear explanation of gender-specific matchmaking rules */}
            <div className="mt-3 p-4 rounded-2xl bg-white border border-rose-100 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-tdc-900">
                <Info className="w-4 h-4 text-tdc-700" />
                <span>
                  {customer.gender === 'Male'
                    ? 'Active Rule (Male Customer Profile):'
                    : 'Active Rule (Female Customer Profile):'}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {customer.gender === 'Male' ? (
                  <>
                    Evaluating opposite-gender women who are <strong>younger</strong> (ideal -1 to -5 yrs), <strong>shorter in height</strong>, have <strong>lower/comparable income</strong> (&le; {customer.incomeFormatted}), and share <strong>identical family planning views</strong> (Kids: <em>{customer.wantKids}</em>), reinforced by culinary alignment (<em>{customer.diet}</em>) and location flexibility.
                  </>
                ) : (
                  <>
                    Evaluating opposite-gender men focusing on <strong>intellectual & career pedigree parity</strong> ({customer.careerField} & premier institutions), <strong>egalitarian lifestyle values</strong>, <strong>relocation compatibility</strong>, <strong>height synergy</strong> (taller/equal), and <strong>age synergy</strong> (peer to +4 yrs).
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Match Count Meter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shrink-0 text-center shadow-sm w-full lg:w-48">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Top Ranked Match
            </span>
            <p className="text-3xl font-extrabold text-tdc-700 mt-1 font-mono">
              {rankedMatches.length > 0 ? `${rankedMatches[0].score.totalScore}%` : 'N/A'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {rankedMatches.length > 0 ? rankedMatches[0].score.tier : 'Adjust filters'}
            </p>
          </div>

        </div>

        {/* Algorithm Tuner & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-rose-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center text-xs">
          
          {/* Min Score Slider */}
          <div className="lg:col-span-2 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-semibold text-slate-700">Min Compatibility Score:</span>
              <span className="font-bold text-tdc-700 font-mono text-sm">{minScore}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Toggle Same City */}
          <label className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={sameCityOnly}
              onChange={(e) => setSameCityOnly(e.target.checked)}
              className="rounded text-tdc-600 focus:ring-tdc-500 w-4 h-4 accent-rose-600"
            />
            <span className="font-medium text-slate-700">Same City Only ({customer.city})</span>
          </label>

          {/* Toggle Religion */}
          <label className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={sameReligionOnly}
              onChange={(e) => setSameReligionOnly(e.target.checked)}
              className="rounded text-tdc-600 focus:ring-tdc-500 w-4 h-4 accent-rose-600"
            />
            <span className="font-medium text-slate-700">Same Religion ({customer.religion})</span>
          </label>

          {/* Sort Control */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Sort Candidates By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full font-bold text-slate-800 bg-transparent focus:outline-none"
            >
              <option value="score">Highest Compatibility</option>
              <option value="income">Candidate Income</option>
              <option value="age">Age (Youngest First)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Scored Matches Grid */}
      {rankedMatches.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-800">No candidates match the stringent filter threshold.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try lowering the minimum compatibility score slider or unticking the strict city/religion checkboxes to expand the candidate pool.
          </p>
          <button
            onClick={() => {
              setMinScore(50);
              setSameCityOnly(false);
              setSameReligionOnly(false);
              setDietPreferenceMatch(false);
            }}
            className="text-xs font-bold text-tdc-700 hover:underline pt-2 inline-block"
          >
            Relax Filters (Reset to Defaults)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedMatches.map((match) => {
            const candidate = match.profile;
            const score = match.score;

            const isHighPotential = score.tier === 'High Potential Match';
            const isStrong = score.tier === 'Strong Match';

            return (
              <div
                key={candidate.id}
                className="group bg-white rounded-3xl border border-slate-200/90 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-950/5 transition-all duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Bar: Compatibility Badge & Tier */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        isHighPotential
                          ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-950 border border-amber-300 shadow-sm'
                          : isStrong
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isHighPotential && <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                      <span>{score.tier}</span>
                    </span>

                    {/* Compatibility Score Circle */}
                    <div className="flex items-center gap-1.5">
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-slate-900 font-mono leading-none">
                          {score.totalScore}%
                        </span>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Match</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.firstName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-tdc-700 transition-colors">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {candidate.age} yrs • {candidate.gender} • {candidate.maritalStatus}
                      </p>
                      <p className="text-xs text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {candidate.city}, {candidate.country}
                      </p>
                    </div>
                  </div>

                  {/* Career & Financials */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1 mb-3.5">
                    <p className="font-bold text-slate-800 truncate">
                      {candidate.designation}
                    </p>
                    <p className="text-slate-600 truncate">
                      {candidate.currentCompany} • <span className="font-semibold text-emerald-700">{candidate.incomeFormatted}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {candidate.undergraduateCollege}
                    </p>
                  </div>

                  {/* Algorithmic Key Compatibility Badges */}
                  <div className="space-y-1.5 my-3">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Key Algorithmic Alignments
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-tdc-900 border border-rose-100 font-medium">
                        Height: {candidate.heightFormatted.split(' ')[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-tdc-900 border border-rose-100 font-medium">
                        Kids: {candidate.wantKids}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-tdc-900 border border-rose-100 font-medium">
                        Diet: {candidate.diet}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                        {candidate.religion} ({candidate.caste})
                      </span>
                    </div>
                  </div>

                  {/* Top Positives Snippet */}
                  <div className="my-3 space-y-1 text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                    {score.positiveReasons.slice(0, 2).map((reason, idx) => (
                      <p key={idx} className="line-clamp-1 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{reason}</span>
                      </p>
                    ))}
                  </div>

                </div>

                {/* Card Action Buttons (Inspect Profile & Send Match) */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInspectionMatch(match)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>AI Deep Dive</span>
                  </button>

                  <button
                    onClick={() => setSelectedSendMatch(match)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-tdc-700 to-rose-600 hover:from-tdc-800 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Match</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Deep Inspection Modal */}
      {selectedInspectionMatch && (
        <MatchDetailModal
          client={customer}
          match={selectedInspectionMatch}
          isOpen={!!selectedInspectionMatch}
          onClose={() => setSelectedInspectionMatch(null)}
          onSendMatch={(m) => {
            setSelectedInspectionMatch(null);
            setSelectedSendMatch(m);
          }}
        />
      )}

      {/* Send Match Modal */}
      {selectedSendMatch && (
        <SendMatchModal
          client={customer}
          match={selectedSendMatch}
          isOpen={!!selectedSendMatch}
          onClose={() => setSelectedSendMatch(null)}
          onSuccess={handleMatchSentSuccess}
        />
      )}

    </div>
  );
}
