import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, SCENARIO_RESPONSE_SCHEMA } from '@/lib/gemini';
import type { Scenario, ScenarioCategory } from '@/lib/types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function extractErrorDetails(err: unknown): { status: number; message: string } {
  const fallback = {
    status: 500,
    message: 'Unable to generate a scenario draft right now. Please try again in a moment.',
  };

  if (!(err instanceof Error)) return fallback;

  const raw = err.message || '';
  let parsedCode: number | undefined;
  let parsedMessage: string | undefined;
  let parsedStatus: string | undefined;

  // @google/genai often serializes upstream errors as JSON strings in err.message
  try {
    const json = JSON.parse(raw);
    if (json?.error) {
      parsedCode = typeof json.error.code === 'number' ? json.error.code : undefined;
      parsedMessage = typeof json.error.message === 'string' ? json.error.message : undefined;
      parsedStatus = typeof json.error.status === 'string' ? json.error.status : undefined;
    }
  } catch {
    // err.message is plain text
  }

  const msg = parsedMessage || raw;
  const code = parsedCode || (raw.includes('503') ? 503 : raw.includes('429') ? 429 : 500);

  if (code === 503 || parsedStatus === 'UNAVAILABLE') {
    return {
      status: 503,
      message:
        'The scenario drafting service is experiencing a temporary spike in demand. Please click Retry Draft in a few seconds, or fill in the scenario fields directly below.',
    };
  }

  if (code === 429 || parsedStatus === 'RESOURCE_EXHAUSTED') {
    return {
      status: 429,
      message:
        'Rate limit reached for scenario drafting. Please wait a few seconds before trying again, or check your API key quota in Settings > Secrets.',
    };
  }

  if (code === 400 || code === 403 || parsedStatus === 'PERMISSION_DENIED') {
    return {
      status: code,
      message:
        'Please verify your GEMINI_API_KEY configuration in Settings > Secrets and try again.',
    };
  }

  return { status: code >= 400 && code < 600 ? code : 500, message: msg || fallback.message };
}

function isTransientError(err: unknown): boolean {
  const details = extractErrorDetails(err);
  return details.status === 503 || details.status === 429;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    const category = (body?.category as ScenarioCategory) || 'Workplace & hiring';

    if (!topic || topic.length < 4) {
      return NextResponse.json(
        { error: 'Please provide a brief real-world topic (at least 4 characters).' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    const prompt = `Design an educational, non-judgmental cognitive bias scenario for BiasBreak in the category "${category}" about: "${topic}".
      
Requirements:
- Option A and Option B MUST have equivalent objective qualifications/metrics (identical GPA, years of experience, or performance numbers) during the blind phase so neither is objectively superior.
- Do NOT reveal gender or names in blindLabel, blindSummary, or metrics.
- Include realistic subtle framing differences (e.g., agentic vs. communal language, or life-context framing) in the blind descriptions.
- In revealedName and revealedContext, reveal identities and explain how real-world stereotypes shape interpretation of identical facts.
- Cite a real, credible peer-reviewed behavioral or social psychology study (no fabricated citations).
- Tone must be reflective, curious, and evidence-based—never accusatory or preachy.`;

    const modelOrder = ['gemini-4-hydrogen', 'gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
    const backoffMs = [0, 900, 1800];

    let responseText: string | undefined;
    let lastError: unknown;

    for (let attempt = 0; attempt < modelOrder.length; attempt++) {
      if (backoffMs[attempt] > 0) {
        await sleep(backoffMs[attempt]);
      }
      try {
        const response = await ai.models.generateContent({
          model: modelOrder[attempt],
          contents: prompt,
          config: {
            systemInstruction:
              'You are a behavioral science educator creating interactive perspective-shift scenarios for SDG 5 Gender Equality and evidence-based decision-making.',
            responseMimeType: 'application/json',
            responseSchema: SCENARIO_RESPONSE_SCHEMA,
          },
        });
        responseText = response.text?.trim();
        if (responseText) break;
      } catch (err) {
        lastError = err;
        if (!isTransientError(err)) {
          break;
        }
      }
    }

    if (!responseText) {
      if (lastError) {
        const { status, message } = extractErrorDetails(lastError);
        return NextResponse.json({ error: message }, { status });
      }
      return NextResponse.json(
        { error: 'The scenario generator returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(responseText);

    const generatedScenario: Scenario = {
      id: `custom-${Date.now()}`,
      title: parsed.title,
      category,
      durationMinutes: 3,
      biasMechanism: parsed.biasMechanism,
      promptQuestion: parsed.promptQuestion,
      contextBrief: parsed.contextBrief,
      options: [
        {
          id: 'A',
          blindLabel: parsed.optionA.blindLabel || 'Candidate A',
          blindSummary: parsed.optionA.blindSummary,
          metrics: [
            { label: parsed.optionA.objectiveMetric1Label, value: parsed.optionA.objectiveMetric1Value, isObjective: true },
            { label: parsed.optionA.objectiveMetric2Label, value: parsed.optionA.objectiveMetric2Value, isObjective: true },
            { label: parsed.optionA.subjectiveCueLabel, value: parsed.optionA.subjectiveCueValue, isObjective: false },
          ],
          framingStyle: parsed.optionA.framingStyle,
          revealedName: parsed.optionA.revealedName,
          revealedContext: parsed.optionA.revealedContext,
        },
        {
          id: 'B',
          blindLabel: parsed.optionB.blindLabel || 'Candidate B',
          blindSummary: parsed.optionB.blindSummary,
          metrics: [
            { label: parsed.optionB.objectiveMetric1Label, value: parsed.optionB.objectiveMetric1Value, isObjective: true },
            { label: parsed.optionB.objectiveMetric2Label, value: parsed.optionB.objectiveMetric2Value, isObjective: true },
            { label: parsed.optionB.subjectiveCueLabel, value: parsed.optionB.subjectiveCueValue, isObjective: false },
          ],
          framingStyle: parsed.optionB.framingStyle,
          revealedName: parsed.optionB.revealedName,
          revealedContext: parsed.optionB.revealedContext,
        },
      ],
      reasoningPrompts: Array.isArray(parsed.reasoningPrompts) ? parsed.reasoningPrompts.slice(0, 4) : [],
      revealHeadline: parsed.revealHeadline,
      revealContext: parsed.revealContext,
      evidenceBreakdown: {
        objectiveFacts: parsed.objectiveFacts || [],
        subjectiveCues: parsed.subjectiveCues || [],
      },
      researchCitation: {
        studyTitle: parsed.studyTitle,
        authors: parsed.authors,
        year: parsed.year || 2020,
        finding: parsed.finding,
      },
      debiasingPractice: parsed.debiasingPractice,
      isCustom: true,
    };

    return NextResponse.json({ scenario: generatedScenario });
  } catch (err: unknown) {
    const { status, message } = extractErrorDetails(err);
    return NextResponse.json({ error: message }, { status });
  }
}
