'use client';

import React, { useState } from 'react';
import { CustomerProfile, JourneyStatus, MatchmakerNote } from '@/types/customer';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { 
  ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Calendar, 
  Ruler, GraduationCap, Briefcase, IndianRupee, Heart, 
  Users, Home, Baby, Compass, Dog, Utensils, Wine, 
  Cigarette, Moon, Sparkles, MessageSquare, Plus, CheckCircle2,
  Clock, Send, ChevronRight, UserCheck
} from 'lucide-react';

interface CustomerDetailViewProps {
  customer: CustomerProfile;
  onBack: () => void;
  onScrollToMatches: () => void;
}

const JOURNEY_STAGES: JourneyStatus[] = [
  'Onboarding',
  'Verified',
  'Active Matching',
  'Introductions Sent',
  'First Date Scheduled',
  'Under Feedback',
  'Courtship',
  'Matched',
];

export function CustomerDetailView({ customer, onBack, onScrollToMatches }: CustomerDetailViewProps) {
  const { updateCustomerJourneyStatus, addCustomerNote } = useMatchmaker();
  
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<MatchmakerNote['category']>('Call');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsSubmittingNote(true);
    addCustomerNote(customer.id, newNoteText.trim(), newNoteCategory);
    setNewNoteText('');
    setIsSubmittingNote(false);
  };

  const currentStageIndex = JOURNEY_STAGES.indexOf(customer.statusTag);

  return (
    <div className="space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-tdc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Clients</span>
        </button>

        <button
          onClick={onScrollToMatches}
          className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-tdc-700 to-rose-600 text-white shadow-md shadow-rose-200 hover:shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>View Algorithm Matches ({customer.gender === 'Male' ? 'Eligible Women' : 'Eligible Men'})</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={customer.photoUrl}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-rose-100 shadow-md"
              />
              {customer.verifiedBadge && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow" title="Verified Customer Biodata">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                  {customer.firstName} {customer.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-tdc-800 border border-rose-200">
                  {customer.gender} • {customer.age} yrs
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {customer.maritalStatus}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-2">
                <span>{customer.designation} at <strong className="text-slate-900">{customer.currentCompany}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-bold">{customer.incomeFormatted}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {customer.city}, {customer.country}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {customer.phoneNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Current Journey Stage Quick Controller */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full md:w-auto text-left md:text-right">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Customer Journey Stage
            </p>
            <div className="mt-1.5 flex items-center md:justify-end gap-2">
              <select
                value={customer.statusTag}
                onChange={(e) => updateCustomerJourneyStatus(customer.id, e.target.value as JourneyStatus)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-tdc-900 focus:outline-none focus:ring-2 focus:ring-tdc-600"
              >
                {JOURNEY_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Assigned to: {customer.assignedMatchmaker}
            </p>
          </div>

        </div>

        {/* Visual Customer Journey Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Matchmaking Journey Progression
          </p>

          <div className="hidden lg:grid grid-cols-8 gap-2">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isPassed = currentStageIndex >= idx;
              const isCurrent = customer.statusTag === stage;

              return (
                <button
                  key={stage}
                  onClick={() => updateCustomerJourneyStatus(customer.id, stage)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                    isCurrent
                      ? 'bg-tdc-700 text-white border-tdc-700 shadow-sm'
                      : isPassed
                      ? 'bg-rose-50 text-tdc-900 border-rose-200 hover:bg-rose-100'
                      : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-80 mb-0.5">
                    <span>Step {idx + 1}</span>
                    {isPassed && !isCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </div>
                  <p className="font-semibold leading-tight line-clamp-1">{stage}</p>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid: Full Biodata (All fields required by TDC) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Structured Biodata */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Education, Career & Financials */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-tdc-700" />
              <span>Education & Career Biodata</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Undergraduate Degree</span>
                <span className="font-bold text-slate-900 text-sm">{customer.undergraduateDegree}</span>
                <p className="text-slate-600 mt-0.5">{customer.undergraduateCollege}</p>
              </div>

              {customer.postgraduateCollege ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Postgraduate Degree</span>
                  <span className="font-bold text-slate-900 text-sm">{customer.postgraduateDegree}</span>
                  <p className="text-slate-600 mt-0.5">{customer.postgraduateCollege}</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Postgraduate</span>
                  <span className="font-medium text-slate-500">Not Applicable</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Current Company & Role</span>
                <span className="font-bold text-slate-900 text-sm">{customer.designation}</span>
                <p className="text-slate-600 mt-0.5">{customer.currentCompany} ({customer.careerField})</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-emerald-700 font-semibold block mb-1">Annual Compensation</span>
                <span className="font-extrabold text-emerald-900 text-base">{customer.incomeFormatted}</span>
                <p className="text-emerald-700 text-[11px] mt-0.5">Verified salary bracket</p>
              </div>
            </div>
          </div>

          {/* Section 2: Personal, Cultural & Matrimonial Details (Indian Context) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-tdc-700" />
              <span>Cultural, Family & Matrimonial Details</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <span className="font-bold text-slate-800">{customer.dateOfBirth}</span>
                <p className="text-[11px] text-slate-500">Age {customer.age}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Height</span>
                <span className="font-bold text-slate-800">{customer.heightFormatted}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Marital Status</span>
                <span className="font-bold text-slate-800">{customer.maritalStatus}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Religion & Caste</span>
                <span className="font-bold text-slate-800">{customer.religion}</span>
                <p className="text-[11px] text-slate-500">{customer.caste} {customer.subcaste ? `• ${customer.subcaste}` : ''}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Mother Tongue</span>
                <span className="font-bold text-slate-800">{customer.motherTongue}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Languages Known</span>
                <span className="font-bold text-slate-800">{customer.languagesKnown.join(', ')}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Siblings</span>
                <span className="font-bold text-slate-800">{customer.siblings}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Family Setup</span>
                <span className="font-bold text-slate-800">{customer.familyType} Family</span>
                <p className="text-[11px] text-slate-500">{customer.familyValues} Values</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Kundali / Manglik</span>
                <span className="font-bold text-slate-800">{customer.manglikStatus}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Lifestyle & Values Alignment */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-tdc-700" />
              <span>Lifestyle Habits & Core Relationship Preferences</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Baby className="w-4 h-4 text-tdc-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Want Kids?</span>
                  <span className="font-bold text-slate-800">{customer.wantKids}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-tdc-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Open to Relocate?</span>
                  <span className="font-bold text-slate-800">{customer.openToRelocate}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Dog className="w-4 h-4 text-tdc-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Open to Pets?</span>
                  <span className="font-bold text-slate-800">{customer.openToPets}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-tdc-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Dietary Habit</span>
                  <span className="font-bold text-slate-800">{customer.diet}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Wine className="w-4 h-4 text-tdc-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Drinking Habit</span>
                  <span className="font-bold text-slate-800">{customer.drinking}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Cigarette className="w-4 h-4 text-tdc-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Smoking Habit</span>
                  <span className="font-bold text-slate-800">{customer.smoking}</span>
                </div>
              </div>
            </div>

            {/* About Me & Partner Expectations */}
            <div className="mt-5 space-y-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                <p className="text-[11px] font-bold text-tdc-900 uppercase tracking-wider mb-1">
                  About {customer.firstName} (Self Description)
                </p>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{customer.aboutMe}"
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {customer.hobbies.map(h => (
                    <span key={h} className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-slate-700 border border-rose-200">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  What {customer.firstName} Looks For in a Partner
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {customer.partnerExpectations}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (1 Col): Matchmaker Notes & Sent Matches */}
        <div className="space-y-6">
          
          {/* Matchmaker Quick Notes Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-tdc-700" />
                <span>Matchmaker Notes ({customer.notes.length})</span>
              </h3>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 mb-5">
              <div className="flex items-center gap-2">
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as MatchmakerNote['category'])}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-tdc-600"
                >
                  <option value="Call">Phone Call</option>
                  <option value="Meeting">Meeting / Zoom</option>
                  <option value="Preference Update">Preference Update</option>
                  <option value="Family Feedback">Family Feedback</option>
                  <option value="General">General</option>
                </select>
                <span className="text-[11px] text-slate-400">Quick log</span>
              </div>

              <textarea
                rows={3}
                placeholder="Record quick meeting notes, mother's feedback, or preference changes..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tdc-600 text-slate-800"
              />

              <button
                type="submit"
                disabled={isSubmittingNote || !newNoteText.trim()}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Matchmaker Note</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {customer.notes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No notes recorded yet for this client.</p>
              ) : (
                customer.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">{note.author}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-medium">
                        {note.category || 'Note'}
                      </span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{note.text}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      {note.timestamp}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sent Matches History */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-tdc-700" />
              <span>Dispatched Introductions ({customer.sentMatches.length})</span>
            </h3>

            {customer.sentMatches.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No matches dispatched yet.</p>
                <button
                  onClick={onScrollToMatches}
                  className="mt-2 text-tdc-700 font-semibold hover:underline"
                >
                  Review algorithm matches below ↓
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {customer.sentMatches.map((sm, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{sm.matchName}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {sm.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono truncate">{sm.introEmailSubject}</p>
                    <p className="text-[10px] text-slate-400">Dispatched: {sm.dateSent}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
