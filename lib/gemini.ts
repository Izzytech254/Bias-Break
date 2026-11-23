import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export function getGeminiClient(): GoogleGenAI {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const SCENARIO_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Concise, engaging scenario question title (e.g. "Who should lead the surgical rotation?")',
    },
    biasMechanism: {
      type: Type.STRING,
      description: 'Specific cognitive bias mechanism explored (e.g. "Confidence Heuristic & Attribution Bias")',
    },
    contextBrief: {
      type: Type.STRING,
      description: 'Realistic 2-3 sentence setup explaining the situation without revealing gender yet.',
    },
    promptQuestion: {
      type: Type.STRING,
      description: 'Clear 1-sentence decision prompt for the user.',
    },
    optionA: {
      type: Type.OBJECT,
      properties: {
        blindLabel: { type: Type.STRING },
        blindSummary: { type: Type.STRING },
        objectiveMetric1Label: { type: Type.STRING },
        objectiveMetric1Value: { type: Type.STRING },
        objectiveMetric2Label: { type: Type.STRING },
        objectiveMetric2Value: { type: Type.STRING },
        subjectiveCueLabel: { type: Type.STRING },
        subjectiveCueValue: { type: Type.STRING },
        framingStyle: { type: Type.STRING },
        revealedName: { type: Type.STRING },
        revealedContext: { type: Type.STRING },
      },
      required: [
        'blindLabel',
        'blindSummary',
        'objectiveMetric1Label',
        'objectiveMetric1Value',
        'objectiveMetric2Label',
        'objectiveMetric2Value',
        'subjectiveCueLabel',
        'subjectiveCueValue',
        'framingStyle',
        'revealedName',
        'revealedContext',
      ],
    },
    optionB: {
      type: Type.OBJECT,
      properties: {
        blindLabel: { type: Type.STRING },
        blindSummary: { type: Type.STRING },
        objectiveMetric1Label: { type: Type.STRING },
        objectiveMetric1Value: { type: Type.STRING },
        objectiveMetric2Label: { type: Type.STRING },
        objectiveMetric2Value: { type: Type.STRING },
        subjectiveCueLabel: { type: Type.STRING },
        subjectiveCueValue: { type: Type.STRING },
        framingStyle: { type: Type.STRING },
        revealedName: { type: Type.STRING },
        revealedContext: { type: Type.STRING },
      },
      required: [
        'blindLabel',
        'blindSummary',
        'objectiveMetric1Label',
        'objectiveMetric1Value',
        'objectiveMetric2Label',
        'objectiveMetric2Value',
        'subjectiveCueLabel',
        'subjectiveCueValue',
        'framingStyle',
        'revealedName',
        'revealedContext',
      ],
    },
    reasoningPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 concise reasoning chips a user might pick to explain their initial choice.',
    },
    revealHeadline: {
      type: Type.STRING,
      description: 'Non-judgmental headline explaining the perspective shift.',
    },
    revealContext: {
      type: Type.STRING,
      description: 'Reflective 2-3 sentence explanation showing why neither initial choice proves prejudice, and what assumptions to notice.',
    },
    objectiveFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-3 verified objective facts shared by both options.',
    },
    subjectiveCues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 subtle subjective cues that often trigger assumptions.',
    },
    studyTitle: { type: Type.STRING },
    authors: { type: Type.STRING },
    year: { type: Type.INTEGER },
    finding: { type: Type.STRING },
    debiasingPractice: {
      type: Type.STRING,
      description: 'One concrete, actionable habit for making fairer evidence-based decisions.',
    },
  },
  required: [
    'title',
    'biasMechanism',
    'contextBrief',
    'promptQuestion',
    'optionA',
    'optionB',
    'reasoningPrompts',
    'revealHeadline',
    'revealContext',
    'objectiveFacts',
    'subjectiveCues',
    'studyTitle',
    'authors',
    'year',
    'finding',
    'debiasingPractice',
  ],
};
