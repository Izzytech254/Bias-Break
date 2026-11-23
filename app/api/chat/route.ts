import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

interface ChatContextInput {
  activeScenarioTitle?: string;
  activeBiasMechanism?: string;
  completedCount?: number;
  reconsideredCount?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function extractChatError(err: unknown): { status: number; message: string } {
  const fallback = {
    status: 500,
    message: 'Unable to reach the Reflection Coach right now. Please try again in a moment.',
  };

  if (!(err instanceof Error)) return fallback;

  const raw = err.message || '';
  let parsedCode: number | undefined;
  let parsedMessage: string | undefined;
  let parsedStatus: string | undefined;

  try {
    const json = JSON.parse(raw);
    if (json?.error) {
      parsedCode = typeof json.error.code === 'number' ? json.error.code : undefined;
      parsedMessage = typeof json.error.message === 'string' ? json.error.message : undefined;
      parsedStatus = typeof json.error.status === 'string' ? json.error.status : undefined;
    }
  } catch {
    // Plain text error
  }

  const code = parsedCode || (raw.includes('503') ? 503 : raw.includes('429') ? 429 : 500);

  if (code === 503 || parsedStatus === 'UNAVAILABLE') {
    return {
      status: 503,
      message:
        'The Reflection Coach is experiencing a temporary spike in demand. Please click retry in a few seconds.',
    };
  }

  if (code === 429 || parsedStatus === 'RESOURCE_EXHAUSTED') {
    return {
      status: 429,
      message:
        'Rate limit reached for the Reflection Coach. Please wait a few seconds or check your API key quota in Settings > Secrets.',
    };
  }

  if (code === 400 || code === 403 || parsedStatus === 'PERMISSION_DENIED') {
    return {
      status: code,
      message:
        'Please verify your GEMINI_API_KEY configuration in Settings > Secrets and try again.',
    };
  }

  return {
    status: code >= 400 && code < 600 ? code : 500,
    message: parsedMessage || raw || fallback.message,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMessages: ChatMessageInput[] = Array.isArray(body?.messages) ? body.messages : [];
    const context: ChatContextInput = body?.context || {};

    const validMessages = rawMessages.filter(
      (m) =>
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim().length > 0
    );

    if (validMessages.length === 0) {
      return NextResponse.json({ error: 'Please enter a message to continue.' }, { status: 400 });
    }

    const latestMessage = validMessages[validMessages.length - 1];
    if (latestMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'The latest message must come from the user.' },
        { status: 400 }
      );
    }

    const historyMessages = validMessages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const contextLines: string[] = [];
    if (context.activeScenarioTitle) {
      contextLines.push(`The user is currently exploring the scenario: "${context.activeScenarioTitle}".`);
    }
    if (context.activeBiasMechanism) {
      contextLines.push(`The cognitive mechanism in focus is: ${context.activeBiasMechanism}.`);
    }
    if (typeof context.completedCount === 'number' && context.completedCount > 0) {
      contextLines.push(
        `So far, the user has completed ${context.completedCount} scenario(s) and reconsidered ${context.reconsideredCount ?? 0} decision(s).`
      );
    }

    const systemInstruction = `You are the BiasBreak Reflection Coach, a calm, thoughtful behavioral science guide supporting UN SDG 5 (Gender Equality) and evidence-based decision-making.

Your role and tone:
- Help users examine assumptions vs. measurable evidence in hiring, education, leadership, technology, sports, and everyday life.
- NEVER lecture, scold, or label the user as biased or prejudiced. Keep the tone curious, Socratic, respectful, and grounded in peer-reviewed research (such as Moss-Racusin et al. 2012, Bowles et al. 2007, Eagly & Karau 2002, Terrell et al. 2017, Correll et al. 2007, Kanze et al. 2018).
- Keep responses concise and scannable (2–4 short paragraphs or crisp bullet points) unless the user asks for deeper detail.
- Offer practical debiasing practices (e.g., structured rubrics, blind work-sample reviews, separating strategic substance from communication tone).
${contextLines.length > 0 ? `\nCurrent Session Context:\n${contextLines.join('\n')}` : ''}`;

    const ai = getGeminiClient();
    const modelOrder = ['gemini-4-hydrogen', 'gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
    const backoffMs = [0, 800, 1600];

    let replyText: string | undefined;
    let lastError: unknown;

    for (let attempt = 0; attempt < modelOrder.length; attempt++) {
      if (backoffMs[attempt] > 0) {
        await sleep(backoffMs[attempt]);
      }

      try {
        const chat = ai.chats.create({
          model: modelOrder[attempt],
          ...(historyMessages.length > 0 ? { history: historyMessages } : {}),
          config: {
            systemInstruction,
          },
        });

        const response = await chat.sendMessage({
          message: latestMessage.text.trim(),
        });

        replyText = response.text?.trim();
        if (replyText) break;
      } catch (err) {
        lastError = err;
        const { status } = extractChatError(err);
        if (status !== 503 && status !== 429) {
          break;
        }
      }
    }

    if (!replyText) {
      if (lastError) {
        const { status, message } = extractChatError(lastError);
        return NextResponse.json({ error: message }, { status });
      }
      return NextResponse.json(
        { error: 'No response was returned by the Reflection Coach. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: replyText });
  } catch (err: unknown) {
    const { status, message } = extractChatError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
