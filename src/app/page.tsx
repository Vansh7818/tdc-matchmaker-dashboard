'use client';

import React, { useState } from 'react';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { LoginView } from '@/components/auth/LoginView';
import { Header } from '@/components/layout/Header';
import { CustomerListView } from '@/components/dashboard/CustomerListView';
import { CustomerDetailView } from '@/components/customer/CustomerDetailView';
import { MatchmakerBoard } from '@/components/matching/MatchmakerBoard';
import { SettingsModal } from '@/components/settings/SettingsModal';

export default function HomePage() {
  const { user, selectedCustomer, setSelectedCustomer } = useMatchmaker();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // If not authenticated, show the login view
  if (!user) {
    return <LoginView />;
  }

  const handleScrollToMatches = () => {
    const el = document.getElementById('matching-board-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Global Brand Header */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {!selectedCustomer ? (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Matchmaker Operations Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage assigned high-net-worth clients, review biodata, monitor journey stages, and run algorithm match pools.
              </p>
            </div>

            <CustomerListView />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Customer Detailed Biodata & Notes View */}
            <CustomerDetailView
              customer={selectedCustomer}
              onBack={() => setSelectedCustomer(null)}
              onScrollToMatches={handleScrollToMatches}
            />

            {/* Opposite Gender Matchmaker Board & Algorithm Pool */}
            <div className="pt-6 border-t-2 border-slate-200/60">
              <MatchmakerBoard customer={selectedCustomer} />
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} The Date Crew (TDC) • Confidential Matchmaking & Relationship System
          </p>
          <p className="flex items-center gap-2">
            <span>MVP v1.0.0</span>
            <span>•</span>
            <span className="text-tdc-700 font-semibold">TDC Algo Engine & Copilot</span>
          </p>
        </div>
      </footer>

      {/* Platform & AI Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
