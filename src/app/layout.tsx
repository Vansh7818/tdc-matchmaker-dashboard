import type { Metadata } from 'next';
import './globals.css';
import { MatchmakerProvider } from '@/context/MatchmakerContext';

export const metadata: Metadata = {
  title: 'TDC Matchmaker Portal | The Date Crew',
  description: 'Internal Matchmaker Algorithm & Executive Relationship Management Dashboard for The Date Crew (TDC)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 min-h-screen">
        <MatchmakerProvider>
          {children}
        </MatchmakerProvider>
      </body>
    </html>
  );
}
