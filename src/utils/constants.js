// Constants extracted from App.jsx

const USERS_KEY = "ironfa_users";
const SESSION_KEY = "ironfa_session";
const ACTIVE_PLAN_KEY = "ironfa_active_plan";
const WORKOUT_LOG_KEY = "ironfa_workout_log";
const ACTIVE_WORKOUT_KEY = "ironfa_active_workout";
const PROGRESS_DATA_KEY = "ironfa_progress_data";
const LANGUAGE_KEY = "ironfa_language";

const SEX_LABELS = { مرد: { fa: "مرد", en: "Male" }, زن: { fa: "زن", en: "Female" } };
const GOAL_DISPLAY = {
  "حجم عضلانی": { fa: "حجم عضلانی", en: "Muscle Gain" },
  "چربی‌سوزی": { fa: "چربی‌سوزی", en: "Fat Loss" },
  "قدرت": { fa: "قدرت", en: "Strength" },
  "ریکامپوزیشن": { fa: "ریکامپوزیشن", en: "Recomposition" },
};
const LEVEL_DISPLAY = {
  "مبتدی": { fa: "مبتدی", en: "Beginner" },
  "متوسط": { fa: "متوسط", en: "Intermediate" },
  "پیشرفته": { fa: "پیشرفته", en: "Advanced" },
};
const EQUIPMENT_DISPLAY = {
  "باشگاه کامل": { fa: "باشگاه کامل", en: "Full Gym" },
  "هوم جیم": { fa: "هوم جیم", en: "Home Gym" },
  "دمبل و کش": { fa: "دمبل و کش", en: "Dumbbells & Bands" },
  "وزن بدن": { fa: "وزن بدن", en: "Bodyweight" },
};
const RECOVERY_DISPLAY = {
  "پایین": { fa: "پایین", en: "Low" },
  "متوسط": { fa: "متوسط", en: "Medium" },
  "بالا": { fa: "بالا", en: "High" },
};
const LIMITATION_DISPLAY = {
  "ندارم": { fa: "ندارم", en: "None" },
  "زانو": { fa: "زانو", en: "Knee" },
  "کمر": { fa: "کمر", en: "Back" },
  "شانه": { fa: "شانه", en: "Shoulder" },
  "مچ": { fa: "مچ", en: "Wrist" },
  "گردن": { fa: "گردن", en: "Neck" },
  "لگن": { fa: "لگن", en: "Hip" },
};
const MUSCLE_DISPLAY = {
  "پا": { fa: "پا", en: "Legs" },
  "سرینی": { fa: "سرینی", en: "Glutes" },
  "کور": { fa: "کور", en: "Core" },
  "پشت": { fa: "پشت", en: "Back" },
  "پشت ران": { fa: "پشت ران", en: "Hamstrings" },
  "کمر": { fa: "کمر", en: "Lower Back" },
  "کمر پایین": { fa: "کمر پایین", en: "Lower Back" },
  "سینه": { fa: "سینه", en: "Chest" },
  "سرشانه": { fa: "سرشانه", en: "Shoulders" },
  "پشت بازو": { fa: "پشت بازو", en: "Triceps" },
  "بازو": { fa: "بازو", en: "Arms" },
  "شکم": { fa: "شکم", en: "Abs" },
};
const EXERCISE_EQUIPMENT_DISPLAY = {
  "هالتر": { fa: "هالتر", en: "Barbell" },
  "دمبل": { fa: "دمبل", en: "Dumbbell" },
  "دستگاه": { fa: "دستگاه", en: "Machine" },
  "میله": { fa: "میله", en: "Bar" },
  "بدون ابزار": { fa: "بدون ابزار", en: "Bodyweight" },
};
const SPLIT_LABELS_EN = {
  upper_lower: "Upper / Lower",
  push_pull_legs: "Push / Pull / Legs",
  full_body: "Full Body",
  bro_split: "Bro Split",
};


const DEMO_USER = {
  id: 0, name: "کاربر دمو", email: "test@ironfa.com", password: "94100eb4cd8448d3813fb16d8342d3a2c6e9bfbd25641bf14dcbbbc8ad856c63",
  goal: "حجم عضلانی", training_level: "متوسط", age: 25, height: 178, weight: 80, sex: "مرد",
  training_days_per_week: 4, session_duration: 60, equipment_access: "باشگاه کامل", injury_or_limitation_flags: ["ندارم"],
  recovery_quality: "بالا",
  onboarded: true
};

const TRUST_BASELINE_COPY = "این برنامه از روی هدف، سطح، تعداد جلسات، تجهیزات، ریکاوری و محدودیت‌های ثبت‌شده تو ساخته می‌شود و قرار نیست جای تشخیص پزشکی یا مربی حضوری را بگیرد.";
const DISCLAIMER_BASELINE_COPY = "اگر درد، آسیب، یا وضعیت پزشکی خاص داری، قبل از اجرای برنامه با متخصص واجد صلاحیت مشورت کن و هر حرکت دردزا را متوقف کن.";
const TRUST_BASELINE_COPY_EN = "This plan is built from your goal, level, session count, equipment, recovery, and recorded limitations, and it is not meant to replace medical judgment or an in-person coach.";
const DISCLAIMER_BASELINE_COPY_EN = "If you have pain, an injury, or a medical condition, consult a qualified professional before following the plan and stop any movement that causes pain.";


function hasMeaningfulLimitations(limitations = []) {
  return Array.isArray(limitations) && limitations.length > 0 && !limitations.includes("ندارم");
}

function isPromptLimitationSensitive(prompt = "") {
  const text = String(prompt).toLowerCase();
  const patterns = [
    "درد", "آسیب", "زانو", "کمر", "شانه", "گردن", "مچ", "لگن",
    "pain", "injury", "knee", "back", "shoulder", "neck", "wrist", "hip",
    "physio", "rehab", "توانبخشی", "فیزیوتراپی", "پزشک",
  ];
  return patterns.some(pattern => text.includes(pattern));
}

function getAiSafetyMode({ limitations = [], prompt = "" }) {
  const hasLimitations = hasMeaningfulLimitations(limitations);
  const promptSensitive = isPromptLimitationSensitive(prompt);
  if (hasLimitations && promptSensitive) return "high";
  if (hasLimitations || promptSensitive) return "elevated";
  return "normal";
}


const SPLIT_LABELS = {
  full_body: "فول‌بادی",
  upper_lower: "بالاتنه / پایین‌تنه",
  ppl: "Push Pull Legs",
  strength_split: "اسپلیت قدرت",
};

const GOAL_LABELS = {
  hypertrophy: "حجم عضلانی",
  fat_loss: "چربی‌سوزی",
  strength: "قدرت",
  recomposition: "ریکامپوزیشن",
};

const LEVEL_LABELS = {
  beginner: "مبتدی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

const PROGRAMMING_STYLE_LABELS = {
  hypertrophy: "حجم‌محور با پیشروی کنترل‌شده",
  strength: "قدرت‌محور با استراحت بلندتر",
  fat_loss: "تراکم بالاتر با خستگی کنترل‌شده",
  recomposition: "متعادل و پایدار",
};

const PROGRAMMING_CUE_LABELS = {
  hypertrophy: "روی کیفیت تکرارها و نزدیک‌شدن کنترل‌شده به ناتوانی تمرکز کن.",
  strength: "ست‌های اصلی را با تکنیک دقیق و استراحت کامل‌تر انجام بده.",
  fat_loss: "ریتم تمرین را حفظ کن و بین ست‌ها استراحت را جمع‌وجور نگه دار.",
  recomposition: "تعادل بین کیفیت اجرا، حجم مناسب و خستگی قابل‌ریکاوری را حفظ کن.",
};

const PROGRAMMING_STYLE_LABELS_EN = {
  hypertrophy: "Hypertrophy-focused with controlled progression",
  strength: "Strength-focused with longer rest",
  fat_loss: "Higher density with controlled fatigue",
  recomposition: "Balanced and sustainable",
};

const PROGRAMMING_CUE_LABELS_EN = {
  hypertrophy: "Focus on rep quality and controlled proximity to failure.",
  strength: "Keep main sets technically sharp and rest more fully.",
  fat_loss: "Keep the training pace up and rest periods tighter.",
  recomposition: "Balance execution quality, useful volume, and recoverable fatigue.",
};


const LEVELS = [
  { level: 1, title: "تازه‌کار", minXP: 0, maxXP: 200, color: "#888" },
  { level: 2, title: "مبتدی", minXP: 200, maxXP: 500, color: "#4a9" },
  { level: 3, title: "در حال پیشرفت", minXP: 500, maxXP: 1000, color: "#4af" },
  { level: 4, title: "ورزشکار", minXP: 1000, maxXP: 2000, color: "#a4f" },
  { level: 5, title: "حرفه‌ای", minXP: 2000, maxXP: 3500, color: "#f84" },
  { level: 6, title: "قهرمان", minXP: 3500, maxXP: 5500, color: "#f44" },
  { level: 7, title: "استاد آهن", minXP: 5500, maxXP: 8000, color: "#fa0" },
  { level: 8, title: "نخبه", minXP: 8000, maxXP: 11000, color: "#e8ff00" },
  { level: 9, title: "اسطوره", minXP: 11000, maxXP: 15000, color: "#0ff" },
  { level: 10, title: "آتلت آیرون‌فا", minXP: 15000, maxXP: 99999, color: "#f0f" },
];

const BADGES = [
  { id: "first_workout", icon: "🏅", title: "اولین قدم", desc: "اولین تمرین رو ثبت کردی", condition: (g) => g.totalWorkouts >= 1 },
  { id: "streak_3", icon: "🔥", title: "در آتش", desc: "۳ روز متوالی تمرین", condition: (g) => g.streak >= 3 },
  { id: "streak_7", icon: "⚡", title: "هفته‌ای", desc: "۷ روز متوالی تمرین", condition: (g) => g.streak >= 7 },
  { id: "streak_30", icon: "💎", title: "ماه آهنین", desc: "۳۰ روز متوالی تمرین", condition: (g) => g.streak >= 30 },
  { id: "workouts_10", icon: "💪", title: "جدی شدم", desc: "۱۰ تمرین کامل", condition: (g) => g.totalWorkouts >= 10 },
  { id: "workouts_50", icon: "🏆", title: "نیمه‌حرفه‌ای", desc: "۵۰ تمرین کامل", condition: (g) => g.totalWorkouts >= 50 },
  { id: "workouts_100", icon: "👑", title: "صد تمرین", desc: "۱۰۰ تمرین کامل", condition: (g) => g.totalWorkouts >= 100 },
  { id: "sets_50", icon: "🎯", title: "پشتکار", desc: "۵۰ ست ثبت‌شده", condition: (g) => g.totalSets >= 50 },
  { id: "level_5", icon: "🌟", title: "حرفه‌ای شدم", desc: "به لول ۵ رسیدی", condition: (g) => g.level >= 5 },
  { id: "level_10", icon: "🔮", title: "آتلت آیرون‌فا", desc: "به لول ۱۰ رسیدی", condition: (g) => g.level >= 10 },
];

const GAMIF_KEY = "ironfa_gamification";

export {
  USERS_KEY, SESSION_KEY, ACTIVE_PLAN_KEY, WORKOUT_LOG_KEY, ACTIVE_WORKOUT_KEY,
  PROGRESS_DATA_KEY, LANGUAGE_KEY,
  SEX_LABELS, GOAL_DISPLAY, LEVEL_DISPLAY, EQUIPMENT_DISPLAY, RECOVERY_DISPLAY,
  LIMITATION_DISPLAY, MUSCLE_DISPLAY, EXERCISE_EQUIPMENT_DISPLAY, SPLIT_LABELS_EN,
  DEMO_USER,
  TRUST_BASELINE_COPY, DISCLAIMER_BASELINE_COPY,
  TRUST_BASELINE_COPY_EN, DISCLAIMER_BASELINE_COPY_EN,
  SPLIT_LABELS, GOAL_LABELS, LEVEL_LABELS,
  PROGRAMMING_STYLE_LABELS, PROGRAMMING_CUE_LABELS,
  PROGRAMMING_STYLE_LABELS_EN, PROGRAMMING_CUE_LABELS_EN,
  GAMIF_KEY, LEVELS, BADGES,
};
