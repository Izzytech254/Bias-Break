'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Send, Users } from 'lucide-react';
import type { Scenario } from '@/lib/types';

interface ChallengeHubProps {
  scenarios: Scenario[];
  preselectedScenarioId?: string;
  onLaunchChallengePreview: (scenario: Scenario) => void;
}

export default function ChallengeHub({
  scenarios,
  preselectedScenarioId,
  onLaunchChallengePreview,
}: ChallengeHubProps) {
  const [selectedId, setSelectedId] = useState(
    preselectedScenarioId || scenarios[0]?.id || ''
  );
  const [challengerName, setChallengerName] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedScenario =
    scenarios.find((s) => s.id === selectedId) || scenarios[0];

  const getChallengeUrl = () => {
    if (typeof window === 'undefined' || !selectedScenario) return '';
    const params = new URLSearchParams();
    params.set('challenge', selectedScenario.id);
    if (challengerName.trim()) {
      params.set('from', challengerName.trim());
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    const url = getChallengeUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (!selectedScenario) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs font-mono text-sky-700">Peer Discussion & Challenge Mode</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Challenge a friend or teammate
        </h2>
        <p className="text-base text-slate-600">
          Send a blind scenario link without spoilers. Your friend makes their initial judgment
          first, unlocks the Bias Reveal, and compares which cues influenced their thinking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <label
              htmlFor="challenge-scenario"
              className="block text-xs font-semibold text-slate-700 mb-2"
            >
              1. Pick a scenario to send
            </label>
            <select
              id="challenge-scenario"
              value={selectedScenario.id}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setCopied(false);
              }}
              className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:bg-white focus:border-sky-700 focus:outline-none"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.category} — {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="challenger-name"
              className="block text-xs font-semibold text-slate-700 mb-2"
            >
              2. Your name (optional)
            </label>
            <input
              id="challenger-name"
              type="text"
              value={challengerName}
              onChange={(e) => setChallengerName(e.target.value)}
              placeholder="E.g. Alex"
              className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">
              3. Share blind invitation link
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Challenge Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copy Challenge Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onLaunchChallengePreview(selectedScenario)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 text-sky-700" aria-hidden="true" />
                <span>Preview Friend Experience</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sky-700">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-mono">Invitation Preview</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-slate-900">
              {selectedScenario.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {challengerName.trim()
                ? `${challengerName.trim()} invited you to make a blind decision on this real-world scenario before seeing the Bias Reveal.`
                : 'A friend invited you to make a blind decision on this real-world scenario before seeing the Bias Reveal.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onLaunchChallengePreview(selectedScenario)}
            className="inline-flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <span>Open Blind Scenario Now</span>
            <ArrowRight className="w-4 h-4 text-sky-700" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
