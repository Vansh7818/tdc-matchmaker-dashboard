'use client';

import React from 'react';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { Heart, Users, Sparkles, LogOut, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const { user, logout, selectedCustomer, setSelectedCustomer, customers } = useMatchmaker();

  const activeCount = customers.filter(c => c.statusTag === 'Active Matching').length;
  const introCount = customers.filter(c => c.statusTag === 'Introductions Sent' || c.statusTag === 'First Date Scheduled').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            {selectedCustomer && (
              <button
                onClick={() => setSelectedCustomer(null)}
                className="mr-1 p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-rose-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Back to Customer List"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Clients List</span>
              </button>
            )}

            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setSelectedCustomer(null)}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-tdc-700 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
                <Heart className="w-5 h-5 fill-white/90" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900 font-serif">
                    The Date Crew
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-tdc-800 px-1.5 py-0.5 rounded">
                    TDC Matchmaker
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
                  High-Touch Executive Matchmaking Platform
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {activeCount} Active Matching
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {introCount} In Progress
              </span>
            </div>

            {/* AI Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-tdc-700 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-medium"
              title="Algorithm & AI Configuration"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-rose-200"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
