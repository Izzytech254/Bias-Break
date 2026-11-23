'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Eye,
  Info,
} from 'lucide-react';
import { FRAMING_SWAP_CASES } from '@/lib/scenarios';

export default function BiasRevealLab() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [activeLens, setActiveLens] = useState<'A' | 'B'>('A');
  const [viewMode, setViewMode] = useState<'toggle' | 'split'>('toggle');

  const currentCase = FRAMING_SWAP_CASES[selectedCaseIndex];
  const isMaleLens = activeLens === 'A';
  const totalCases = FRAMING_SWAP_CASES.length;

  const goToCase = (nextIndex: number) => {
    const wrapped = (nextIndex + totalCases) % totalCases;
    setSelectedCaseIndex(wrapped);
    setActiveLens('A');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono text-sky-700">Interactive Framing Experiment</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            The Bias Reveal Lab: Flip the Identity Lens
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Hold the objective metrics completely constant. Toggle between two identity frames—or
            compare both side by side—to observe how feedback phrasing, investor questions, and
            classroom nudges shift in real-world studies.
          </p>
        </div>

        {/* Toggle between Live Lens Flip vs Side-by-Side Diff */}
        <div
          className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg self-start lg:self-end shrink-0"
          role="group"
          aria-label="Comparison display mode"
        >
          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'toggle'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Interactive Flip</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Side-by-Side Diff</span>
          </button>
        </div>
      </div>

      {/* Case Selector Tabs & Quick Cycling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FRAMING_SWAP_CASES.map((item, idx) => {
            const active = idx === selectedCaseIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToCase(idx)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {item.domain}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="text-xs font-mono text-slate-500 tabular-nums px-1">
            {selectedCaseIndex + 1} / {totalCases}
          </span>
          <button
            type="button"
            onClick={() => goToCase(selectedCaseIndex - 1)}
            aria-label="Previous framing experiment"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Prev</span>
          </button>
          <button
            type="button"
            onClick={() => goToCase(selectedCaseIndex + 1)}
            aria-label="Next framing experiment"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {viewMode === 'toggle' ? (
        /* Interactive Two-Zone Sandbox Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Stage (7 cols): Live Framed Excerpt */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <p className="text-xs font-mono text-slate-500">{currentCase.domain}</p>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                  {currentCase.title}
                </h3>
              </div>

              {/* Identity Lens Switch */}
              <div
                className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0"
                role="group"
                aria-label="Toggle identity framing lens"
              >
                <button
                  type="button"
                  onClick={() => setActiveLens('A')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isMaleLens
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {currentCase.maleFramedName.split(' ')[0]} (Frame A)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLens('B')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    !isMaleLens
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {currentCase.femaleFramedName.split(' ')[0]} (Frame B)
                </button>
              </div>
            </div>

            {/* Constant Shared Objective Evidence */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3">
                Constant Objective Metrics (Identical in Both Frames)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentCase.sharedMetrics.map((metric) => (
                  <div
                    key={metric}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-medium text-slate-800">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Flipped Excerpt */}
            <motion.div
              key={`${currentCase.id}-${activeLens}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                  <Eye className="w-4 h-4 text-sky-700" aria-hidden="true" />
                  <span>
                    Profile Shown:{' '}
                    {isMaleLens ? currentCase.maleFramedName : currentCase.femaleFramedName}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveLens(isMaleLens ? 'B' : 'A')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md whitespace-nowrap transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Flip Identity</span>
                </button>
              </div>

              <blockquote className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-lg leading-relaxed font-serif">
                {isMaleLens ? currentCase.maleFramedExcerpt : currentCase.femaleFramedExcerpt}
              </blockquote>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      Observed Evaluation Shift
                    </p>
                    <p className="text-sm text-amber-950 mt-1 leading-relaxed">
                      {isMaleLens
                        ? currentCase.maleObservedReaction
                        : currentCase.femaleObservedReaction}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Concept & Comparison Deck (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-xs font-mono text-slate-500">Side-by-Side Comparison</p>
              <h4 className="font-serif text-xl font-semibold text-slate-900 mt-1">
                What changed when the name changed?
              </h4>
            </div>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border transition-colors ${
                  isMaleLens ? 'border-sky-700 bg-sky-50/40' : 'border-slate-200 bg-white'
                }`}
              >
                <p className="text-xs font-semibold text-slate-500">
                  Frame A · {currentCase.maleFramedName}
                </p>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                  {currentCase.maleObservedReaction}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border transition-colors ${
                  !isMaleLens ? 'border-sky-700 bg-sky-50/40' : 'border-slate-200 bg-white'
                }`}
              >
                <p className="text-xs font-semibold text-slate-500">
                  Frame B · {currentCase.femaleFramedName}
                </p>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                  {currentCase.femaleObservedReaction}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-sky-800">Research Mechanism</p>
              <p className="text-sm text-slate-800 mt-1.5 leading-relaxed">
                {currentCase.cognitiveTakeaway}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Side-by-Side Diff View */
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-slate-500">{currentCase.domain}</p>
              <h3 className="font-serif text-2xl font-semibold text-slate-900 mt-1">
                {currentCase.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentCase.sharedMetrics.map((metric) => (
                <span
                  key={metric}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                  <span>{metric}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 md:pr-6 md:border-r md:border-slate-200">
              <p className="text-xs font-mono text-sky-700">
                Frame A · {currentCase.maleFramedName}
              </p>
              <blockquote className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-serif text-base text-slate-900 leading-relaxed">
                {currentCase.maleFramedExcerpt}
              </blockquote>
              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Typical Evaluation: </span>
                {currentCase.maleObservedReaction}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-mono text-amber-800">
                Frame B · {currentCase.femaleFramedName}
              </p>
              <blockquote className="p-4 rounded-lg bg-amber-50/40 border border-amber-200 font-serif text-base text-slate-900 leading-relaxed">
                {currentCase.femaleFramedExcerpt}
              </blockquote>
              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Typical Evaluation: </span>
                {currentCase.femaleObservedReaction}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200">
            <p className="text-xs font-semibold text-sky-900">Research Mechanism</p>
            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
              {currentCase.cognitiveTakeaway}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
