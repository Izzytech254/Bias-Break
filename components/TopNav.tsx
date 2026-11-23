'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export type NavSection = 'explore' | 'reveal-lab' | 'insights' | 'creator' | 'challenge';

interface TopNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  completedCount: number;
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'explore', label: 'Scenarios' },
  { id: 'reveal-lab', label: 'Bias Reveal' },
  { id: 'insights', label: 'Insights' },
  { id: 'creator', label: 'Creator' },
  { id: 'challenge', label: 'Challenge' },
];

export default function TopNav({ activeSection, onNavigate, completedCount }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (section: NavSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('explore')}
          className="font-serif text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 rounded-sm"
        >
          BiasBreak
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 rounded-sm ${
                  isActive
                    ? 'text-slate-900 underline decoration-sky-700 decoration-2 underline-offset-8'
                    : 'text-slate-600 hover:text-slate-900 hover:underline hover:decoration-slate-300 hover:underline-offset-8'
                }`}
              >
                {item.label}
                {item.id === 'insights' && completedCount > 0 ? (
                  <span className="ml-1.5 font-mono text-xs text-sky-700 tabular-nums">
                    ({completedCount})
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('explore')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
          >
            <span>Explore Bias</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen ? (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'insights' && completedCount > 0 ? (
                  <span className="font-mono text-xs text-sky-700 tabular-nums">
                    {completedCount} completed
                  </span>
                ) : null}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSelect('explore')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors"
            >
              <span>Explore Bias</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
