import type { Scenario, FramingSwapCase, ScenarioCategory } from './types';

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  'Workplace & hiring',
  'Education',
  'Leadership',
  'Technology',
  'Daily life',
  'Sports',
];

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'software-team-lead',
    title: 'Who should lead the software team?',
    category: 'Workplace & hiring',
    durationMinutes: 3,
    biasMechanism: 'Leadership Attribution & Warmth–Competence Framing',
    promptQuestion: 'Who would you choose to lead the critical cloud migration project?',
    contextBrief:
      'A technology company is selecting a technical team lead for a high-visibility six-month platform migration. Both internal candidates hold identical engineering levels, tenure, and quarterly delivery metrics.',
    options: [
      {
        id: 'A',
        blindLabel: 'Candidate A',
        blindSummary:
          '5 years experience · Strong technical record · Team collaboration. Consistently meets architecture milestones and delivers clear executive readouts during quarterly reviews.',
        metrics: [
          { label: 'Engineering Tenure', value: '5.0 years', isObjective: true },
          { label: 'On-Time Delivery', value: '96%', isObjective: true },
          { label: 'Peer Review Note', value: 'Direct & decisive in design reviews', isObjective: false },
        ],
        framingStyle: 'Agentic / Assertive phrasing',
        revealedName: 'Andrew Rockwell (Man, 31)',
        revealedContext:
          'In half of parallel evaluations, this identical profile is shown as Sarah Chen; in the other half, as Andrew Rockwell. Evaluators frequently read "direct and decisive" as natural executive authority when attached to a male name.',
      },
      {
        id: 'B',
        blindLabel: 'Candidate B',
        blindSummary:
          '5 years experience · Strong technical record · Team collaboration. Known for unblocking teammates across squads and building durable cross-team consensus before shipping.',
        metrics: [
          { label: 'Engineering Tenure', value: '5.0 years', isObjective: true },
          { label: 'On-Time Delivery', value: '96%', isObjective: true },
          { label: 'Peer Review Note', value: 'Supportive & consensus-oriented', isObjective: false },
        ],
        framingStyle: 'Communal / Collaborative phrasing',
        revealedName: 'Elena Vance (Woman, 31)',
        revealedContext:
          'Candidate B holds the exact same 96% delivery score and 5-year tenure. Yet communal descriptors like "supportive" are often interpreted as strong supporting-role traits rather than lead-authority readiness.',
      },
    ],
    reasoningPrompts: [
      'Decisive communication style',
      'Cross-team consensus building',
      'Equal objective delivery record',
      'Perceived authority under pressure',
    ],
    revealHeadline: 'Identical credentials — framed through gendered leadership expectations',
    revealContext:
      'Both candidates have identical qualifications, tenure, and 96% delivery performance. The only difference lies in how peer adjectives ("decisive" vs. "supportive") echo common stereotypes about what leadership sounds like. Choosing either candidate is not a flaw—the insight is noticing which cue carried the decision.',
    evidenceBreakdown: {
      objectiveFacts: [
        'Both candidates have 5.0 years of production engineering tenure.',
        'Both hold an identical 96% on-time milestone delivery rate.',
        'Both passed the same senior system architecture benchmark.',
      ],
      subjectiveCues: [
        '"Direct & decisive" triggers a traditional prototype of solo authority.',
        '"Supportive & consensus-oriented" is often discounted as a helper trait rather than executive leadership.',
      ],
    },
    researchCitation: {
      studyTitle: 'The Confidence–Competence & Double-Bind Pattern in Technical Leadership',
      authors: 'Eagly, A. H., & Karau, S. J. (Psychological Review)',
      year: 2002,
      finding:
        'Role congruity research demonstrates that identical leadership performance is rated differently when described with agentic versus communal adjectives, often penalizing women for exhibiting either too much or too little assertiveness.',
    },
    debiasingPractice:
      'Define the measurable leadership outcomes (e.g., cross-squad reliability, architecture velocity) on a structured rubric before reading narrative peer adjectives.',
  },
  {
    id: 'negotiation-compensation',
    title: 'Evaluating a compensation counteroffer',
    category: 'Workplace & hiring',
    durationMinutes: 3,
    biasMechanism: 'Negotiation Backlash & Tone Policing',
    contextBrief:
      'After exceeding annual revenue targets by 18%, a senior product specialist submits a formal email requesting a 12% salary adjustment and clearer promotion criteria before signing their renewal.',
    promptQuestion: 'How do you interpret this candidate’s negotiation approach for the upcoming team?',
    options: [
      {
        id: 'A',
        blindLabel: 'Response Framing A',
        blindSummary:
          '"Based on my 18% above-target delivery and two enterprise launches, I am requesting a 12% compensation adjustment to reflect market benchmarks."',
        metrics: [
          { label: 'Target Attainment', value: '118%', isObjective: true },
          { label: 'Market Gap', value: '-12%', isObjective: true },
          { label: 'Manager Impression', value: 'Firm, clear, direct ask', isObjective: false },
        ],
        framingStyle: 'Individual market-benchmark framing',
        revealedName: 'Maya Patel (Senior Specialist)',
        revealedContext:
          'When this exact direct script is attributed to a woman, reviewers in controlled experiments are significantly more likely to question "team fit" or label the tone "demanding" compared to when the exact same script carries a male name.',
      },
      {
        id: 'B',
        blindLabel: 'Response Framing B',
        blindSummary:
          '"I am excited to keep supporting our team’s goals next year. Given our 18% above-target results, could we discuss aligning my package closer to market?"',
        metrics: [
          { label: 'Target Attainment', value: '118%', isObjective: true },
          { label: 'Market Gap', value: '-12%', isObjective: true },
          { label: 'Manager Impression', value: 'Relational, collaborative tone', isObjective: false },
        ],
        framingStyle: 'Relational / softened framing',
        revealedName: 'Marcus Reed (Senior Specialist)',
        revealedContext:
          'When a man uses softened, relational framing, reviewers sometimes read it as lacking conviction—whereas women often adopt this exact phrasing to avoid social backlash while still negotiating.',
      },
    ],
    reasoningPrompts: [
      'Clear alignment with 118% performance',
      'Collaborative team-first tone',
      'Concern about rigid communication',
      'Objective market benchmark gap',
    ],
    revealHeadline: 'The exact same ask carries a different social cost depending on who asks',
    revealContext:
      'Both candidates delivered 118% of quota and face a 12% market gap. Notice whether one wording felt "confident" while the other felt "pushy" or "hesitant"—and how those instincts shift once names and gender expectations enter the room.',
    evidenceBreakdown: {
      objectiveFacts: [
        '118% verified target attainment across two enterprise launches.',
        'Documented 12% compensation gap relative to internal role band.',
      ],
      subjectiveCues: [
        'Direct declarative phrasing ("I am requesting") is rewarded as strategic in men but penalized as abrasive in women.',
        'Softened phrasing ("excited to support... could we discuss") is a learned strategy to navigate backlash, not lower ambition.',
      ],
    },
    researchCitation: {
      studyTitle: 'Social Incentives for Gender Differences in the Propensity to Initiate Negotiations',
      authors: 'Bowles, H. R., Babcock, L., & Lai, L. (Organizational Behavior & Human Decision Processes)',
      year: 2007,
      finding:
        'Controlled hiring experiments showed evaluators penalized female candidates—but not male candidates—for initiating identical, polite compensation negotiations.',
    },
    debiasingPractice:
      'Evaluate compensation requests solely against verified output metrics and published pay bands, stripping tone judgments from the review.',
  },
  {
    id: 'physics-lab-fellowship',
    title: 'Selecting a university research fellow',
    category: 'Education',
    durationMinutes: 4,
    biasMechanism: 'Competence Doubting in STEM Admissions',
    contextBrief:
      'A university physics department has one paid summer lab fellowship remaining. Two second-year undergraduates have submitted identical transcripts and project portfolios.',
    promptQuestion: 'Which applicant should receive the funded lab mentorship and higher starting stipend?',
    options: [
      {
        id: 'A',
        blindLabel: 'Applicant A',
        blindSummary:
          '3.88 GPA · Built automated spectrometer calibration script · Professor notes: "Shows strong raw intuition for experimental troubleshooting."',
        metrics: [
          { label: 'Cumulative GPA', value: '3.88 / 4.00', isObjective: true },
          { label: 'Lab Error Margin', value: '±0.4%', isObjective: true },
          { label: 'Advisor Phrase', value: '"Raw experimental intuition"', isObjective: false },
        ],
        framingStyle: 'Innate brilliance attribution',
        revealedName: 'John Miller (Undergraduate)',
        revealedContext:
          'In the landmark Yale randomized study, identical physics/biology lab applications bearing the name "John" were rated significantly more competent and offered higher starting stipends than the exact same resume bearing the name "Jennifer".',
      },
      {
        id: 'B',
        blindLabel: 'Applicant B',
        blindSummary:
          '3.88 GPA · Built automated spectrometer calibration script · Professor notes: "Remarkably diligent, organized, and thorough with lab documentation."',
        metrics: [
          { label: 'Cumulative GPA', value: '3.88 / 4.00', isObjective: true },
          { label: 'Lab Error Margin', value: '±0.4%', isObjective: true },
          { label: 'Advisor Phrase', value: '"Diligent and thorough"', isObjective: false },
        ],
        framingStyle: 'Effort / diligence attribution',
        revealedName: 'Jennifer Brooks (Undergraduate)',
        revealedContext:
          'Notice how recommendation letters frequently praise men for "innate brilliance/intuition" and women for "diligence and hard work"—even when their technical output and ±0.4% error margin are identical.',
      },
    ],
    reasoningPrompts: [
      'Perceived natural aptitude for research',
      'Precision & documentation discipline',
      'Equal GPA and technical accuracy',
      'Confidence in independent troubleshooting',
    ],
    revealHeadline: '"Brilliance" vs. "Diligence" in STEM recommendation letters',
    revealContext:
      'Both students achieved the same 3.88 GPA, built the same calibration script, and produced identical ±0.4% lab accuracy. Linguistic studies of academic letters show women are disproportionately described with effort words ("diligent") while men receive genius words ("intuition"), subtly steering fellowship offers.',
    evidenceBreakdown: {
      objectiveFacts: [
        'Identical 3.88 GPA in core mechanics and electromagnetism.',
        'Identical ±0.4% calibration accuracy on lab benchmarks.',
      ],
      subjectiveCues: [
        '"Raw intuition" signals perceived effortless genius, which faculty weigh heavily in STEM.',
        '"Diligent and thorough" is subtly undervalued compared to "brilliance" in competitive research selection.',
      ],
    },
    researchCitation: {
      studyTitle: 'Science Faculty’s Subtle Gender Biases Favor Male Students',
      authors: 'Moss-Racusin, C. A., Dovidio, J. F., Brescoll, V. L., Graham, M. J., & Handelsman, J. (PNAS)',
      year: 2012,
      finding:
        'In a randomized double-blind study of 127 science faculty, identical applications were rated 14% higher in competence and offered $3,730 more in starting salary when assigned a male name rather than a female name.',
    },
    debiasingPractice:
      'Anonymize student names and replace open-ended recommendation adjectives with standardized technical work-sample rubrics.',
  },
  {
    id: 'boardroom-strategy-pivot',
    title: 'Evaluating executive presence during a pivot',
    category: 'Leadership',
    durationMinutes: 3,
    biasMechanism: 'The Double-Bind Dilemma',
    contextBrief:
      'During a tense quarterly review with 14% churn risk, two division leads propose competing roadmaps to stabilize product retention within 90 days.',
    promptQuestion: 'Which leader demonstrates stronger readiness for the VP of Product role?',
    options: [
      {
        id: 'A',
        blindLabel: 'Leader A',
        blindSummary:
          'Interrupts unfocused debate to state: "We are burning cycles. Cut three non-core features Monday and lock engineering onto onboarding reliability."',
        metrics: [
          { label: 'Division Retention', value: '91.5%', isObjective: true },
          { label: 'Roadmap ROI', value: '+22% YoY', isObjective: true },
          { label: 'Meeting Tone', value: 'Unapologetically blunt', isObjective: false },
        ],
        framingStyle: 'Commanding / urgent intervention',
        revealedName: 'Claire Sterling (Director)',
        revealedContext:
          'When Leader A is revealed as Claire, reactions frequently split: some praise her clarity, while others suddenly perceive the exact same interruption as "abrasive" or "not collaborative enough"—a penalty rarely applied to male directors.',
      },
      {
        id: 'B',
        blindLabel: 'Leader B',
        blindSummary:
          'Polls the room before proposing: "I hear everyone’s constraints—could we align around pausing non-core features so onboarding gets our full focus?"',
        metrics: [
          { label: 'Division Retention', value: '91.5%', isObjective: true },
          { label: 'Roadmap ROI', value: '+22% YoY', isObjective: true },
          { label: 'Meeting Tone', value: 'Inclusive & diplomatic', isObjective: false },
        ],
        framingStyle: 'Consultative / consensus intervention',
        revealedName: 'David Okafor (Director)',
        revealedContext:
          'Both leaders propose the exact same strategic decision (focusing on onboarding) and share identical +22% YoY ROI. Yet diplomatic phrasing can be misread as indecisiveness, creating a narrow tightrope for underrepresented leaders.',
      },
    ],
    reasoningPrompts: [
      'Urgency & clarity in a crisis',
      'Ability to keep cross-functional buy-in',
      'Both propose the exact same strategy',
      'Comfort with blunt authority',
    ],
    revealHeadline: 'Same strategic solution, judged by two different style rules',
    revealContext:
      'Look closely: both Leader A and Leader B proposed the exact same operational fix—pausing non-core features to protect onboarding—and both hold a +22% YoY ROI track record. The reveal invites you to check whether tone mattered more than strategic substance.',
    evidenceBreakdown: {
      objectiveFacts: [
        'Identical 91.5% division retention and +22% YoY roadmap ROI.',
        'Both leaders identified the exact same root bottleneck (onboarding reliability).',
      ],
      subjectiveCues: [
        'Blunt urgency is rewarded as "commanding" for men but often labeled "abrasive" for women.',
        'Inclusive questioning is valued for harmony yet sometimes penalized as "insufficiently forceful" for senior VP roles.',
      ],
    },
    researchCitation: {
      studyTitle: 'The Abrasive Trap: Gender Differences in Performance Reviews',
      authors: 'Snyder, K. (Fortune / Textio Linguistic Analysis)',
      year: 2014,
      finding:
        'Analysis of 248 tech performance reviews revealed negative personality criticism ("abrasive", "bossy") appeared in 85% of critical reviews for women versus less than 2% for men.',
    },
    debiasingPractice:
      'Separate strategic decision quality (did the proposal fix the bottleneck?) from personal communication style norms during leadership evaluations.',
  },
  {
    id: 'open-source-code-review',
    title: 'Accepting a high-stakes pull request',
    category: 'Technology',
    durationMinutes: 3,
    biasMechanism: 'Gendered Code Attribution',
    contextBrief:
      'An open-source distributed database repository receives two optimization pull requests from external contributors addressing a memory leak under concurrent load.',
    promptQuestion: 'Which pull request feels safer to merge into the release branch first?',
    options: [
      {
        id: 'A',
        blindLabel: 'Contributor PR #412',
        blindSummary:
          'Reduces heap allocation by 34%. Includes 18 unit tests and concise inline comments explaining lock-free ring buffer boundaries.',
        metrics: [
          { label: 'Memory Reduction', value: '-34%', isObjective: true },
          { label: 'Test Coverage', value: '98% pass', isObjective: true },
          { label: 'Profile Handle', value: '@dev_412 (Gender-neutral)', isObjective: false },
        ],
        framingStyle: 'Gender-neutral technical profile',
        revealedName: 'Hannah Lindqvist (@hlindqvist)',
        revealedContext:
          'Large-scale GitHub data analysis showed women’s pull requests had a HIGHER acceptance rate (78.6%) than men’s when their profile was gender-neutral—but dropped significantly when their gender was visible.',
      },
      {
        id: 'B',
        blindLabel: 'Contributor PR #419',
        blindSummary:
          'Reduces heap allocation by 34%. Includes 18 unit tests and concise inline comments explaining lock-free ring buffer boundaries.',
        metrics: [
          { label: 'Memory Reduction', value: '-34%', isObjective: true },
          { label: 'Test Coverage', value: '98% pass', isObjective: true },
          { label: 'Profile Handle', value: '@k_morales (Identifiable avatar)', isObjective: false },
        ],
        framingStyle: 'Visible personal identity profile',
        revealedName: 'Lucas Morales (@lmorales)',
        revealedContext:
          'Both PRs contain functionally equivalent patches (-34% heap, 98% test pass). Removing avatar and name cues in technical review is one of the highest-impact fairness practices in software engineering.',
      },
    ],
    reasoningPrompts: [
      'Identical benchmark & test coverage',
      'Preference for neutral technical handle',
      'Confidence in lock-free explanation',
      'No meaningful technical difference',
    ],
    revealHeadline: 'What 3 million GitHub pull requests revealed about blind code review',
    revealContext:
      'Both patches reduce memory by 34% with 98% test coverage. Real-world data from millions of pull requests showed that when contributor gender was obscured, women’s code was accepted at a higher rate than men’s—proving that blind review protects code quality.',
    evidenceBreakdown: {
      objectiveFacts: [
        'Identical -34% heap allocation improvement.',
        'Identical 18 passing unit tests with 98% branch coverage.',
      ],
      subjectiveCues: [
        'Visible contributor avatars and names introduce subtle unconscious skepticism in technical peer review.',
      ],
    },
    researchCitation: {
      studyTitle: 'Gender Differences and Bias in Open Source: Pull Request Acceptance of Women Versus Men',
      authors: 'Terrell, J., Kofink, A., Middleton, J., Rainear, C., Murphy-Hill, E., & Parnin, C. (PeerJ Computer Science)',
      year: 2017,
      finding:
        'Across 3 million GitHub pull requests, women’s acceptance rate was 78.6% (higher than men’s 74.6%) only when their gender was hidden; when identifiable as women, acceptance dropped sharply.',
    },
    debiasingPractice:
      'Use anonymized pull-request author handles during initial code review, evaluating automated benchmarks and test coverage before seeing contributor profiles.',
  },
  {
    id: 'everyday-family-leave',
    title: 'Assigning a high-travel client account',
    category: 'Daily life',
    durationMinutes: 3,
    biasMechanism: 'Benevolent Caregiving Assumptions',
    contextBrief:
      'Two account directors are eligible to lead an international client expansion requiring four days of travel every month. Both recently became parents within the last year.',
    promptQuestion: 'Who should you offer the lead international account to first?',
    options: [
      {
        id: 'A',
        blindLabel: 'Director A',
        blindSummary:
          '94% client renewal rate · Expressed strong interest in global accounts during last year’s review · Currently balancing a 9-month-old at home.',
        metrics: [
          { label: 'Client Renewal', value: '94%', isObjective: true },
          { label: 'Global Account Prep', value: 'Certified', isObjective: true },
          { label: 'Manager Thought', value: '"Might appreciate staying closer to home"', isObjective: false },
        ],
        framingStyle: 'Protective / assumption-based hesitation',
        revealedName: 'Nadia Al-Mansoor (Account Director)',
        revealedContext:
          'Managers often skip offering travel or stretch roles to new mothers out of "benevolent" concern—without actually asking them—while assuming new fathers want the career advancement.',
      },
      {
        id: 'B',
        blindLabel: 'Director B',
        blindSummary:
          '94% client renewal rate · Expressed strong interest in global accounts during last year’s review · Currently balancing a 9-month-old at home.',
        metrics: [
          { label: 'Client Renewal', value: '94%', isObjective: true },
          { label: 'Global Account Prep', value: 'Certified', isObjective: true },
          { label: 'Manager Thought', value: '"Likely motivated to provide & advance"', isObjective: false },
        ],
        framingStyle: 'Breadwinner / ambition assumption',
        revealedName: 'Tomás Herrera (Account Director)',
        revealedContext:
          'Notice the hidden double standard: identical family status triggers "protective exclusion" for women (Maternal Wall) and "provider motivation" for men—while also discouraging men who want equal caregiving flexibility.',
      },
    ],
    reasoningPrompts: [
      'Equal 94% renewal performance',
      'Assumption about family availability',
      'Desire to protect work-life balance',
      'Need to ask candidate directly first',
    ],
    revealHeadline: 'When "trying to be considerate" quietly limits someone’s career',
    revealContext:
      'Both directors have a 94% renewal rate and a 9-month-old child. Everyday gender assumptions cause well-meaning colleagues to make choices ON BEHALF of mothers ("she wouldn’t want to travel") and fathers ("he won’t want flexible hours"), instead of letting individuals choose.',
    evidenceBreakdown: {
      objectiveFacts: [
        'Both directors hold a 94% client renewal rate and global account certification.',
        'Neither director indicated they wanted to opt out of travel.',
      ],
      subjectiveCues: [
        'Assuming caregiving limits availability for women without asking creates an invisible promotion ceiling.',
        'Assuming fathers prioritize travel over caregiving reinforces unequal domestic expectations.',
      ],
    },
    researchCitation: {
      studyTitle: 'Getting a Job: Is There a Motherhood Penalty?',
      authors: 'Correll, S. J., Benard, S., & Paik, I. (American Journal of Sociology)',
      year: 2007,
      finding:
        'Equally qualified mothers were judged significantly less committed and offered lower starting salaries than non-mothers, while fathers experienced no penalty and often received a "fatherhood bonus."',
    },
    debiasingPractice:
      'Never pre-screen people out of stretch opportunities based on family assumptions; present every qualified candidate with the full scope and let them decide.',
  },
  {
    id: 'sports-coaching-authority',
    title: 'Evaluating sideline coaching style',
    category: 'Sports',
    durationMinutes: 3,
    biasMechanism: 'Emotional Expression Double Standard',
    contextBrief:
      'A collegiate athletic board is reviewing two head coaching finalists for a varsity track & field program. Both coached regional championship teams with identical athlete graduation rates.',
    promptQuestion: 'Which coach displays stronger championship temperament?',
    options: [
      {
        id: 'A',
        blindLabel: 'Coach A',
        blindSummary:
          '3 regional titles · 98% athlete graduation rate · Known for intense, vocal sideline feedback during high-stakes relay qualifiers.',
        metrics: [
          { label: 'Regional Titles', value: '3 titles', isObjective: true },
          { label: 'Graduation Rate', value: '98%', isObjective: true },
          { label: 'Sideline Clip', value: 'Passionate, intense vocal coaching', isObjective: false },
        ],
        framingStyle: 'High-intensity sideline expression',
        revealedName: 'Coach Tessa Vance',
        revealedContext:
          'In sports media and athletic boards, intense sideline emotion from male coaches is routinely celebrated as "fiery competitive drive," while the same volume from female coaches is disproportionately labeled "unruly" or "over-emotional."',
      },
      {
        id: 'B',
        blindLabel: 'Coach B',
        blindSummary:
          '3 regional titles · 98% athlete graduation rate · Known for intense, vocal sideline feedback during high-stakes relay qualifiers.',
        metrics: [
          { label: 'Regional Titles', value: '3 titles', isObjective: true },
          { label: 'Graduation Rate', value: '98%', isObjective: true },
          { label: 'Sideline Clip', value: 'Fiery, competitive drive', isObjective: false },
        ],
        framingStyle: 'Identical intensity, athletic trope',
        revealedName: 'Coach Derek Vance',
        revealedContext:
          'Both coaches delivered 3 regional titles and 98% graduation rates using the exact same sideline coaching intensity—only the descriptive label changed from "emotional" to "fiery drive."',
      },
    ],
    reasoningPrompts: [
      'Identical 3 titles and 98% graduation',
      'Reaction to vocal sideline intensity',
      'Difference in descriptive wording',
      'Athlete wellbeing & championship focus',
    ],
    revealHeadline: '"Fiery competitor" vs. "Overly emotional" on the exact same sideline',
    revealContext:
      'Both finalists achieved 3 regional titles and a 98% athlete graduation rate. Sports leadership research shows that identical assertive coaching behaviors receive sharply different labels depending on gender expectations in athletics.',
    evidenceBreakdown: {
      objectiveFacts: [
        'Identical 3 regional championship titles.',
        'Identical 98% student-athlete graduation rate.',
      ],
      subjectiveCues: [
        'Adjectives like "passionate/fiery" vs. "intense/emotional" frame the exact same behavior as either strength or instability.',
      ],
    },
    researchCitation: {
      studyTitle: 'Gendered Language in Sports Commentary & Coaching Evaluations',
      authors: 'LaVoi, N. M., & Dutove, J. K. (Women in Sport & Physical Activity Journal)',
      year: 2012,
      finding:
        'Women coaches face conflicting expectations to demonstrate masculine-coded intensity while maintaining feminine-coded warmth, reducing representation in head coaching roles.',
    },
    debiasingPractice:
      'Anchor coaching evaluations in athlete retention, graduation rates, and tactical outcomes rather than subjective impressions of sideline volume.',
  },
];

export const FRAMING_SWAP_CASES: FramingSwapCase[] = [
  {
    id: 'swap-engineering-review',
    domain: 'Workplace Performance Review',
    title: 'Same technical delivery, different adjectives',
    sharedMetrics: ['99.4% service uptime', '14 shipped architecture RFCs', '4 mentees promoted'],
    maleFramedName: 'Daniel Mercer',
    maleFramedExcerpt:
      '"Daniel drives hard on architecture standards and challenges weak proposals directly in design reviews. He shows clear executive presence."',
    maleObservedReaction:
      'Commonly rated as: "Ready for Principal / Staff promotion — strong technical conviction."',
    femaleFramedName: 'Danielle Mercer',
    femaleFramedExcerpt:
      '"Danielle drives hard on architecture standards and challenges weak proposals directly in design reviews. She can come across as abrasive to peers."',
    femaleObservedReaction:
      'Commonly rated as: "Technically strong, but needs coaching on interpersonal warmth before promotion."',
    cognitiveTakeaway:
      'When identical assertiveness is described, women are nearly 3× more likely to receive personality critiques ("abrasive") attached to their technical competence.',
  },
  {
    id: 'swap-startup-pitch',
    domain: 'Venture Capital Pitch Q&A',
    title: 'Prevention vs. Promotion questioning',
    sharedMetrics: ['$1.8M ARR (+110% YoY)', '94% net dollar retention', '18 months runway'],
    maleFramedName: 'Liam O’Connor (Founder)',
    maleFramedExcerpt:
      'Investor Q&A focus: "How big can this market get in 5 years? What happens if you capture 20% of enterprise spend?"',
    maleObservedReaction:
      'Promotion-framed questions invite bold vision answers, leading to larger average funding checks.',
    femaleFramedName: 'Leah O’Connor (Founder)',
    femaleFramedExcerpt:
      'Investor Q&A focus: "How will you defend against incumbent churn? What if enterprise budgets tighten next quarter?"',
    femaleObservedReaction:
      'Prevention-framed questions force defensive risk answers—even when metrics ($1.8M ARR, 94% retention) are identical.',
    cognitiveTakeaway:
      'Kanze et al. (Academy of Management, 2018) found investors asked men "how they will win" and women "how they will avoid losing"—directly shaping funding outcomes.',
  },
  {
    id: 'swap-classroom-participation',
    domain: 'STEM Classroom Feedback',
    title: 'Encouragement cues in early engineering',
    sharedMetrics: ['97% robotics exam score', 'Lead circuit designer', 'Zero missed labs'],
    maleFramedName: 'Noah Alvarez (10th Grade)',
    maleFramedExcerpt:
      'Teacher feedback: "Noah has a natural mind for systems engineering—we should enter him in the regional robotics finals."',
    maleObservedReaction:
      'Encouraged toward competitive specialization and autonomous leadership.',
    femaleFramedName: 'Nora Alvarez (10th Grade)',
    femaleFramedExcerpt:
      'Teacher feedback: "Nora is super organized and keeps her group’s lab binder spotless—she’d be great coordinating the team schedule."',
    femaleObservedReaction:
      'Steered gently toward administrative coordination instead of technical hardware leadership.',
    cognitiveTakeaway:
      'Subtle everyday encouragement nudges students toward gendered roles years before university or workplace hiring ever begins.',
  },
];
