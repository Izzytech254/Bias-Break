'use client';

import React, { useState } from 'react';
import { Loader2, PlusCircle, Wand2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SCENARIO_CATEGORIES } from '@/lib/scenarios';
import type { Scenario, ScenarioCategory } from '@/lib/types';

interface ScenarioCreatorProps {
  onCreateScenario: (scenario: Scenario) => void;
}

export default function ScenarioCreator({ onCreateScenario }: ScenarioCreatorProps) {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [category, setCategory] = useState<ScenarioCategory>('Workplace & hiring');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // Editable Scenario Form State
  const [title, setTitle] = useState('');
  const [biasMechanism, setBiasMechanism] = useState('');
  const [contextBrief, setContextBrief] = useState('');
  const [promptQuestion, setPromptQuestion] = useState('');
  const [optASummary, setOptASummary] = useState('');
  const [optARevealedName, setOptARevealedName] = useState('');
  const [optARevealedContext, setOptARevealedContext] = useState('');
  const [optBSummary, setOptBSummary] = useState('');
  const [optBRevealedName, setOptBRevealedName] = useState('');
  const [optBRevealedContext, setOptBRevealedContext] = useState('');
  const [revealHeadline, setRevealHeadline] = useState('');
  const [revealContext, setRevealContext] = useState('');
  const [studyTitle, setStudyTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [finding, setFinding] = useState('');
  const [debiasingPractice, setDebiasingPractice] = useState('');

  const [draftedExtra, setDraftedExtra] = useState<Scenario | null>(null);

  const handleAIDraft = async () => {
    setErrorMsg(null);
    setSavedNotice(false);
    if (topicPrompt.trim().length < 4) {
      setErrorMsg('Please enter a short real-world situation or topic to draft.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicPrompt.trim(), category }),
      });

      const rawBody = await res.text();
      let data: { scenario?: Scenario; error?: string } | null = null;
      try {
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        throw new Error(
          `The scenario generator returned an unexpected response (HTTP ${res.status}). Please try again in a moment.`
        );
      }

      if (!res.ok || !data?.scenario) {
        throw new Error(data?.error || 'Could not draft scenario. Please try again.');
      }

      const s: Scenario = data.scenario;
      setDraftedExtra(s);
      setTitle(s.title);
      setBiasMechanism(s.biasMechanism);
      setContextBrief(s.contextBrief);
      setPromptQuestion(s.promptQuestion);
      setOptASummary(s.options[0].blindSummary);
      setOptARevealedName(s.options[0].revealedName);
      setOptARevealedContext(s.options[0].revealedContext);
      setOptBSummary(s.options[1].blindSummary);
      setOptBRevealedName(s.options[1].revealedName);
      setOptBRevealedContext(s.options[1].revealedContext);
      setRevealHeadline(s.revealHeadline);
      setRevealContext(s.revealContext);
      setStudyTitle(s.researchCitation.studyTitle);
      setAuthors(s.researchCitation.authors);
      setFinding(s.researchCitation.finding);
      setDebiasingPractice(s.debiasingPractice);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to generate scenario right now.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !contextBrief.trim() || !optASummary.trim() || !optBSummary.trim()) {
      setErrorMsg('Please fill in the scenario title, brief, and both blind option summaries.');
      return;
    }

    const newScenario: Scenario = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      durationMinutes: 3,
      biasMechanism: biasMechanism.trim() || 'Assumption vs. Evidence Awareness',
      contextBrief: contextBrief.trim(),
      promptQuestion: promptQuestion.trim() || 'Which option would you select based on the brief?',
      options: [
        {
          id: 'A',
          blindLabel: 'Candidate A',
          blindSummary: optASummary.trim(),
          metrics: draftedExtra?.options[0].metrics ?? [
            { label: 'Core Benchmark', value: 'Equivalent', isObjective: true },
            { label: 'Framing Note', value: 'Direct framing', isObjective: false },
          ],
          framingStyle: draftedExtra?.options[0].framingStyle ?? 'Direct framing',
          revealedName: optARevealedName.trim() || 'Profile A (Revealed)',
          revealedContext:
            optARevealedContext.trim() ||
            'Revealed context highlights how identical credentials can be read differently.',
        },
        {
          id: 'B',
          blindLabel: 'Candidate B',
          blindSummary: optBSummary.trim(),
          metrics: draftedExtra?.options[1].metrics ?? [
            { label: 'Core Benchmark', value: 'Equivalent', isObjective: true },
            { label: 'Framing Note', value: 'Collaborative framing', isObjective: false },
          ],
          framingStyle: draftedExtra?.options[1].framingStyle ?? 'Collaborative framing',
          revealedName: optBRevealedName.trim() || 'Profile B (Revealed)',
          revealedContext:
            optBRevealedContext.trim() ||
            'Revealed context shows equivalent qualifications paired with different style cues.',
        },
      ],
      reasoningPrompts: draftedExtra?.reasoningPrompts ?? [
        'Objective credentials',
        'Communication style',
        'Perceived readiness',
        'Equal qualifications',
      ],
      revealHeadline:
        revealHeadline.trim() || 'Looking beneath initial assumptions to check the evidence',
      revealContext:
        revealContext.trim() ||
        'Both profiles share equivalent qualifications. Comparing the blind choice against the reveal helps surface hidden expectations.',
      evidenceBreakdown: draftedExtra?.evidenceBreakdown ?? {
        objectiveFacts: ['Both profiles hold equivalent core qualifications and delivery metrics.'],
        subjectiveCues: ['Subtle wording or identity cues can steer quick intuitive judgments.'],
      },
      researchCitation: {
        studyTitle: studyTitle.trim() || 'Educator-Authored Behavioral Reflection Scenario',
        authors: authors.trim() || 'Workshop Facilitator Contribution',
        year: draftedExtra?.researchCitation.year ?? new Date().getFullYear(),
        finding:
          finding.trim() ||
          'Structured blind evaluation prior to reviewing identity cues improves decision consistency.',
      },
      debiasingPractice:
        debiasingPractice.trim() ||
        'Define measurable selection criteria before reviewing identifying details.',
      isCustom: true,
    };

    onCreateScenario(newScenario);
    setSavedNotice(true);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs font-mono text-sky-700">Educator & Facilitator Studio</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Create a Custom BiasBreak Scenario
        </h2>
        <p className="text-base text-slate-600">
          Design a classroom, workplace, or workshop simulation. Draft a research-grounded scenario
          from a topic or author every blind profile and reveal detail yourself.
        </p>
      </div>

      {/* Research Draft Helper */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Research-Grounded Scenario Drafter
            </h3>
            <p className="text-xs text-slate-500">
              Describe a real-world decision setting and populate the editable fields below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label htmlFor="creator-category" className="sr-only">
              Category
            </label>
            <select
              id="creator-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ScenarioCategory)}
              className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            >
              {SCENARIO_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5">
            <label htmlFor="creator-topic" className="sr-only">
              Scenario topic
            </label>
            <input
              id="creator-topic"
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="E.g. Choosing a surgical residency chief or AI lead..."
              className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleAIDraft}
              className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg transition-colors whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Drafting...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" aria-hidden="true" />
                  <span>Draft Scenario</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg ? (
          <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-red-200 bg-red-50 text-sm text-red-900"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleAIDraft}
              className="px-3 py-1.5 text-xs font-semibold text-red-900 bg-white border border-red-200 hover:bg-red-100 rounded-md whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              Retry Draft
            </button>
          </div>
        ) : null}

        {savedNotice ? (
          <div
            role="status"
            className="flex items-center gap-2.5 p-3.5 rounded-lg border border-emerald-200 bg-emerald-50 text-sm text-emerald-900"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>
              Scenario published to your library! Launching your simulation now...
            </span>
          </div>
        ) : null}
      </div>

      {/* Editable Form */}
      <form
        onSubmit={handlePublish}
        className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="field-title" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Scenario Question Title *
            </label>
            <input
              id="field-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Who should lead the emergency triage team?"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="field-mech" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cognitive Mechanism Explored
            </label>
            <input
              id="field-mech"
              type="text"
              value={biasMechanism}
              onChange={(e) => setBiasMechanism(e.target.value)}
              placeholder="Authority & Assertiveness Framing"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="field-brief" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Stage 1 Context Brief (Blind Setup) *
          </label>
          <textarea
            id="field-brief"
            rows={2}
            required
            value={contextBrief}
            onChange={(e) => setContextBrief(e.target.value)}
            placeholder="Describe the shared qualifications and situation without revealing gender..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          <div className="space-y-3">
            <p className="text-xs font-mono text-slate-500">Option A (Blind + Reveal)</p>
            <textarea
              rows={3}
              required
              value={optASummary}
              onChange={(e) => setOptASummary(e.target.value)}
              placeholder="Candidate A blind profile summary..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
            <input
              type="text"
              value={optARevealedName}
              onChange={(e) => setOptARevealedName(e.target.value)}
              placeholder="Revealed Identity (e.g. Jordan Lee)"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
            <textarea
              rows={2}
              value={optARevealedContext}
              onChange={(e) => setOptARevealedContext(e.target.value)}
              placeholder="What the reveal highlights for Option A..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-mono text-slate-500">Option B (Blind + Reveal)</p>
            <textarea
              rows={3}
              required
              value={optBSummary}
              onChange={(e) => setOptBSummary(e.target.value)}
              placeholder="Candidate B blind profile summary..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
            <input
              type="text"
              value={optBRevealedName}
              onChange={(e) => setOptBRevealedName(e.target.value)}
              placeholder="Revealed Identity (e.g. Priya Nair)"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
            <textarea
              rows={2}
              value={optBRevealedContext}
              onChange={(e) => setOptBRevealedContext(e.target.value)}
              placeholder="What the reveal highlights for Option B..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="field-rev-head" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bias Reveal Headline
            </label>
            <input
              id="field-rev-head"
              type="text"
              value={revealHeadline}
              onChange={(e) => setRevealHeadline(e.target.value)}
              placeholder="Identical track records, different framing lenses"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="field-habit" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Practical Debiasing Habit
            </label>
            <input
              id="field-habit"
              type="text"
              value={debiasingPractice}
              onChange={(e) => setDebiasingPractice(e.target.value)}
              placeholder="Use blind scorecards prior to reviewing names"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Publish & Test Scenario</span>
          </button>
        </div>
      </form>
    </section>
  );
}
