import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BiasBreak — Experience Decisions, Question Assumptions',
  description:
    'An interactive cognitive bias and perspective-shift simulation platform. Make real-world choices, experience the Bias Reveal, and compare evidence against assumptions.',
  openGraph: {
    title: 'BiasBreak — Experience Decisions, Question Assumptions',
    description:
      'An interactive cognitive bias and perspective-shift simulation platform for evidence-based decision-making.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BiasBreak — Experience Decisions, Question Assumptions',
    description:
      'An interactive cognitive bias and perspective-shift simulation platform for evidence-based decision-making.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
        {children}
      </body>
    </html>
  );
}
