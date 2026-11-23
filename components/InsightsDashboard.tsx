'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Compass, Copy, Eye, RotateCcw, Scale } from 'lucide-react';
import { SCENARIO_CATEGORIES } from '@/lib/scenarios';
import type { Scenario, UserDecisionRecord } from '@/lib/types';

interface InsightsDashboardProps {
  records: UserDecisionRecord[];
  scenarios: Scenario[];
  onOpenScenario: (scenario: Scenario) => void;
  onExploreMore: () => void;
  onResetRecords: () => void;
}

export default function InsightsDashboard({
  records,
  scenarios,
  onOpenScenario,
  onExploreMore,
  onResetRecords,
}: InsightsDashboardProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const completedCount = records.length;
  const reconsideredCount = records.filter((r) => r.postRevealStance === 'reconsidered').length;
  const equalCount = records.filter((r) => r.postRevealStance === 'equal').length;
  const keptCount = records.filter((r) => r.postRevealStance === 'kept').length;
  const categoriesExplored = Array.from(new Set(records.map((r) => r.category)));
  const mechanismsExplored = Array.from(new Set(records.map((r) => r.biasMechanism)));

  const reflectionText =
    completedCount === 0
      ? 'Complete your first interactive scenario to build a personal reflection summary.'
      : `You explored ${completedCount} real-life scenario${completedCount === 1 ? '' : 's'} across ${categoriesExplored.join(', ')}. ${
          reconsideredCount + equalCount > 0
            ? `In ${reconsideredCount + equalCount} decision${reconsideredCount + equalCount === 1 ? '' : 's'}, seeing the hidden context shifted your reading or highlighted tied objective qualifications.`
            : 'In each scenario, you examined how objective credentials compare against subtle framing cues.'
        } Biggest takeaway: anchor high-stakes decisions in measurable evidence before context cues shape expectations.`;

  const handleCopySummary = async () => {
    const shareString = `My BiasBreak Learning Reflection:\n• Scenarios completed: ${completedCount}/${scenarios.length}\n• Decisions reconsidered or re-evaluated: ${reconsideredCount + equalCount}\n• Themes explored: ${mechanismsExplored.join(', ') || 'None yet'}\n\nTakeaway: ${reflectionText}`;
    try {
      await navigator.clipboard.writeText(shareString);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      setCopiedSummary(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-mono text-sky-700">Personal Learning Reflection</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Evidence & Assumption Insights
          </h2>
          <p className="text-base text-slate-600">
            BiasBreak never assigns a pass/fail bias score. Instead, this space helps you review the
            perspectives you explored and which evidence mattered most.
          </p>
        </div>

        {completedCount > 0 ? (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Summary Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Share Reflection</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onResetRecords}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* 4-Column Reflection KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Scenarios Completed</p>
          <p className="font-mono text-3xl font-semibold text-slate-900 mt-2 tabular-nums">
            {completedCount}
            <span className="text-base text-slate-400 font-normal">/{scenarios.length}</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Decisions Reconsidered</p>
          <p className="font-mono text-3xl font-semibold text-slate-900 mt-2 tabular-nums">
            {reconsideredCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Equal Credentials Noted</p>
          <p className="font-mono text-3xl font-semibold text-slate-900 mt-2 tabular-nums">
            {equalCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Domains Explored</p>
          <p className="font-mono text-3xl font-semibold text-slate-900 mt-2 tabular-nums">
            {categoriesExplored.length}
            <span className="text-base text-slate-400 font-normal">/6</span>
          </p>
        </div>
      </div>

      {/* Reflection Synthesis + Domain Coverage Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-mono text-sky-700">Your Learning Reflection</p>
            <p className="font-serif text-xl sm:text-2xl text-slate-900 leading-relaxed">
              {reflectionText}
            </p>
          </div>

          {completedCount > 0 ? (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <p className="text-xs font-semibold text-slate-500">
                Post-Reveal Perspective Breakdown
              </p>
              {/* Proportional visual distribution bar */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                {reconsideredCount > 0 ? (
                  <div
                    className="bg-amber-600 h-full"
                    style={{ width: `${(reconsideredCount / completedCount) * 100}%` }}
                  />
                ) : null}
                {equalCount > 0 ? (
                  <div
                    className="bg-sky-700 h-full"
                    style={{ width: `${(equalCount / completedCount) * 100}%` }}
                  />
                ) : null}
                {keptCount > 0 ? (
                  <div
                    className="bg-slate-400 h-full"
                    style={{ width: `${(keptCount / completedCount) * 100}%` }}
                  />
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                  <span className="tabular-nums">Reconsidered ({reconsideredCount})</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                  <span className="tabular-nums">Equal Credentials ({equalCount})</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span className="tabular-nums">Kept Choice ({keptCount})</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors"
              >
                <span>Start First Scenario</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* 6-Domain Coverage Map */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <div>
            <p className="text-xs font-mono text-slate-500">Domain Coverage</p>
            <h3 className="font-serif text-xl font-semibold text-slate-900 mt-1">
              Six Real-World Contexts
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {SCENARIO_CATEGORIES.map((category) => {
              const domainScenarios = scenarios.filter((s) => s.category === category);
              const doneInDomain = records.filter((r) => r.category === category).length;
              const isExplored = doneInDomain > 0;
              const nextUnfinished =
                domainScenarios.find((s) => !records.some((r) => r.scenarioId === s.id)) ||
                domainScenarios[0];

              return (
                <div key={category} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isExplored ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                    ) : (
                      <Compass className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    )}
                    <span
                      className={`text-sm truncate ${
                        isExplored ? 'font-semibold text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {doneInDomain}/{domainScenarios.length}
                    </span>
                    {nextUnfinished ? (
                      <button
                        type="button"
                        onClick={() => onOpenScenario(nextUnfinished)}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-800 whitespace-nowrap"
                      >
                        {isExplored ? 'Review' : 'Explore'}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decision History Ledger */}
      {completedCount > 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Completed Scenario Reflections
            </h3>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {completedCount} recorded
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {records.map((rec) => {
              const matchingScenario = scenarios.find((s) => s.id === rec.scenarioId);
              return (
                <div
                  key={rec.scenarioId}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{rec.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.biasMechanism}</span>
                    </div>
                    <p className="font-serif text-lg font-semibold text-slate-900">
                      {rec.scenarioTitle}
                    </p>
                    <p className="text-sm text-slate-600">
                      Initial pick: <span className="font-medium text-slate-900">Option {rec.initialChoice}</span>
                      {' · '}
                      After reveal:{' '}
                      <span className="inline-flex items-center gap-1 font-medium text-slate-900">
                        {rec.postRevealStance === 'reconsidered' ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                            <span>Reconsidered decision</span>
                          </>
                        ) : rec.postRevealStance === 'equal' ? (
                          <>
                            <Scale className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                            <span>Noted equal qualification</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                            <span>Kept initial choice</span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>

                  {matchingScenario ? (
                    <button
                      type="button"
                      onClick={() => onOpenScenario(matchingScenario)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-sky-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Review Scenario</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
