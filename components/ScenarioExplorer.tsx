'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Compass, Eye } from 'lucide-react';
import { CATEGORY_IMAGES } from '@/lib/assets';
import { SCENARIO_CATEGORIES } from '@/lib/scenarios';
import type { Scenario, ScenarioCategory, UserDecisionRecord } from '@/lib/types';

interface ScenarioExplorerProps {
  scenarios: Scenario[];
  records: UserDecisionRecord[];
  onSelectScenario: (scenario: Scenario) => void;
}

export default function ScenarioExplorer({
  scenarios,
  records,
  onSelectScenario,
}: ScenarioExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | ScenarioCategory>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredScenarios =
    activeCategory === 'All'
      ? scenarios
      : scenarios.filter((item) => item.category === activeCategory);

  const completedIds = new Set(records.map((r) => r.scenarioId));
  const showFeaturedSpotlight = activeCategory === 'All' && filteredScenarios.length > 0;
  const featuredScenario = showFeaturedSpotlight ? filteredScenarios[0] : null;
  const gridScenarios = showFeaturedSpotlight ? filteredScenarios.slice(1) : filteredScenarios;

  return (
    <section id="scenarios-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header & Progress Line */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono text-sky-700">
            <span>Interactive Decision Library</span>
            {records.length > 0 ? (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-700 tabular-nums">
                  {records.length}/{scenarios.length} reflected
                </span>
              </>
            ) : null}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Choose a real-life scenario to experience
          </h2>
          <p className="text-base text-slate-600">
            Click any card below to begin. Make a blind choice first, then unlock the Bias Reveal.
          </p>
        </div>

        {/* Interactive Category Segmented Filter */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg"
          role="tablist"
          aria-label="Filter scenarios by domain"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'All'}
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'All'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Domains
          </button>
          {SCENARIO_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Flagship Spotlight Card (Click Anywhere) */}
      {featuredScenario ? (
        <button
          type="button"
          onClick={() => onSelectScenario(featuredScenario)}
          className="w-full text-left group bg-white/95 backdrop-blur-sm border border-slate-200 hover:border-sky-700/60 hover:shadow-md rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
        >
          <div className="lg:col-span-5 relative min-h-[240px] bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-hidden">
            {!failedImages[featuredScenario.id] ? (
              <Image
                src={CATEGORY_IMAGES[featuredScenario.category]}
                alt={`${featuredScenario.category} editorial scene for ${featuredScenario.title}`}
                fill
                referrerPolicy="no-referrer"
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [featuredScenario.id]: true }))
                }
                className="object-cover lg:h-full group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-50 p-6">
                <Compass className="w-8 h-8 text-sky-700" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold text-sky-700">Recommended First</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700">{featuredScenario.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {featuredScenario.durationMinutes} min
                </span>
                {completedIds.has(featuredScenario.id) ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reflected</span>
                    </span>
                  </>
                ) : null}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 group-hover:text-sky-800 transition-colors leading-snug">
                {featuredScenario.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {featuredScenario.contextBrief}
              </p>

              {/* Subtle candidate preview line */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900">
                    {featuredScenario.options[0].blindLabel}:
                  </span>{' '}
                  {featuredScenario.options[0].metrics[0]?.value} ·{' '}
                  {featuredScenario.options[0].metrics[1]?.value}
                </div>
                <div className="px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900">
                    {featuredScenario.options[1].blindLabel}:
                  </span>{' '}
                  {featuredScenario.options[1].metrics[0]?.value} ·{' '}
                  {featuredScenario.options[1].metrics[1]?.value}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span>Includes Blind Reveal & Evidence Audit</span>
              </span>

              <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 group-hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0">
                <span>
                  {completedIds.has(featuredScenario.id)
                    ? 'Revisit Flagship Scenario'
                    : 'Enter Flagship Scenario'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </span>
            </div>
          </div>
        </button>
      ) : null}

      {/* Remaining Scenarios Grid (Click Anywhere Cards) */}
      {filteredScenarios.length === 0 ? (
        <div className="bg-white/95 border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
          <p className="font-serif text-xl font-semibold text-slate-900">
            No scenarios in this category yet
          </p>
          <p className="text-sm text-slate-600">
            Switch to All Domains or design a custom scenario in the Educator Creator tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridScenarios.map((scenario, idx) => {
            const isCompleted = completedIds.has(scenario.id);
            const imgData = CATEGORY_IMAGES[scenario.category];
            const hasFailed = failedImages[scenario.id];
            const displayIndex = showFeaturedSpotlight ? idx + 2 : idx + 1;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onSelectScenario(scenario)}
                className="text-left group bg-white/95 backdrop-blur-sm border border-slate-200 hover:border-sky-700/60 hover:shadow-md rounded-xl overflow-hidden flex flex-col justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
              >
                <div className="w-full">
                  {/* Visual Cover */}
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden border-b border-slate-200">
                    {!hasFailed ? (
                      <Image
                        src={imgData}
                        alt={`${scenario.category} editorial scene for ${scenario.title}`}
                        fill
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [scenario.id]: true }))
                        }
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-50 p-6">
                        <Compass className="w-8 h-8 text-sky-700" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Card Body — Clean Unboxed Metadata */}
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
                      <span className="font-mono font-medium text-slate-400 tabular-nums">
                        {String(displayIndex).padStart(2, '0')}.
                      </span>
                      <span className="font-medium text-slate-700">{scenario.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{scenario.durationMinutes} min</span>
                      {scenario.isCustom ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-sky-700">Custom</span>
                        </>
                      ) : null}
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-slate-900 group-hover:text-sky-800 transition-colors leading-snug">
                      {scenario.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {scenario.contextBrief}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="w-full px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Reflected</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 truncate">
                      {scenario.biasMechanism}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 group-hover:text-sky-800 whitespace-nowrap shrink-0">
                    <span>{isCompleted ? 'Revisit' : 'Start'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
