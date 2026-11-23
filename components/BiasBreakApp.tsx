'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import TopNav, { type NavSection } from '@/components/TopNav';
import HeroSection from '@/components/HeroSection';
import ScenarioExplorer from '@/components/ScenarioExplorer';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import BiasRevealLab from '@/components/BiasRevealLab';
import InsightsDashboard from '@/components/InsightsDashboard';
import ScenarioCreator from '@/components/ScenarioCreator';
import ChallengeHub from '@/components/ChallengeHub';
import ReflectionCoach from '@/components/ReflectionCoach';
import { INITIAL_SCENARIOS } from '@/lib/scenarios';
import type { Scenario, UserDecisionRecord } from '@/lib/types';

const STORAGE_RECORDS_KEY = 'biasbreak_records_v1';
const STORAGE_CUSTOM_KEY = 'biasbreak_custom_scenarios_v1';

export default function BiasBreakApp() {
  const [activeSection, setActiveSection] = useState<NavSection>('explore');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isChallengePreview, setIsChallengePreview] = useState(false);
  const [challengeInviter, setChallengeInviter] = useState<string | null>(null);
  const [challengeScenarioId, setChallengeScenarioId] = useState<string | undefined>(undefined);

  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
  const [records, setRecords] = useState<UserDecisionRecord[]>([]);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [coachPendingPrompt, setCoachPendingPrompt] = useState<string | null>(null);

  const explorerRef = useRef<HTMLDivElement | null>(null);

  const allScenarios = [...customScenarios, ...INITIAL_SCENARIOS];

  // Hydrate persisted reflection history, custom scenarios, and optional URL challenge
  useEffect(() => {
    const timer = window.setTimeout(() => {
      let loadedCustom: Scenario[] = [];
      try {
        const savedRecords = localStorage.getItem(STORAGE_RECORDS_KEY);
        if (savedRecords) {
          const parsed = JSON.parse(savedRecords);
          if (Array.isArray(parsed)) setRecords(parsed);
        }

        const savedCustom = localStorage.getItem(STORAGE_CUSTOM_KEY);
        if (savedCustom) {
          const parsedCustom = JSON.parse(savedCustom);
          if (Array.isArray(parsedCustom)) {
            loadedCustom = parsedCustom;
            setCustomScenarios(parsedCustom);
          }
        }
      } catch {
        // Ignore storage read errors in restricted contexts
      }

      const params = new URLSearchParams(window.location.search);
      const challengeId = params.get('challenge');
      const fromName = params.get('from');
      if (challengeId) {
        const pool = [...loadedCustom, ...INITIAL_SCENARIOS];
        const match = pool.find((s) => s.id === challengeId);
        if (match) {
          setActiveScenario(match);
          setIsChallengePreview(true);
          if (fromName) setChallengeInviter(fromName);
        }
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSaveRecord = (newRecord: UserDecisionRecord) => {
    setRecords((prev) => {
      const filtered = prev.filter((item) => item.scenarioId !== newRecord.scenarioId);
      const updated = [newRecord, ...filtered];
      try {
        localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const handleResetRecords = () => {
    setRecords([]);
    try {
      localStorage.removeItem(STORAGE_RECORDS_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleCreateScenario = (scenario: Scenario) => {
    setCustomScenarios((prev) => {
      const updated = [scenario, ...prev];
      try {
        localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
    setActiveScenario(scenario);
    setIsChallengePreview(false);
    setActiveSection('explore');
  };

  const handleNavigate = (section: NavSection) => {
    setActiveScenario(null);
    setIsChallengePreview(false);
    setChallengeInviter(null);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExploring = () => {
    setActiveScenario(null);
    setActiveSection('explore');
    setTimeout(() => {
      explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleOpenScenario = (scenario: Scenario, challengeMode = false) => {
    setActiveScenario(scenario);
    setIsChallengePreview(challengeMode);
    setActiveSection('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextScenario = () => {
    if (!activeScenario) return;
    const currentIndex = allScenarios.findIndex((s) => s.id === activeScenario.id);
    const next = allScenarios[(currentIndex + 1) % allScenarios.length];
    if (next) {
      setActiveScenario(next);
      setIsChallengePreview(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShareChallenge = (scenario: Scenario) => {
    setChallengeScenarioId(scenario.id);
    setActiveScenario(null);
    setActiveSection('challenge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col text-slate-900">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-optical-canvas" />
        <TopNav
          activeSection={activeSection}
          onNavigate={handleNavigate}
          completedCount={records.length}
        />

        <main className="flex-1">
          {activeScenario ? (
            <div>
              {challengeInviter ? (
                <div className="bg-sky-50 border-b border-sky-200 px-4 py-3 text-center text-sm text-sky-900">
                  <span className="font-semibold">{challengeInviter}</span> challenged you to make a
                  blind judgment on this scenario before viewing the Bias Reveal.
                </div>
              ) : null}

              <ScenarioSimulator
                key={activeScenario.id}
                scenario={activeScenario}
                existingRecord={records.find((r) => r.scenarioId === activeScenario.id)}
                isChallengeMode={isChallengePreview}
                onComplete={handleSaveRecord}
                onBack={() => {
                  setActiveScenario(null);
                  setIsChallengePreview(false);
                  setChallengeInviter(null);
                }}
                onNextScenario={handleNextScenario}
                onShareChallenge={handleShareChallenge}
                onAskCoach={(prompt) => {
                  setCoachPendingPrompt(prompt);
                  setIsCoachOpen(true);
                }}
              />
            </div>
          ) : (
            <>
              {activeSection === 'explore' ? (
                <>
                  <HeroSection
                    onStartExploring={handleStartExploring}
                    onOpenRevealLab={() => handleNavigate('reveal-lab')}
                    totalScenarios={allScenarios.length}
                  />
                  <div ref={explorerRef}>
                    <ScenarioExplorer
                      scenarios={allScenarios}
                      records={records}
                      onSelectScenario={(s) => handleOpenScenario(s, false)}
                    />
                  </div>
                </>
              ) : null}

              {activeSection === 'reveal-lab' ? <BiasRevealLab /> : null}

              {activeSection === 'insights' ? (
                <InsightsDashboard
                  records={records}
                  scenarios={allScenarios}
                  onOpenScenario={(s) => handleOpenScenario(s, false)}
                  onExploreMore={() => handleNavigate('explore')}
                  onResetRecords={handleResetRecords}
                />
              ) : null}

              {activeSection === 'creator' ? (
                <ScenarioCreator onCreateScenario={handleCreateScenario} />
              ) : null}

              {activeSection === 'challenge' ? (
                <ChallengeHub
                  scenarios={allScenarios}
                  preselectedScenarioId={challengeScenarioId}
                  onLaunchChallengePreview={(s) => handleOpenScenario(s, true)}
                />
              ) : null}
            </>
          )}
        </main>

        {/* Quiet Editorial Footer */}
        <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-sm mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div className="space-y-1">
              <p className="font-serif text-sm font-semibold text-slate-900">BiasBreak</p>
              <p>
                Interactive perspective-shift simulations for evidence-based judgment · UN SDG 5
                Gender Equality
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => handleNavigate('explore')}
                className="hover:text-slate-900 transition-colors"
              >
                Scenarios
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('reveal-lab')}
                className="hover:text-slate-900 transition-colors"
              >
                Bias Reveal Lab
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('insights')}
                className="hover:text-slate-900 transition-colors"
              >
                Learning Reflection
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('creator')}
                className="hover:text-slate-900 transition-colors"
              >
                Educator Studio
              </button>
            </div>
          </div>
        </footer>

        <ReflectionCoach
          isOpen={isCoachOpen}
          onToggleOpen={setIsCoachOpen}
          activeScenario={activeScenario}
          completedCount={records.length}
          reconsideredCount={records.filter((r) => r.postRevealStance === 'reconsidered').length}
          pendingPrompt={coachPendingPrompt}
          onConsumePendingPrompt={() => setCoachPendingPrompt(null)}
        />
      </div>
    </MotionConfig>
  );
}
