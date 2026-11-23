# BiasBreak

**See the decision. Reveal the assumption. Break the bias.**

BiasBreak is an interactive cognitive bias and perspective-shift simulation platform aligned with **UN Sustainable Development Goal 5 (Gender Equality)**. It teaches through experience rather than lectures—inviting users to make real-world judgment calls blind, inspect the Bias Reveal, and compare evidence against assumptions.

## Key Features

- **3-Stage Interactive Decision Simulation**
  1. **Blind Decision**: Compare candidates or scenarios with equivalent objective credentials while identities are masked.
  2. **The Bias Reveal**: Unmask hidden context, identity framing, and live `A ↔ B` name swaps without judgmental scoring.
  3. **Evidence & Reflection Comparison**: Audit initial choices vs. post-reveal perspectives alongside peer-reviewed research citations and debiasing practices.
- **Six Everyday Domains**: *Workplace & hiring*, *Education*, *Leadership*, *Technology*, *Daily life*, and *Sports*.
- **Bias Reveal Lab**: Live interactive A/B identity lens flip and side-by-side diff across workplace reviews, venture pitches, and STEM classrooms.
- **Personal Learning Reflection (`Insights`)**: Tracks completed scenarios, reconsidered decisions, and domain coverage without pass/fail bias labels.
- **BiasBreak Reflection Coach**: Multi-turn Gemini chat assistant (`POST /api/chat`) grounded in behavioral science research to unpack scenarios and debiasing habits.
- **Educator Scenario Creator & Challenge Mode**: Author custom scenarios manually or draft them from a topic via `POST /api/scenarios/generate`, and share spoiler-free friend challenge links (`?challenge=...`).

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling & Motion**: Tailwind CSS v4, Motion (`motion/react`), Lucide Icons
- **AI Integration**: `@google/genai` (server-side API routes)

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and configure your key:
   ```bash
   cp .env.example .env.local
   ```
   Set `GEMINI_API_KEY` in `.env.local`.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).
