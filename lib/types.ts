export type ScenarioCategory =
  | 'Workplace & hiring'
  | 'Education'
  | 'Leadership'
  | 'Technology'
  | 'Daily life'
  | 'Sports';

export interface CandidateMetric {
  label: string;
  value: string;
  isObjective: boolean;
}

export interface ScenarioOption {
  id: 'A' | 'B';
  blindLabel: string;
  blindSummary: string;
  metrics: CandidateMetric[];
  framingStyle: string;
  revealedName: string;
  revealedContext: string;
}

export interface ResearchCitation {
  studyTitle: string;
  authors: string;
  year: number;
  finding: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  durationMinutes: number;
  biasMechanism: string;
  promptQuestion: string;
  contextBrief: string;
  options: [ScenarioOption, ScenarioOption];
  reasoningPrompts: string[];
  revealHeadline: string;
  revealContext: string;
  evidenceBreakdown: {
    objectiveFacts: string[];
    subjectiveCues: string[];
  };
  researchCitation: ResearchCitation;
  debiasingPractice: string;
  isCustom?: boolean;
}

export type PostRevealStance = 'kept' | 'reconsidered' | 'equal';

export interface UserDecisionRecord {
  scenarioId: string;
  scenarioTitle: string;
  category: ScenarioCategory;
  biasMechanism: string;
  initialChoice: 'A' | 'B';
  initialReasoningTags: string[];
  initialRationaleText: string;
  postRevealStance: PostRevealStance;
  postRevealNote: string;
  completedAt: string;
}

export interface FramingSwapCase {
  id: string;
  domain: string;
  title: string;
  sharedMetrics: string[];
  maleFramedName: string;
  maleFramedExcerpt: string;
  maleObservedReaction: string;
  femaleFramedName: string;
  femaleFramedExcerpt: string;
  femaleObservedReaction: string;
  cognitiveTakeaway: string;
}
