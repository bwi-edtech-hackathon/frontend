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

  // Chat Lesson body content
  "I see you struggled with this on your checkpoint:": {
    ru: "Я вижу, у вас возникли трудности с этим на чекпоинте:",
    uz: "Nazoratda bu bilan qiyinchilikka uchraganingizni ko'rdim:",
  },
  "Before we solve it, can you tell me what": {
    ru: "Прежде чем решать, скажите, какой",
    uz: "Yechishdan oldin, qanday",
  },
  type: { ru: "тип", uz: "tur" },
  "of equation this is?": {
    ru: "тип уравнения это?",
    uz: "tenglama ekanini ayta olasizmi?",
  },
  "Right. The general form is": {
    ru: "Верно. Общий вид:",
    uz: "To'g'ri. Umumiy ko'rinishi:",
  },
  and: { ru: "и", uz: "va" },
  "Session progress": { ru: "Прогресс сессии", uz: "Seans bo'yicha yutuq" },
  "Identified equation type": {
    ru: "Определили тип уравнения",
    uz: "Tenglama turini aniqlandi",
  },
  "Recognized coefficients": {
    ru: "Распознали коэффициенты",
    uz: "Koeffisiyentlarni aniqlandi",
  },
  "Compute discriminant": {
    ru: "Вычислить дискриминант",
    uz: "Diskriminantni hisoblang",
  },
  "Apply quadratic formula": {
    ru: "Применить квадратную формулу",
    uz: "Kvadrat formulani qo'llang",
  },
  "Verify with practice": {
    ru: "Проверить на практике",
    uz: "Amaliyot bilan tekshiring",
  },
  "Tip:": { ru: "Совет:", uz: "Maslahat:" },
  "Drop an image of your handwritten work — the coach will read it.": {
    ru: "Загрузите фото рукописной работы — коуч прочтёт.",
    uz: "Qo'lda yozilgan ishingiz rasmini yuklang — kouch o'qiydi.",
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
  "Rasch score · last 8 weeks": {
    ru: "Rasch-балл · последние 8 недель",
    uz: "Rasch ball · so'nggi 8 hafta",
  },
  "+8.2 vs 4 wk ago": {
    ru: "+8,2 vs 4 нед. назад",
    uz: "+8.2 oldingi 4 haftaga",
  },
  Uzbek: { ru: "Узб.", uz: "O'zbek" },
  "B+ target · 60": { ru: "B+ цель · 60", uz: "B+ maqsad · 60" },
  "Topic mastery heat map": {
    ru: "Тепловая карта тем",
    uz: "Mavzu o'zlashtirishi xaritasi",
  },
  "Math · 22 topics · darker = stronger": {
    ru: "Матем. · 22 темы · темнее = крепче",
    uz: "Matem. · 22 mavzu · qoraroq = mustahkam",
  },
  "Algebra · Geometry · Functions · Probability": {
    ru: "Алгебра · Геометрия · Функции · Вероятность",
    uz: "Algebra · Geometriya · Funksiyalar · Ehtimollik",
  },
  "Recent mocks": { ru: "Недавние пробные", uz: "So'nggi sinovlar" },
  "Full mock #7": { ru: "Пробный #7", uz: "Sinov #7" },
  "Full mock #6": { ru: "Пробный #6", uz: "Sinov #6" },
  "Checkpoint · Vieta": { ru: "Чекпоинт · Виета", uz: "Nazorat · Viyet" },
  "Quick Battle": { ru: "Быстрая битва", uz: "Tezkor jang" },
  "Match in Math": { ru: "Битва по матем.", uz: "Matem. jang" },
  "Tuesday, August 5": { ru: "Вторник, 5 авг.", uz: "Seshanba, 5 avg." },
  "Search topics…": { ru: "Поиск тем…", uz: "Mavzu qidirish…" },
  "Rasch score": { ru: "Rasch-балл", uz: "Rasch ball" },
  "Topic mastery": { ru: "Освоение тем", uz: "Mavzu o'zlashtirilishi" },
  "Battle ELO": { ru: "Боевой ELO", uz: "Jang ELO" },
  "Study streak": { ru: "Серия учёбы", uz: "O'qish seriyasi" },
  "Math · projected": { ru: "Матем. · прогноз", uz: "Matem. · prognoz" },
  mastered: { ru: "освоено", uz: "o'zlashtirilgan" },
  best: { ru: "рекорд", uz: "rekord" },
  "Find an opponent in 30s": { ru: "Соперник за 30с", uz: "30s da raqib" },
  "Friends online": { ru: "Друзья онлайн", uz: "Onlayn do'stlar" },
  "Tashkent · Math": { ru: "Ташкент · Матем.", uz: "Toshkent · Matem." },

  // Battle status & friends
  "In Math lobby": { ru: "В лобби матем.", uz: "Matem. lobbida" },
  Studying: { ru: "Учится", uz: "O'qimoqda" },
  Online: { ru: "Онлайн", uz: "Onlayn" },

  // Web Leaderboard
  "Lyceum #1, Tashkent": { ru: "Лицей №1, Ташкент", uz: "1-litsey, Toshkent" },
  "of 8,412 students in Math": {
    ru: "из 8 412 студентов в матем.",
    uz: "matem. fanida 8412 o'quvchidan",
  },
  "Monday 00:00 Tashkent time": {
    ru: "Понедельник 00:00 по Ташкенту",
    uz: "Dushanba 00:00 Toshkent vaqti",
  },
  "This week's prize pool": {
    ru: "Призовой фонд недели",
    uz: "Bu haftaning sovrin jamg'armasi",
  },
  "Top 10 · Premium month": {
    ru: "Топ 10 · месяц Premium",
    uz: "Top 10 · Premium oy",
  },
  "Climb faster": { ru: "Расти быстрее", uz: "Tezroq ko'taril" },
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
  "studying right now": { ru: "учатся прямо сейчас", uz: "hozir o'qishmoqda" },
  "across 14 viloyats": { ru: "в 14 регионах", uz: "14 viloyatda" },
  "Estimated grade": { ru: "Прогноз балла", uz: "Baho prognozi" },
  Estimated: { ru: "Прогноз", uz: "Prognoz" },
  "Salom, Diana": { ru: "Привет, Diana", uz: "Salom, Diana" },
  "Math · 5 min": { ru: "Матем. · 5 мин", uz: "Matem. · 5 daqiqa" },
  "+18 ELO": { ru: "+18 ELO", uz: "+18 ELO" },
  "applicants used Milliy Sertifikat 2025/26": {
    ru: "абитуриентов сдали Milliy Sertifikat 2025/26",
    uz: "abituriyentlar Milliy Sertifikat 2025/26 dan foydalandi",
  },
  "YoY growth in certificate usage": {
    ru: "рост популярности сертификата за год",
    uz: "sertifikat foydalanishining yillik o'sishi",
  },
  "growth in general-subject certificates": {
    ru: "рост по общеобразовательным сертификатам",
    uz: "umumiy sertifikatlar bo'yicha o'sish",
  },
  "salary bonus for teachers with C1+ certificate": {
    ru: "надбавка учителям с сертификатом C1+",
    uz: "C1+ sertifikatli o'qituvchilarga ish haqi qo'shimchasi",
  },
  "What's inside": { ru: "Что внутри", uz: "Ichida nima bor" },
  "The first prep platform that": {
    ru: "Первая платформа подготовки, которая",
    uz: "Sizni biladigan birinchi tayyorgarlik platformasi",
  },
  "knows you": { ru: "знает вас", uz: "biladi" },
  Recommended: { ru: "Рекомендуем", uz: "Tavsiya" },
  "© 2026 CoachAI · BMBA prep platform · Tashkent, UZ": {
    ru: "© 2026 CoachAI · Платформа подготовки к BMBA · Ташкент, UZ",
    uz: "© 2026 CoachAI · BMBA tayyorgarlik platformasi · Toshkent, UZ",
  },
  "In your equation, what are": {
    ru: "В вашем уравнении, чему равны",
    uz: "Sizning tenglamangizda nimaga teng",
  },
  Karakalpak: { ru: "Каракалпак.", uz: "Qoraqalpoq" },

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

  // Exam Landing
  "BMBA format": { ru: "Формат BMBA", uz: "BMBA formati" },
  "Realistic 150-minute simulation": {
    ru: "Реалистичная 150-минутная симуляция",
    uz: "Real 150 daqiqalik simulyatsiya",
  },
  "Same scoring engine as the real Milliy Sertifikat: Rasch-calibrated grading, section structure, proctor-style timer warnings, auto-save every 30 seconds.":
    {
      ru: "Тот же движок оценки, что и у настоящего Milliy Sertifikat: оценка по Rasch, структура секций, предупреждения по таймеру и автосохранение каждые 30 секунд.",
      uz: "Haqiqiy Milliy Sertifikat bilan bir xil baholash tizimi: Rasch baholash, bo'limlar tuzilishi, taymer ogohlantirishlari va har 30 soniyada avtosaqlash.",
    },
  Duration: { ru: "Время", uz: "Davomiyligi" },
  "150 min": { ru: "150 мин", uz: "150 daqiqa" },
  Questions: { ru: "Вопросов", uz: "Savollar" },
  "Section A": { ru: "Часть А", uz: "A bo'lim" },
  "35 closed": { ru: "35 закрытых", uz: "35 ta yopiq" },
  "Section B": { ru: "Часть Б", uz: "B bo'lim" },
  "10 open": { ru: "10 открытых", uz: "10 ta ochiq" },
  "Pick subject": { ru: "Выберите предмет", uz: "Fanni tanlang" },
  "Before you start": { ru: "Перед началом", uz: "Boshlashdan oldin" },
  "Strict timer": { ru: "Жёсткий таймер", uz: "Qattiq taymer" },
  "150 minutes total with warnings at 30, 15, and 5 minutes remaining. Auto-submits at zero.":
    {
      ru: "150 минут всего с предупреждениями при 30, 15 и 5 оставшихся минутах. Автоматически сдаётся на нуле.",
      uz: "Jami 150 daqiqa, 30, 15 va 5 daqiqa qolganda ogohlantirish. Nolda avto topshiriladi.",
    },
  "No going back": { ru: "Назад нельзя", uz: "Orqaga qaytib bo'lmaydi" },
  "Once you submit Section A, you can't return to it. Section B opens immediately after.":
    {
      ru: "После сдачи Части А вернуться нельзя. Сразу открывается Часть Б.",
      uz: "A bo'limini topshirgandan keyin unga qaytib bo'lmaydi. Darhol B bo'lim ochiladi.",
    },
  Tools: { ru: "Инструменты", uz: "Asboblar" },
  "Formula sheet and scratch paper available from the right toolbar at any time.":
    {
      ru: "Формулы и черновик доступны в правой панели в любое время.",
      uz: "Formulalar va qoralama o'ng paneldan istalgan vaqtda mavjud.",
    },
  "Auto-save": { ru: "Автосохранение", uz: "Avtosaqlash" },
  "Every answer and flag is saved as you go. Reload safely if your connection drops.":
    {
      ru: "Каждый ответ и метка сохраняются на ходу. Можно безопасно перезагрузить при обрыве связи.",
      uz: "Har bir javob va belgi saqlanib boriladi. Aloqa uzilsa, xavfsiz qayta yuklang.",
    },
  "Ready to begin?": { ru: "Готовы начать?", uz: "Boshlashga tayyormisiz?" },
  mock: { ru: "пробный", uz: "sinov" },
  "Once you press Start, the timer begins immediately and runs in the background even if you switch tabs.":
    {
      ru: "После нажатия «Старт» таймер запускается сразу и продолжается даже при переключении вкладок.",
      uz: "Start tugmasini bossangiz, taymer darhol boshlanadi va boshqa varaqlarga o'tsangiz ham ishlaydi.",
    },
  "Starting…": { ru: "Запуск…", uz: "Boshlanmoqda…" },
  "Start exam": { ru: "Начать экзамен", uz: "Imtihonni boshlash" },
  "Find a quiet 2.5h window — exit closes the session.": {
    ru: "Найдите тихое окно 2,5 ч — выход закрывает сессию.",
    uz: "2,5 soatlik tinch vaqt toping — chiqish seansni yopadi.",
  },
  "Grading scale": { ru: "Шкала оценок", uz: "Baholash shkalasi" },
  "Minimum 46 points needed for any certificate.": {
    ru: "Минимум 46 баллов для любого сертификата.",
    uz: "Har qanday sertifikat uchun kamida 46 ball kerak.",
  },

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
  // Exam active
  Open: { ru: "Открыт", uz: "Ochiq" },
  "Open type": { ru: "Открытый", uz: "Ochiq turi" },
  "Loading exam…": { ru: "Загрузка экзамена…", uz: "Imtihon yuklanmoqda…" },
  "Wrap up. The exam will submit automatically.": {
    ru: "Завершайте. Экзамен будет сдан автоматически.",
    uz: "Yakunlang. Imtihon avto topshiriladi.",
  },
  "Proctor warning.": {
    ru: "Предупреждение прокторинга.",
    uz: "Proktor ogohlantirishi.",
  },
  "Could not submit exam. Try again.": {
    ru: "Не удалось сдать экзамен. Попробуйте снова.",
    uz: "Imtihonni topshirib bo'lmadi. Qaytadan urinib ko'ring.",
  },
  "Time's up — submitting your answers.": {
    ru: "Время вышло — отправляем ваши ответы.",
    uz: "Vaqt tugadi — javoblar yuborilmoqda.",
  },
  "Exit and discard this attempt? Your answers will be lost.": {
    ru: "Выйти и сбросить попытку? Ответы будут потеряны.",
    uz: "Chiqib, urinishni bekor qilamizmi? Javoblar yo'qoladi.",
  },
  "⚠ Less than 5 minutes remaining — your exam will auto-submit when the timer hits zero.":
    {
      ru: "⚠ Меньше 5 минут — экзамен сдастся автоматически при достижении нуля.",
      uz: "⚠ 5 daqiqadan kam vaqt qoldi — taymer nolga yetganda imtihon avto topshiriladi.",
    },
  "Answer sheet · 1–20": {
    ru: "Лист ответов · 1–20",
    uz: "Javoblar varaqasi · 1–20",
  },
  "Type your answer (number, word, or formula)…": {
    ru: "Введите ответ (число, слово или формулу)…",
    uz: "Javobingizni kiriting (raqam, so'z yoki formula)…",
  },
  "Note:": { ru: "Примечание:", uz: "Eslatma:" },
  "You cannot return to Section A after submitting it.": {
    ru: "После отправки Части А вернуться нельзя.",
    uz: "A bo'limini topshirgandan keyin unga qaytib bo'lmaydi.",
  },
  "Submit answered confirm": {
    ru: "Сдать {answered}/{total} отвеченных?",
    uz: "{answered}/{total} javob berildi, topshiriladimi?",
  },

  // Exam Analyzing
  "Scoring closed-type answers…": {
    ru: "Оценка закрытых ответов…",
    uz: "Yopiq turdagi javoblar baholanmoqda…",
  },
  "Grading open-type responses with AI…": {
    ru: "Оценка открытых ответов с помощью ИИ…",
    uz: "Ochiq javoblar AI yordamida baholanmoqda…",
  },
  "Calibrating Rasch score against item difficulty…": {
    ru: "Калибровка Rasch-балла по сложности заданий…",
    uz: "Rasch ball topshiriqlar qiyinligi bo'yicha kalibrlanmoqda…",
  },
  "Identifying weakest topics & impact ranking…": {
    ru: "Поиск слабых тем и ранжирование по влиянию…",
    uz: "Eng zaif mavzular va ta'sir reytingi aniqlanmoqda…",
  },
  "Building your diagnostic report…": {
    ru: "Создаём ваш диагностический отчёт…",
    uz: "Diagnostik hisobotingiz yaratilmoqda…",
  },
  "Analyzing your answers…": {
    ru: "Анализируем ваши ответы…",
    uz: "Javoblaringiz tahlil qilinmoqda…",
  },
  "Hold tight — we're running your answers through the same Rasch-calibrated engine the BMBA uses and generating a diagnostic report.":
    {
      ru: "Подождите — мы прогоняем ваши ответы через тот же Rasch-движок BMBA и формируем диагностический отчёт.",
      uz: "Sabr qiling — javoblaringizni BMBA ishlatadigan Rasch tizimi orqali o'tkazib, diagnostik hisobot tayyorlayapmiz.",
    },

  // Exam Result
  "Loading your report…": {
    ru: "Загрузка отчёта…",
    uz: "Hisobotingiz yuklanmoqda…",
  },
  "Mock exam · Mathematics": {
    ru: "Пробный · Математика",
    uz: "Sinov · Matematika",
  },
  "Your diagnostic report": {
    ru: "Ваш диагностический отчёт",
    uz: "Diagnostik hisobotingiz",
  },
  "Back to dashboard": { ru: "На главную", uz: "Asosiyga qaytish" },
  "Certificate-ready": { ru: "К сертификату готов", uz: "Sertifikatga tayyor" },
  "Below pass threshold": { ru: "Ниже порога", uz: "O'tish bo'sag'asidan past" },
  Grade: { ru: "Балл", uz: "Baho" },
  "Rasch / 75": { ru: "Rasch / 75", uz: "Rasch / 75" },
  "You answered {correct}/{total} correctly. Your weak topics are ranked below by impact on your final score — fix the top three and your projected grade jumps a tier.":
    {
      ru: "Вы ответили {correct}/{total} верно. Ваши слабые темы ниже отранжированы по влиянию на финал — закрыв топ-3, вы поднимете прогноз на ступень.",
      uz: "Siz {correct}/{total} ga to'g'ri javob berdingiz. Zaif mavzularingiz quyida yakuniy ballga ta'siri bo'yicha tartiblangan — top-3 ni yopib, prognozingizni bir pog'ona ko'tarasiz.",
    },
  "Section A · closed": {
    ru: "Часть А · закрытые",
    uz: "A bo'lim · yopiq",
  },
  "Section B · open": {
    ru: "Часть Б · открытые",
    uz: "B bo'lim · ochiq",
  },
  "Analyze with AI Coach": {
    ru: "Разобрать с ИИ-коучем",
    uz: "AI-kouch bilan tahlil qilish",
  },
  "Updating…": { ru: "Обновление…", uz: "Yangilanmoqda…" },
  "View updated roadmap": {
    ru: "Открыть обновлённый план",
    uz: "Yangilangan yo'lni ko'rish",
  },
  "Weakest topics": { ru: "Слабые темы", uz: "Eng zaif mavzular" },
  "Ranked by impact on your projected final score": {
    ru: "По влиянию на итоговый прогноз",
    uz: "Yakuniy ballingizga ta'siri bo'yicha",
  },
  Top: { ru: "Топ", uz: "Top" },
  "You're solid on": {
    ru: "Вы сильны в",
    uz: "Siz quyidagilarda mustahkamsiz",
  },
  "Don't drill these — diminishing returns. Focus minutes on the weak list to climb tiers faster.":
    {
      ru: "Не тратьте время на эти — отдача падает. Сосредоточьтесь на слабых темах, чтобы расти быстрее.",
      uz: "Bularga vaqt sarflamang — foyda kam. Tezroq ko'tarilish uchun zaif ro'yxatga e'tibor bering.",
    },
  "Question breakdown": { ru: "Разбор вопросов", uz: "Savollar tahlili" },
  "First {n} questions · tap \"Explain\" to ask the AI Coach": {
    ru: "Первые {n} вопросов · нажмите «Объяснить», чтобы спросить ИИ-коуча",
    uz: "Birinchi {n} ta savol · AI-kouchdan so'rash uchun «Tushuntirish» ni bosing",
  },
  "View all": { ru: "Все", uz: "Hammasi" },
  Yours: { ru: "Ваш", uz: "Sizniki" },
  Correct: { ru: "Верный", uz: "To'g'ri" },
  Time: { ru: "Время", uz: "Vaqt" },
  Action: { ru: "Действие", uz: "Harakat" },
  Explain: { ru: "Объяснить", uz: "Tushuntirish" },
  "Talk through wrong answers": {
    ru: "Разобрать ошибки",
    uz: "Xato javoblarni muhokama qilish",
  },
  "AI Coach uses the Socratic method — no lectures, just questions that lead you to the answer.":
    {
      ru: "ИИ-коуч использует сократический метод — без лекций, только вопросы, ведущие к ответу.",
      uz: "AI-kouch sokratik usuldan foydalanadi — ma'ruzalar emas, javobga olib boruvchi savollar.",
    },
  "Start session": { ru: "Начать сессию", uz: "Seansni boshlash" },
  "We'll rebuild your study path around the weak topics, pacing checkpoints up to your exam date.":
    {
      ru: "Мы перестроим план вокруг слабых тем с чекпоинтами до даты экзамена.",
      uz: "Reja zaif mavzular atrofida qayta tuziladi, nazoratlar imtihon sanasigacha taqsimlanadi.",
    },
  "Update plan": { ru: "Обновить план", uz: "Rejani yangilash" },
  "Drill the topics in battles": {
    ru: "Прорабатывать темы в битвах",
    uz: "Mavzularni janglarda mashq qiling",
  },
  "5-minute ranked duels filtered to your weakest topics — the cheapest exposure per minute.":
    {
      ru: "5-минутные рейтинговые дуэли по слабым темам — лучшая отдача за минуту.",
      uz: "5 daqiqalik reytingli janglar zaif mavzularga moslangan — daqiqada eng katta foyda.",
    },
  "Open battle lobby": { ru: "Открыть лобби битв", uz: "Jang lobbisini ochish" },

  // Exam tools
  Pen: { ru: "Перо", uz: "Qalam" },
  Highlighter: { ru: "Маркер", uz: "Marker" },
  Clear: { ru: "Очистить", uz: "Tozalash" },
  "Search formulas…": { ru: "Поиск формул…", uz: "Formula qidirish…" },
  "Loading…": { ru: "Загрузка…", uz: "Yuklanmoqda…" },
  "No matches.": { ru: "Совпадений нет.", uz: "Mosliklar yo'q." },
  Close: { ru: "Закрыть", uz: "Yopish" },

  // Roadmap
  Locked: { ru: "Заблокировано", uz: "Yopilgan" },

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
