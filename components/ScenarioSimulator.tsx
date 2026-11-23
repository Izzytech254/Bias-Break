'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  MessageSquareQuote,
  RefreshCw,
  Scale,
  Share2,
  SlidersHorizontal,
} from 'lucide-react';
import type { PostRevealStance, Scenario, UserDecisionRecord } from '@/lib/types';

interface ScenarioSimulatorProps {
  scenario: Scenario;
  existingRecord?: UserDecisionRecord;
  isChallengeMode?: boolean;
  onComplete: (record: UserDecisionRecord) => void;
  onBack: () => void;
  onNextScenario?: () => void;
  onShareChallenge: (scenario: Scenario) => void;
}

export default function ScenarioSimulator({
  scenario,
  existingRecord,
  isChallengeMode = false,
  onComplete,
  onBack,
  onNextScenario,
  onShareChallenge,
}: ScenarioSimulatorProps) {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(
    existingRecord?.initialChoice ?? null
  );
  const [selectedReasons, setSelectedReasons] = useState<string[]>(
    existingRecord?.initialReasoningTags ?? []
  );
  const [rationaleText, setRationaleText] = useState(
    existingRecord?.initialRationaleText ?? ''
  );

  const [postRevealStance, setPostRevealStance] = useState<PostRevealStance | null>(
    existingRecord?.postRevealStance ?? null
  );
  const [postRevealNote, setPostRevealNote] = useState(
    existingRecord?.postRevealNote ?? ''
  );
  const [swappedNames, setSwappedNames] = useState(false);
  const [showInitialNote, setShowInitialNote] = useState(
    Boolean(existingRecord?.initialRationaleText)
  );
  const [showRevealNote, setShowRevealNote] = useState(
    Boolean(existingRecord?.postRevealNote)
  );

  const scrollToStageTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((item) => item !== reason) : [...prev, reason]
    );
  };

  const handleStageJump = (targetStage: 1 | 2 | 3) => {
    setStage(targetStage);
    scrollToStageTop();
  };

  const handleProceedToReveal = () => {
    if (!selectedChoice) return;
    setSwappedNames(false);
    setStage(2);
    scrollToStageTop();
  };

  const handleProceedToComparison = () => {
    if (!selectedChoice || !postRevealStance) return;
    const record: UserDecisionRecord = {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      category: scenario.category,
      biasMechanism: scenario.biasMechanism,
      initialChoice: selectedChoice,
      initialReasoningTags: selectedReasons,
      initialRationaleText: rationaleText.trim(),
      postRevealStance,
      postRevealNote: postRevealNote.trim(),
      completedAt: new Date().toISOString(),
    };
    onComplete(record);
    setStage(3);
    scrollToStageTop();
  };

  const handleReplay = () => {
    setStage(1);
    setSelectedChoice(null);
    setSelectedReasons([]);
    setRationaleText('');
    setPostRevealStance(null);
    setPostRevealNote('');
    setSwappedNames(false);
    setShowInitialNote(false);
    setShowRevealNote(false);
    scrollToStageTop();
  };

  const chosenOption = scenario.options.find((opt) => opt.id === selectedChoice);

  const getRevealedIdentity = (index: number) => {
    if (!swappedNames) return scenario.options[index];
    return scenario.options[index === 0 ? 1 : 0];
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Connected 3-Stage Track */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>All Scenarios</span>
          </button>

          <div className="text-xs text-slate-500 flex items-center gap-2 truncate">
            <span className="font-medium text-slate-700">{scenario.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{scenario.durationMinutes} min</span>
            {isChallengeMode ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-sky-700">Friend Challenge</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Connected 3-Step Track */}
        <ol className="flex items-center gap-2 text-xs font-medium flex-wrap" aria-label="Simulation stage">
          {[
            { step: 1 as const, label: '01. Blind Decision' },
            { step: 2 as const, label: '02. Bias Reveal' },
            { step: 3 as const, label: '03. Evidence Audit' },
          ].map((item, idx) => {
            const isCurrent = stage === item.step;
            const isDone = stage > item.step;
            return (
              <React.Fragment key={item.step}>
                <li>
                  {isDone ? (
                    <button
                      type="button"
                      onClick={() => handleStageJump(item.step)}
                      className="px-3 py-1.5 rounded-md whitespace-nowrap transition-colors bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                        isCurrent
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
                {idx < 2 ? (
                  <span aria-hidden="true" className="text-slate-300">
                    —
                  </span>
                ) : null}
              </React.Fragment>
            );
          })}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: BLIND PROFILE DECISION */}
        {stage === 1 ? (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-mono text-sky-700">
                Stage 1 · Identities Masked for Unbiased Evaluation
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                {scenario.title}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">{scenario.contextBrief}</p>
            </div>

            <div className="pt-1">
              <p className="text-sm font-semibold text-slate-900 mb-4">
                {scenario.promptQuestion}
              </p>

              {/* Two-Column Candidate / Option Dossiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenario.options.map((opt) => {
                  const isSelected = selectedChoice === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedChoice(opt.id)}
                      className={`text-left p-6 rounded-xl border transition-all flex flex-col justify-between space-y-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                        isSelected
                          ? 'bg-sky-50/60 border-sky-700 ring-1 ring-sky-700 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-lg font-mono text-sm font-semibold flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-sky-700 text-white'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="font-serif text-xl font-semibold text-slate-900">
                              {opt.blindLabel}
                            </span>
                          </div>

                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${
                              isSelected
                                ? 'bg-sky-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isSelected ? 'Selected' : `Choose ${opt.id}`}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed">
                          {opt.blindSummary}
                        </p>
                      </div>

                      {/* Structured Metric vs Framing Cue Breakdown */}
                      <div className="pt-4 border-t border-slate-200 space-y-2.5 w-full">
                        {opt.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="flex items-baseline justify-between gap-4 text-xs"
                          >
                            <span className="inline-flex items-center gap-1.5 text-slate-500">
                              {metric.isObjective ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 text-sky-700 shrink-0"
                                  aria-hidden="true"
                                />
                              ) : (
                                <MessageSquareQuote
                                  className="w-3.5 h-3.5 text-amber-700 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{metric.label}</span>
                            </span>
                            <span className="font-mono font-medium text-slate-900 text-right tabular-nums">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reasoning Deck */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  What factored most into your judgment?
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Optional: tap one or more quick cues below, or continue straight to the reveal.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {scenario.reasoningPrompts.map((reason) => {
                  const active = selectedReasons.includes(reason);
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => toggleReason(reason)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              {showInitialNote ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="initial-rationale"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Your rationale (optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInitialNote(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Hide note
                    </button>
                  </div>
                  <textarea
                    id="initial-rationale"
                    rows={2}
                    value={rationaleText}
                    onChange={(e) => setRationaleText(e.target.value)}
                    placeholder="E.g. I prioritized decisive review style because the timeline is tight..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowInitialNote(true)}
                    className="text-xs font-medium text-sky-700 hover:text-sky-800 hover:underline"
                  >
                    + Add a quick note (optional)
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500">
                  {selectedChoice
                    ? `Initial pick locked: ${chosenOption?.blindLabel}`
                    : 'Choose an option above to unlock the Bias Reveal.'}
                </p>
                <button
                  type="button"
                  disabled={!selectedChoice}
                  onClick={handleProceedToReveal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span>See the Bias Reveal</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* STAGE 2: THE BIAS REVEAL */}
        {stage === 2 ? (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="bg-amber-50/75 border border-amber-200 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-mono">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span>Stage 2 · Context & Identity Reveal</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900">
                  {scenario.revealHeadline}
                </h2>
                <p className="text-base text-slate-700 leading-relaxed">
                  {scenario.revealContext}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSwappedNames((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-950 bg-white hover:bg-amber-100/60 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start lg:self-center"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                <span>{swappedNames ? 'Restore Original Reveal' : 'Flip Names (A ↔ B)'}</span>
              </button>
            </div>

            {/* Revealed Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenario.options.map((opt, idx) => {
                const wasChosen = selectedChoice === opt.id;
                const identitySource = getRevealedIdentity(idx);
                return (
                  <motion.div
                    key={`${opt.id}-${swappedNames ? 'swapped' : 'orig'}`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.16 }}
                    className={`p-6 rounded-xl border bg-white space-y-4 ${
                      wasChosen ? 'border-sky-700 ring-1 ring-sky-700 shadow-sm' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-mono text-slate-500">
                          {opt.blindLabel} · {opt.framingStyle}
                        </p>
                        <h3 className="font-serif text-xl font-semibold text-slate-900 mt-1">
                          {identitySource.revealedName}
                        </h3>
                      </div>
                      {wasChosen ? (
                        <span className="text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-md whitespace-nowrap">
                          Your Initial Pick
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {identitySource.revealedContext}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Perspective Re-evaluation Prompt */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  With this additional context visible, how does your judgment feel now?
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  BiasBreak does not label either initial choice as wrong. The reflection is simply
                  observing whether hidden cues shifted your reading.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPostRevealStance('kept')}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    postRevealStance === 'kept'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-semibold">Keep Initial Choice</p>
                  <p
                    className={`text-xs mt-1 ${
                      postRevealStance === 'kept' ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    My decision still stands after seeing the reveal.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPostRevealStance('reconsidered')}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    postRevealStance === 'reconsidered'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-semibold">Reconsider Decision</p>
                  <p
                    className={`text-xs mt-1 ${
                      postRevealStance === 'reconsidered' ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    Noticing the framing makes me rethink what I weighed.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPostRevealStance('equal')}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    postRevealStance === 'equal'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-semibold">Both Equally Qualified</p>
                  <p
                    className={`text-xs mt-1 ${
                      postRevealStance === 'equal' ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    Objective metrics are tied; I’d gather structured work samples.
                  </p>
                </button>
              </div>

              {showRevealNote ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="post-reveal-note"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      What surprised you or stood out? (optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRevealNote(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Hide note
                    </button>
                  </div>
                  <textarea
                    id="post-reveal-note"
                    rows={2}
                    value={postRevealNote}
                    onChange={(e) => setPostRevealNote(e.target.value)}
                    placeholder="E.g. I hadn't noticed that both candidates shared the exact same performance metrics..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowRevealNote(true)}
                    className="text-xs font-medium text-sky-700 hover:text-sky-800 hover:underline"
                  >
                    + Add a quick reflection note (optional)
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleStageJump(1)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  ← Back to Blind Profiles
                </button>
                <button
                  type="button"
                  disabled={!postRevealStance}
                  onClick={handleProceedToComparison}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Compare Evidence & Reflection</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* STAGE 3: DECISION COMPARISON & RESEARCH INSIGHTS */}
        {stage === 3 ? (
          <motion.div
            key="stage-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Side-by-Side Decision Comparison */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="pb-5 border-b border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-sky-700">
                    Stage 3 · Decision Comparison & Evidence Audit
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
                    {scenario.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Replay Scenario</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Initial Judgment */}
                <div className="space-y-3 md:pr-6 md:border-r md:border-slate-200">
                  <p className="text-xs font-mono text-slate-500">Your First Judgment (Blind)</p>
                  <p className="font-serif text-xl font-semibold text-slate-900">
                    {chosenOption?.blindLabel} ({chosenOption?.revealedName})
                  </p>
                  {selectedReasons.length > 0 ? (
                    <p className="text-xs text-slate-600">
                      Cues noted: {selectedReasons.join(' · ')}
                    </p>
                  ) : null}
                  {rationaleText ? (
                    <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      “{rationaleText}”
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No written note recorded.</p>
                  )}
                </div>

                {/* Column 2: Post-Reveal Perspective */}
                <div className="space-y-3">
                  <p className="text-xs font-mono text-slate-500">After Context Reveal</p>
                  <p className="font-serif text-xl font-semibold text-slate-900">
                    {postRevealStance === 'kept'
                      ? 'Kept Initial Decision'
                      : postRevealStance === 'reconsidered'
                        ? 'Reconsidered Decision'
                        : 'Recognized Equal Qualification'}
                  </p>
                  <p className="text-xs text-slate-600">
                    Mechanism Explored: {scenario.biasMechanism}
                  </p>
                  {postRevealNote ? (
                    <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      “{postRevealNote}”
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Reflection saved to your personal Insights summary.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Evidence vs. Assumption Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-sky-800">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Objective Evidence in This Scenario
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {scenario.evidenceBreakdown.objectiveFacts.map((fact) => (
                    <li key={fact} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2
                        className="w-4 h-4 text-sky-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Subjective Cues & Assumptions to Watch
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {scenario.evidenceBreakdown.subjectiveCues.map((cue) => (
                    <li key={cue} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Eye
                        className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Research Evidence & Debiasing Practice */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <BookOpen className="w-4 h-4 text-sky-700" aria-hidden="true" />
                  <h3 className="text-base font-semibold">Research Foundation</h3>
                </div>
                <p className="font-serif text-lg font-semibold text-slate-900">
                  {scenario.researchCitation.studyTitle}
                </p>
                <p className="text-xs font-mono text-slate-500">
                  {scenario.researchCitation.authors} · {scenario.researchCitation.year}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scenario.researchCitation.finding}
                </p>
              </div>

              <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-8 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-xs font-mono text-sky-700">Practical Debiasing Habit</p>
                  <p className="text-sm text-slate-800 leading-relaxed mt-2">
                    {scenario.debiasingPractice}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onShareChallenge(scenario)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4 text-sky-700" aria-hidden="true" />
                    <span>Challenge a Friend</span>
                  </button>

                  {onNextScenario ? (
                    <button
                      type="button"
                      onClick={onNextScenario}
                      className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <span>Next Scenario</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
