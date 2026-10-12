'use client';

import React, { useState } from 'react';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { Heart, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';

export function LoginView() {
  const { login } = useMatchmaker();
  const [username, setUsername] = useState('matchmaker@thedatecrew.com');
  const [password, setPassword] = useState('tdc2025');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 400);
  };

  const handleFillCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-slate-50 to-amber-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-tdc-700 via-rose-600 to-amber-500 shadow-xl shadow-rose-200 text-white mb-4">
            <Heart className="w-8 h-8 fill-white/90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            The Date Crew
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Internal Matchmaker & Relationship Intelligence Portal
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-rose-950/5 border border-rose-100 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Matchmaker Email / Username
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-600 focus:border-transparent text-slate-800"
                  placeholder="name@thedatecrew.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdc-600 focus:border-transparent text-slate-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-tdc-700 to-rose-600 hover:from-tdc-800 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Credentials:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleFillCredentials('matchmaker@thedatecrew.com', 'tdc2025')}
                className="w-full text-left p-2.5 rounded-lg border border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800">Priya Sharma (Lead Matchmaker)</p>
                  <p className="text-[11px] text-slate-500 font-mono">matchmaker@thedatecrew.com / tdc2025</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-tdc-600" />
              </button>

              <button
                type="button"
                onClick={() => handleFillCredentials('aditya@thedatecrew.com', 'admin123')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800">Aditya Oberoi (VP Operations)</p>
                  <p className="text-[11px] text-slate-500 font-mono">aditya@thedatecrew.com / admin123</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-400">
              For TDC internal team members only • Confidential customer biodata
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
