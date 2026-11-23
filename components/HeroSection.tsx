'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Eye, Scale, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '@/lib/assets';

interface HeroSectionProps {
  onStartFlagship: () => void;
  onBrowseAll: () => void;
  onOpenRevealLab: () => void;
  totalScenarios: number;
}

export default function HeroSection({
  onStartFlagship,
  onBrowseAll,
  onOpenRevealLab,
  totalScenarios,
}: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="border-b border-slate-200/80 bg-white/50 backdrop-blur-[3px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-mono tracking-wide text-sky-700">
                Interactive Cognitive Decision Lab · SDG 5 Gender Equality
              </p>

              <h1
                className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold leading-[1.1] tracking-tight text-slate-900 max-w-2xl"
                style={{ textWrap: 'balance' }}
              >
                Notice the assumption before the decision makes itself.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Bias is rarely obvious. Even when two candidates share identical qualifications and
                track records, subtle cues shape who we view as decisive, qualified, or ready to
                lead. BiasBreak puts you inside real-life judgment calls—teaching through
                experience rather than lectures.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStartFlagship}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
                >
                  <span>Start 2-Min Scenario</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onBrowseAll}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white/90 hover:bg-white rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
                >
                  <span>Browse All {totalScenarios}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenRevealLab}
                  className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-sky-800 hover:text-sky-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 rounded-md"
                >
                  <Eye className="w-4 h-4 text-sky-700" aria-hidden="true" />
                  <span>Try Framing Flip</span>
                </button>
              </div>

              {/* Quiet 3-step micro legend */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-slate-900">01</span>
                  <span>Pick blind in 30 seconds</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-slate-900">02</span>
                  <span>Unlock the Bias Reveal</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-slate-900">03</span>
                  <span>Compare evidence vs. intuition</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[340px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
            {!imgError ? (
              <Image
                src={HERO_IMAGE}
                alt="Overlapping frosted optical glass planes refracting subtle cobalt and amber light"
                fill
                priority
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="object-cover lg:h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 via-sky-50 to-amber-50 text-slate-700">
                <Scale className="w-10 h-10 text-sky-700 mb-3" />
                <p className="font-serif text-lg font-medium text-center">
                  Shift the lens from intuition to evidence
                </p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-sky-200 mb-1">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Perspective Refraction Study</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                Identical credentials can read completely differently once hidden context enters
                the room.
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Structural Strip with hairline dividers */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
          <div className="lg:pr-6">
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              {String(totalScenarios).padStart(2, '0')}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Real-Life Scenarios</p>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              Workplace, education, tech, leadership, sports & daily life
            </p>
          </div>
          <div className="lg:px-6">
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              3-Step
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Perspective Loop</p>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              Decide blind, inspect the reveal, compare your rationale
            </p>
          </div>
          <div className="lg:px-6">
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              Zero
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Judgmental Labels</p>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              Built to spark reflection, never to lecture or scold
            </p>
          </div>
          <div className="lg:pl-6">
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              Peer-Reviewed
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Behavioral Evidence</p>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              Grounded in Yale, Carnegie Mellon, PNAS & GitHub studies
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
