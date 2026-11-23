'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import type { Scenario } from '@/lib/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ReflectionCoachProps {
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  activeScenario: Scenario | null;
  completedCount: number;
  reconsideredCount: number;
  pendingPrompt?: string | null;
  onConsumePendingPrompt?: () => void;
}

const DEFAULT_STARTERS = [
  'Why can identical qualifications get judged differently?',
  'How can my team run fairer blind hiring or code reviews?',
  'What is the Double-Bind Dilemma in leadership?',
];

export default function ReflectionCoach({
  isOpen,
  onToggleOpen,
  activeScenario,
  completedCount,
  reconsideredCount,
  pendingPrompt,
  onConsumePendingPrompt,
}: ReflectionCoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Welcome to the BiasBreak Reflection Coach. Ask about any scenario, explore the research behind the Bias Reveal, or brainstorm practical ways to build evidence-based decisions in your team or classroom.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isSending]);

  const requestCoachReply = async (thread: ChatMessage[]) => {
    setErrorMsg(null);
    setIsSending(true);

    try {
      // Omit the synthetic client-side welcome greeting from model history so turn order starts cleanly with user
      const apiMessages = thread
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context: {
            activeScenarioTitle: activeScenario?.title,
            activeBiasMechanism: activeScenario?.biasMechanism,
            completedCount,
            reconsideredCount,
          },
        }),
      });

      const rawBody = await res.text();
      let data: { reply?: string; error?: string } | null = null;
      try {
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        throw new Error(
          `The Reflection Coach endpoint returned an unexpected response (HTTP ${res.status}). Please try again in a moment.`
        );
      }

      const replyText = data?.reply;
      if (!res.ok || !replyText) {
        throw new Error(data?.error || 'Unable to get a response right now.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: replyText,
        },
      ]);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to reach the Reflection Coach.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const sendMessageText = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextThread = [...messages, userMsg];
    setMessages(nextThread);
    setInput('');
    await requestCoachReply(nextThread);
  };

  const handleRetryLast = () => {
    if (isSending || messages.length <= 1) return;
    void requestCoachReply(messages);
  };

  const sendMessageRef = useRef(sendMessageText);
  useEffect(() => {
    sendMessageRef.current = sendMessageText;
  });

  // Support contextual opening with a prefilled prompt from Stage 3
  useEffect(() => {
    if (!isOpen || !pendingPrompt) return;
    const promptToSend = pendingPrompt;
    const timer = window.setTimeout(() => {
      onConsumePendingPrompt?.();
      void sendMessageRef.current(promptToSend);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, pendingPrompt, onConsumePendingPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessageText(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessageText(input);
    }
  };

  const handleResetChat = () => {
    setErrorMsg(null);
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Conversation cleared. What scenario, framing cue, or evidence-based decision habit would you like to explore next?',
      },
    ]);
  };

  const starters = activeScenario
    ? [
        `Unpack "${activeScenario.title}" without judging either choice`,
        `How can we prevent ${activeScenario.biasMechanism.toLowerCase()} in practice?`,
        'What does the behavioral research actually show here?',
      ]
    : DEFAULT_STARTERS;

  return (
    <>
      {/* Floating Launcher Button (visible when drawer is closed) */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => onToggleOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg border border-slate-700 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
          aria-label="Open BiasBreak Reflection Coach chat"
        >
          <MessageSquare className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <span>Reflection Coach</span>
        </button>
      ) : null}

      {/* Multi-Turn Slide-Over Chat Drawer */}
      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            aria-label="BiasBreak Reflection Coach"
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[420px] h-[min(600px,calc(100vh-5.5rem))] z-50 bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-serif text-base font-semibold text-slate-900 truncate">
                  BiasBreak Reflection Coach
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  {activeScenario
                    ? `Context: ${activeScenario.title}`
                    : 'Evidence, Framing & SDG 5 Guide'}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleOpen(false)}
                  title="Close Reflection Coach"
                  aria-label="Close Reflection Coach"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F8FAFC]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-sky-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Starter Prompts shown when only welcome message exists */}
              {messages.length === 1 && !isSending ? (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-mono text-slate-500 px-1">
                    Suggested questions
                  </p>
                  <div className="flex flex-col gap-2">
                    {starters.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessageText(prompt)}
                        className="text-left px-3.5 py-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-sky-50 hover:text-sky-900 border border-slate-200 hover:border-sky-300 rounded-lg transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {isSending ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-700" aria-hidden="true" />
                    <span>Thinking...</span>
                  </div>
                </div>
              ) : null}

              {errorMsg ? (
                <div
                  role="alert"
                  className="p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-900 flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={handleRetryLast}
                    className="px-2.5 py-1 text-xs font-semibold text-red-900 bg-white border border-red-200 hover:bg-red-100 rounded-md whitespace-nowrap shrink-0"
                  >
                    Retry
                  </button>
                </div>
              ) : null}

              <div ref={threadEndRef} />
            </div>

            {/* Composer Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-slate-200 bg-white flex items-end gap-2"
            >
              <label htmlFor="reflection-chat-input" className="sr-only">
                Ask the Reflection Coach
              </label>
              <textarea
                id="reflection-chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a scenario, cue, or study..."
                className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:outline-none max-h-28"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Send message"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white transition-colors shrink-0"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
