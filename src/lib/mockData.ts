import type {
  ChatMessage,
  DiagnosticResult,
  Lesson,
  Question,
  VoiceSessionFeedback,
  VoiceTurn,
  Week,
} from "@/types";

export const ENGLISH_QUESTIONS: Question[] = [
  {
    id: "en-1",
    subject: "english",
    type: "mcq",
    prompt: "She ____ to the market every Saturday.",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: "goes",
    difficulty: 1,
    topic: "subject_verb_agreement",
  },
  {
    id: "en-2",
    subject: "english",
    type: "mcq",
    prompt: "By the time we arrived, the movie ____.",
    options: ["already started", "had already started", "was already start", "starts already"],
    correctAnswer: "had already started",
    difficulty: 2,
    topic: "past_perfect",
  },
  {
    id: "en-3",
    subject: "english",
    type: "text",
    prompt: 'Rewrite using "despite": Although it was raining, we went hiking.',
    correctAnswer: "Despite the rain, we went hiking.",
    difficulty: 2,
    topic: "linking_words",
  },
  {
    id: "en-4",
    subject: "english",
    type: "mcq",
    prompt: 'Which word best fills the gap? "Her argument was ____ — every step followed logically from the last."',
    options: ["cogent", "coherent", "cohesive", "concise"],
    correctAnswer: "cogent",
    difficulty: 3,
    topic: "lexical_range",
  },
  {
    id: "en-5",
    subject: "english",
    type: "text",
    prompt: 'Fill the blank with the correct article (a / an / the / —): "I bought ___ apple yesterday."',
    correctAnswer: "an",
    difficulty: 1,
    topic: "articles",
  },
  {
    id: "en-6",
    subject: "english",
    type: "mcq",
    prompt: 'Choose the correct collocation: "She made a ____ decision after weeks of thinking."',
    options: ["serious", "deep", "considered", "fast"],
    correctAnswer: "considered",
    difficulty: 2,
    topic: "collocations",
  },
  {
    id: "en-7",
    subject: "english",
    type: "text",
    prompt: 'Identify the error: "If I would have known, I would have called."',
    correctAnswer: "If I had known, I would have called.",
    difficulty: 3,
    topic: "conditionals",
  },
  {
    id: "en-8",
    subject: "english",
    type: "voice",
    prompt: "IELTS Part 1 — Hometown",
    cue: "Tell me about your hometown. What do you like most about it, and what would you change if you could?",
    difficulty: 2,
    topic: "speaking_part1",
  },
  {
    id: "en-9",
    subject: "english",
    type: "voice",
    prompt: "IELTS Part 2 — Cue Card",
    cue:
      "Describe a skill you would like to learn. You should say: what the skill is, why you want to learn it, how you plan to learn it, and explain how this skill might change your life.",
    difficulty: 3,
    topic: "speaking_part2",
  },
  {
    id: "en-10",
    subject: "english",
    type: "voice",
    prompt: "IELTS Part 3 — Follow up",
    cue:
      "Do you think people learn skills faster now than in the past? Why or why not?",
    difficulty: 3,
    topic: "speaking_part3",
  },
];

export const MATH_QUESTIONS: Question[] = [
  {
    id: "ma-1",
    subject: "math",
    type: "mcq",
    prompt: "Solve for x: 2x + 7 = 19",
    options: ["4", "5", "6", "7"],
    correctAnswer: "6",
    difficulty: 1,
    topic: "linear_equations",
  },
  {
    id: "ma-2",
    subject: "math",
    type: "text",
    prompt: "Factor: x² − 9",
    correctAnswer: "(x-3)(x+3)",
    difficulty: 2,
    topic: "factoring",
  },
  {
    id: "ma-3",
    subject: "math",
    type: "mcq",
    prompt: "What is the slope of the line through (2, 3) and (6, 11)?",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    difficulty: 2,
    topic: "linear_functions",
  },
  {
    id: "ma-4",
    subject: "math",
    type: "text",
    prompt: "If f(x) = x² + 2x, what is f(3)?",
    correctAnswer: "15",
    difficulty: 1,
    topic: "functions",
  },
  {
    id: "ma-5",
    subject: "math",
    type: "mcq",
    prompt: "The roots of x² − 5x + 6 = 0 are:",
    options: ["1 and 6", "2 and 3", "−2 and −3", "−1 and −6"],
    correctAnswer: "2 and 3",
    difficulty: 2,
    topic: "quadratics",
  },
  {
    id: "ma-6",
    subject: "math",
    type: "text",
    prompt: "A right triangle has legs of 5 and 12. What is the hypotenuse?",
    correctAnswer: "13",
    difficulty: 1,
    topic: "geometry",
  },
  {
    id: "ma-7",
    subject: "math",
    type: "mcq",
    prompt: "Simplify: (3x²y)(4xy³)",
    options: ["7x³y⁴", "12x³y⁴", "12x²y³", "7x²y³"],
    correctAnswer: "12x³y⁴",
    difficulty: 2,
    topic: "exponents",
  },
  {
    id: "ma-8",
    subject: "math",
    type: "text",
    prompt: "Solve: log₂(x) = 5",
    correctAnswer: "32",
    difficulty: 3,
    topic: "logarithms",
  },
  {
    id: "ma-9",
    subject: "math",
    type: "mcq",
    prompt: "The area of a circle with radius 7 is approximately:",
    options: ["44", "49", "154", "196"],
    correctAnswer: "154",
    difficulty: 2,
    topic: "geometry",
  },
  {
    id: "ma-10",
    subject: "math",
    type: "text",
    prompt: "A train travels 240 km in 3 hours. What is its average speed in km/h?",
    correctAnswer: "80",
    difficulty: 1,
    topic: "word_problems",
  },
];

export const ENGLISH_RESULT: DiagnosticResult = {
  level: "B2",
  percentile: 64,
  durationMs: 9 * 60 * 1000 + 41 * 1000,
  questionCount: 10,
  strengths: [
    "Past tense and aspect — uses past simple and past perfect consistently",
    "Comprehension at intermediate speed — handles natural-pace audio",
    "Topic vocabulary — strong on travel, work, and study domains",
  ],
  weaknesses: [
    "Speaking fluency — frequent hesitation between clauses",
    "Article usage — mixes 'a/an/the' in abstract noun contexts",
    "Lexical range — leans on common synonyms instead of precise ones",
  ],
  subSkillScores: [
    { label: "Grammar", score: 7.2 },
    { label: "Vocabulary", score: 6.4 },
    { label: "Listening", score: 7.8 },
    { label: "Speaking", score: 5.6 },
    { label: "Writing", score: 6.8 },
  ],
};

export const MATH_RESULT: DiagnosticResult = {
  level: "Grade 9 — Algebra",
  percentile: 58,
  durationMs: 7 * 60 * 1000 + 12 * 1000,
  questionCount: 10,
  strengths: [
    "Linear equations — solves consistently in one or two steps",
    "Basic geometry — Pythagorean theorem and area formulas",
    "Function evaluation — substitutes correctly",
  ],
  weaknesses: [
    "Quadratics — confuses factoring patterns under time pressure",
    "Logarithms — limited exposure",
    "Word problems — struggles to set up equations from text",
  ],
  subSkillScores: [
    { label: "Algebra", score: 6.8 },
    { label: "Geometry", score: 7.2 },
    { label: "Functions", score: 5.4 },
    { label: "Word Problems", score: 4.6 },
  ],
};

const lesson = (
  id: string,
  weekIndex: number,
  title: string,
  description: string,
  type: Lesson["type"],
  durationMin: number,
  targetsWeakArea = false,
  difficulty: Lesson["difficulty"] = "medium",
  problemStatement?: string,
): Lesson => ({
  id,
  weekIndex,
  title,
  description,
  type,
  durationMin,
  targetsWeakArea,
  difficulty,
  problemStatement,
});

export const ENGLISH_ROADMAP: Week[] = [
  {
    index: 1,
    title: "Speaking Foundations",
    focus: "Fluency, common phrases, self-introduction",
    lessons: [
      lesson("en-w1-l1", 1, "Introduce yourself naturally", "Practice a 60-second self-introduction with an AI examiner.", "voice", 10, true, "easy"),
      lesson("en-w1-l2", 1, "Past tense pitfalls", "Common mistakes in past simple and past perfect.", "text", 8, false, "easy"),
      lesson("en-w1-l3", 1, "Common collocations", "High-frequency verb + noun pairs IELTS examiners reward.", "text", 6, false, "easy"),
    ],
  },
  {
    index: 2,
    title: "Fluency Builders",
    focus: "Filler reduction, connectors, pacing",
    lessons: [
      lesson("en-w2-l1", 2, "Filler words & connectors", "Replace 'um' and 'like' with band-7 discourse markers.", "voice", 12, true, "medium"),
      lesson("en-w2-l2", 2, "Linking ideas with cohesion", "Use 'however', 'consequently', 'on the other hand'.", "text", 8, false, "medium"),
      lesson("en-w2-l3", 2, "Reading: scanning for detail", "Practice IELTS-style scanning under 20 minutes.", "text", 12, false, "medium"),
    ],
  },
  {
    index: 3,
    title: "Article Mastery",
    focus: "a / an / the with abstract nouns",
    lessons: [
      lesson("en-w3-l1", 3, "When 'the' disappears", "Generic vs specific reference patterns.", "text", 10, true, "medium"),
      lesson("en-w3-l2", 3, "Article drills (writing)", "Edit a paragraph by adding or removing articles.", "text", 10, true, "medium"),
      lesson("en-w3-l3", 3, "Speaking: describing places", "Use articles correctly while describing your city.", "voice", 10, true, "medium"),
    ],
  },
  {
    index: 4,
    title: "Lexical Range",
    focus: "Precision over repetition",
    lessons: [
      lesson("en-w4-l1", 4, "Synonyms by register", "Formal vs informal — match the context.", "text", 10, true, "medium"),
      lesson("en-w4-l2", 4, "Topic vocabulary: technology", "Band-7 vocabulary for tech-related IELTS questions.", "text", 12, false, "medium"),
      lesson("en-w4-l3", 4, "Speaking: paraphrasing the question", "Restate the prompt in your own words before answering.", "voice", 10, true, "medium"),
    ],
  },
  {
    index: 5,
    title: "Listening for Detail",
    focus: "Multi-speaker, accent variety",
    lessons: [
      lesson("en-w5-l1", 5, "Section 3 academic dialogues", "Spot the speaker's stance under pressure.", "text", 14, false, "hard"),
      lesson("en-w5-l2", 5, "Numbers, dates, spellings", "Mini-drills for high-stakes detail capture.", "text", 8, false, "easy"),
      lesson("en-w5-l3", 5, "Lecture-style monologue", "Take notes while listening, then summarize aloud.", "voice", 14, false, "hard"),
    ],
  },
  {
    index: 6,
    title: "Writing Task 2",
    focus: "Argument essays with band-7 structure",
    lessons: [
      lesson("en-w6-l1", 6, "Essay skeletons", "Four reliable Task 2 structures.", "text", 12, false, "medium"),
      lesson("en-w6-l2", 6, "Linking + paragraphing", "Coherence and cohesion the examiners look for.", "text", 12, false, "medium"),
      lesson("en-w6-l3", 6, "Timed essay", "Write a 250-word Task 2 in 40 minutes with feedback.", "text", 20, false, "hard"),
    ],
  },
  {
    index: 7,
    title: "Speaking Part 2 Mastery",
    focus: "Cue cards with 2-minute delivery",
    lessons: [
      lesson("en-w7-l1", 7, "Brainstorm in 60 seconds", "Use the 'who/what/why/feel' frame.", "voice", 10, true, "medium"),
      lesson("en-w7-l2", 7, "Long-turn cohesion", "Keep talking without filler for the full two minutes.", "voice", 14, true, "hard"),
      lesson("en-w7-l3", 7, "Cue card simulation", "Three back-to-back cue cards with band scoring.", "voice", 18, true, "hard"),
    ],
  },
  {
    index: 8,
    title: "Mock Exam Week",
    focus: "Full-length practice and review",
    lessons: [
      lesson("en-w8-l1", 8, "Full Speaking mock", "Parts 1, 2, 3 with full band breakdown.", "voice", 16, true, "hard"),
      lesson("en-w8-l2", 8, "Reading mock + review", "60-minute reading test with answer analysis.", "text", 20, false, "hard"),
      lesson("en-w8-l3", 8, "Personalized weak-area sprint", "Targeted drills based on your remaining gaps.", "text", 16, true, "hard"),
    ],
  },
];

export const MATH_ROADMAP: Week[] = [
  {
    index: 1,
    title: "Linear Foundations",
    focus: "Equations, inequalities, slopes",
    lessons: [
      lesson("ma-w1-l1", 1, "One-variable equations", "Solve 2x + 7 = 19 with multiple methods.", "chat", 10, false, "easy", "Solve: 2x + 7 = 19"),
      lesson("ma-w1-l2", 1, "Word problems → equations", "Turn sentences into variables.", "chat", 12, true, "medium", "If a train travels 240 km in 3 hours, what's its speed?"),
      lesson("ma-w1-l3", 1, "Slopes and lines", "Find slope from two points, then write the equation.", "chat", 10, false, "medium", "Find the slope through (2, 3) and (6, 11)."),
    ],
  },
  {
    index: 2,
    title: "Quadratics, Step by Step",
    focus: "Factoring and the quadratic formula",
    lessons: [
      lesson("ma-w2-l1", 2, "Factoring x² + bx + c", "When the leading coefficient is 1.", "chat", 12, true, "medium", "Factor: x² - 5x + 6"),
      lesson("ma-w2-l2", 2, "Difference of squares", "Recognize and apply x² - a².", "chat", 8, true, "easy", "Factor: x² - 9"),
      lesson("ma-w2-l3", 2, "The quadratic formula", "When factoring breaks down.", "chat", 12, true, "hard", "Solve: 2x² - 4x + 1 = 0"),
    ],
  },
  {
    index: 3,
    title: "Functions",
    focus: "Notation, evaluation, transformations",
    lessons: [
      lesson("ma-w3-l1", 3, "Function notation", "What f(x) actually means.", "chat", 10, true, "easy", "If f(x) = x² + 2x, what is f(3)?"),
      lesson("ma-w3-l2", 3, "Composite functions", "Chain functions together.", "chat", 12, true, "medium", "If f(x) = 2x + 1, g(x) = x², find f(g(2))."),
      lesson("ma-w3-l3", 3, "Inverse functions", "Reverse the mapping.", "chat", 10, true, "medium", "Find the inverse of f(x) = 3x - 5"),
    ],
  },
  {
    index: 4,
    title: "Geometry Core",
    focus: "Pythagoras, area, similarity",
    lessons: [
      lesson("ma-w4-l1", 4, "Pythagorean theorem", "Apply and extend.", "chat", 10, false, "easy", "A right triangle has legs 5 and 12. Find the hypotenuse."),
      lesson("ma-w4-l2", 4, "Area and circumference", "Circles, polygons, composite figures.", "chat", 10, false, "medium", "Find the area of a circle with radius 7."),
      lesson("ma-w4-l3", 4, "Similar triangles", "Ratios and proportions.", "chat", 12, false, "medium", "Two triangles are similar. The sides of one are 3, 4, 5. The longest side of the other is 15. Find the other sides."),
    ],
  },
  {
    index: 5,
    title: "Exponents & Logarithms",
    focus: "Rules and conversions",
    lessons: [
      lesson("ma-w5-l1", 5, "Exponent rules", "Multiply, divide, power-of-power.", "chat", 10, false, "medium", "Simplify: (3x²y)(4xy³)"),
      lesson("ma-w5-l2", 5, "Intro to logs", "Logs as inverse exponents.", "chat", 12, true, "medium", "Solve: log₂(x) = 5"),
      lesson("ma-w5-l3", 5, "Log equations", "Combine and solve.", "chat", 12, true, "hard", "Solve: log(x) + log(x - 3) = 1"),
    ],
  },
  {
    index: 6,
    title: "Word Problem Sprint",
    focus: "Setup, solve, sanity-check",
    lessons: [
      lesson("ma-w6-l1", 6, "Rate problems", "Distance, work, mixtures.", "chat", 12, true, "medium", "Two trains leave from opposite cities 300 km apart..."),
      lesson("ma-w6-l2", 6, "Percent problems", "Increase, decrease, of-what.", "chat", 10, true, "medium", "A shirt is 20% off and now costs $32. What was the original price?"),
      lesson("ma-w6-l3", 6, "Number sense problems", "Translation from English.", "chat", 12, true, "hard", "The sum of three consecutive integers is 72. What are they?"),
    ],
  },
  {
    index: 7,
    title: "Coordinate Geometry",
    focus: "Distances, midpoints, equations",
    lessons: [
      lesson("ma-w7-l1", 7, "Distance formula", "Pythagoras on the plane.", "chat", 10, false, "medium", "Find the distance between (1, 2) and (5, 6)."),
      lesson("ma-w7-l2", 7, "Midpoints and segments", "Find the middle.", "chat", 8, false, "easy", "Find the midpoint of (-2, 4) and (6, -8)."),
      lesson("ma-w7-l3", 7, "Equation of a circle", "Center-radius form.", "chat", 12, false, "hard", "Write the equation of a circle centered at (2, -1) with radius 5."),
    ],
  },
  {
    index: 8,
    title: "Review & Mock",
    focus: "Mixed problems, timed practice",
    lessons: [
      lesson("ma-w8-l1", 8, "Mixed algebra mock", "30-minute timed set.", "chat", 20, true, "hard"),
      lesson("ma-w8-l2", 8, "Mixed geometry mock", "30-minute timed set.", "chat", 20, false, "hard"),
      lesson("ma-w8-l3", 8, "Personalized weak-area sprint", "Targeted by your diagnostic.", "chat", 20, true, "hard"),
    ],
  },
];

export const ENGLISH_VOICE_FEEDBACK: VoiceSessionFeedback = {
  overallBand: 6.5,
  subScores: [
    { label: "Fluency & Coherence", score: 6.0 },
    { label: "Lexical Resource", score: 6.5 },
    { label: "Grammar Range", score: 6.5 },
    { label: "Pronunciation", score: 7.0 },
  ],
  specifics: [
    {
      quote: "I live in… eh… Tashkent. It's a, um, beautiful city.",
      comment:
        "Уменьшайте паузы и слова-паразиты («um», «eh»). На уровне B2 экзаменатор ожидает более плавную речь — попробуйте дышать вместо паузы.",
    },
    {
      quote: "There is many parks in my city.",
      comment:
        "Используйте «There are» во множественном числе. Это базовая ошибка согласования, которая снижает балл за Grammar.",
    },
    {
      quote: "The food is very tasty and beautiful.",
      comment:
        "Tasty va beautiful so'zlari ovqat haqida kuchli emas. «Flavorful», «aromatic», «mouth-watering» kabi aniqroq sifatlarni qo'llang.",
    },
  ],
};

export const ENGLISH_VOICE_TURNS: VoiceTurn[] = [
  {
    id: "vt-1",
    role: "ai",
    text: "Let's begin with Part 1. Can you tell me a little about where you grew up?",
    timestamp: 0,
  },
];

export const MATH_CHAT_OPENING: ChatMessage[] = [
  {
    id: "cm-0",
    role: "ai",
    text: "Let's work through this together. Take a look at the equation. What's the first thing you notice?",
    timestamp: 0,
  },
];

export const SOCRATIC_TEMPLATE_REPLIES: string[] = [
  "Good — what happens if you isolate the variable on one side?",
  "Why do you think that step is valid? Try checking by substituting back.",
  "Almost. What sign should that term have when it crosses the equals?",
  "You're close. What's the next step if you factor that expression?",
  "Nice. Can you write the final answer in simplest form?",
];

export function questionsFor(subject: "english" | "math"): Question[] {
  return subject === "english" ? ENGLISH_QUESTIONS : MATH_QUESTIONS;
}

export function resultFor(subject: "english" | "math"): DiagnosticResult {
  return subject === "english" ? ENGLISH_RESULT : MATH_RESULT;
}

export function roadmapFor(subject: "english" | "math"): Week[] {
  return subject === "english" ? ENGLISH_ROADMAP : MATH_ROADMAP;
}

export function lessonById(id: string): Lesson | undefined {
  const all = [...ENGLISH_ROADMAP, ...MATH_ROADMAP].flatMap((w) => w.lessons);
  return all.find((l) => l.id === id);
}
