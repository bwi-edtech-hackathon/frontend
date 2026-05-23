import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ru" | "uz";

type Dict = Record<string, { ru: string; uz: string }>;

const STRINGS: Dict = {
  // Common
  "Hi, Diana": { ru: "Привет, Diana", uz: "Salom, Diana" },
  "Good evening, Diana": { ru: "Добрый вечер, Diana", uz: "Xayrli kech, Diana" },
  "Diana M.": { ru: "Diana M.", uz: "Diana M." },
  You: { ru: "Вы", uz: "Siz" },
  Today: { ru: "Сегодня", uz: "Bugun" },
  "See all": { ru: "Все", uz: "Hammasi" },
  "View →": { ru: "Смотреть →", uz: "Ko'rish →" },
  "12 day streak": { ru: "Серия: 12 дней", uz: "12 kunlik seriya" },
  "4 win streak": { ru: "Серия: 4 победы", uz: "4 ta g'alaba ketma-ket" },
  streak: { ru: "серия", uz: "seriya" },

  // Subjects
  Mathematics: { ru: "Математика", uz: "Matematika" },
  Math: { ru: "Матем.", uz: "Matem." },
  Physics: { ru: "Физика", uz: "Fizika" },
  Chemistry: { ru: "Химия", uz: "Kimyo" },
  Biology: { ru: "Биология", uz: "Biologiya" },
  History: { ru: "История", uz: "Tarix" },
  Geography: { ru: "География", uz: "Geografiya" },
  "Uzbek lit": { ru: "Узб. лит.", uz: "O'zbek tili" },
  "Russian lit": { ru: "Рус. лит.", uz: "Rus tili" },
  Algebra: { ru: "Алгебра", uz: "Algebra" },
  Geometry: { ru: "Геометрия", uz: "Geometriya" },
  Functions: { ru: "Функции", uz: "Funksiyalar" },
  Probability: { ru: "Вероятность", uz: "Ehtimollik" },

  // Tab bar
  Home: { ru: "Главная", uz: "Asosiy" },
  Battle: { ru: "Битва", uz: "Jang" },
  Path: { ru: "Путь", uz: "Yo'l" },
  Coach: { ru: "Коуч", uz: "Kouch" },

  // Home dashboard
  "Continue your path": { ru: "Продолжить путь", uz: "Yo'lda davom et" },
  "Today's lesson": { ru: "Урок дня", uz: "Bugungi dars" },
  "Today · 3 tasks": { ru: "Сегодня · 3 задачи", uz: "Bugun · 3 ta vazifa" },
  "Quadratic equations": {
    ru: "Квадратные уравнения",
    uz: "Kvadrat tenglamalar",
  },
  "Discriminant method": { ru: "Метод дискриминанта", uz: "Diskriminant usuli" },
  "Resume lesson": { ru: "Продолжить", uz: "Davom etish" },
  Skip: { ru: "Пропустить", uz: "O'tkazib yuborish" },
  "Checkpoint exam · Logarithms": {
    ru: "Чекпоинт · Логарифмы",
    uz: "Nazorat · Logarifmlar",
  },
  "8 questions · 12 min": {
    ru: "8 вопросов · 12 мин",
    uz: "8 ta savol · 12 daqiqa",
  },
  "New topic · Vieta's formulas": {
    ru: "Новая тема · Формулы Виета",
    uz: "Yangi mavzu · Viyet formulalari",
  },
  "Required for week 2": { ru: "Нужно к неделе 2", uz: "2-haftaga kerak" },
  "Quick Battle · Math": {
    ru: "Быстрая битва · Матем.",
    uz: "Tezkor jang · Matem.",
  },
  "+50 XP daily reward": {
    ru: "+50 XP ежедневно",
    uz: "+50 XP kunlik mukofot",
  },
  "Certificate readiness": {
    ru: "Готовность к сертификату",
    uz: "Sertifikatga tayyorlik",
  },
  target: { ru: "цель", uz: "maqsad" },

  // Battle
  "Math · Silver tier": {
    ru: "Матем. · Серебряный",
    uz: "Matem. · Kumush daraja",
  },
  "Silver tier": { ru: "Серебряный", uz: "Kumush daraja" },
  "Gold tier": { ru: "Золотой", uz: "Oltin daraja" },
  Bronze: { ru: "Бронза", uz: "Bronza" },
  Silver: { ru: "Серебро", uz: "Kumush" },
  Gold: { ru: "Золото", uz: "Oltin" },
  Plat: { ru: "Плат.", uz: "Plat." },
  Ranked: { ru: "Рейтинговая", uz: "Reytingli" },
  "Quick Match": { ru: "Быстрая битва", uz: "Tezkor jang" },
  "10 questions · 5 min · find opponent in 30s": {
    ru: "10 вопросов · 5 мин · соперник за 30с",
    uz: "10 ta savol · 5 daqiqa · 30s da raqib",
  },
  "Find opponent": { ru: "Найти соперника", uz: "Raqib topish" },
  "Find a match": { ru: "Найти соперника", uz: "Raqib topish" },
  "Friend Battle": { ru: "Битва с другом", uz: "Do'st bilan jang" },
  "Invite by link · unranked": {
    ru: "По ссылке · без рейтинга",
    uz: "Havola orqali · reytingsiz",
  },
  "Invite friend": { ru: "Пригласить друга", uz: "Do'stni taklif qilish" },
  "vs AI bot": { ru: "против ИИ", uz: "AI bilan" },
  "Instant start · ranked (capped)": {
    ru: "Старт сразу · с лимитом",
    uz: "Tez boshlash · cheklangan",
  },
  "Recent battles": { ru: "Недавние битвы", uz: "So'nggi janglar" },
  "Live now": { ru: "Сейчас в игре", uz: "Hozir o'ynamoqda" },
  Exit: { ru: "Выйти", uz: "Chiqish" },
  "minutes remaining": { ru: "минут осталось", uz: "daqiqa qoldi" },
  "in progress": { ru: "в игре", uz: "jarayonda" },
  "Daily battles played": { ru: "Битв сегодня", uz: "Bugungi janglar" },
  Tier: { ru: "Уровень", uz: "Daraja" },
  Streak: { ru: "Серия", uz: "Seriya" },
  at: { ru: "при", uz: "da" },
  "You're 8 wins from Gold tier (1600)": {
    ru: "8 побед до Золота (1600)",
    uz: "Oltingacha 8 ta g'alaba (1600)",
  },
  "Sequences & series": {
    ru: "Последовательности и ряды",
    uz: "Ketma-ketliklar",
  },

  // Chat Lesson
  mastery: { ru: "освоено", uz: "o'zlashtirildi" },
  "I get it": { ru: "Понятно", uz: "Tushundim" },
  "Coach is thinking…": { ru: "Коуч думает…", uz: "Kouch o'ylayapti…" },
  "Type your answer…": { ru: "Введите ответ…", uz: "Javobingizni kiriting…" },
  "Quadratic?": { ru: "Квадратное?", uz: "Kvadrat?" },
  Challenge: { ru: "Вызов", uz: "Chaqirish" },

  // Roadmap
  "Your roadmap": { ru: "Ваш план", uz: "Sizning yo'lingiz" },
  wk: { ru: "нед.", uz: "h." },
  "On track for": { ru: "Цель:", uz: "Maqsad:" },
  "B+ by August 12": { ru: "B+ к 12 авг.", uz: "B+ 12-avgust" },
  "Linear equations": { ru: "Линейные уравнения", uz: "Chiziqli tenglamalar" },
  Inequalities: { ru: "Неравенства", uz: "Tengsizliklar" },
  Logarithms: { ru: "Логарифмы", uz: "Logarifmlar" },
  Trigonometry: { ru: "Тригонометрия", uz: "Trigonometriya" },
  Mastered: { ru: "Освоено", uz: "O'zlashtirilgan" },
  "In progress": { ru: "В процессе", uz: "Jarayonda" },
  "Unlocks after checkpoint": { ru: "После чекпоинта", uz: "Nazoratdan keyin" },
  prerequisites: { ru: "предусл.", uz: "shartlar" },
  topics: { ru: "темы", uz: "mavzu" },
  Continue: { ru: "Продолжить", uz: "Davom etish" },
  Checkpoint: { ru: "Чекпоинт", uz: "Nazorat" },

  // Web nav
  Dashboard: { ru: "Главная", uz: "Asosiy" },
  Roadmap: { ru: "План", uz: "Yo'l" },
  "Mock exams": { ru: "Пробные", uz: "Sinov imtihonlar" },
  "Chat Lesson": { ru: "Чат-урок", uz: "Chat-dars" },
  Leaderboard: { ru: "Рейтинг", uz: "Reyting" },

  // Web Dashboard
  "Tuesday, August 5": { ru: "Вторник, 5 авг.", uz: "Seshanba, 5 avg." },
  "Search topics…": { ru: "Поиск тем…", uz: "Mavzu qidirish…" },
  "Rasch score": { ru: "Rasch-балл", uz: "Rasch ball" },
  "Topic mastery": { ru: "Освоение тем", uz: "Mavzu o'zlashtirilishi" },
  "Battle ELO": { ru: "Боевой ELO", uz: "Jang ELO" },
  "Study streak": { ru: "Серия учёбы", uz: "O'qish seriyasi" },
  "Math · projected": { ru: "Матем. · прогноз", uz: "Matem. · prognoz" },
  mastered: { ru: "освоено", uz: "o'zlashtirilgan" },
  best: { ru: "рекорд", uz: "rekord" },
  "Recent mocks": { ru: "Недавние пробные", uz: "So'nggi sinovlar" },
  "Find an opponent in 30s": { ru: "Соперник за 30с", uz: "30s da raqib" },
  "Match in Math": { ru: "Битва по матем.", uz: "Matem. jang" },
  "Friends online": { ru: "Друзья онлайн", uz: "Onlayn do'stlar" },
  "Tashkent · Math": { ru: "Ташкент · Матем.", uz: "Toshkent · Matem." },

  // Web Leaderboard
  Rank: { ru: "Место", uz: "O'rin" },
  Student: { ru: "Студент", uz: "O'quvchi" },
  Global: { ru: "Глобальный", uz: "Global" },
  "This week": { ru: "Эта неделя", uz: "Bu hafta" },
  Friends: { ru: "Друзья", uz: "Do'stlar" },
  Tashkent: { ru: "Ташкент", uz: "Toshkent" },
  "My school": { ru: "Моя школа", uz: "Maktabim" },
  "Your rank": { ru: "Ваш ранг", uz: "Sizning o'rningiz" },
  Peak: { ru: "Рекорд", uz: "Rekord" },
  "Weekly reset in": { ru: "Сброс через", uz: "Yangilanish" },

  // Landing
  Pricing: { ru: "Тарифы", uz: "Narxlar" },
  "Sign in": { ru: "Войти", uz: "Kirish" },
  "Start free": { ru: "Начать бесплатно", uz: "Bepul boshlash" },
  "See how it works": { ru: "Как это работает", uz: "Qanday ishlaydi" },
  "Milliy Sertifikat 2026": {
    ru: "Milliy Sertifikat 2026",
    uz: "Milliy Sertifikat 2026",
  },
  "BMBA prep, rebuilt with AI.": {
    ru: "BMBA-подготовка, переосмысленная с ИИ.",
    uz: "BMBA tayyorgarligi, sun'iy intellekt bilan.",
  },
  "A diagnostic that finds your weak topics in 30 minutes. A roadmap that rewrites itself after every mock. A Socratic coach when you're stuck. And ranked battles when you're bored.":
    {
      ru: "Диагностика находит слабые темы за 30 минут. План перестраивается после каждой пробной. Сократический коуч, когда застряли. Рейтинговые битвы, когда скучно.",
      uz: "Diagnostika 30 daqiqada zaif mavzularni topadi. Reja har bir sinovdan keyin qayta tuziladi. Yo'lda sokratik kouch yordam beradi. Reytingli janglar zerikkanda.",
    },
  "Diagnostic exam": { ru: "Диагностика", uz: "Diagnostika" },
  "Adaptive 30-min test that estimates your Rasch score and identifies your 5 weakest topics.":
    {
      ru: "Адаптивный тест на 30 мин: оценка Rasch-балла и 5 слабых тем.",
      uz: "Moslashuvchan 30-daqiqali test: Rasch ball va 5 ta zaif mavzu.",
    },
  "AI Roadmap": { ru: "AI-план", uz: "AI yo'l" },
  "Sequenced topics + checkpoints, regenerated as you master each one. Calibrated to your exam date.":
    {
      ru: "Темы и чекпоинты, перегенерируются по мере прогресса. Привязка к дате экзамена.",
      uz: "Mavzular va nazoratlar, har gal qayta tuziladi. Imtihon sanasiga moslashadi.",
    },
  "Socratic AI Coach": { ru: "Сократический ИИ-коуч", uz: "Sokratik AI-kouch" },
  "When you fail a checkpoint, the Coach asks questions — never lectures. Math via KaTeX, diagrams via Mermaid.":
    {
      ru: "При провале чекпоинта Коуч задаёт вопросы, а не читает лекцию. Формулы в KaTeX, схемы в Mermaid.",
      uz: "Nazoratni o'tmaganda Kouch savol beradi, ma'ruza qilmaydi. Formulalar KaTeX, sxemalar Mermaid.",
    },
  "Ranked battles": { ru: "Рейтинговые битвы", uz: "Reytingli janglar" },
  "5-minute head-to-head duels with subject-specific ELO. Leaderboards by school and region.":
    {
      ru: "5-минутные дуэли с ELO по предмету. Рейтинги по школе и региону.",
      uz: "5 daqiqali yakkama-yakka jang, predmet bo'yicha ELO. Maktab va viloyat reytingi.",
    },
  "How it works": { ru: "Как это работает", uz: "Qanday ishlaydi" },
  "Take the diagnostic": {
    ru: "Пройти диагностику",
    uz: "Diagnostikani topshirish",
  },
  "30 minutes. Adaptive. Covers 80% of the topic tree.": {
    ru: "30 минут. Адаптивно. Покрывает 80% дерева тем.",
    uz: "30 daqiqa. Moslashuvchan. Mavzularning 80% i.",
  },
  "Get your roadmap": { ru: "Получить план", uz: "Yo'lni olish" },
  "A personalized sequence of topics, mocks and checkpoints.": {
    ru: "Персональная последовательность тем, пробных и чекпоинтов.",
    uz: "Shaxsiy mavzular, sinovlar va nazoratlar ketma-ketligi.",
  },
  "Study, battle, repeat": {
    ru: "Учись, сражайся, повторяй",
    uz: "O'rgan, jang qil, takrorla",
  },
  "Lessons, mocks, and 5-minute battles until you hit your target grade.": {
    ru: "Уроки, пробные и 5-минутные битвы до достижения цели.",
    uz: "Darslar, sinovlar va 5 daqiqali janglar maqsadingizgacha.",
  },
  "All BMBA subjects": { ru: "Все предметы BMBA", uz: "Barcha BMBA fanlari" },
  Free: { ru: "Бесплатно", uz: "Bepul" },
  Standard: { ru: "Стандарт", uz: "Standart" },
  Premium: { ru: "Премиум", uz: "Premium" },
  "/month": { ru: "/мес", uz: "/oy" },
  "Diagnostic + 3 checkpoints/week + 5 battles/day": {
    ru: "Диагностика + 3 чекпоинта/нед + 5 битв/день",
    uz: "Diagnostika + haftada 3 nazorat + kuniga 5 jang",
  },
  "1 subject unlimited + full roadmap + 30 battles/day": {
    ru: "1 предмет без лимита + полный план + 30 битв/день",
    uz: "1 fan cheksiz + to'liq yo'l + kuniga 30 jang",
  },
  "All subjects + unlimited chat lesson + unlimited battles": {
    ru: "Все предметы + чат-уроки без лимита + битвы без лимита",
    uz: "Barcha fanlar + cheksiz chat-dars + cheksiz jang",
  },
  "Get started": { ru: "Начать", uz: "Boshlash" },
  "Choose Premium": { ru: "Выбрать Premium", uz: "Premium tanlash" },

  // Mock Exam
  "Full Mock #8": { ru: "Пробный экзамен #8", uz: "Sinov imtihon #8" },
  "Auto-saved": { ru: "Автосохранено", uz: "Avtosaqlandi" },
  "12s ago": { ru: "12с назад", uz: "12s oldin" },
  "Section A · Closed type": { ru: "Часть А · Закрытые", uz: "A bo'lim · Yopiq" },
  "Section B · Open type": { ru: "Часть Б · Открытые", uz: "B bo'lim · Ochiq" },
  Question: { ru: "Вопрос", uz: "Savol" },
  of: { ru: "из", uz: "dan" },
  Previous: { ru: "Назад", uz: "Orqaga" },
  Next: { ru: "Далее", uz: "Keyingi" },
  "Flag for review": { ru: "Пометить", uz: "Belgilash" },
  Unflag: { ru: "Снять метку", uz: "Bekor qilish" },
  "Submit exam": { ru: "Сдать экзамен", uz: "Imtihonni topshirish" },
  Answered: { ru: "Отвечено", uz: "Javob berildi" },
  Flagged: { ru: "Помечено", uz: "Belgilangan" },
  Unseen: { ru: "Не открыто", uz: "Ko'rilmagan" },
  Current: { ru: "Текущий", uz: "Joriy" },
  "Time remaining": { ru: "Осталось", uz: "Qoldi" },
  "Question palette": { ru: "Список вопросов", uz: "Savollar ro'yxati" },
  "Answer sheet": { ru: "Лист ответов", uz: "Javoblar varaqasi" },
  "Find the value of": { ru: "Найдите значение", uz: "Quyidagining qiymatini toping" },
  "such that the system has": {
    ru: "при котором система имеет",
    uz: "tenglamalar tizimi",
  },
  "exactly two real solutions": {
    ru: "ровно два вещественных решения",
    uz: "aniq ikkita haqiqiy yechim",
  },
  "Closed · 1 correct": { ru: "Закрытый · 1 верный", uz: "Yopiq · 1 to'g'ri" },
  ball: { ru: "балл", uz: "ball" },
  Calculator: { ru: "Калькулятор", uz: "Kalkulator" },
  "Formula sheet": { ru: "Формулы", uz: "Formulalar" },
  "Scratch paper": { ru: "Черновик", uz: "Qoralama" },

  // Web Roadmap viz
  "Your study path": { ru: "Ваш учебный путь", uz: "O'quv yo'lingiz" },
  "6-week plan": { ru: "6-недельный план", uz: "6 haftalik reja" },
  Week: { ru: "Неделя", uz: "Hafta" },
  Diagnostic: { ru: "Диагностика", uz: "Diagnostika" },
  "Final mock": { ru: "Финал", uz: "Yakuniy sinov" },
  "BMBA exam": { ru: "Экзамен BMBA", uz: "BMBA imtihon" },
  "Regenerate roadmap": { ru: "Перестроить план", uz: "Yo'lni qayta tuzish" },
  Domains: { ru: "Разделы", uz: "Bo'limlar" },
  "Mastery legend": { ru: "Легенда", uz: "Belgilar" },

  // Chat Lesson web
  Topic: { ru: "Тема", uz: "Mavzu" },
  "Related formulas": { ru: "Связанные формулы", uz: "Bog'liq formulalar" },
  Session: { ru: "Сессия", uz: "Seans" },
  "New session": { ru: "Новая сессия", uz: "Yangi seans" },
  "Recent sessions": { ru: "Недавние сессии", uz: "So'nggi seanslar" },
  "End session": { ru: "Завершить", uz: "Yakunlash" },
  "Quadratic formula": { ru: "Квадратная формула", uz: "Kvadrat formula" },
  "Vieta's theorem": { ru: "Теорема Виета", uz: "Viyet teoremasi" },
  Discriminant: { ru: "Дискриминант", uz: "Diskriminant" },
};

export function makeT(lang: Lang) {
  return function t(en: string): string {
    if (lang === "en" || !en) return en;
    const s = STRINGS[en];
    if (!s || !s[lang]) return en;
    return s[lang];
  };
}

type I18nCtx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (en: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

const LANG_KEY = "coachai.lang";

function readLang(): Lang {
  if (typeof window === "undefined") return "en";
  const v = window.localStorage.getItem(LANG_KEY);
  if (v === "ru" || v === "uz" || v === "en") return v;
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<I18nCtx>(() => {
    const t = makeT(lang);
    return { lang, setLang, t };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
