import { useState, useEffect, useRef } from "react";

const USERS_KEY = "ironfа_users";
const SESSION_KEY = "ironfa_session";
const ACTIVE_PLAN_KEY = "ironfa_active_plan";
const WORKOUT_LOG_KEY = "ironfa_workout_log";
const ACTIVE_WORKOUT_KEY = "ironfa_active_workout";
const PROGRESS_DATA_KEY = "ironfa_progress_data";
const LANGUAGE_KEY = "ironfa_language";

const LANG_TEXT = {
  fa: {
    auth_subtitle: "مربی هوشمند تناسب اندام تو",
    get_started: "🚀 شروع",
    log_in: "ورود",
    or: "یا",
    personalized_plans: "برنامه‌های شخصی‌سازی‌شده",
    ai_coach: "مربی AI",
    gamification: "گیمیفیکیشن",
    adherence_tracking: "ردیابی پایبندی",
    takes_less_than_2_minutes: "کمتر از ۲ دقیقه زمان می‌برد",
    create_account: "ساخت حساب",
    login_to_app: "ورود به اپ",
    back: "برگشت",
    name: "نام",
    email: "ایمیل",
    password: "رمز عبور",
    continue_onboarding: "ادامه و شروع آنبوردینگ",
    demo_login: "🎮 ورود با حساب دمو",
    restore_copy: "با ورود، برنامه و تاریخچه ذخیره‌شده تو از روی session فعلی بازیابی می‌شود.",
    complete_fields_error: "نام، ایمیل و رمز عبور را کامل کن",
    password_length_error: "رمز عبور حداقل ۶ کاراکتر باشد",
    email_exists_error: "این ایمیل قبلاً ثبت شده است",
    invalid_login_error: "ایمیل یا رمز عبور اشتباه است",
    onboarding_brand: "💪 آیرون‌فا",
    step_of: "مرحله {current} از {total}",
    next: "بعدی ←",
    previous: "← قبلی",
    build_program: "🚀 ساخت برنامه",
    product_boundary: "مرز محصول",
    sex_step_title: "جنسیت",
    sex_step_subtitle: "اول جنسیتت را مشخص کن",
    goal_step_title: "هدف و سطح",
    goal_step_subtitle: "جهت تمرینت را مشخص کنیم",
    body_step_title: "پروفایل بدنی",
    body_step_subtitle: "اطلاعات پایه بدنت را وارد کن",
    training_step_title: "ساختار تمرین",
    training_step_subtitle: "برنامه باید با زندگی واقعی تو جور باشد",
    recovery_step_title: "محدودیت و ریکاوری",
    recovery_step_subtitle: "برنامه باید برای بدنت واقع‌بینانه باشد",
    final_step_title: "مرور نهایی",
    final_step_subtitle: "قبل از ساخت برنامه، ورودی‌ها را چک کن",
    sex_label: "جنسیت",
    goal_label: "هدف اصلی",
    level_label: "سطح تمرینی",
    age_label: "سن (سال)",
    age_placeholder: "مثلاً ۲۵",
    weight_label: "وزن (kg)",
    weight_placeholder: "مثلاً ۷۵",
    height_label: "قد (cm)",
    height_placeholder: "مثلاً ۱۷۵",
    training_days_label: "روزهای تمرین در هفته",
    equipment_label: "تجهیزات در دسترس",
    session_duration_label: "مدت هر جلسه (دقیقه)",
    limitations_label: "آسیب‌دیدگی یا محدودیت",
    limitations_hint: "چند مورد انتخاب کن",
    recovery_label: "کیفیت ریکاوری فعلی",
    summary_goal: "هدف",
    summary_level: "سطح تمرینی",
    summary_age_sex: "سن / جنسیت",
    summary_height_weight: "قد / وزن",
    summary_weekly_plan: "برنامه هفتگی",
    summary_equipment: "تجهیزات",
    summary_recovery: "ریکاوری",
    summary_limitations: "محدودیت‌ها",
    exercises_tab: "حرکات",
    workout_tab: "تمرین",
    programs_tab: "برنامه",
    progress_tab: "پیشرفت",
    nutrition_tab: "تغذیه",
    coach_tab: "مربی",
    points_tab: "امتیاز",
    logout: "خروج",
    exercises_bank: "🏋️ بانک حرکات",
    search_placeholder: "جستجو...",
    back_label: "← برگشت",
    add_to_today_workout: "+ اضافه به تمرین امروز",
    today_workout: "⚡ تمرین امروز",
    workout_programs: "📋 برنامه‌های تمرینی",
    progress_tracking: "📊 ردیابی پیشرفت",
    smart_coach: "🤖 مربی هوشمند",
    points_title: "🏆 امتیازات من",
    nutrition_title: "🥗 تغذیه",
    ai_boundary: "مرز مربی AI",
    ai_context: "کانتکست فعلی که به مربی AI داده می‌شود",
    ai_processing: "⏳ در حال پردازش...",
    ask_ai: "🚀 سوال از مربی AI",
    ai_answer: "🤖 پاسخ مربی:",
    ai_prompt_placeholder: "سوالت رو بنویس...",
    ai_intro: "سوالت رو بپرس — جواب شخصی‌سازی‌شده بر اساس پروفایل تو",
    ai_login_context_goal: "هدف",
    ai_login_context_level: "سطح",
    ai_login_context_active_program: "برنامه فعال",
    ai_login_context_active_day: "روز فعال",
    ai_login_context_split: "split",
    ai_login_context_limitations: "محدودیت‌ها",
    active_program_none: "ندارد",
    unknown: "نامشخص",
    none: "ندارد",
    no_sessions_yet: "هنوز جلسه‌ای ثبت نشده. اولین تمرین را از تب برنامه یا تمرین شروع کن.",
    current_weight: "وزن فعلی",
    total_change: "تغییر کل",
    sessions_last_7_days: "جلسات ۷ روز اخیر",
    logged_exercises: "حرکت ثبت‌شده",
    average_adherence: "میانگین پایبندی",
    latest_adherence: "پایبندی آخرین جلسه",
  },
  en: {
    auth_subtitle: "Your Smart Fitness Coach",
    get_started: "🚀 Get Started",
    log_in: "Log In",
    or: "OR",
    personalized_plans: "Personalized Plans",
    ai_coach: "AI Coach",
    gamification: "Gamification",
    adherence_tracking: "Adherence Tracking",
    takes_less_than_2_minutes: "Takes less than 2 minutes",
    create_account: "Create Account",
    login_to_app: "Log In",
    back: "Back",
    name: "Name",
    email: "Email",
    password: "Password",
    continue_onboarding: "Continue to Onboarding",
    demo_login: "🎮 Demo Account",
    restore_copy: "Your saved plan and history will be restored from the current session after login.",
    complete_fields_error: "Complete name, email, and password",
    password_length_error: "Password must be at least 6 characters",
    email_exists_error: "This email is already registered",
    invalid_login_error: "Incorrect email or password",
    onboarding_brand: "💪 IronFa",
    step_of: "Step {current} of {total}",
    next: "Next →",
    previous: "← Back",
    build_program: "🚀 Build My Program",
    product_boundary: "Product Boundary",
    sex_step_title: "Gender",
    sex_step_subtitle: "Let’s start with your gender",
    goal_step_title: "Goal & Level",
    goal_step_subtitle: "Set the direction of your training",
    body_step_title: "Body Profile",
    body_step_subtitle: "Enter your baseline body data",
    training_step_title: "Training Structure",
    training_step_subtitle: "Your plan should fit real life",
    recovery_step_title: "Limitations & Recovery",
    recovery_step_subtitle: "Your plan should be realistic for your body",
    final_step_title: "Final Review",
    final_step_subtitle: "Check your inputs before building the plan",
    sex_label: "Gender",
    goal_label: "Primary Goal",
    level_label: "Training Level",
    age_label: "Age (years)",
    age_placeholder: "e.g. 25",
    weight_label: "Weight (kg)",
    weight_placeholder: "e.g. 75",
    height_label: "Height (cm)",
    height_placeholder: "e.g. 175",
    training_days_label: "Training Days Per Week",
    equipment_label: "Available Equipment",
    session_duration_label: "Session Duration (minutes)",
    limitations_label: "Injury or Limitation",
    limitations_hint: "You can choose multiple",
    recovery_label: "Current Recovery Quality",
    summary_goal: "Goal",
    summary_level: "Training Level",
    summary_age_sex: "Age / Gender",
    summary_height_weight: "Height / Weight",
    summary_weekly_plan: "Weekly Structure",
    summary_equipment: "Equipment",
    summary_recovery: "Recovery",
    summary_limitations: "Limitations",
    exercises_tab: "Exercises",
    workout_tab: "Workout",
    programs_tab: "Programs",
    progress_tab: "Progress",
    nutrition_tab: "Nutrition",
    coach_tab: "Coach",
    points_tab: "Points",
    logout: "Log Out",
    exercises_bank: "🏋️ Exercise Library",
    search_placeholder: "Search...",
    back_label: "← Back",
    add_to_today_workout: "+ Add to Today’s Workout",
    today_workout: "⚡ Today’s Workout",
    workout_programs: "📋 Training Programs",
    progress_tracking: "📊 Progress Tracking",
    smart_coach: "🤖 Smart Coach",
    points_title: "🏆 My Rewards",
    nutrition_title: "🥗 Nutrition",
    ai_boundary: "AI Coach Boundary",
    ai_context: "Current context sent to the AI coach",
    ai_processing: "⏳ Processing...",
    ask_ai: "🚀 Ask the AI Coach",
    ai_answer: "🤖 Coach Response:",
    ai_prompt_placeholder: "Type your question...",
    ai_intro: "Ask your question — get a personalized answer based on your profile",
    ai_login_context_goal: "Goal",
    ai_login_context_level: "Level",
    ai_login_context_active_program: "Active Program",
    ai_login_context_active_day: "Active Day",
    ai_login_context_split: "Split",
    ai_login_context_limitations: "Limitations",
    active_program_none: "None",
    unknown: "Unknown",
    none: "None",
    no_sessions_yet: "No sessions logged yet. Start your first workout from Programs or Workout.",
    current_weight: "Current Weight",
    total_change: "Total Change",
    sessions_last_7_days: "Sessions in Last 7 Days",
    logged_exercises: "Logged Exercises",
    average_adherence: "Average Adherence",
    latest_adherence: "Latest Adherence",
  }
};

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

function getInitialLanguage() {
  if (!canUseStorage()) return "fa";
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved === "fa" || saved === "en") return saved;
  const locale = typeof navigator !== "undefined" ? navigator.language?.toLowerCase() || "" : "";
  return locale.startsWith("fa") ? "fa" : "en";
}

function saveLanguage(language) {
  if (canUseStorage()) localStorage.setItem(LANGUAGE_KEY, language);
}

function tr(language, key, vars = {}) {
  const template = (LANG_TEXT[language] || LANG_TEXT.fa)[key] || LANG_TEXT.fa[key] || key;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function localizedLabel(map, value, language) {
  if (!value) return tr(language, "unknown");
  return map[value]?.[language] || map[value]?.fa || value;
}

function canUseStorage() {
  return typeof localStorage !== "undefined";
}

function getUsers() {
  if (!canUseStorage()) return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users) { if (canUseStorage()) localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getSession() { if (!canUseStorage()) return null; try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
function saveSession(user) { if (canUseStorage()) localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession() { if (canUseStorage()) localStorage.removeItem(SESSION_KEY); }
function getActivePlans() {
  try { return JSON.parse(localStorage.getItem(ACTIVE_PLAN_KEY) || "{}"); } catch { return {}; }
}
function getActivePlan(userId) {
  const all = getActivePlans();
  return all[userId] || null;
}
function saveActivePlan(userId, plan) {
  const all = getActivePlans();
  all[userId] = plan;
  localStorage.setItem(ACTIVE_PLAN_KEY, JSON.stringify(all));
}
function clearActivePlan(userId) {
  const all = getActivePlans();
  delete all[userId];
  localStorage.setItem(ACTIVE_PLAN_KEY, JSON.stringify(all));
}
function getPerUserStoredMap(key) {
  try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
}
function getPerUserData(key, userId, fallback) {
  const all = getPerUserStoredMap(key);
  return all[userId] ?? fallback;
}
function savePerUserData(key, userId, value) {
  const all = getPerUserStoredMap(key);
  all[userId] = value;
  localStorage.setItem(key, JSON.stringify(all));
}
function clearPerUserData(key, userId) {
  const all = getPerUserStoredMap(key);
  delete all[userId];
  localStorage.setItem(key, JSON.stringify(all));
}

function sanitizeWorkoutLog(logs) {
  if (!Array.isArray(logs)) return [];
  return logs
    .filter(log => log && typeof log === "object" && log.name)
    .map(log => ({
      ...log,
      name: String(log.name),
      weight: Number(log.weight) || 0,
      reps: Number(log.reps) || 0,
      sets: Math.max(1, Number(log.sets) || 1),
      created_at: Number(log.created_at) || Date.now(),
    }))
    .filter(log => log.reps > 0);
}

function sanitizeProgressData(entries, fallback = []) {
  const source = Array.isArray(entries) && entries.length ? entries : fallback;
  if (!Array.isArray(source)) return [];
  return source
    .filter(entry => entry && typeof entry === "object")
    .map(entry => ({
      created_at: Number(entry.created_at) || Date.now(),
      date: entry.date || new Date().toLocaleDateString("fa-IR"),
      weight: Number(entry.weight) || 0,
    }))
    .filter(entry => entry.weight > 0);
}

function normalizePersistedLevel(value) {
  return ({
    beginner: "مبتدی",
    intermediate: "متوسط",
    advanced: "پیشرفته",
    مبتدی: "مبتدی",
    متوسط: "متوسط",
    پیشرفته: "پیشرفته",
  }[value] || "مبتدی");
}

function normalizePersistedSex(value) {
  return ({
    male: "مرد",
    female: "زن",
    مرد: "مرد",
    زن: "زن",
  }[value] || "مرد");
}

function normalizePersistedEquipment(value) {
  return ({
    full_gym: "باشگاه کامل",
    home_gym: "هوم جیم",
    dumbbells_bands: "دمبل و کش",
    bodyweight: "وزن بدن",
    باشگاه: "باشگاه کامل",
    "باشگاه کامل": "باشگاه کامل",
    خانه: "هوم جیم",
    "هوم جیم": "هوم جیم",
    ترکیبی: "دمبل و کش",
    "دمبل و کش": "دمبل و کش",
    "فضای باز": "وزن بدن",
    "وزن بدن": "وزن بدن",
  }[value] || "باشگاه کامل");
}

function normalizePersistedRecovery(value, sleepQuality, stressLevel) {
  if (value) {
    return ({
      low: "پایین",
      medium: "متوسط",
      high: "بالا",
      پایین: "پایین",
      متوسط: "متوسط",
      بالا: "بالا",
    }[value] || "متوسط");
  }
  return ({
    "ضعیف": "پایین",
    "کم": "بالا",
    "خوب": "بالا",
    "عالی": "بالا",
    "زیاد": "پایین",
  }[sleepQuality] || {
    "زیاد": "پایین",
    "کم": "بالا",
  }[stressLevel] || "متوسط");
}

function normalizePersistedLimitations(limitations, injury) {
  if (Array.isArray(limitations) && limitations.length) return limitations;
  if (injury) return Array.isArray(injury) ? injury : [injury];
  return ["ندارم"];
}

function toCanonicalUserShape(user) {
  const trainingLevel = normalizePersistedLevel(user.training_level || user.level);
  const sex = normalizePersistedSex(user.sex || user.gender);
  const trainingDays = Number(user.training_days_per_week || user.workoutDays || 3);
  const sessionDuration = Number(user.session_duration || user.sessionLength || 60);
  const equipmentAccess = normalizePersistedEquipment(user.equipment_access || user.place);
  const recoveryQuality = normalizePersistedRecovery(user.recovery_quality, user.sleepQuality, user.stressLevel);
  const limitations = normalizePersistedLimitations(user.injury_or_limitation_flags, user.injury);

  return {
    ...user,
    training_level: trainingLevel,
    sex,
    training_days_per_week: trainingDays,
    session_duration: sessionDuration,
    equipment_access: equipmentAccess,
    recovery_quality: recoveryQuality,
    injury_or_limitation_flags: limitations,
  };
}

function migrateLegacyUserShape(user) {
  if (!user) return null;
  return toCanonicalUserShape(user);
}

function normalizePersistedUser(user) {
  if (!user) return null;
  return {
    ...user,
    training_level: normalizePersistedLevel(user.training_level),
    sex: normalizePersistedSex(user.sex),
    training_days_per_week: Number(user.training_days_per_week || 3),
    session_duration: Number(user.session_duration || 60),
    equipment_access: normalizePersistedEquipment(user.equipment_access),
    recovery_quality: normalizePersistedRecovery(user.recovery_quality),
    injury_or_limitation_flags: normalizePersistedLimitations(user.injury_or_limitation_flags),
  };
}

function migratePersistedAuthData() {
  if (!canUseStorage()) return;
  try {
    const rawUsers = getUsers();
    if (Array.isArray(rawUsers) && rawUsers.length) {
      const migratedUsers = rawUsers.map(migrateLegacyUserShape);
      localStorage.setItem(USERS_KEY, JSON.stringify(migratedUsers));
    }
    const rawSession = getSession();
    if (rawSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(migrateLegacyUserShape(rawSession)));
    }
  } catch {
    // Keep runtime resilient if legacy storage is malformed.
  }
}

migratePersistedAuthData();

function getDisplayGoal(goal, language = "fa") {
  const normalizedGoal = normalizeSplitGoal(goal);
  const persianLabel = GOAL_LABELS[normalizedGoal] || goal || "نامشخص";
  return localizedLabel(GOAL_DISPLAY, persianLabel, language);
}

function getDisplayTrainingLevel(level, language = "fa") {
  const normalizedLevel = normalizeSplitLevel(level);
  const persianLabel = LEVEL_LABELS[normalizedLevel] || level || "نامشخص";
  return localizedLabel(LEVEL_DISPLAY, persianLabel, language);
}

function getDisplaySexLabel(value, language = "fa") {
  return localizedLabel(SEX_LABELS, value, language);
}

function getDisplayEquipmentLabel(value, language = "fa") {
  return localizedLabel(EQUIPMENT_DISPLAY, value, language);
}

function getDisplayRecoveryLabel(value, language = "fa") {
  return localizedLabel(RECOVERY_DISPLAY, value, language);
}

function getDisplayLimitations(values = [], language = "fa") {
  if (!Array.isArray(values) || values.length === 0) return tr(language, "none");
  return values.map(value => localizedLabel(LIMITATION_DISPLAY, value, language)).join(language === "fa" ? "، " : ", ");
}

function getSplitLabel(splitFamily, language = "fa") {
  if (!splitFamily) return tr(language, "unknown");
  if (language === "fa") return SPLIT_LABELS[splitFamily] || splitFamily;
  return SPLIT_LABELS_EN[splitFamily] || splitFamily;
}

function getExerciseDisplayName(exerciseOrName, language = "fa") {
  const exercise = typeof exerciseOrName === "string" ? getExerciseByName(exerciseOrName) : exerciseOrName;
  if (!exercise) return typeof exerciseOrName === "string" ? exerciseOrName : "";
  return language === "en" ? (exercise.name_en || exercise.name || exercise.name_fa) : (exercise.name_fa || exercise.name || exercise.name_en);
}

function getProgressionStrategyLabel(strategy, language = "fa") {
  const labels = {
    deload: { fa: "دیلود کوتاه", en: "Short Deload" },
    plateau_reset: { fa: "ریست پلاتو", en: "Plateau Reset" },
    increase_load: { fa: "افزایش وزنه", en: "Increase Load" },
    increase_reps: { fa: "افزایش تکرار", en: "Increase Reps" },
    consolidate: { fa: "تثبیت اجرا", en: "Consolidate Execution" },
    hold: { fa: "نگه‌داشتن بار", en: "Hold Load" },
    default: { fa: "پیشروی پایه", en: "Baseline Progression" },
  };
  return (labels[strategy] || labels.default)[language] || (labels[strategy] || labels.default).fa;
}

function getProgrammingStyleLabel(goal, language = "fa") {
  const normalizedGoal = normalizeSplitGoal(goal);
  if (language === "fa") return PROGRAMMING_STYLE_LABELS[normalizedGoal] || "پیشروی پایه";
  return PROGRAMMING_STYLE_LABELS_EN[normalizedGoal] || "Baseline progression";
}

function getProgrammingCueLabel(goal, language = "fa") {
  const normalizedGoal = normalizeSplitGoal(goal);
  if (language === "fa") return PROGRAMMING_CUE_LABELS[normalizedGoal] || "";
  return PROGRAMMING_CUE_LABELS_EN[normalizedGoal] || "";
}

function getRestRangeLabel(restRange, language = "fa") {
  if (!restRange) return language === "fa" ? "نامشخص" : "Unknown";
  if (language === "fa") return restRange;
  return String(restRange).replace("ثانیه", "sec").trim();
}

function getProgramNameLabel(program, language = "fa") {
  if (!program) return "";
  if (language === "fa") return program.name;
  if (program.isRecommended && program.split) {
    return `Smart Recommendation — ${getSplitLabel(program.split.split_family, language)} ${program.split.frequency}-Day`;
  }
  const staticMap = {
    "پایه قدرت — ۳ روز": "Strength Foundation — 3 Days",
    "Push Pull Legs — ۶ روز": "Push Pull Legs — 6 Days",
    "فول‌بادی — ۴ روز": "Full Body — 4 Days",
  };
  if (staticMap[program.name]) return staticMap[program.name];
  return program.name;
}

function getProgramNameFromStoredLabel(programName, language = "fa") {
  if (!programName) return "";
  if (language === "fa") return programName;
  if (programName.startsWith("پیشنهاد هوشمند")) {
    if (programName.includes("بالاتنه / پایین‌تنه") && programName.includes("4")) return "Smart Recommendation — Upper / Lower 4-Day";
    if (programName.includes("فول‌بادی") && programName.includes("4")) return "Smart Recommendation — Full Body 4-Day";
    if (programName.includes("فول‌بادی") && programName.includes("3")) return "Smart Recommendation — Full Body 3-Day";
    return "Smart Recommendation";
  }
  const staticMap = {
    "پایه قدرت — ۳ روز": "Strength Foundation — 3 Days",
    "Push Pull Legs — ۶ روز": "Push Pull Legs — 6 Days",
    "فول‌بادی — ۴ روز": "Full Body — 4 Days",
  };
  return staticMap[programName] || programName;
}

function localizeStoredDate(dateValue, language = "fa") {
  if (!dateValue) return "";
  const raw = String(dateValue);
  if (language === "fa") return raw;
  return raw.replace(/[۰-۹]/g, (digit) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(digit)]);
}

function formatLocalizedDate(dateInput, language = "fa") {
  const timestamp = Number(dateInput);
  const date = !Number.isNaN(timestamp) && timestamp > 0
    ? new Date(timestamp)
    : (dateInput instanceof Date ? dateInput : new Date(dateInput));
  if (Number.isNaN(date.getTime())) return localizeStoredDate(dateInput, language);
  return new Intl.DateTimeFormat(
    language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory",
    { year: "numeric", month: "numeric", day: "numeric" }
  ).format(date);
}

function getLevelTitle(levelInfo, language = "fa") {
  const labels = {
    1: { fa: "تازه‌کار", en: "Newcomer" },
    2: { fa: "مبتدی", en: "Beginner" },
    3: { fa: "در حال پیشرفت", en: "Progressing" },
    4: { fa: "ورزشکار", en: "Athlete" },
    5: { fa: "حرفه‌ای", en: "Advanced" },
    6: { fa: "قهرمان", en: "Champion" },
    7: { fa: "استاد آهن", en: "Iron Master" },
    8: { fa: "نخبه", en: "Elite" },
    9: { fa: "اسطوره", en: "Legend" },
    10: { fa: "آتلت آیرون‌فا", en: "IronFa Athlete" },
  };
  return labels[levelInfo?.level]?.[language] || levelInfo?.title || "";
}

function getBadgeLabel(badge, language = "fa") {
  const labels = {
    first_workout: { title: { fa: "اولین قدم", en: "First Step" }, desc: { fa: "اولین تمرین رو ثبت کردی", en: "You logged your first workout" } },
    streak_3: { title: { fa: "در آتش", en: "On Fire" }, desc: { fa: "۳ روز متوالی تمرین", en: "3 days training streak" } },
    streak_7: { title: { fa: "هفته‌ای", en: "Weekly Run" }, desc: { fa: "۷ روز متوالی تمرین", en: "7 days training streak" } },
    streak_30: { title: { fa: "ماه آهنین", en: "Iron Month" }, desc: { fa: "۳۰ روز متوالی تمرین", en: "30 days training streak" } },
    workouts_10: { title: { fa: "جدی شدم", en: "Getting Serious" }, desc: { fa: "۱۰ تمرین کامل", en: "10 completed workouts" } },
    workouts_50: { title: { fa: "نیمه‌حرفه‌ای", en: "Semi-Pro" }, desc: { fa: "۵۰ تمرین کامل", en: "50 completed workouts" } },
    workouts_100: { title: { fa: "صد تمرین", en: "Hundred Workouts" }, desc: { fa: "۱۰۰ تمرین کامل", en: "100 completed workouts" } },
    sets_50: { title: { fa: "پشتکار", en: "Persistence" }, desc: { fa: "۵۰ ست ثبت‌شده", en: "50 logged sets" } },
    level_5: { title: { fa: "حرفه‌ای شدم", en: "Advanced Reached" }, desc: { fa: "به لول ۵ رسیدی", en: "You reached level 5" } },
    level_10: { title: { fa: "آتلت آیرون‌فا", en: "IronFa Athlete" }, desc: { fa: "به لول ۱۰ رسیدی", en: "You reached level 10" } },
  };
  return {
    title: labels[badge.id]?.title?.[language] || badge.title,
    desc: labels[badge.id]?.desc?.[language] || badge.desc,
  };
}

function getProgramDayLabel(dayName, language = "fa") {
  if (!dayName) return "";
  if (language === "fa") return dayName;
  const map = {
    "روز A": "Day A",
    "روز B": "Day B",
    "روز C": "Day C",
    "روز ۱": "Day 1",
    "روز ۲": "Day 2",
    "روز ۳": "Day 3",
    "روز ۴": "Day 4",
    "بالاتنه ۱": "Upper 1",
    "بالاتنه ۲": "Upper 2",
    "پایین‌تنه ۱": "Lower 1",
    "پایین‌تنه ۲": "Lower 2",
    "فول‌بادی A": "Full Body A",
    "فول‌بادی B": "Full Body B",
    "فول‌بادی C": "Full Body C",
    "پوش": "Push",
    "پول": "Pull",
    "لگز": "Legs",
    "سینه و پشت بازو": "Chest & Triceps",
    "پشت و جلو بازو": "Back & Biceps",
    "سرشانه و شکم": "Shoulders & Abs",
    "پا": "Legs",
  };
  return map[dayName] || dayName;
}

const DEMO_USER = {
  id: 0, name: "کاربر دمو", email: "test@ironfa.com", password: "ironfa123",
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

// ── Onboarding ──────────────────────────────────────────────────────────────
function Onboarding({ baseUser, onFinish, language = "fa", setLanguage = () => {} }) {
  const accent = "#e8ff00";
  const [step, setStep] = useState(0);
  const sourceUser = baseUser?.onboarded ? normalizePersistedUser(baseUser) : (baseUser || {});
  const normalizeGoal = (value) => ({
    "حجم": "حجم عضلانی",
    "حجم عضلانی": "حجم عضلانی",
    "کات": "چربی‌سوزی",
    "چربی‌سوزی": "چربی‌سوزی",
    "قدرت": "قدرت",
    "ریکامپوزیشن": "ریکامپوزیشن",
    "فیتنس": "ریکامپوزیشن",
    "سلامت": "ریکامپوزیشن",
  }[value] || "حجم عضلانی");
  const normalizeLevel = (value) => ({
    "مبتدی": "مبتدی",
    "متوسط": "متوسط",
    "پیشرفته": "پیشرفته",
  }[value] || "مبتدی");
  const normalizeSex = (value) => value === "زن" ? "زن" : "مرد";
  const normalizeEquipment = (value) => {
    const first = Array.isArray(value) ? value[0] : value;
    return ({
      "باشگاه": "باشگاه کامل",
      "باشگاه کامل": "باشگاه کامل",
      "خانه": "هوم جیم",
      "هوم جیم": "هوم جیم",
      "ترکیبی": "دمبل و کش",
      "دمبل و کش": "دمبل و کش",
      "فضای باز": "وزن بدن",
      "وزن بدن": "وزن بدن",
    }[first] || "باشگاه کامل");
  };
  const normalizeRecovery = (recoveryQuality, stressLevel) => {
    if (recoveryQuality === "پایین" || recoveryQuality === "متوسط" || recoveryQuality === "بالا") return recoveryQuality;
    const sleepQuality = recoveryQuality;
    if (sleepQuality === "ضعیف" || stressLevel === "زیاد") return "پایین";
    if (sleepQuality === "عالی" || sleepQuality === "خوب" || stressLevel === "کم") return "بالا";
    return "متوسط";
  };
  const normalizeLimitations = (value) => {
    if (!value) return ["ندارم"];
    const arr = Array.isArray(value) ? value : [value];
    const clean = arr.filter(Boolean);
    return clean.length ? clean : ["ندارم"];
  };
  const [data, setData] = useState({
    goal: sourceUser.goal ? normalizeGoal(sourceUser.goal) : "",
    training_level: sourceUser.training_level ? normalizeLevel(sourceUser.training_level) : "",
    age: sourceUser.age || "",
    sex: sourceUser.sex ? normalizeSex(sourceUser.sex) : "",
    weight: sourceUser.weight || "",
    height: sourceUser.height || "",
    training_days_per_week: sourceUser.training_days_per_week ? String(sourceUser.training_days_per_week) : "",
    equipment_access: sourceUser.equipment_access ? normalizeEquipment(sourceUser.equipment_access) : "",
    injury_or_limitation_flags: Array.isArray(sourceUser.injury_or_limitation_flags) ? sourceUser.injury_or_limitation_flags : [],
    session_duration: sourceUser.session_duration ? String(sourceUser.session_duration) : "",
    recovery_quality: sourceUser.recovery_quality ? normalizeRecovery(sourceUser.recovery_quality) : "",
  });

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggle = (k, v) => setData(d => {
    const arr = Array.isArray(d[k]) ? d[k] : [d[k]];
    if (arr.includes(v)) return { ...d, [k]: arr.length > 1 ? arr.filter(x => x !== v) : arr };
    if (v === "ندارم") return { ...d, [k]: ["ندارم"] };
    return { ...d, [k]: [...arr.filter(x => x !== "ندارم"), v] };
  });
  const goalOptions = ["حجم عضلانی", "چربی‌سوزی", "قدرت", "ریکامپوزیشن"].map(value => ({ value, label: localizedLabel(GOAL_DISPLAY, value, language) }));
  const levelOptions = ["مبتدی", "متوسط", "پیشرفته"].map(value => ({ value, label: localizedLabel(LEVEL_DISPLAY, value, language) }));
  const sexOptions = ["مرد", "زن"].map(value => ({ value, label: localizedLabel(SEX_LABELS, value, language) }));
  const equipmentOptions = ["باشگاه کامل", "هوم جیم", "دمبل و کش", "وزن بدن"].map(value => ({ value, label: localizedLabel(EQUIPMENT_DISPLAY, value, language) }));
  const recoveryOptions = ["پایین", "متوسط", "بالا"].map(value => ({ value, label: localizedLabel(RECOVERY_DISPLAY, value, language) }));
  const limitationOptions = ["ندارم", "زانو", "کمر", "شانه", "مچ", "گردن", "لگن"].map(value => ({ value, label: localizedLabel(LIMITATION_DISPLAY, value, language) }));

  const STEPS = [
    {
      icon: "🧬", title: tr(language, "sex_step_title"), subtitle: tr(language, "sex_step_subtitle"),
      fields: (
        <div>
          <Row label={tr(language, "sex_label")}>
            <Chips options={sexOptions} value={data.sex} onChange={v => set("sex", v)} accent={accent} />
          </Row>
        </div>
      )
    },
    {
      icon: "🎯", title: tr(language, "goal_step_title"), subtitle: tr(language, "goal_step_subtitle"),
      fields: (
        <div>
          <Row label={tr(language, "goal_label")}>
            <Chips options={goalOptions} value={data.goal} onChange={v => set("goal", v)} accent={accent} />
          </Row>
          <Row label={tr(language, "level_label")}>
            <Chips options={levelOptions} value={data.training_level} onChange={v => set("training_level", v)} accent={accent} />
          </Row>
        </div>
      )
    },
    {
      icon: "🧬", title: tr(language, "body_step_title"), subtitle: tr(language, "body_step_subtitle"),
      fields: (
        <div>
          <Row label={tr(language, "age_label")}>
            <NumInput value={data.age} onChange={v => set("age", v)} placeholder={tr(language, "age_placeholder")} />
          </Row>
          <Row label={tr(language, "weight_label")}>
            <NumInput value={data.weight} onChange={v => set("weight", v)} placeholder={tr(language, "weight_placeholder")} />
          </Row>
          <Row label={tr(language, "height_label")}>
            <NumInput value={data.height} onChange={v => set("height", v)} placeholder={tr(language, "height_placeholder")} />
          </Row>
        </div>
      )
    },
    {
      icon: "📅", title: tr(language, "training_step_title"), subtitle: tr(language, "training_step_subtitle"),
      fields: (
        <div>
          <Row label={tr(language, "training_days_label")}>
            <Chips options={["۳", "۴", "۵", "۶"]} value={data.training_days_per_week} onChange={v => set("training_days_per_week", v)} accent={accent} />
          </Row>
          <Row label={tr(language, "equipment_label")}>
            <Chips options={equipmentOptions} value={data.equipment_access} onChange={v => set("equipment_access", v)} accent={accent} />
          </Row>
          <Row label={tr(language, "session_duration_label")}>
            <Chips options={["۳۰", "۴۵", "۶۰", "۹۰"]} value={data.session_duration} onChange={v => set("session_duration", v)} accent={accent} />
          </Row>
          <Row label={tr(language, "limitations_label")} hint={tr(language, "limitations_hint")}>
            <MultiChips options={limitationOptions} value={data.injury_or_limitation_flags} onToggle={v => toggle("injury_or_limitation_flags", v)} accent={accent} />
          </Row>
          <Row label={tr(language, "recovery_label")}>
            <Chips options={recoveryOptions} value={data.recovery_quality} onChange={v => set("recovery_quality", v)} accent={accent} />
          </Row>
        </div>
      )
    },
    {
      icon: "✅", title: tr(language, "final_step_title"), subtitle: tr(language, "final_step_subtitle"),
      summary: true
    }
  ];

  const safeStep = Math.max(0, Math.min(step, STEPS.length - 1));
  const current = STEPS[safeStep];
  const progress = ((safeStep) / (STEPS.length - 1)) * 100;

  const s = {
    wrap: { minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Vazirmatn','Tahoma',sans-serif", direction: language === "fa" ? "rtl" : "ltr", display: "flex", flexDirection: "column" },
    header: { padding: "20px 20px 0", },
    brand: { fontSize: 18, fontWeight: 900, color: accent, marginBottom: 16 },
    progressBar: { height: 4, background: "#1e1e1e", borderRadius: 4, overflow: "hidden", marginBottom: 8 },
    progressFill: { height: "100%", width: `${progress}%`, background: accent, borderRadius: 4, transition: "width 0.4s ease" },
    stepCount: { fontSize: 12, color: "#555", marginBottom: 24 },
    body: { flex: 1, padding: "0 20px", overflowY: "auto" },
    icon: { fontSize: 44, marginBottom: 10, display: "block", textAlign: "center" },
    title: { fontSize: 24, fontWeight: 900, color: "#f0f0f0", textAlign: "center", marginBottom: 4 },
    subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 28 },
    footer: { padding: 20, display: "flex", gap: 10 },
    btnBack: { flex: 1, background: "#1e1e1e", color: "#aaa", border: "1px solid #2a2a2a", borderRadius: 12, padding: 14, fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer" },
    btnNext: { flex: 2, background: accent, color: "#000", border: "none", borderRadius: 12, padding: 14, fontFamily: "inherit", fontWeight: 900, fontSize: 15, cursor: "pointer" },
  };

  const isStepValid = () => {
    if (current.summary) return true;
    switch (step) {
      case 0:
        return !!data.sex;
      case 1:
        return !!data.goal && !!data.training_level;
      case 2:
        return !!data.age && !!data.weight && !!data.height;
      case 3:
        return !!data.training_days_per_week && !!data.equipment_access && !!data.session_duration && !!data.recovery_quality;
      default:
        return true;
    }
  };

  const finish = () => {
    if (!isStepValid()) return;
    const cleanedOnboardingData = {
      goal: data.goal,
      training_level: data.training_level,
      age: data.age,
      sex: data.sex,
      weight: data.weight,
      height: data.height,
      training_days_per_week: Number(data.training_days_per_week),
      equipment_access: data.equipment_access,
      injury_or_limitation_flags: data.injury_or_limitation_flags,
      session_duration: Number(data.session_duration),
      recovery_quality: data.recovery_quality,
    };
    const updated = normalizePersistedUser({
      ...baseUser,
      ...cleanedOnboardingData,
      onboarded: true,
    });
    const users = getUsers();
    const idx = users.findIndex(u => u.id === baseUser.id);
    if (idx >= 0) {
      users[idx] = updated;
      saveUsers(users);
    } else {
      saveUsers([...users, updated]);
    }
    saveSession(updated);
    onFinish(updated);
  };

  const summaryItems = [
    { label: tr(language, "summary_goal"), val: getDisplayGoal(data.goal, language), highlight: true },
    { label: tr(language, "summary_level"), val: getDisplayTrainingLevel(data.training_level, language) },
    { label: tr(language, "summary_age_sex"), val: language === "fa" ? `${data.age} سال · ${getDisplaySexLabel(data.sex, language)}` : `${data.age} years · ${getDisplaySexLabel(data.sex, language)}` },
    { label: tr(language, "summary_height_weight"), val: `${data.height}cm · ${data.weight}kg` },
    { label: tr(language, "summary_weekly_plan"), val: language === "fa" ? `${data.training_days_per_week} روز در هفته · ${data.session_duration} دقیقه` : `${data.training_days_per_week} days/week · ${data.session_duration} min` },
    { label: tr(language, "summary_equipment"), val: getDisplayEquipmentLabel(data.equipment_access, language) },
    { label: tr(language, "summary_recovery"), val: getDisplayRecoveryLabel(data.recovery_quality, language) },
    ...(data.injury_or_limitation_flags?.length && !data.injury_or_limitation_flags.includes("ندارم")
      ? [{ label: tr(language, "summary_limitations"), val: getDisplayLimitations(data.injury_or_limitation_flags, language) }]
      : []),
  ];

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.brand}>{tr(language, "onboarding_brand")}</div>
        <div style={s.progressBar}><div style={s.progressFill} /></div>
        <div style={s.stepCount}>{tr(language, "step_of", { current: safeStep + 1, total: STEPS.length })}</div>
        <div style={{ display: "flex", justifyContent: language === "fa" ? "flex-start" : "flex-end", marginTop: 10 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: 4, borderRadius: 999, background: "rgba(15,15,15,0.72)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button type="button" onClick={() => setLanguage("en")} style={{ minWidth: 30, textAlign: "center", padding: "4px 6px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: language === "en" ? "#111" : "#c2c2c2", background: language === "en" ? accent : "transparent", border: "none", cursor: "pointer" }}>EN</button>
            <button type="button" onClick={() => setLanguage("fa")} style={{ minWidth: 30, textAlign: "center", padding: "4px 6px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: language === "fa" ? "#111" : "#c2c2c2", background: language === "fa" ? accent : "transparent", border: "none", cursor: "pointer" }}>فا</button>
          </div>
        </div>
      </div>

      <div style={s.body}>
        <span style={s.icon}>{current.icon}</span>
        <div style={s.title}>{current.title}</div>
        <div style={s.subtitle}>{current.subtitle}</div>

        {current.summary ? (
          <div>
            {summaryItems.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 10px", borderRadius: item.highlight ? 10 : 0,
                marginBottom: item.highlight ? 4 : 0,
                background: item.highlight ? "#0f1a00" : "transparent",
                borderBottom: item.highlight ? "none" : "1px solid #1e1e1e",
                border: item.highlight ? `1px solid #2a4a00` : undefined,
              }}>
                <span style={{ color: item.highlight ? "#aad" : "#666", fontSize: 14 }}>{item.label}</span>
                <span style={{ color: item.highlight ? accent : "#f0f0f0", fontSize: 14, fontWeight: item.highlight ? 800 : 600, textAlign: "left", maxWidth: "55%" }}>{item.val}</span>
              </div>
            ))}
            <div style={{
              background: "#10161d",
              border: "1px solid #24384f",
              borderRadius: 12,
              padding: "12px 14px",
              marginTop: 14,
              color: "#a9c7e8",
              fontSize: 12,
              lineHeight: 1.9
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{tr(language, "product_boundary")}</div>
              <div>{language === "fa" ? TRUST_BASELINE_COPY : TRUST_BASELINE_COPY_EN}</div>
              <div style={{ color: "#87a7c9", marginTop: 6 }}>{language === "fa" ? DISCLAIMER_BASELINE_COPY : DISCLAIMER_BASELINE_COPY_EN}</div>
            </div>
          </div>
        ) : current.fields}
      </div>

      <div style={s.footer}>
        {safeStep > 0 && <button style={s.btnBack} onClick={() => setStep(s => Math.max(0, s - 1))}>{tr(language, "previous")}</button>}
        <button
          style={{ ...s.btnNext, opacity: isStepValid() ? 1 : 0.5, cursor: isStepValid() ? "pointer" : "not-allowed" }}
          onClick={() => {
            if (!isStepValid()) return;
            safeStep < STEPS.length - 1 ? setStep(s => Math.min(STEPS.length - 1, s + 1)) : finish();
          }}
        >
          {safeStep < STEPS.length - 1 ? tr(language, "next") : tr(language, "build_program")}
        </button>
      </div>
    </div>
  );
}

// ── Small UI helpers ─────────────────────────────────────────────────────────
function Row({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: "#555", background: "#1e1e1e", padding: "2px 8px", borderRadius: 20 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
function MultiChips({ options, value = [], onToggle, accent }) {
  const arr = Array.isArray(value) ? value : [value];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(option => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        const selected = arr.includes(item.value);
        return (
          <button key={item.value} onClick={() => onToggle(item.value)} style={{
            padding: "8px 16px", borderRadius: 20,
            border: `1.5px solid ${selected ? accent : "#2a2a2a"}`,
            background: selected ? accent : "#141414",
            color: selected ? "#000" : "#aaa",
            fontFamily: "inherit", fontWeight: selected ? 700 : 400,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s",
            position: "relative"
          }}>
            {selected && <span style={{ marginLeft: 4 }}>✓ </span>}{item.label}
          </button>
        );
      })}
    </div>
  );
}
function Chips({ options, value, onChange, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(option => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <button key={item.value} onClick={() => onChange(item.value)} style={{
            padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${value === item.value ? accent : "#2a2a2a"}`,
            background: value === item.value ? accent : "#141414", color: value === item.value ? "#000" : "#aaa",
            fontFamily: "inherit", fontWeight: value === item.value ? 700 : 400, fontSize: 14, cursor: "pointer", transition: "all 0.15s"
          }}>{item.label}</button>
        );
      })}
    </div>
  );
}
function NumInput({ value, onChange, placeholder }) {
  return (
    <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 12, padding: "10px 14px", color: "#f0f0f0", fontSize: 15, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" }} />
  );
}
function SelectInput({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 12, padding: "10px 14px", color: "#f0f0f0", fontSize: 15, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Auth ─────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin, language = "fa", setLanguage = () => {} }) {
  const [view, setView] = useState("welcome");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [onboardUser, setOnboardUser] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const accent = "#e8ff00";
  const authHero = "/x.png";
  const s = {
    wrap: {
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #171717 0%, #060606 58%, #000 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Vazirmatn','Tahoma',sans-serif",
      padding: 20,
      boxSizing: "border-box",
      direction: language === "fa" ? "rtl" : "ltr",
    },
    shell: {
      width: "100%",
      maxWidth: 420,
    },
    heroShell: {
      position: "relative",
      minHeight: 760,
      borderRadius: 28,
      overflow: "hidden",
      background: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 36%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,0.62) 74%, rgba(0,0,0,0.82) 100%), url("${authHero}") center 27% / 112% auto no-repeat`,
      padding: 24,
      boxShadow: "0 28px 80px rgba(0,0,0,0.46)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    heroTop: {
      position: "absolute",
      inset: 0,
      zIndex: 1,
      pointerEvents: "none",
    },
    brandWrap: { textAlign: "center", marginTop: 10, position: "relative", zIndex: 1 },
    brandTitle: { fontSize: 54, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -2, fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif" },
    brandAccent: { color: accent },
    brandSub: { fontSize: 17, color: "rgba(255,255,255,0.85)", marginTop: 16, letterSpacing: 0.2, fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif" },
    langSwitch: {
      position: "absolute",
      top: 16,
      right: 16,
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: 4,
      borderRadius: 999,
      background: "rgba(15,15,15,0.72)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
      direction: "ltr",
      pointerEvents: "auto",
    },
    langPill: (active) => ({
      minWidth: 28,
      textAlign: "center",
      padding: "4px 6px",
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      color: active ? "#111" : "#c2c2c2",
      background: active ? accent : "transparent",
      fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif",
    }),
    welcomePanel: { marginTop: "auto", paddingTop: 48, position: "relative", zIndex: 1, textAlign: "center" },
    primaryCta: {
      width: "80%",
      background: accent,
      color: "#000",
      border: "none",
      borderRadius: 22,
      padding: "18px 20px",
      fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif",
      fontWeight: 900,
      fontSize: 18,
      cursor: "pointer",
      boxShadow: "0 5px 11px rgba(180,198,0,0.14)",
      display: "block",
      margin: "0 auto",
    },
    orRow: { display: "flex", alignItems: "center", gap: 14, margin: "18px 0 16px" },
    orLine: { height: 1, flex: 1, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 100%)" },
    orText: { color: "rgba(255,255,255,0.48)", fontSize: 13, fontWeight: 700, letterSpacing: 1.2, fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif" },
    secondaryCta: {
      width: "80%",
      background: "rgba(6,6,6,0.72)",
      color: "#f2f2f2",
      border: "1px solid rgba(255,255,255,0.16)",
      borderRadius: 22,
      padding: "17px 20px",
      fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif",
      fontWeight: 800,
      fontSize: 17,
      cursor: "pointer",
      backdropFilter: "blur(12px)",
      display: "block",
      margin: "0 auto",
    },
    benefitGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px 16px",
      marginTop: 28,
      color: "rgba(255,255,255,0.82)",
      fontSize: 14,
      textAlign: language === "fa" ? "right" : "left",
      direction: language === "fa" ? "rtl" : "ltr",
      fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif",
    },
    benefitItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      justifyContent: language === "fa" ? "flex-end" : "flex-start",
      flexDirection: language === "fa" ? "row-reverse" : "row",
    },
    microCopy: {
      marginTop: 18,
      color: "rgba(255,255,255,0.56)",
      fontSize: 13,
      textAlign: "center",
      fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif",
    },
    loginPanel: {
      marginTop: "auto",
      direction: language === "fa" ? "rtl" : "ltr",
      position: "relative",
      zIndex: 1,
      background: "linear-gradient(180deg, rgba(10,10,10,0.68) 0%, rgba(7,7,7,0.9) 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 24,
      padding: 20,
      backdropFilter: "blur(4px)",
    },
    panelHead: { marginBottom: 18, textAlign: "center", position: "relative" },
    panelTitle: { color: "#fff", fontSize: 22, fontWeight: 900 },
    panelBack: {
      position: "absolute",
      [language === "fa" ? "right" : "left"]: 0,
      top: 0,
      background: "transparent",
      border: "none",
      color: "rgba(255,255,255,0.62)",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 800,
      fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif",
      padding: 0,
    },
    input: { width: "100%", background: "rgba(20,20,20,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "15px 16px", color: "#f0f0f0", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 },
    btn: { width: "100%", background: accent, color: "#000", border: "none", borderRadius: 18, padding: "15px 0", fontFamily: "inherit", fontWeight: 900, fontSize: 16, cursor: "pointer", marginTop: 4, boxShadow: "0 16px 40px rgba(232,255,0,0.22)" },
    ghostBtn: { width: "100%", background: "rgba(20,20,20,0.92)", color: "#d6d6d6", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "15px 0", fontFamily: "inherit", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 10 },
    error: { background: "#1a0a0a", border: "1px solid #5a1a1a", color: "#ff6b6b", borderRadius: 14, padding: "10px 14px", fontSize: 13, marginBottom: 12, textAlign: "center" },
    cardFooter: { marginTop: 16, color: "#7c7c7c", fontSize: 12, lineHeight: 1.8, textAlign: "center" },
  };

  const handle = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setError(""); };

  const doLogin = () => {
    if (form.email === DEMO_USER.email && form.password === DEMO_USER.password) {
      const normalizedDemo = normalizePersistedUser(DEMO_USER);
      saveSession(normalizedDemo); onLogin(normalizedDemo); return;
    }
    const users = getUsers();
    const user = users.find(u => u.email === form.email && u.password === form.password);
    if (!user) { setError(tr(language, "invalid_login_error")); return; }
    const normalizedUser = normalizePersistedUser(user);
    saveSession(normalizedUser); onLogin(normalizedUser);
  };

  const doSignup = () => {
    if (!form.name || !form.email || !form.password) { setError(tr(language, "complete_fields_error")); return; }
    if (form.password.length < 6) { setError(tr(language, "password_length_error")); return; }
    const users = getUsers();
    const existingUser = users.find(u => u.email === form.email);
    if (existingUser) { setError(tr(language, "email_exists_error")); return; }

    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      goal: "",
      training_level: "",
      age: "",
      sex: "",
      weight: "",
      height: "",
      training_days_per_week: "",
      equipment_access: "",
      injury_or_limitation_flags: [],
      session_duration: "",
      recovery_quality: "",
      onboarded: false,
    };
    setError("");
    setOnboardUser(newUser);
  };

  if (onboardUser) return <Onboarding baseUser={onboardUser} onFinish={onLogin} language={language} setLanguage={setLanguage} />;

  return (
    <div style={s.wrap}>
      <div style={s.shell}>
        <div style={s.heroShell}>
          <div style={s.heroTop}>
            <div />
            <div style={s.langSwitch}>
              <button type="button" onClick={() => setLanguage("en")} style={{ ...s.langPill(language === "en"), border: "none", cursor: "pointer" }}>EN</button>
              <button type="button" onClick={() => setLanguage("fa")} style={{ ...s.langPill(language === "fa"), border: "none", cursor: "pointer" }}>فا</button>
            </div>
          </div>
          <div style={s.brandWrap}>
            <div style={s.brandTitle}>Iron<span style={s.brandAccent}>Fa</span></div>
            <div style={s.brandSub}>{tr(language, "auth_subtitle")}</div>
          </div>
          {view === "welcome" ? (
            <div style={s.welcomePanel}>
              <button style={s.primaryCta} onClick={() => { setView("signup"); setError(""); }}>{tr(language, "get_started")}</button>
              <div style={s.orRow}>
                <div style={s.orLine} />
                <div style={s.orText}>{tr(language, "or")}</div>
                <div style={{ ...s.orLine, transform: "scaleX(-1)" }} />
              </div>
              <button style={s.secondaryCta} onClick={() => { setView("login"); setError(""); }}>{tr(language, "log_in")}</button>
              <div style={s.benefitGrid}>
                {[
                  tr(language, "personalized_plans"),
                  tr(language, "ai_coach"),
                  tr(language, "gamification"),
                  tr(language, "adherence_tracking"),
                ].map(item => (
                  <div key={item} style={s.benefitItem}>
                    <span style={{ color: accent, fontWeight: 900 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={s.microCopy}>{tr(language, "takes_less_than_2_minutes")}</div>
            </div>
          ) : (
            <div style={s.loginPanel}>
              <div style={s.panelHead}>
                <button style={s.panelBack} onClick={() => { setView("welcome"); setError(""); }}>{tr(language, "back")}</button>
                <div style={s.panelTitle}>{view === "signup" ? tr(language, "create_account") : tr(language, "login_to_app")}</div>
              </div>
              {error && <div style={s.error}>{error}</div>}
              {view === "signup" && (
                <input style={s.input} placeholder={tr(language, "name")} value={form.name} onChange={handle("name")} />
              )}
              <input style={s.input} type="email" placeholder={tr(language, "email")} value={form.email} onChange={handle("email")} />
              <div style={{ position: "relative", marginBottom: 12 }}>
                <input
                  style={{
                    ...s.input,
                    marginBottom: 0,
                    paddingLeft: language === "fa" ? 16 : 44,
                    paddingRight: language === "fa" ? 44 : 16,
                    fontFamily: "'Inter','Vazirmatn','Tahoma',sans-serif"
                  }}
                  type={showPass ? "text" : "password"}
                  placeholder={tr(language, "password")}
                  value={form.password}
                  onChange={handle("password")}
                />
                <button
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute",
                    [language === "fa" ? "right" : "left"]: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 18,
                    color: "#666", padding: 0, lineHeight: 1
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <button style={s.btn} onClick={view === "signup" ? doSignup : doLogin}>
                {view === "signup" ? tr(language, "continue_onboarding") : tr(language, "login_to_app")}
              </button>
              {view === "login" && (
                <button
                  style={s.ghostBtn}
                  onClick={() => {
                    const normalizedDemo = normalizePersistedUser(DEMO_USER);
                    saveSession(normalizedDemo);
                    onLogin(normalizedDemo);
                  }}
                >
                  {tr(language, "demo_login")}
                </button>
              )}
              <div style={s.cardFooter}>
                {tr(language, "restore_copy")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const EXERCISES = [
  {
    id: 1, name: "اسکوات", name_fa: "اسکوات", name_en: "Back Squat",
    primary_muscles: ["پا"], secondary_muscles: ["سرینی", "کور"], movement_pattern: "squat",
    equipment: "هالتر", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["زانو", "کمر پایین"],
    joint_stress_flags: ["knee_stress", "lower_back_stress"], default_rep_range: "3-8", default_rest_range: "120-180 ثانیه",
    progression_type: "load", substitution_list: ["پرس پا", "لانج"],
    desc: "پادشاه حرکات پایه — زانوها بیرون، کمر صاف، تا موازی پایین برو.", gif: "🏋️"
  },
  {
    id: 2, name: "ددلیفت", name_fa: "ددلیفت", name_en: "Deadlift",
    primary_muscles: ["پشت"], secondary_muscles: ["پشت ران", "سرینی"], movement_pattern: "hinge",
    equipment: "هالتر", difficulty: "پیشرفته", complexity: "compound",
    suitable_goals: ["strength", "hypertrophy"], contraindications: ["کمر پایین"],
    joint_stress_flags: ["lower_back_stress"], default_rep_range: "3-6", default_rest_range: "150-210 ثانیه",
    progression_type: "load", substitution_list: ["رومانیایی"],
    desc: "کمر صاف، باسن به عقب، هالتر نزدیک ساق پا بکش بالا.", gif: "💪"
  },
  {
    id: 3, name: "پرس سینه", name_fa: "پرس سینه", name_en: "Bench Press",
    primary_muscles: ["سینه"], secondary_muscles: ["سرشانه", "پشت بازو"], movement_pattern: "horizontal_press",
    equipment: "هالتر", difficulty: "مبتدی", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["شانه", "مچ"],
    joint_stress_flags: ["shoulder_stress", "wrist_stress"], default_rep_range: "4-10", default_rest_range: "90-150 ثانیه",
    progression_type: "load", substitution_list: ["پرس سرشانه", "پشت بازو سیمکش"],
    desc: "آرنج ۴۵ درجه، کنترل در پایین، انفجاری بالا بیار.", gif: "🔥"
  },
  {
    id: 4, name: "پول‌آپ", name_fa: "پول‌آپ", name_en: "Pull-Up",
    primary_muscles: ["پشت"], secondary_muscles: ["بازو", "کور"], movement_pattern: "vertical_pull",
    equipment: "میله", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["شانه", "آرنج"],
    joint_stress_flags: ["shoulder_stress"], default_rep_range: "4-10", default_rest_range: "90-150 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["جلو بازو"],
    desc: "از آویزان کامل شروع کن، کتف‌ها را جمع کن، چانه بالای میله.", gif: "⬆️"
  },
  {
    id: 5, name: "پرس سرشانه", name_fa: "پرس سرشانه", name_en: "Overhead Press",
    primary_muscles: ["سرشانه"], secondary_muscles: ["پشت بازو", "کور"], movement_pattern: "vertical_press",
    equipment: "هالتر", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["شانه", "کمر پایین"],
    joint_stress_flags: ["shoulder_stress"], default_rep_range: "4-8", default_rest_range: "90-150 ثانیه",
    progression_type: "load", substitution_list: ["پرس سینه"],
    desc: "هسته محکم، هالتر را مستقیم بالا ببر، سر جلو نره.", gif: "🎯"
  },
  {
    id: 6, name: "جلو بازو", name_fa: "جلو بازو", name_en: "Dumbbell Curl",
    primary_muscles: ["بازو"], secondary_muscles: [], movement_pattern: "elbow_flexion",
    equipment: "دمبل", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["آرنج", "مچ"],
    joint_stress_flags: ["wrist_stress"], default_rep_range: "8-15", default_rest_range: "45-75 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["پول‌آپ"],
    desc: "آرنج ثابت، کامل باز کن، در بالا فشار بده.", gif: "💪"
  },
  {
    id: 7, name: "پشت بازو سیمکش", name_fa: "پشت بازو سیمکش", name_en: "Cable Pushdown",
    primary_muscles: ["بازو"], secondary_muscles: [], movement_pattern: "elbow_extension",
    equipment: "دستگاه", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["آرنج"],
    joint_stress_flags: ["elbow_stress"], default_rep_range: "10-15", default_rest_range: "45-75 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["پرس سینه"],
    desc: "آرنج ثابت کنار بدن، کامل باز کن، کنترل برگرد.", gif: "🎯"
  },
  {
    id: 8, name: "لانج", name_fa: "لانج", name_en: "Lunge",
    primary_muscles: ["پا"], secondary_muscles: ["سرینی", "کور"], movement_pattern: "single_leg",
    equipment: "دمبل", difficulty: "مبتدی", complexity: "compound",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["زانو", "تعادل"],
    joint_stress_flags: ["knee_stress"], default_rep_range: "8-12", default_rest_range: "60-90 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["پرس پا", "اسکوات"],
    desc: "گام بلند بردار، زانو به زمین نزنه، تنه صاف.", gif: "🦵"
  },
  {
    id: 9, name: "کرانچ", name_fa: "کرانچ", name_en: "Crunch",
    primary_muscles: ["شکم"], secondary_muscles: [], movement_pattern: "trunk_flexion",
    equipment: "بدون ابزار", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["fat_loss", "hypertrophy", "recomposition"], contraindications: ["گردن"],
    joint_stress_flags: ["neck_stress"], default_rep_range: "12-20", default_rest_range: "30-45 ثانیه",
    progression_type: "reps", substitution_list: ["پلانک"],
    desc: "پشت خم نشه، شکم را سفت کن، آهسته پایین بیا.", gif: "⚡"
  },
  {
    id: 10, name: "پلانک", name_fa: "پلانک", name_en: "Plank",
    primary_muscles: ["کور"], secondary_muscles: ["شکم", "سرشانه"], movement_pattern: "anti_extension",
    equipment: "بدون ابزار", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["fat_loss", "recomposition", "strength"], contraindications: ["شانه", "کمر پایین"],
    joint_stress_flags: ["shoulder_stress"], default_rep_range: "20-60 ثانیه", default_rest_range: "30-45 ثانیه",
    progression_type: "time", substitution_list: ["کرانچ"],
    desc: "بدن مثل خط‌کش، باسن بالا نره، نفس بکش.", gif: "🧱"
  },
  {
    id: 11, name: "رومانیایی", name_fa: "رومانیایی", name_en: "Romanian Deadlift",
    primary_muscles: ["پشت ران"], secondary_muscles: ["سرینی", "کمر"], movement_pattern: "hinge",
    equipment: "هالتر", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["کمر پایین"],
    joint_stress_flags: ["lower_back_stress"], default_rep_range: "6-10", default_rest_range: "90-150 ثانیه",
    progression_type: "load", substitution_list: ["ددلیفت", "لانج"],
    desc: "زانو کمی خم، لگن را به عقب ببر، کمر صاف بمونه.", gif: "🏆"
  },
  {
    id: 12, name: "پرس پا", name_fa: "پرس پا", name_en: "Leg Press",
    primary_muscles: ["پا"], secondary_muscles: ["سرینی"], movement_pattern: "squat_pattern",
    equipment: "دستگاه", difficulty: "مبتدی", complexity: "compound",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["زانو", "کمر پایین"],
    joint_stress_flags: ["knee_stress"], default_rep_range: "8-15", default_rest_range: "75-120 ثانیه",
    progression_type: "load", substitution_list: ["اسکوات", "لانج"],
    desc: "پاها عرض شانه، کمر به تکیه‌گاه، کامل باز نکن.", gif: "🦵"
  },
];

const getExercisePrimaryMuscle = (exercise) => exercise.primary_muscles?.[0] || exercise.muscle || "نامشخص";
const getExerciseDifficulty = (exercise) => exercise.difficulty || "مبتدی";
const getExerciseEquipment = (exercise) => exercise.equipment || "نامشخص";
const getExerciseGoalsLabel = (exercise) => (exercise.suitable_goals || []).map(goal => ({
  hypertrophy: "حجم",
  fat_loss: "چربی‌سوزی",
  strength: "قدرت",
  recomposition: "ریکامپوزیشن",
}[goal] || goal));
const getExercisePrimaryMuscleLabel = (exercise, language = "fa") => localizedLabel(MUSCLE_DISPLAY, getExercisePrimaryMuscle(exercise), language);
const getExerciseSecondaryMusclesLabel = (exercise, language = "fa") => {
  const muscles = exercise.secondary_muscles || [];
  if (!muscles.length) return tr(language, "none");
  return muscles.map(muscle => localizedLabel(MUSCLE_DISPLAY, muscle, language)).join(language === "fa" ? "، " : ", ");
};
const getExerciseDifficultyLabel = (exercise, language = "fa") => localizedLabel(LEVEL_DISPLAY, getExerciseDifficulty(exercise), language);
const getExerciseEquipmentLabel = (exercise, language = "fa") => localizedLabel(EXERCISE_EQUIPMENT_DISPLAY, getExerciseEquipment(exercise), language);
const getExerciseGoalLabels = (exercise, language = "fa") => {
  const goals = getExerciseGoalsLabel(exercise);
  if (!goals.length) return [language === "fa" ? "عمومی" : "General"];
  return goals.map(goal => {
    if (goal === "حجم") return language === "fa" ? "حجم" : "Muscle Gain";
    return localizedLabel(GOAL_DISPLAY, goal, language);
  });
};
const mapLimitationToContraindication = (value) => ({
  "زانو": "زانو",
  "کمر پایین": "کمر پایین",
  "شانه": "شانه",
  "مچ": "مچ",
  "گردن": "گردن",
  "لگن": "لگن",
}[value] || value);

function isExerciseCompatibleWithEquipment(exercise, equipmentAccess) {
  const equipment = getExerciseEquipment(exercise);
  if (equipmentAccess === "full_gym") return true;
  if (equipmentAccess === "home_gym") return equipment !== "دستگاه";
  if (equipmentAccess === "dumbbells_bands") return ["دمبل", "بدون ابزار"].includes(equipment);
  if (equipmentAccess === "bodyweight") return equipment === "بدون ابزار" || equipment === "میله";
  return true;
}

function isExerciseBeginnerSafe(exercise, trainingLevel) {
  if (trainingLevel !== "beginner") return true;
  return getExerciseDifficulty(exercise) !== "پیشرفته" && exercise.complexity !== "advanced";
}

function isExerciseLimitationSafe(exercise, limitationFlags = []) {
  const cleanFlags = (limitationFlags || []).filter(flag => flag && flag !== "ندارم").map(mapLimitationToContraindication);
  if (cleanFlags.length === 0) return true;
  return !cleanFlags.some(flag => (exercise.contraindications || []).includes(flag));
}

function filterExercisesForUser(exercises, user) {
  const normalizedUser = normalizePersistedUser(user);
  const goal = normalizeSplitGoal(normalizedUser.goal);
  const trainingLevel = normalizeSplitLevel(normalizedUser.training_level);
  const equipmentAccess = normalizeSplitEquipment(normalizedUser.equipment_access);
  const limitationFlags = normalizedUser.injury_or_limitation_flags || [];

  return exercises.filter(exercise =>
    isExerciseCompatibleWithEquipment(exercise, equipmentAccess) &&
    isExerciseBeginnerSafe(exercise, trainingLevel) &&
    isExerciseLimitationSafe(exercise, limitationFlags) &&
    (!(exercise.suitable_goals || []).length || exercise.suitable_goals.includes(goal))
  );
}

function substituteExercise(exerciseName, user, fallbackPool) {
  const normalizedUser = normalizePersistedUser(user);
  const exercise = EXERCISES.find(ex => ex.name === exerciseName);
  if (!exercise) return exerciseName;
  const pool = fallbackPool || filterExercisesForUser(EXERCISES, normalizedUser);
  if (
    isExerciseCompatibleWithEquipment(exercise, normalizeSplitEquipment(normalizedUser.equipment_access)) &&
    isExerciseBeginnerSafe(exercise, normalizeSplitLevel(normalizedUser.training_level)) &&
    isExerciseLimitationSafe(exercise, normalizedUser.injury_or_limitation_flags || [])
  ) {
    return exercise.name;
  }
  const substitute = pool.find(candidate => (exercise.substitution_list || []).includes(candidate.name));
  return substitute?.name || pool.find(candidate => candidate.movement_pattern === exercise.movement_pattern)?.name || pool[0]?.name || exercise.name;
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

function getExerciseByName(name) {
  return EXERCISES.find(ex => ex.name === name) || null;
}

function parseRepRange(repRange) {
  if (!repRange) return { min: null, max: null };
  const match = String(repRange).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { min: null, max: null };
  return { min: Number(match[1]), max: Number(match[2]) };
}

function formatRepRange(min, max, fallback = "8-12") {
  if (!min || !max || min > max) return fallback;
  return `${min}-${max}`;
}

function parseRestRange(restRange) {
  if (!restRange) return { min: null, max: null };
  const matches = String(restRange).match(/\d+/g);
  if (!matches?.length) return { min: null, max: null };
  if (matches.length === 1) {
    const value = Number(matches[0]);
    return { min: value, max: value };
  }
  return { min: Number(matches[0]), max: Number(matches[1]) };
}

function formatRestRange(min, max, fallback = "60-90 ثانیه") {
  if (!min || !max || min > max) return fallback;
  return `${min}-${max} ثانیه`;
}

function getProgressionTrend(logs = []) {
  if (!logs.length) {
    return {
      averageReps: 0,
      averageAdherence: null,
      recentConsistency: 0,
      stalled: false,
      plateauRisk: false,
      needsConsolidation: false,
      needsDeload: false,
      trendLabel: "no_data",
    };
  }

  const recentLogs = logs.slice(0, 3);
  const averageReps = recentLogs.reduce((sum, log) => sum + (Number(log.reps) || 0), 0) / recentLogs.length;
  const adherenceSamples = recentLogs
    .map(log => {
      const prescribedSets = Number(log.prescribed_sets) || 0;
      const loggedSets = Number(log.sets) || 0;
      return prescribedSets ? Math.min(1, loggedSets / prescribedSets) : null;
    })
    .filter(value => typeof value === "number");
  const averageAdherence = adherenceSamples.length
    ? adherenceSamples.reduce((sum, value) => sum + value, 0) / adherenceSamples.length
    : null;
  const recentConsistency = recentLogs.filter(log => (Number(log.reps) || 0) > 0).length / recentLogs.length;
  const latestReps = Number(recentLogs[0]?.reps) || 0;
  const latestWeight = Number(recentLogs[0]?.weight) || 0;
  const previousBestReps = Math.max(...recentLogs.slice(1).map(log => Number(log.reps) || 0), 0);
  const previousBestWeight = Math.max(...recentLogs.slice(1).map(log => Number(log.weight) || 0), 0);
  const stalled = recentLogs.length >= 2 && latestReps <= previousBestReps;
  const needsConsolidation = averageAdherence !== null && averageAdherence < 0.7;
  const needsDeload = recentLogs.length >= 3 && averageAdherence !== null && averageAdherence < 0.55;
  const plateauRisk = !needsDeload
    && !needsConsolidation
    && recentLogs.length >= 3
    && stalled
    && averageAdherence !== null
    && averageAdherence >= 0.8
    && latestWeight >= previousBestWeight;

  let trendLabel = "stable";
  if (needsDeload) trendLabel = "deload";
  else if (plateauRisk) trendLabel = "plateau";
  else if (needsConsolidation) trendLabel = "consolidate";
  else if (!stalled && latestReps > previousBestReps) trendLabel = "advancing";
  else if (stalled) trendLabel = "stalled";

  return {
    averageReps,
    averageAdherence,
    recentConsistency,
    stalled,
    plateauRisk,
    needsConsolidation,
    needsDeload,
    trendLabel,
  };
}

function getLongTermProgressionCycle(logs = []) {
  const cycleLogs = logs.slice(0, 9);
  if (cycleLogs.length < 6) {
    return {
      phase: "baseline",
      cycleLength: cycleLogs.length,
      completedBlocks: 0,
      averageAdherence: null,
      averageVolume: 0,
    };
  }

  const adherenceSamples = cycleLogs
    .map(log => {
      const prescribedSets = Number(log.prescribed_sets) || 0;
      const loggedSets = Number(log.sets) || 0;
      return prescribedSets ? Math.min(1, loggedSets / prescribedSets) : null;
    })
    .filter(value => typeof value === "number");
  const averageAdherence = adherenceSamples.length
    ? adherenceSamples.reduce((sum, value) => sum + value, 0) / adherenceSamples.length
    : null;
  const averageVolume = cycleLogs.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0) / cycleLogs.length;
  const firstHalf = cycleLogs.slice(Math.floor(cycleLogs.length / 2));
  const secondHalf = cycleLogs.slice(0, Math.floor(cycleLogs.length / 2));
  const firstHalfVolume = firstHalf.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0);
  const secondHalfVolume = secondHalf.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0);
  const volumeTrendUp = secondHalfVolume > firstHalfVolume * 1.06;
  const cycleLength = cycleLogs.length;
  const completedBlocks = Math.floor(cycleLength / 3);

  let phase = "accumulate";
  if (averageAdherence !== null && averageAdherence < 0.65) {
    phase = "reset";
  } else if (completedBlocks >= 2 && volumeTrendUp && averageAdherence !== null && averageAdherence >= 0.82) {
    phase = "intensify";
  } else if (completedBlocks >= 2 && !volumeTrendUp) {
    phase = "stabilize";
  }

  return {
    phase,
    cycleLength,
    completedBlocks,
    averageAdherence,
    averageVolume,
  };
}

function getWeekBucketKey(log) {
  const raw = Number(log?.created_at);
  const date = raw ? new Date(raw) : new Date();
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

function getLongTermVolumeManagement(logs = [], user, exercise) {
  const historyLogs = logs.slice(0, 12);
  if (historyLogs.length < 8) {
    return {
      state: "baseline",
      averageRecentWeeklyVolume: 0,
      averagePreviousWeeklyVolume: 0,
      recentAdherence: null,
      activeWeeks: 0,
      note: null,
    };
  }

  const normalizedUser = normalizePersistedUser(user);
  const weeklyBuckets = historyLogs.reduce((acc, log) => {
    const key = getWeekBucketKey(log);
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});
  const weeklySummaries = Object.entries(weeklyBuckets)
    .map(([week, entries]) => ({
      week,
      volume: entries.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0),
      adherence: entries
        .map(log => {
          const prescribedSets = Number(log.prescribed_sets) || 0;
          const loggedSets = Number(log.sets) || 0;
          return prescribedSets ? Math.min(1, loggedSets / prescribedSets) : null;
        })
        .filter(value => typeof value === "number"),
    }))
    .map(summary => ({
      ...summary,
      averageAdherence: summary.adherence.length
        ? summary.adherence.reduce((sum, value) => sum + value, 0) / summary.adherence.length
        : null,
    }))
    .sort((a, b) => b.week.localeCompare(a.week));

  if (weeklySummaries.length < 3) {
    return {
      state: "baseline",
      averageRecentWeeklyVolume: 0,
      averagePreviousWeeklyVolume: 0,
      recentAdherence: null,
      activeWeeks: weeklySummaries.length,
      note: null,
    };
  }

  const recentWeeks = weeklySummaries.slice(0, 2);
  const previousWeeks = weeklySummaries.slice(2, 4);
  const averageRecentWeeklyVolume = Math.round(recentWeeks.reduce((sum, week) => sum + week.volume, 0) / recentWeeks.length);
  const averagePreviousWeeklyVolume = previousWeeks.length
    ? Math.round(previousWeeks.reduce((sum, week) => sum + week.volume, 0) / previousWeeks.length)
    : 0;
  const recentAdherenceSamples = recentWeeks
    .map(week => week.averageAdherence)
    .filter(value => typeof value === "number");
  const recentAdherence = recentAdherenceSamples.length
    ? recentAdherenceSamples.reduce((sum, value) => sum + value, 0) / recentAdherenceSamples.length
    : null;

  const volumeTrendUp = averagePreviousWeeklyVolume > 0 && averageRecentWeeklyVolume > averagePreviousWeeklyVolume * 1.18;
  const volumeTrendDown = averagePreviousWeeklyVolume > 0 && averageRecentWeeklyVolume < averagePreviousWeeklyVolume * 0.88;
  const highRecovery = normalizeSplitRecovery(normalizedUser.recovery_quality) === "high";
  const goal = normalizeSplitGoal(normalizedUser.goal);
  const canPushVolume = !exercise?.complexity || exercise.complexity !== "isolation";

  if (volumeTrendUp && recentAdherence !== null && recentAdherence < 0.78) {
    return {
      state: "volume_guard",
      averageRecentWeeklyVolume,
      averagePreviousWeeklyVolume,
      recentAdherence,
      activeWeeks: weeklySummaries.length,
      note: "در چند هفته اخیر حجم این حرکت سریع‌تر از کیفیت اجرا بالا رفته، پس app فعلاً حجم را کنترل می‌کند تا فشار مزمن جمع نشود.",
    };
  }

  if (
    canPushVolume &&
    highRecovery &&
    recentAdherence !== null &&
    recentAdherence >= 0.88 &&
    (goal === "hypertrophy" || goal === "recomposition") &&
    (averagePreviousWeeklyVolume === 0 || volumeTrendDown || Math.abs(averageRecentWeeklyVolume - averagePreviousWeeklyVolume) <= averageRecentWeeklyVolume * 0.08)
  ) {
    return {
      state: "volume_push",
      averageRecentWeeklyVolume,
      averagePreviousWeeklyVolume,
      recentAdherence,
      activeWeeks: weeklySummaries.length,
      note: "چند هفته اخیر حجم این حرکت پایدار مانده و ریکاوری/پایبندی خوب بوده، پس app کمی فضای رشد حجمی بیشتری می‌دهد.",
    };
  }

  return {
    state: "baseline",
    averageRecentWeeklyVolume,
    averagePreviousWeeklyVolume,
    recentAdherence,
    activeWeeks: weeklySummaries.length,
    note: null,
  };
}

function getTrendDirection(currentValue, previousValue, epsilon = 0.01) {
  if (typeof currentValue !== "number" || typeof previousValue !== "number") return "neutral";
  if (currentValue > previousValue + epsilon) return "up";
  if (currentValue < previousValue - epsilon) return "down";
  return "flat";
}

function getGoalSpecificProgressInterpretation({
  goal,
  totalWeightChange,
  adherenceTrendDirection,
  volumeTrendDirection,
  recentAverageAdherence,
  weeklySessionCount,
}, language = "fa") {
  const normalizedGoal = normalizeSplitGoal(goal);

  if (normalizedGoal === "hypertrophy") {
    if (adherenceTrendDirection === "up" && (volumeTrendDirection === "up" || volumeTrendDirection === "flat")) {
      return {
        title: language === "fa" ? "مسیر عضله‌سازی فعلاً درست است" : "Your muscle-building trend is on track",
        tone: "strong",
        summary: language === "fa"
          ? "برای هدف حجم، بالا رفتن پایبندی همراه با حفظ یا رشد حجم تمرین نشانه خوبی است."
          : "For hypertrophy, rising adherence together with stable or growing training volume is a good sign.",
      };
    }
    if (weeklySessionCount < 2) {
      return {
        title: language === "fa" ? "برای عضله‌سازی هنوز ریتم کافی نداری" : "You still need a steadier rhythm for muscle gain",
        tone: "caution",
        summary: language === "fa"
          ? "برای این هدف، ثبات جلسه‌ها از نوسان‌های مقطعی مهم‌تر است. اول ریتم هفتگی را پایدار کن."
          : "For this goal, weekly consistency matters more than short spikes. Stabilize your weekly training rhythm first.",
      };
    }
    return {
      title: language === "fa" ? "عضله‌سازی جلو می‌رود، ولی هنوز جا برای ثبات بیشتر هست" : "Muscle gain is moving forward, but more consistency will help",
      tone: "steady",
      summary: language === "fa"
        ? "برای این هدف، ترکیب پایبندی بالا و حجم تمرین پایدار مهم‌ترین نشانه پیشرفت است."
        : "For this goal, high adherence plus stable training volume is the clearest sign of progress.",
    };
  }

  if (normalizedGoal === "strength") {
    if (adherenceTrendDirection === "up" && recentAverageAdherence !== null && recentAverageAdherence >= 85) {
      return {
        title: language === "fa" ? "برای قدرت، کیفیت اجرا رو به بهتر شدن است" : "Execution quality for strength is improving",
        tone: "strong",
        summary: language === "fa"
          ? "در هدف قدرت، پایبندی به نسخه و کیفیت ست‌ها از صرفاً بالا رفتن حجم مهم‌تر است."
          : "For strength, prescription adherence and set quality matter more than volume alone.",
      };
    }
    return {
      title: language === "fa" ? "قدرت بیشتر به اجرای تمیز وابسته است" : "Strength progress depends on cleaner execution",
      tone: "steady",
      summary: language === "fa"
        ? "برای این هدف، اگر کیفیت و پایبندی نوسان داشته باشند، بهتر است فعلاً روی اجرای دقیق و ریکاوری بمانی."
        : "For this goal, if execution quality and adherence fluctuate, stay focused on cleaner reps and recovery for now.",
    };
  }

  if (normalizedGoal === "fat_loss") {
    const numericWeightChange = Number(totalWeightChange);
    if (!Number.isNaN(numericWeightChange) && numericWeightChange < 0 && adherenceTrendDirection !== "down") {
      return {
        title: language === "fa" ? "برای چربی‌سوزی مسیر فعلاً قابل‌قبول است" : "Your fat-loss direction is acceptable right now",
        tone: "strong",
        summary: language === "fa"
          ? "افت وزن همراه با حفظ پایبندی تمرینی نشانه خوبی است، حتی اگر حجم تمرین خیلی بالا نرود."
          : "Weight reduction together with maintained training adherence is a good sign, even if training volume does not climb much.",
      };
    }
    return {
      title: language === "fa" ? "چربی‌سوزی را با ثبات تمرین دنبال کن" : "Pursue fat loss through consistency",
      tone: "steady",
      summary: language === "fa"
        ? "برای این هدف، افت پایبندی یا ریتم ناپایدار خیلی سریع کیفیت خروجی را پایین می‌آورد."
        : "For this goal, drops in adherence or an unstable rhythm reduce output quality quickly.",
    };
  }

  if (normalizedGoal === "recomposition") {
    if (adherenceTrendDirection === "up" && weeklySessionCount >= 2) {
      return {
        title: language === "fa" ? "برای ریکامپوزیشن ثباتت رو به بهتر شدن است" : "Your recomposition consistency is improving",
        tone: "strong",
        summary: language === "fa"
          ? "در این هدف، ثبات تمرین و اجرای نزدیک به نسخه از نوسان‌های شدید وزن مهم‌تر است."
          : "For recomposition, training consistency and close prescription execution matter more than sharp weight swings.",
      };
    }
    return {
      title: language === "fa" ? "ریکامپوزیشن به صبر و ثبات نیاز دارد" : "Recomposition needs patience and consistency",
      tone: "steady",
      summary: language === "fa"
        ? "برای این هدف، بهتر است روی ثبات sessionها و حفظ کیفیت اجرای برنامه متمرکز بمانی."
        : "For this goal, stay focused on consistent sessions and maintaining execution quality.",
    };
  }

  return {
    title: language === "fa" ? "روند کلی تمرینت در حال شکل‌گیری است" : "Your overall training trend is still taking shape",
    tone: "steady",
    summary: language === "fa"
      ? "هنوز بهتر است روی ثبات اجرا و پایبندی به نسخه تمرکز کنی."
      : "For now, stay focused on execution consistency and prescription adherence.",
  };
}

function getProgressionSuggestion(exercise, prescription, logs = [], language = "fa") {
  if (!exercise || !prescription) return null;
  const { min, max } = parseRepRange(prescription.rep_range);
  const targetSets = Number(prescription.sets) || 1;

  if (logs.length === 0) {
    if (!min || !max) return null;
    return {
      lastWeight: 0,
      lastReps: 0,
      lastSets: 0,
      suggestedWeight: "",
      suggestedReps: min,
      suggestedSets: targetSets,
      message: language === "fa"
        ? `برای اولین اجرای این حرکت، از بازه ${min}-${max} شروع کن و اول فرم تمیز و کامل بودن ست‌های هدف را تثبیت کن.`
        : `For your first run of this exercise, start inside the ${min}-${max} range and first lock in clean form and full target-set execution.`,
      strategy: null,
      trend_label: "baseline",
      average_reps: null,
      average_adherence: null,
    };
  }
  const latestLog = logs[0];
  const progressionType = exercise.progression_type || "load";
  const lastWeight = Number(latestLog.weight) || 0;
  const lastReps = Number(latestLog.reps) || 0;
  const lastSets = Number(latestLog.sets) || 1;
  const resolvedTargetSets = Number(prescription.sets) || lastSets;
  const trend = getProgressionTrend(logs);
  const cycle = getLongTermProgressionCycle(logs);

  if (!min || !max) return null;

  let suggestedWeight = lastWeight;
  let suggestedReps = lastReps || min;
  let message = language === "fa"
    ? `آخرین ثبت: ${lastWeight || "بدون وزن"}kg × ${lastReps} تکرار × ${lastSets} ست`
    : `Last log: ${lastWeight || "bodyweight"}kg × ${lastReps} reps × ${lastSets} sets`;
  let strategy = "steady";

  if (trend.needsDeload) {
    suggestedWeight = lastWeight > 0 ? Number((lastWeight * 0.9).toFixed(1)) : "";
    suggestedReps = min;
    strategy = "deload";
    message = language === "fa"
      ? `چند جلسه اخیر فشار این حرکت خوب جمع نشده. یک deload کوتاه با ${suggestedWeight || "بار سبک‌تر"} و ${min}-${max} تکرار اجرا کن تا کیفیت حرکت برگردد.`
      : `Recent sessions suggest fatigue has not managed well here. Run a short deload with ${suggestedWeight || "a lighter load"} and ${min}-${max} reps to restore quality.`;
  } else if (trend.plateauRisk) {
    suggestedWeight = lastWeight;
    suggestedReps = Math.max(min, lastReps || min);
    strategy = "plateau_reset";
    message = language === "fa"
      ? `این حرکت چند جلسه است روی همین سطح گیر کرده. یک reset کنترل‌شده با همین بار و اجرای تمیز، قبل از فشار بیشتر منطقی‌تر است.`
      : `This movement has been stuck at the same level for several sessions. A controlled reset at the same load with cleaner execution makes more sense before pushing harder.`;
  } else if (trend.needsConsolidation) {
    suggestedWeight = lastWeight;
    suggestedReps = Math.max(min, lastReps || min);
    strategy = "consolidate";
    message = language === "fa"
      ? "چند جلسه اخیر کامل ثبت نشده. اول همین نسخه را تمیز و کامل اجرا کن، بعد سراغ افزایش برو."
      : "Recent sessions were not fully logged. First execute this prescription cleanly and fully, then move on to progression.";
  } else if (trend.stalled && lastWeight > 0) {
    suggestedWeight = lastWeight;
    suggestedReps = Math.max(min, lastReps || min);
    strategy = "hold";
    message = language === "fa"
      ? `پیشروی این حرکت کمی ایست کرده. یک جلسه دیگر ${lastWeight}kg را با فرم تمیز تثبیت کن و بعد افزایش بده.`
      : `Progress has stalled slightly here. Stabilize one more session at ${lastWeight}kg with clean form before increasing.`;
  } else if (progressionType === "reps_then_load") {
    if (lastReps >= max && lastWeight > 0) {
      suggestedWeight = Number((lastWeight + 2.5).toFixed(1));
      suggestedReps = min;
      strategy = "increase_load";
      message = language === "fa"
        ? `آخرین ست به سقف بازه رسید. جلسه بعد ${suggestedWeight}kg را با ${min}-${max} تکرار شروع کن.`
        : `Your last set hit the top of the range. Next session start ${suggestedWeight}kg in the ${min}-${max} rep range.`;
    } else {
      suggestedReps = Math.min(max, Math.max(min, lastReps + 1));
      strategy = "increase_reps";
      message = language === "fa"
        ? `اولویت جلسه بعد: با ${lastWeight || "وزن فعلی"}kg یک تکرار بیشتر بزن و به بازه ${min}-${max} نزدیک شو.`
        : `Next-session priority: get one more rep with ${lastWeight || "your current load"}kg and move closer to the ${min}-${max} range.`;
    }
  } else if (progressionType === "reps") {
    suggestedReps = Math.min(max, Math.max(min, lastReps + 1));
    strategy = "increase_reps";
    message = language === "fa"
      ? `برای جلسه بعد روی ${suggestedReps} تکرار با فرم تمیز تمرکز کن.`
      : `For the next session, focus on reaching ${suggestedReps} reps with clean form.`;
  } else if (progressionType === "time") {
    suggestedReps = Math.min(max, Math.max(min, lastReps + 5));
    strategy = "extend_time";
    message = language === "fa"
      ? `برای جلسه بعد کمی زمان/تکرار را بالا ببر و فرم را حفظ کن.`
      : `For the next session, slightly raise time/reps while keeping form clean.`;
  } else {
    if (lastReps >= max && lastWeight > 0) {
      suggestedWeight = Number((lastWeight + 2.5).toFixed(1));
      suggestedReps = min;
      strategy = "increase_load";
      message = language === "fa"
        ? `آخرین ثبت خوب بود. جلسه بعد ${suggestedWeight}kg را در بازه ${min}-${max} هدف بگیر.`
        : `Your last log looked good. Next session aim for ${suggestedWeight}kg in the ${min}-${max} range.`;
    } else {
      suggestedReps = Math.min(max, Math.max(min, lastReps + 1));
      strategy = "increase_reps";
      message = language === "fa"
        ? `قبل از افزایش وزنه، همین وزنه را در بازه ${min}-${max} کامل‌تر کن.`
        : `Before increasing the load, complete this same weight more fully inside the ${min}-${max} range.`;
    }
  }

  if (cycle.phase === "intensify" && (strategy === "increase_reps" || strategy === "increase_load")) {
    message += language === "fa"
      ? " الان هم در فاز شدت چرخه‌ای هستی، پس فشار را با اجرای تمیز ولی قاطع جلو ببر."
      : " You are also in an intensification phase, so push with clean but decisive execution.";
  } else if (cycle.phase === "stabilize" && (strategy === "hold" || strategy === "consolidate")) {
    message += language === "fa"
      ? " چرخه اخیر نشان می‌دهد فعلاً تثبیت کیفیت از فشار بیشتر مهم‌تر است."
      : " The recent cycle suggests that stabilizing quality matters more right now than pushing harder.";
  } else if (cycle.phase === "reset" && strategy !== "deload") {
    message += language === "fa"
      ? " چرخه اخیر هم نشان می‌دهد بهتر است قبل از فشار بیشتر، یک بازتنظیم کوتاه داشته باشی."
      : " The recent cycle also suggests a short reset before applying more pressure.";
  }

  return {
    lastWeight,
    lastReps,
    lastSets,
    suggestedWeight: suggestedWeight || "",
    suggestedReps: suggestedReps || "",
    suggestedSets: resolvedTargetSets,
    message,
    strategy,
    trend_label: trend.trendLabel,
    cycle_phase: cycle.phase,
    cycle_blocks: cycle.completedBlocks,
    average_reps: trend.averageReps ? Number(trend.averageReps.toFixed(1)) : null,
    average_adherence: typeof trend.averageAdherence === "number"
      ? Math.round(trend.averageAdherence * 100)
      : null,
  };
}

function getForcedProgressionSuggestion(scenario, exercise, prescription, logs = []) {
  if (!exercise || !prescription || !scenario) return null;
  const { min, max } = parseRepRange(prescription.rep_range);
  const targetSets = Number(prescription.sets) || 1;
  const latestLog = logs[0] || null;
  const lastWeight = Number(latestLog?.weight) || 20;
  const lastReps = Number(latestLog?.reps) || min || 8;

  if (scenario === "increase_load") {
    return {
      lastWeight,
      lastReps,
      lastSets: Number(latestLog?.sets) || targetSets,
      suggestedWeight: Number((lastWeight + 2.5).toFixed(1)),
      suggestedReps: min || lastReps,
      suggestedSets: targetSets,
      message: `حالت تست فعال است: برای این حرکت افزایش وزنه را با ${Number((lastWeight + 2.5).toFixed(1))}kg و بازه ${min}-${max} ببین.`,
      strategy: "increase_load",
      trend_label: "test_increase_load",
      average_reps: max || lastReps,
      average_adherence: 100,
    };
  }

  if (scenario === "increase_reps") {
    return {
      lastWeight,
      lastReps,
      lastSets: Number(latestLog?.sets) || targetSets,
      suggestedWeight: lastWeight,
      suggestedReps: Math.min(max || lastReps + 1, Math.max(min || 1, lastReps + 1)),
      suggestedSets: targetSets,
      message: `حالت تست فعال است: برای این حرکت ابتدا افزایش تکرار را با همان ${lastWeight}kg ببین.`,
      strategy: "increase_reps",
      trend_label: "test_increase_reps",
      average_reps: Math.max(min || 1, (max || lastReps + 1) - 1),
      average_adherence: 90,
    };
  }

  if (scenario === "plateau_reset") {
    return {
      lastWeight,
      lastReps,
      lastSets: Number(latestLog?.sets) || targetSets,
      suggestedWeight: lastWeight,
      suggestedReps: Math.max(min || 1, lastReps),
      suggestedSets: targetSets,
      message: "حالت تست فعال است: این حرکت را در وضعیت ریست پلاتو می‌بینی؛ فعلاً بار را نگه دار و با اجرای تمیز reset کن.",
      strategy: "plateau_reset",
      trend_label: "test_plateau_reset",
      average_reps: Math.max(min || 1, lastReps),
      average_adherence: 88,
    };
  }

  if (scenario === "deload") {
    return {
      lastWeight,
      lastReps,
      lastSets: Number(latestLog?.sets) || targetSets,
      suggestedWeight: Number((lastWeight * 0.9).toFixed(1)),
      suggestedReps: min || 8,
      suggestedSets: Math.max(1, targetSets - 1),
      message: `حالت تست فعال است: این حرکت را در وضعیت دیلود کوتاه می‌بینی؛ بار را به ${Number((lastWeight * 0.9).toFixed(1))}kg کم کن و نسخه را سبک‌تر اجرا کن.`,
      strategy: "deload",
      trend_label: "test_deload",
      average_reps: min || 8,
      average_adherence: 45,
    };
  }

  return getProgressionSuggestion(exercise, prescription, logs);
}

function buildSyntheticProgressionLogs({
  exerciseName,
  prescription,
  currentWorkoutContext,
  scenario,
}) {
  const { min, max } = parseRepRange(prescription?.rep_range);
  const targetSets = Number(prescription?.sets) || 3;
  const baseWeight = 20;
  const now = Date.now();
  const buildEntry = (overrides, index) => ({
    id: now - index,
    created_at: now - (index * 60000),
    date: new Date(now - (index * 60000)).toLocaleDateString("fa-IR"),
    name: exerciseName,
    weight: baseWeight,
    reps: min || 8,
    sets: targetSets,
    program_name: currentWorkoutContext?.program_name || "سناریوی تست",
    day_name: currentWorkoutContext?.day_name || "روز تست",
    split_family: currentWorkoutContext?.split_family || null,
    is_recommended: currentWorkoutContext?.is_recommended || false,
    prescribed_sets: targetSets,
    prescribed_rep_range: prescription?.rep_range || "8-12",
    prescribed_rest_range: prescription?.rest_range || "60-90 ثانیه",
    prescribed_effort: prescription?.effort || "2 RIR",
    synthetic_progression_test: true,
    ...overrides,
  });

  if (scenario === "increase_load") {
    return [
      buildEntry({ reps: max || 10, weight: baseWeight + 2.5 }, 1),
      buildEntry({ reps: Math.max(min || 8, (max || 10) - 1), weight: baseWeight }, 2),
      buildEntry({ reps: Math.max(min || 8, (max || 10) - 2), weight: baseWeight }, 3),
    ];
  }

  if (scenario === "increase_reps") {
    return [
      buildEntry({ reps: Math.max(min || 8, (max || 10) - 1), weight: baseWeight }, 1),
      buildEntry({ reps: Math.max(min || 8, (max || 10) - 2), weight: baseWeight }, 2),
      buildEntry({ reps: Math.max(min || 8, (max || 10) - 3), weight: baseWeight }, 3),
    ];
  }

  if (scenario === "plateau_reset") {
    return [
      buildEntry({ reps: Math.max(min || 8, Math.min(max || 10, min || 8)), weight: baseWeight }, 1),
      buildEntry({ reps: Math.max(min || 8, Math.min(max || 10, min || 8)), weight: baseWeight }, 2),
      buildEntry({ reps: Math.max(min || 8, Math.min(max || 10, min || 8)), weight: baseWeight }, 3),
    ];
  }

  if (scenario === "deload") {
    return [
      buildEntry({ reps: min || 8, weight: baseWeight, sets: 1 }, 1),
      buildEntry({ reps: min || 8, weight: baseWeight, sets: 1 }, 2),
      buildEntry({ reps: min || 8, weight: baseWeight, sets: 1 }, 3),
    ];
  }

  return [];
}

function getRecommendedRepsFromRange(repRange) {
  const { min, max } = parseRepRange(repRange);
  if (!min || !max) return "";
  return String(min);
}

function getSuggestedRestSeconds(restRange) {
  if (!restRange) return 90;
  const match = String(restRange).match(/(\d+)/);
  return match ? Number(match[1]) : 90;
}

function getCompletionGuidance({ adherence, currentProgramDay, nextDay, remainingExercises = [] }) {
  if (typeof adherence === "number") {
    if (adherence < 0.5) {
      return {
        title: "جلسه را سبک بستی",
        tone: "recovery",
        message: remainingExercises.length
          ? `نسخه امروز کامل نشد. جلسه بعد از ${remainingExercises[0]} شروع کن و قبل از رفتن به روز بعد، ${remainingExercises.length} حرکت باقی‌مانده را جمع کن.`
          : "نسخه امروز کامل نشد. جلسه بعد چند ست اول را محافظه‌کارانه شروع کن و به نسخه نزدیک‌تر شو.",
      };
    }
    if (adherence < 0.85) {
      return {
        title: "پیشروی خوب، اما هنوز جا دارد",
        tone: "steady",
        message: nextDay
          ? `بخش اصلی روز فعال انجام شد. اگر ریکاوری‌ات خوب بود جلسه بعد به ${nextDay.day} برو، وگرنه همین روز را یک‌بار تمیزتر کامل کن.`
          : "بخش اصلی روز فعال انجام شد. جلسه بعد همین ساختار را با پایبندی بالاتر تکرار کن.",
      };
    }
    return {
      title: "نسخه امروز خوب اجرا شد",
      tone: "strong",
      message: nextDay
        ? `پایبندی خوب بود. جلسه بعد سراغ ${nextDay.day} برو و اگر فرم خوب ماند، progression پیشنهادی را هم اعمال کن.`
        : "پایبندی خوب بود. جلسه بعد می‌توانی progression پیشنهادی را برای حرکات اصلی دنبال کنی.",
    };
  }

  return {
    title: "جلسه ثبت شد",
    tone: "neutral",
    message: nextDay
      ? `جلسه بعد با ${nextDay.day} ادامه بده.`
      : currentProgramDay
        ? "اگر هنوز انرژی داری، همین روز را کامل‌تر کن یا جلسه را در progress مرور کن."
        : "حالا می‌توانی برنامه پیشنهادی را انتخاب کنی یا وارد تب پیشرفت شوی.",
  };
}

function getProgressionExplanation(progression, language = "fa") {
  if (!progression) return null;

  if (progression.strategy === "consolidate") {
    return language === "fa"
      ? "دلیل این تصمیم: پایبندی چند جلسه اخیر پایین بوده و app فعلاً به‌جای افزایش، تثبیت اجرای نسخه را امن‌تر می‌داند."
      : "Reason: recent adherence has been low, so the app prefers consolidating execution before increasing load.";
  }
  if (progression.strategy === "deload") {
    return language === "fa"
      ? "دلیل این تصمیم: چند جلسه اخیر هم از نظر کیفیت ثبت و هم فشار کلی نشانه جمع‌شدن خستگی را داشته‌اند، پس app یک deload کوتاه را امن‌تر می‌داند."
      : "Reason: recent sessions show both fatigue accumulation and reduced execution quality, so a short deload is safer.";
  }
  if (progression.strategy === "plateau_reset") {
    return language === "fa"
      ? "دلیل این تصمیم: با وجود ثبت نسبتاً پایدار، حرکت روی همان سطح گیر کرده و app قبل از فشار بیشتر یک reset کنترل‌شده را منطقی‌تر می‌بیند."
      : "Reason: despite stable logging, the movement has stalled at the same level, so a controlled reset makes more sense before pushing harder.";
  }
  if (progression.strategy === "hold") {
    return language === "fa"
      ? "دلیل این تصمیم: عملکرد حرکت در چند ثبت اخیر جلو نرفته، پس app یک جلسه تثبیت با همین بار را ترجیح می‌دهد."
      : "Reason: performance has not moved forward over the last few logs, so the app prefers a stabilizing session at the same load.";
  }
  if (progression.strategy === "increase_load") {
    return language === "fa"
      ? "دلیل این تصمیم: ثبت‌های اخیر به سقف بازه هدف رسیده‌اند، پس افزایش وزنه منطقی‌تر از افزایش تکرار است."
      : "Reason: recent logs have reached the top of the target range, so increasing load is more logical than adding reps.";
  }
  if (progression.strategy === "increase_reps") {
    return language === "fa"
      ? "دلیل این تصمیم: هنوز جا برای پر کردن بازه تکرار وجود دارد، پس app قبل از افزایش وزنه، تکرار را بالا می‌برد."
      : "Reason: there is still room to fill the target rep range, so the app increases reps before load.";
  }
  if (progression.strategy === "extend_time") {
    return language === "fa"
      ? "دلیل این تصمیم: این حرکت بیشتر با زمان/تداوم بهتر می‌شود تا افزایش مستقیم بار."
      : "Reason: this exercise improves more through time and continuity than direct load increases.";
  }
  return language === "fa"
    ? "این پیشنهاد از روی ثبت‌های اخیر و prescription فعلی ساخته شده است."
    : "This suggestion is based on recent logs and the current prescription.";
}

function getCompletionGuidanceExplanation(result) {
  if (!result) return null;
  if (result.guidance_tone === "recovery") {
    return "این جمع‌بندی نشان می‌دهد هنوز بخشی از نسخه روز فعال ثبت نشده و app فعلاً تکمیل همین روز را اولویت می‌دهد.";
  }
  if (result.guidance_tone === "steady") {
    return "این جمع‌بندی یعنی بخش اصلی جلسه انجام شده، اما هنوز کیفیت اجرا به نقطه‌ای نرسیده که افزایش فشار کاملاً مطمئن باشد.";
  }
  if (result.guidance_tone === "strong") {
    return "این جمع‌بندی یعنی نسخه روز فعال با کیفیت خوبی اجرا شده و app آمادگی بیشتری برای رفتن به روز بعد یا progression می‌بیند.";
  }
  return "این جمع‌بندی از پایبندی نسخه، پوشش روز فعال و context برنامه ساخته شده است.";
}

function buildPlanExplanation(user, recommendedProgram, language = "fa") {
  const normalizedUser = normalizePersistedUser(user);
  const split = recommendedProgram?.split || {};
  const reasons = [];
  const adjustments = [];
  const nextChecks = [];

  reasons.push(
    language === "fa"
      ? `هدف فعلی تو ${getDisplayGoal(normalizedUser.goal, language)} است، بنابراین منطق برنامه روی ${getProgrammingStyleLabel(recommendedProgram.goal_key || recommendedProgram.goal, language) || "پیشروی پایه"} تنظیم شده.`
      : `Your current goal is ${getDisplayGoal(normalizedUser.goal, language)}, so the program logic is set around ${getProgrammingStyleLabel(recommendedProgram.goal_key || recommendedProgram.goal, language) || "baseline progression"}.`
  );
  reasons.push(
    language === "fa"
      ? `${normalizedUser.training_days_per_week || "؟"} جلسه در هفته باعث شده split ${getSplitLabel(split.split_family, language) || split.split_family || "فعلی"} انتخاب شود.`
      : `${normalizedUser.training_days_per_week || "?"} training days per week led to selecting the ${getSplitLabel(split.split_family, language) || split.split_family || "current"} split.`
  );

  if (normalizedUser.session_duration <= 45) {
    adjustments.push(language === "fa"
      ? "مدت جلسه کوتاه‌تر است، پس حجم هر روز کمی جمع‌وجورتر نگه داشته شده."
      : "Session length is shorter, so daily volume is kept a bit more compact.");
  } else if (normalizedUser.session_duration >= 90) {
    adjustments.push(language === "fa"
      ? "مدت جلسه مناسب‌تر است، پس برنامه فضای بیشتری برای حرکات اصلی و ست‌های کامل‌تر دارد."
      : "Longer session length allows more room for main lifts and fuller working sets.");
  }

  if (normalizedUser.recovery_quality === "پایین") {
    adjustments.push(language === "fa"
      ? "به‌خاطر ریکاوری پایین، ساختار تمرین محافظه‌کارانه‌تر نگه داشته شده."
      : "Because recovery is low, the training structure is kept more conservative.");
  } else if (normalizedUser.recovery_quality === "بالا") {
    adjustments.push(language === "fa"
      ? "ریکاوری بهتر اجازه داده split و prescription کمی تهاجمی‌تر بمانند."
      : "Better recovery allows the split and prescription to stay slightly more aggressive.");
  }

  if ((normalizedUser.injury_or_limitation_flags || []).length > 0 && !normalizedUser.injury_or_limitation_flags.includes("ندارم")) {
    adjustments.push(
      language === "fa"
        ? `به‌خاطر محدودیت‌های ${getDisplayLimitations(normalizedUser.injury_or_limitation_flags, language)}, بعضی حرکت‌ها فیلتر یا جایگزین شده‌اند.`
        : `Because of limitations such as ${getDisplayLimitations(normalizedUser.injury_or_limitation_flags, language)}, some exercises were filtered or substituted.`
    );
  }

  if (split.notes?.length) {
    split.notes.forEach(note => adjustments.push(splitNoteToExplanation(note, language)));
  }

  nextChecks.push(
    language === "fa"
      ? "اگر پایبندی روزهای فعال پایین بماند، progression به‌جای افزایش به حالت تثبیت یا نگه‌داشتن بار می‌رود."
      : "If adherence on active days stays low, progression will move into consolidation or hold-load states instead of increasing."
  );
  nextChecks.push(
    language === "fa"
      ? "اگر ثبت‌ها کامل و پایدار باشند، app برای حرکت‌های اصلی افزایش تکرار یا وزنه را پیشنهاد می‌دهد."
      : "If logs stay complete and stable, the app will suggest rep or load increases for main exercises."
  );

  return { reasons, adjustments, nextChecks };
}

function splitNoteToExplanation(note, language = "fa") {
  return ({
    beginner_downgrade: language === "fa" ? "به‌خاطر سطح فعلی، split ساده‌تر انتخاب شده تا اجرای برنامه پایدار بماند." : "Because of the current level, a simpler split was selected to keep execution sustainable.",
    low_recovery_downgrade: language === "fa" ? "به‌خاطر ریکاوری پایین، ساختار تمرین سبک‌تر شده تا فشار اضافه جمع نشود." : "Because recovery is low, the structure was lightened so extra fatigue does not accumulate.",
    six_day_restricted: language === "fa" ? "حالت ۶ روزه برای این نسخه محدود شده تا loop فعلی قابل‌ریکاوری بماند." : "The 6-day mode is restricted in this version so the current loop stays recoverable.",
    short_session_adjusted: language === "fa" ? "به‌خاطر زمان محدود هر جلسه، ساختار انتخابی فشرده‌تر و عملی‌تر شده." : "Because session time is limited, the selected structure was made more compact and practical.",
    equipment_adjusted: language === "fa" ? "به‌خاطر محدودیت تجهیزات، انتخاب حرکت‌ها و ساختار روزها عملی‌تر شده است." : "Because of equipment limits, exercise selection and day structure were made more practical.",
  }[note] || note);
}

function getPrescriptionRepRange(exercise, goal) {
  if (!exercise) return "8-12";
  if (goal === "hypertrophy") {
    if (exercise.complexity === "isolation") return "10-15";
    if (exercise.movement_pattern === "hinge" || exercise.movement_pattern === "squat") return "6-10";
    return "8-12";
  }
  if (goal === "strength") {
    if (exercise.complexity === "isolation") return "6-10";
    if (exercise.movement_pattern === "hinge" || exercise.movement_pattern === "squat") return "3-5";
    return "4-6";
  }
  if (goal === "fat_loss") {
    if (exercise.complexity === "isolation") return "12-15";
    return "8-12";
  }
  if (goal === "recomposition") {
    if (exercise.complexity === "isolation") return "10-15";
    return "6-10";
  }
  return exercise.default_rep_range || "8-12";
}

function getPrescriptionRestRange(exercise, goal) {
  if (!exercise) return "60-90 ثانیه";
  if (goal === "hypertrophy") {
    return exercise.complexity === "isolation" ? "45-75 ثانیه" : "75-120 ثانیه";
  }
  if (goal === "strength") return exercise.complexity === "isolation" ? "60-90 ثانیه" : "120-180 ثانیه";
  if (goal === "fat_loss") return exercise.complexity === "isolation" ? "30-45 ثانیه" : "45-75 ثانیه";
  if (goal === "recomposition") return exercise.complexity === "isolation" ? "45-60 ثانیه" : "60-90 ثانیه";
  return exercise.default_rest_range || "60-90 ثانیه";
}

function getPrescriptionEffort(goal, trainingLevel) {
  if (goal === "hypertrophy") return trainingLevel === "beginner" ? "2-3 RIR" : "1-2 RIR";
  if (goal === "strength") return trainingLevel === "beginner" ? "2-3 RIR" : "1-2 RIR";
  if (goal === "fat_loss") return "2-4 RIR";
  if (goal === "recomposition") return trainingLevel === "beginner" ? "2-3 RIR" : "1-2 RIR";
  return "2 RIR";
}

function getPrescriptionSetCount(exercise, { goal, trainingLevel, recoveryQuality, sessionDuration, frequency }) {
  const isIsolation = exercise?.complexity === "isolation";
  let sets = isIsolation ? 2 : 3;

  if (goal === "hypertrophy") {
    sets = isIsolation ? 3 : 4;
  } else if (goal === "strength") {
    sets = isIsolation ? 2 : 4;
  } else if (goal === "fat_loss") {
    sets = isIsolation ? 2 : 3;
  } else if (goal === "recomposition") {
    sets = isIsolation ? 2 : 3;
  }

  if (trainingLevel === "beginner") sets -= 1;
  if (recoveryQuality === "low") sets -= 1;
  if ((Number(sessionDuration) || 60) <= 45) sets -= 1;
  if ((Number(frequency) || 3) >= 5 && !isIsolation && goal === "hypertrophy") sets -= 1;
  if ((Number(frequency) || 3) >= 5 && goal === "fat_loss") sets -= 1;

  return Math.max(isIsolation ? 2 : 3, sets);
}

function getHistoryAwarePrescriptionAdjustment(exercise, prescription, logs = [], user) {
  if (!exercise || !prescription || !logs.length) {
    return {
      sets: prescription?.sets || 0,
      rep_range: prescription?.rep_range || "8-12",
      rest_range: prescription?.rest_range || "60-90 ثانیه",
      effort: prescription?.effort || "2 RIR",
      progression_state: "baseline",
      adjustment_note: null,
    };
  }

  const normalizedUser = normalizePersistedUser(user);
  const trend = getProgressionTrend(logs);
  const cycle = getLongTermProgressionCycle(logs);
  const volumeManagement = getLongTermVolumeManagement(logs, normalizedUser, exercise);
  const isIsolation = exercise.complexity === "isolation";
  const minSets = isIsolation ? 2 : 3;
  let sets = Number(prescription.sets) || minSets;
  let rep_range = prescription.rep_range;
  let rest_range = prescription.rest_range;
  let effort = prescription.effort;
  let progression_state = "baseline";
  let adjustment_note = null;
  const repRange = parseRepRange(prescription.rep_range);
  const restRange = parseRestRange(prescription.rest_range);

  if (trend.needsDeload) {
    sets = Math.max(minSets, sets - 1);
    if (repRange.min && repRange.max) {
      rep_range = formatRepRange(repRange.min, Math.max(repRange.min, repRange.max - 2), prescription.rep_range);
    }
    if (restRange.min && restRange.max) {
      rest_range = formatRestRange(restRange.min + 30, restRange.max + 30, prescription.rest_range);
    }
    effort = "4-5 RIR";
    progression_state = "deload";
    adjustment_note = "به‌خاطر جمع‌شدن خستگی در چند جلسه اخیر، این حرکت موقتاً سبک‌تر شده تا کیفیت اجرا و ریکاوری برگردد.";
  } else if (trend.plateauRisk) {
    if (restRange.min && restRange.max && !isIsolation) {
      rest_range = formatRestRange(restRange.min + 15, restRange.max + 15, prescription.rest_range);
    }
    effort = "3 RIR";
    progression_state = "plateau_reset";
    adjustment_note = "این حرکت چند جلسه است روی یک سطح مانده، پس app فعلاً یک reset کنترل‌شده با فشار کمی پایین‌تر را ترجیح داده است.";
  } else if (trend.needsConsolidation) {
    sets = Math.max(minSets, sets - 1);
    if (repRange.min && repRange.max && repRange.max - repRange.min >= 2) {
      rep_range = formatRepRange(repRange.min, repRange.max - 1, prescription.rep_range);
    }
    if (restRange.min && restRange.max) {
      rest_range = formatRestRange(restRange.min + 15, restRange.max + 15, prescription.rest_range);
    }
    effort = "3-4 RIR";
    progression_state = "consolidate";
    adjustment_note = "به‌خاطر پایبندی پایین در چند جلسه اخیر، حجم و فشار این حرکت کمی محافظه‌کارانه‌تر شده تا اول اجرای تمیز تثبیت شود.";
  } else if (trend.stalled) {
    if (repRange.min && repRange.max && repRange.max - repRange.min >= 2 && !isIsolation) {
      rep_range = formatRepRange(repRange.min, repRange.max - 1, prescription.rep_range);
    }
    if (restRange.min && restRange.max && !isIsolation) {
      rest_range = formatRestRange(restRange.min + 15, restRange.max + 30, prescription.rest_range);
    }
    effort = "2-3 RIR";
    progression_state = "hold";
    adjustment_note = "به‌خاطر ایست نسبی در ثبت‌های اخیر، فشار این حرکت فعلاً تثبیت شده و کمی فضای ریکاوری بیشتری گرفته تا اجرای آن تمیزتر شود.";
  } else if (
    trend.trendLabel === "advancing" &&
    trend.averageAdherence !== null &&
    trend.averageAdherence >= 0.85 &&
    normalizeSplitRecovery(normalizedUser.recovery_quality) === "high" &&
    !isIsolation &&
    sets < 5
  ) {
    sets += 1;
    if (repRange.min && repRange.max && normalizeSplitGoal(normalizedUser.goal) !== "strength" && repRange.max < 20) {
      rep_range = formatRepRange(repRange.min + 1, repRange.max + 1, prescription.rep_range);
    }
    progression_state = "progress";
    adjustment_note = "به‌خاطر ثبت‌های پایدار اخیر و ریکاوری خوب، این حرکت کمی حجم بیشتری گرفته و بازه اجرای آن هم کمی جلوتر رفته است.";
  }

  if (cycle.phase === "intensify" && progression_state === "baseline") {
    sets = Math.max(minSets, sets - (isIsolation ? 0 : 1));
    if (restRange.min && restRange.max && !isIsolation) {
      rest_range = formatRestRange(restRange.min + 15, restRange.max + 15, rest_range);
    }
    effort = normalizeSplitGoal(normalizedUser.goal) === "strength" ? "1-2 RIR" : "1-2 RIR";
    progression_state = "intensify";
    adjustment_note = "چرخه اخیر این حرکت به فاز شدت رسیده، پس حجم کمی جمع‌تر شده تا اجرای قوی‌تر و بار مؤثرتر جلو برود.";
  } else if (cycle.phase === "accumulate" && progression_state === "baseline" && !isIsolation && sets < 5) {
    sets += 1;
    progression_state = "accumulate";
    adjustment_note = "چرخه اخیر این حرکت هنوز در فاز جمع‌کردن حجم است، پس یک ست بیشتر برای ساختن پایه پایدار نگه داشته شده.";
  } else if (cycle.phase === "reset" && progression_state === "baseline") {
    sets = Math.max(minSets, sets - 1);
    if (repRange.min && repRange.max) {
      rep_range = formatRepRange(repRange.min, Math.max(repRange.min, repRange.max - 1), rep_range);
    }
    effort = "3-4 RIR";
    progression_state = "cycle_reset";
    adjustment_note = "چرخه اخیر این حرکت به reset نیاز دارد، پس نسخه فعلاً کمی سبک‌تر شده تا از نو با کیفیت خوب جلو برود.";
  }

  if (volumeManagement.state === "volume_guard" && !["deload", "cycle_reset"].includes(progression_state)) {
    sets = Math.max(minSets, sets - 1);
    if (restRange.min && restRange.max) {
      rest_range = formatRestRange(restRange.min + 15, restRange.max + 15, rest_range);
    }
    if (repRange.min && repRange.max && repRange.max - repRange.min >= 2) {
      rep_range = formatRepRange(repRange.min, repRange.max - 1, rep_range);
    }
    effort = "3-4 RIR";
    progression_state = "volume_guard";
    adjustment_note = volumeManagement.note;
  } else if (
    volumeManagement.state === "volume_push" &&
    ["baseline", "accumulate", "progress"].includes(progression_state) &&
    sets < (isIsolation ? 4 : 5)
  ) {
    sets += 1;
    if (repRange.min && repRange.max && normalizeSplitGoal(normalizedUser.goal) !== "strength" && repRange.max < 20) {
      rep_range = formatRepRange(repRange.min + 1, repRange.max + 1, rep_range);
    }
    progression_state = "volume_push";
    adjustment_note = volumeManagement.note;
  }

  return {
    sets,
    rep_range,
    rest_range,
    effort,
    progression_state,
    adjustment_note,
    cycle_phase: cycle.phase,
    cycle_blocks: cycle.completedBlocks,
    volume_management_state: volumeManagement.state,
    average_recent_weekly_volume: volumeManagement.averageRecentWeeklyVolume,
    average_previous_weekly_volume: volumeManagement.averagePreviousWeeklyVolume,
  };
}

function buildExercisePrescription(exerciseName, user, goalOverride, frequencyOverride, logs = []) {
  const normalizedUser = normalizePersistedUser(user);
  const exercise = getExerciseByName(exerciseName);
  const goal = goalOverride || normalizeSplitGoal(normalizedUser.goal);
  const trainingLevel = normalizeSplitLevel(normalizedUser.training_level);
  const recoveryQuality = normalizeSplitRecovery(normalizedUser.recovery_quality);
  const sessionDuration = Number(normalizedUser.session_duration) || 60;
  const frequency = Number(frequencyOverride || normalizedUser.training_days_per_week) || 3;
  const basePrescription = {
    sets: getPrescriptionSetCount(exercise, { goal, trainingLevel, recoveryQuality, sessionDuration, frequency }),
    rep_range: getPrescriptionRepRange(exercise, goal),
    rest_range: getPrescriptionRestRange(exercise, goal),
    effort: getPrescriptionEffort(goal, trainingLevel),
  };
  const historyLogs = logs.filter(log => log.name === exerciseName).slice(0, 5);
  const longHistoryLogs = logs.filter(log => log.name === exerciseName).slice(0, 12);
  const adjustment = getHistoryAwarePrescriptionAdjustment(exercise, basePrescription, longHistoryLogs, normalizedUser);

  return {
    name: exerciseName,
    sets: adjustment.sets,
    rep_range: adjustment.rep_range,
    rest_range: adjustment.rest_range,
    effort: adjustment.effort,
    programming_focus: PROGRAMMING_STYLE_LABELS[goal] || "پیشروی پایه",
    progression_state: adjustment.progression_state,
    adjustment_note: adjustment.adjustment_note,
    cycle_phase: adjustment.cycle_phase,
    cycle_blocks: adjustment.cycle_blocks,
    volume_management_state: adjustment.volume_management_state,
    average_recent_weekly_volume: adjustment.average_recent_weekly_volume,
    average_previous_weekly_volume: adjustment.average_previous_weekly_volume,
  };
}

function normalizeSplitGoal(value) {
  return ({
    "حجم": "hypertrophy",
    "حجم عضلانی": "hypertrophy",
    "چربی‌سوزی": "fat_loss",
    "کات": "fat_loss",
    "قدرت": "strength",
    "ریکامپوزیشن": "recomposition",
    "فیتنس": "recomposition",
    "سلامت": "recomposition",
  }[value] || "hypertrophy");
}

function normalizeSplitLevel(value) {
  return ({
    "beginner": "beginner",
    "intermediate": "intermediate",
    "advanced": "advanced",
    "مبتدی": "beginner",
    "متوسط": "intermediate",
    "پیشرفته": "advanced",
  }[value] || "beginner");
}

function normalizeSplitRecovery(recoveryQuality, sleepQuality, stressLevel) {
  if (recoveryQuality) {
    return ({
      low: "low",
      medium: "medium",
      high: "high",
      "پایین": "low",
      "متوسط": "medium",
      "بالا": "high",
    }[recoveryQuality] || "medium");
  }
  if (sleepQuality === "ضعیف" || stressLevel === "زیاد") return "low";
  if (sleepQuality === "عالی" || sleepQuality === "خوب" || stressLevel === "کم") return "high";
  return "medium";
}

function normalizeSplitEquipment(value) {
  const first = Array.isArray(value) ? value[0] : value;
  return ({
    full_gym: "full_gym",
    home_gym: "home_gym",
    dumbbells_bands: "dumbbells_bands",
    bodyweight: "bodyweight",
    "باشگاه": "full_gym",
    "باشگاه کامل": "full_gym",
    "خانه": "home_gym",
    "هوم جیم": "home_gym",
    "ترکیبی": "dumbbells_bands",
    "دمبل و کش": "dumbbells_bands",
    "فضای باز": "bodyweight",
    "وزن بدن": "bodyweight",
  }[first] || "full_gym");
}

function chooseSplit({
  goal,
  training_level,
  training_days_per_week,
  recovery_quality,
  session_duration,
  equipment_access,
}) {
  const frequency = Math.min(6, Math.max(3, Number(training_days_per_week) || 3));
  const notes = [];
  let split_family = "full_body";

  if (goal === "hypertrophy") {
    split_family = frequency <= 3 ? "full_body" : frequency === 4 ? "upper_lower" : "ppl";
  } else if (goal === "fat_loss") {
    split_family = frequency <= 3 ? "full_body" : "upper_lower";
  } else if (goal === "strength") {
    split_family = frequency <= 3 ? "full_body" : frequency === 4 ? "upper_lower" : "strength_split";
  } else if (goal === "recomposition") {
    split_family = frequency <= 3 ? "full_body" : "upper_lower";
  }

  let downgrade_applied = false;
  const downgrade = (next, note) => {
    if (split_family !== next) {
      split_family = next;
      downgrade_applied = true;
    }
    if (note && !notes.includes(note)) notes.push(note);
  };

  if (training_level === "beginner") {
    if (split_family === "ppl" || split_family === "strength_split") downgrade("upper_lower", "beginner_downgrade");
    if (frequency >= 6) downgrade("upper_lower", "six_day_restricted");
  }

  if (recovery_quality === "low") {
    if (split_family === "ppl" || split_family === "strength_split") downgrade("upper_lower", "low_recovery_downgrade");
    else if (split_family === "upper_lower" && frequency >= 5) downgrade("full_body", "low_recovery_downgrade");
  }

  if (goal === "recomposition" && frequency >= 6) downgrade("upper_lower", "six_day_restricted");
  if (goal === "fat_loss" && frequency >= 6) downgrade("upper_lower", "six_day_restricted");
  if (goal === "strength" && frequency >= 6) downgrade("upper_lower", "six_day_restricted");

  if ((Number(session_duration) || 60) <= 30 && frequency >= 5 && split_family !== "full_body") {
    downgrade("upper_lower", "short_session_adjusted");
  }

  if (equipment_access === "bodyweight" && split_family === "strength_split") {
    downgrade("upper_lower", "equipment_adjusted");
  }

  return {
    split_family,
    frequency,
    goal,
    downgrade_applied,
    notes,
  };
}

function buildRecommendedProgram(user, logs = []) {
  const normalizedUser = normalizePersistedUser(user);
  const filteredPool = filterExercisesForUser(EXERCISES, normalizedUser);
  const split = chooseSplit({
    goal: normalizeSplitGoal(normalizedUser.goal),
    training_level: normalizeSplitLevel(normalizedUser.training_level),
    training_days_per_week: normalizedUser.training_days_per_week,
    recovery_quality: normalizeSplitRecovery(normalizedUser.recovery_quality),
    session_duration: normalizedUser.session_duration,
    equipment_access: normalizeSplitEquipment(normalizedUser.equipment_access),
  });

  const goalLabel = GOAL_LABELS[split.goal] || "حجم عضلانی";

  const templates = {
    full_body: [
      { day: "روز A", exercises: ["اسکوات", "پرس سینه", "پول‌آپ", "پلانک"] },
      { day: "روز B", exercises: ["ددلیفت", "پرس سرشانه", "جلو بازو", "کرانچ"] },
      { day: "روز C", exercises: ["لانج", "پرس پا", "پشت بازو سیمکش", "پلانک"] },
    ],
    upper_lower: [
      { day: "بالاتنه ۱", exercises: ["پرس سینه", "پول‌آپ", "پرس سرشانه", "جلو بازو"] },
      { day: "پایین‌تنه ۱", exercises: ["اسکوات", "پرس پا", "رومانیایی", "پلانک"] },
      { day: "بالاتنه ۲", exercises: ["پرس سینه", "پول‌آپ", "پشت بازو سیمکش", "جلو بازو"] },
      { day: "پایین‌تنه ۲", exercises: ["ددلیفت", "لانج", "رومانیایی", "کرانچ"] },
      { day: "فول‌بادی سبک", exercises: ["اسکوات", "پرس سرشانه", "پول‌آپ", "پلانک"] },
    ],
    ppl: [
      { day: "Push", exercises: ["پرس سینه", "پرس سرشانه", "پشت بازو سیمکش"] },
      { day: "Pull", exercises: ["پول‌آپ", "ددلیفت", "جلو بازو"] },
      { day: "Legs", exercises: ["اسکوات", "پرس پا", "لانج", "رومانیایی"] },
      { day: "Push ۲", exercises: ["پرس سینه", "پرس سرشانه", "پشت بازو سیمکش"] },
      { day: "Pull ۲", exercises: ["پول‌آپ", "جلو بازو", "پلانک"] },
      { day: "Legs ۲", exercises: ["اسکوات", "پرس پا", "رومانیایی", "کرانچ"] },
    ],
    strength_split: [
      { day: "Squat Day", exercises: ["اسکوات", "پرس پا", "پلانک"] },
      { day: "Bench Day", exercises: ["پرس سینه", "پرس سرشانه", "پشت بازو سیمکش"] },
      { day: "Pull Day", exercises: ["پول‌آپ", "جلو بازو", "کرانچ"] },
      { day: "Hinge Day", exercises: ["ددلیفت", "رومانیایی", "پلانک"] },
      { day: "Press Day", exercises: ["پرس سرشانه", "پرس سینه", "لانج"] },
    ],
  };

  const days = templates[split.split_family]
    .slice(0, split.frequency)
    .map(day => ({
      ...day,
      exercises: day.exercises.map(ex => substituteExercise(ex, user, filteredPool)),
    }))
    .map(day => ({
      ...day,
      prescriptions: day.exercises.map(exerciseName =>
        buildExercisePrescription(exerciseName, normalizedUser, split.goal, split.frequency, logs)
      ),
    }));
  return {
    id: "recommended",
    isRecommended: true,
    name: `پیشنهاد هوشمند — ${SPLIT_LABELS[split.split_family]} ${split.frequency} روزه`,
    training_level: normalizeSplitLevel(normalizedUser.training_level),
    goal_key: split.goal,
    goal: goalLabel,
    programming_style: PROGRAMMING_STYLE_LABELS[split.goal] || "پیشروی پایه",
    programming_cue: PROGRAMMING_CUE_LABELS[split.goal] || "",
    split,
    days,
  };
}

function buildStaticProgram(program, user, logs = []) {
  const normalizedUser = normalizePersistedUser(user);
  const filteredPool = filterExercisesForUser(EXERCISES, normalizedUser);
  const goalKey = program.goal_key || normalizeSplitGoal(program.goal);
  const frequency = program.days.length;
  const personalizedDays = program.days.map(day => ({
    ...day,
    exercises: day.exercises.map(exerciseName => substituteExercise(exerciseName, normalizedUser, filteredPool)),
  })).map(day => ({
    ...day,
    prescriptions: day.exercises.map(exerciseName =>
      buildExercisePrescription(
        exerciseName,
        { ...normalizedUser, goal: GOAL_LABELS[goalKey] || normalizedUser.goal, training_level: LEVEL_LABELS[program.training_level] || normalizedUser.training_level },
        goalKey,
        frequency,
        logs
      )
    ),
  }));

  return {
    ...program,
    goal_key: goalKey,
    goal: GOAL_LABELS[goalKey] || program.goal,
    programming_style: PROGRAMMING_STYLE_LABELS[goalKey] || "پیشروی پایه",
    programming_cue: PROGRAMMING_CUE_LABELS[goalKey] || "",
    split: {
      split_family: frequency <= 3 ? "full_body" : frequency === 4 ? "upper_lower" : goalKey === "strength" ? "strength_split" : "ppl",
      frequency,
      goal: goalKey,
      downgrade_applied: false,
      notes: [],
    },
    days: personalizedDays,
  };
}

const PROGRAMS = [
  {
    id: 1, name: "پایه قدرت — ۳ روز", training_level: "beginner", goal_key: "strength", goal: "قدرت",
    days: [
      { day: "روز A", exercises: ["اسکوات", "پرس سینه", "پول‌آپ"] },
      { day: "روز B", exercises: ["ددلیفت", "پرس سرشانه", "جلو بازو"] },
      { day: "روز C", exercises: ["لانج", "رومانیایی", "پلانک"] },
    ]
  },
  {
    id: 2, name: "Push Pull Legs — ۶ روز", training_level: "intermediate", goal_key: "hypertrophy", goal: "حجم عضلانی",
    days: [
      { day: "Push", exercises: ["پرس سینه", "پرس سرشانه", "پشت بازو سیمکش"] },
      { day: "Pull", exercises: ["پول‌آپ", "ددلیفت", "جلو بازو"] },
      { day: "Legs", exercises: ["اسکوات", "پرس پا", "لانج", "رومانیایی"] },
    ]
  },
  {
    id: 3, name: "فول‌بادی — ۴ روز", training_level: "advanced", goal_key: "fat_loss", goal: "چربی‌سوزی",
    days: [
      { day: "روز ۱", exercises: ["اسکوات", "پرس سینه", "پول‌آپ", "پلانک"] },
      { day: "روز ۲", exercises: ["ددلیفت", "پرس سرشانه", "جلو بازو", "کرانچ"] },
      { day: "روز ۳", exercises: ["لانج", "پرس پا", "پشت بازو سیمکش"] },
      { day: "روز ۴", exercises: ["رومانیایی", "پول‌آپ", "پرس سینه", "پلانک"] },
    ]
  },
];

const FOODS = [
  { name: "مرغ آب‌پز ۱۰۰گ", cal: 165, p: 31, c: 0, f: 3.6 },
  { name: "برنج سفید ۱۰۰گ", cal: 130, p: 2.7, c: 28, f: 0.3 },
  { name: "تخم‌مرغ (۱ عدد)", cal: 78, p: 6, c: 0.6, f: 5 },
  { name: "نان سنگک ۱۰۰گ", cal: 249, p: 9, c: 50, f: 1.5 },
  { name: "ماست ۱۰۰گ", cal: 61, p: 3.5, c: 4.7, f: 3.3 },
  { name: "کدو ۱۰۰گ", cal: 17, p: 1.2, c: 3.1, f: 0.2 },
  { name: "پنیر ۳۰گ", cal: 80, p: 5, c: 1, f: 6 },
  { name: "موز (۱ عدد)", cal: 89, p: 1.1, c: 23, f: 0.3 },
  { name: "آجیل مخلوط ۳۰گ", cal: 180, p: 5, c: 6, f: 16 },
  { name: "شیر ۲۰۰ml", cal: 122, p: 6.4, c: 9.6, f: 5.6 },
];

function getFoodDisplayName(food, language = "fa") {
  const rawName = typeof food === "string" ? food : food?.name;
  if (!rawName) return "";
  if (language === "fa") return rawName;
  const map = {
    "مرغ آب‌پز ۱۰۰گ": "Boiled Chicken 100g",
    "برنج سفید ۱۰۰گ": "White Rice 100g",
    "تخم‌مرغ (۱ عدد)": "Egg (1 piece)",
    "نان سنگک ۱۰۰گ": "Sangak Bread 100g",
    "ماست ۱۰۰گ": "Yogurt 100g",
    "کدو ۱۰۰گ": "Zucchini 100g",
    "پنیر ۳۰گ": "Cheese 30g",
    "موز (۱ عدد)": "Banana (1 piece)",
    "آجیل مخلوط ۳۰گ": "Mixed Nuts 30g",
    "شیر ۲۰۰ml": "Milk 200ml",
  };
  return map[rawName] || rawName;
}

// ══════════════════════════════════════════════════════
// GAMIFICATION ENGINE
// ══════════════════════════════════════════════════════
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

function getGameData(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(GAMIF_KEY) || "{}");
    return all[userId] || { xp: 0, level: 1, streak: 0, lastWorkoutDate: null, totalWorkouts: 0, totalSets: 0, badges: [], weeklyXP: [] };
  } catch { return { xp: 0, level: 1, streak: 0, lastWorkoutDate: null, totalWorkouts: 0, totalSets: 0, badges: [], weeklyXP: [] }; }
}

function saveGameData(userId, data) {
  try {
    const all = JSON.parse(localStorage.getItem(GAMIF_KEY) || "{}");
    all[userId] = data;
    localStorage.setItem(GAMIF_KEY, JSON.stringify(all));
  } catch {}
}

function getLevelInfo(xp) {
  return LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1];
}

function calcXPForWorkout(sets) {
  const base = 80;
  const bonus = sets * 8;
  return base + bonus;
}

function updateStreak(gameData) {
  const today = new Date().toDateString();
  const lastDate = gameData.lastWorkoutDate;
  if (lastDate === today) return gameData.streak;
  if (!lastDate) return 1;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return lastDate === yesterday ? gameData.streak + 1 : 1;
}

function checkNewBadges(gameData) {
  const earned = gameData.badges || [];
  return BADGES.filter(b => !earned.includes(b.id) && b.condition(gameData));
}

// ── Gamification Popup ──────────────────────────────────────────────────────
function WorkoutCompletePopup({ result, onClose, dark }) {
  const [animStep, setAnimStep] = useState(0);
  const accent = "#e8ff00";
  const completionExplanation = getCompletionGuidanceExplanation(result);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStep(1), 100);
    const t2 = setTimeout(() => setAnimStep(2), 600);
    const t3 = setTimeout(() => setAnimStep(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const levelInfo = getLevelInfo(result.newXP);
  const prevLevelInfo = getLevelInfo(result.newXP - result.xpEarned);
  const leveledUp = levelInfo.level > prevLevelInfo.level;
  const xpProgress = ((result.newXP - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100;
  const completionPercent = result.day_total_exercises
    ? Math.round((result.day_completed_exercises / result.day_total_exercises) * 100)
    : null;
  const prescriptionAdherence = typeof result.prescription_adherence === "number"
    ? Math.round(result.prescription_adherence * 100)
    : null;
  const guidanceToneStyles = {
    recovery: {
      background: dark ? "#1d1400" : "#fff6df",
      border: "1px solid #b88400",
      label: dark ? "#ffd36a" : "#9a6500",
    },
    steady: {
      background: dark ? "#111a24" : "#eef7ff",
      border: "1px solid #2f6ea5",
      label: dark ? "#8fbbe8" : "#2f6ea5",
    },
    strong: {
      background: dark ? "#101600" : "#f4ffe7",
      border: `1px solid ${accent}66`,
      label: dark ? "#d7ff76" : "#708900",
    },
    neutral: {
      background: dark ? "#171717" : "#f5f5f5",
      border: `1px solid ${dark ? "#2a2a2a" : "#ddd"}`,
      label: dark ? "#bbb" : "#555",
    },
  };
  const guidanceTone = guidanceToneStyles[result.guidance_tone || "neutral"] || guidanceToneStyles.neutral;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Vazirmatn','Tahoma',sans-serif", direction: "rtl", padding: 20,
      overflowY: "auto",
    }}>
      <div style={{
        background: dark ? "#111" : "#fff",
        border: `2px solid ${leveledUp ? accent : "#2a2a2a"}`,
        borderRadius: 24, padding: 28, maxWidth: 360, width: "100%",
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        transform: animStep >= 1 ? "scale(1)" : "scale(0.8)",
        opacity: animStep >= 1 ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: leveledUp ? `0 0 60px ${accent}44` : "0 0 40px rgba(0,0,0,0.5)",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 6 }}>
            {leveledUp ? "🎉" : "💪"}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: dark ? "#f0f0f0" : "#111" }}>
            {leveledUp ? "لول آپ! 🚀" : "تمرین کامل شد!"}
          </div>
          {leveledUp && (
            <div style={{ fontSize: 14, color: accent, fontWeight: 700, marginTop: 4 }}>
              به {levelInfo.title} رسیدی!
            </div>
          )}
        </div>

        {/* XP Earned */}
        <div style={{
          background: dark ? "#1a1a1a" : "#f5f5f5",
          borderRadius: 14, padding: "14px 18px", marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: animStep >= 2 ? 1 : 0,
          transform: animStep >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.4s ease 0.1s"
        }}>
          <span style={{ color: dark ? "#888" : "#666", fontSize: 14 }}>XP کسب‌شده</span>
          <span style={{ color: accent, fontSize: 24, fontWeight: 900 }}>+{result.xpEarned} XP</span>
        </div>

        {result.program_name && (
          <div style={{
            background: dark ? "#101600" : "#f7ffe8",
            border: `1px solid ${accent}66`,
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 14,
            opacity: animStep >= 2 ? 1 : 0,
            transform: animStep >= 2 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease 0.15s"
          }}>
            <div style={{ fontSize: 13, color: dark ? "#888" : "#666", marginBottom: 4 }}>جلسه کامل‌شده</div>
            <div style={{ fontWeight: 800, color: dark ? "#f0f0f0" : "#111", marginBottom: 4 }}>{result.program_name}</div>
            {result.day_name && (
              <div style={{ fontSize: 13, color: accent, fontWeight: 700, marginBottom: result.next_day_name ? 4 : 0 }}>
                {result.day_name}
              </div>
            )}
            {result.next_day_name && (
              <div style={{ fontSize: 12, color: dark ? "#888" : "#666" }}>
                جلسه بعدی آماده شد: {result.next_day_name}
              </div>
            )}
          </div>
        )}

        <div style={{
          background: dark ? "#161616" : "#f8f8f8",
          borderRadius: 14, padding: "14px 18px", marginBottom: 14,
          opacity: animStep >= 2 ? 1 : 0,
          transform: animStep >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.4s ease 0.18s"
        }}>
          <div style={{ fontSize: 13, color: dark ? "#888" : "#666", marginBottom: 10 }}>خلاصه جلسه</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "حرکت منحصربه‌فرد", val: result.unique_exercises || 0 },
              { label: "حجم تقریبی", val: result.session_volume || 0 },
              { label: "ست ثبت‌شده", val: result.completed_sets || 0 },
              { label: "پوشش روز فعال", val: completionPercent !== null ? `${completionPercent}%` : "—" },
            ].map((item, i) => (
              <div key={i} style={{ background: dark ? "#1d1d1d" : "#fff", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: accent }}>{item.val}</div>
                <div style={{ fontSize: 11, color: dark ? "#666" : "#999" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Progress */}
        <div style={{
          background: dark ? "#1a1a1a" : "#f5f5f5",
          borderRadius: 14, padding: "14px 18px", marginBottom: 14,
          opacity: animStep >= 2 ? 1 : 0,
          transform: animStep >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.4s ease 0.2s"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: levelInfo.color, fontWeight: 800, fontSize: 15 }}>
              Level {levelInfo.level} — {levelInfo.title}
            </span>
            <span style={{ color: dark ? "#666" : "#999", fontSize: 12 }}>{result.newXP} XP</span>
          </div>
          <div style={{ height: 8, background: dark ? "#2a2a2a" : "#ddd", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${xpProgress}%`,
              background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}88)`,
              borderRadius: 4, transition: "width 1s ease 0.5s",
              boxShadow: `0 0 8px ${levelInfo.color}66`
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: dark ? "#555" : "#aaa" }}>
            <span>{levelInfo.minXP}</span>
            <span>{levelInfo.maxXP} XP</span>
          </div>
        </div>

        {/* Streak */}
        <div style={{
          background: result.newStreak >= 3 ? "#1a0e00" : (dark ? "#1a1a1a" : "#f5f5f5"),
          border: result.newStreak >= 3 ? "1px solid #f8440044" : "none",
          borderRadius: 14, padding: "14px 18px", marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: animStep >= 2 ? 1 : 0,
          transform: animStep >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.4s ease 0.3s"
        }}>
          <span style={{ color: dark ? "#888" : "#666", fontSize: 14 }}>Streak روزانه</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: result.newStreak >= 3 ? "#ff6600" : (dark ? "#f0f0f0" : "#111") }}>
            🔥 {result.newStreak} روز
          </span>
        </div>

        {/* New Badges */}
        {result.newBadges.length > 0 && (
          <div style={{
            background: dark ? "#0a1500" : "#f0fff0",
            border: "1px solid #2a4a1a",
            borderRadius: 14, padding: "14px 18px", marginBottom: 14,
            opacity: animStep >= 3 ? 1 : 0,
            transform: animStep >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease 0.4s"
          }}>
            <div style={{ fontSize: 13, color: "#6a0", fontWeight: 700, marginBottom: 10 }}>🏅 نشان جدید!</div>
            {result.newBadges.map(b => (
              <div key={b.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: dark ? "#f0f0f0" : "#111" }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: dark ? "#888" : "#666" }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {result.next_step && (
          <div style={{
            background: guidanceTone.background,
            border: guidanceTone.border,
            borderRadius: 14, padding: "12px 16px", marginBottom: 14,
            opacity: animStep >= 3 ? 1 : 0,
            transform: animStep >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease 0.45s"
          }}>
            <div style={{ fontSize: 12, color: guidanceTone.label, marginBottom: 4 }}>
              {result.guidance_title || "قدم بعدی"}
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: dark ? "#f0f0f0" : "#111" }}>{result.next_step}</div>
            {completionExplanation && (
              <div style={{ fontSize: 12, color: dark ? "#9aa3ad" : "#4f5a66", marginTop: 8, lineHeight: 1.8 }}>
                {completionExplanation}
              </div>
            )}
          </div>
        )}

        {prescriptionAdherence !== null && (
          <div style={{
            background: dark ? "#16131f" : "#f5efff",
            border: "1px solid #6d4cc2",
            borderRadius: 14, padding: "12px 16px", marginBottom: 14,
            opacity: animStep >= 3 ? 1 : 0,
            transform: animStep >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.4s ease 0.48s"
          }}>
            <div style={{ fontSize: 12, color: dark ? "#b8a7ee" : "#6d4cc2", marginBottom: 4 }}>پایبندی به نسخه تمرین</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: dark ? "#f0f0f0" : "#111" }}>
              {prescriptionAdherence}% از prescription روز فعال ثبت شد
              {result.prescription_summary ? ` · ${result.prescription_summary}` : ""}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20,
          opacity: animStep >= 3 ? 1 : 0,
          transition: "all 0.4s ease 0.5s"
        }}>
          {[
            { label: "ست‌ها", val: result.sets },
            { label: "کل تمرین", val: result.totalWorkouts },
            { label: "کل XP", val: result.newXP },
          ].map((item, i) => (
            <div key={i} style={{ background: dark ? "#1a1a1a" : "#f5f5f5", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: accent }}>{item.val}</div>
              <div style={{ fontSize: 11, color: dark ? "#666" : "#999" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: "100%", background: accent, color: "#000", border: "none",
          borderRadius: 12, padding: 14, fontFamily: "inherit", fontWeight: 900, fontSize: 16, cursor: "pointer"
        }}>
          💪 ادامه بده!
        </button>
      </div>
    </div>
  );
}

// ── Leaderboard ─────────────────────────────────────────────────────────────
function LeaderboardTab({ dark, currentUser, gameData, language = "fa" }) {
  const accent = "#e8ff00";
  const mockUsers = [
    { name: language === "fa" ? "علی رضایی" : "Ali Rezaei", xp: 4250, streak: 14, level: 5 },
    { name: language === "fa" ? "سارا محمدی" : "Sara Mohammadi", xp: 3800, streak: 21, level: 4 },
    { name: language === "fa" ? "محمد کریمی" : "Mohammad Karimi", xp: 3200, streak: 8, level: 4 },
    { name: currentUser.name, xp: gameData.xp, streak: gameData.streak, level: gameData.level, isMe: true },
    { name: language === "fa" ? "نیما احمدی" : "Nima Ahmadi", xp: 2100, streak: 5, level: 3 },
    { name: language === "fa" ? "فاطمه حسینی" : "Fatemeh Hosseini", xp: 1800, streak: 3, level: 3 },
    { name: language === "fa" ? "رضا تهرانی" : "Reza Tehrani", xp: 1200, streak: 0, level: 2 },
  ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));

  const s = {
    card: { background: dark ? "#141414" : "#fff", border: `1px solid ${dark ? "#2a2a2a" : "#eee"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 },
  };

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>{language === "fa" ? "🏆 لیدربورد هفتگی" : "🏆 Weekly Leaderboard"}</div>
      {mockUsers.map((u) => (
        <div key={u.name} style={{
          ...s.card,
          background: u.isMe ? (dark ? "#0f1a00" : "#f0fff0") : (dark ? "#141414" : "#fff"),
          border: u.isMe ? `2px solid ${accent}` : `1px solid ${dark ? "#2a2a2a" : "#eee"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: u.rank <= 3 ? ["#ffd700", "#c0c0c0", "#cd7f32"][u.rank - 1] : (dark ? "#2a2a2a" : "#eee"),
              fontWeight: 900, fontSize: u.rank <= 3 ? 18 : 14,
              color: u.rank <= 3 ? "#000" : (dark ? "#888" : "#666"),
            }}>
              {u.rank <= 3 ? ["🥇", "🥈", "🥉"][u.rank - 1] : u.rank}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: u.isMe ? accent : (dark ? "#f0f0f0" : "#111") }}>
                {u.name} {u.isMe && (language === "fa" ? "(من)" : "(You)")}
              </div>
              <div style={{ fontSize: 12, color: dark ? "#666" : "#999" }}>
                {language === "fa" ? `Level ${u.level} · 🔥 ${u.streak} روز` : `Level ${u.level} · 🔥 ${u.streak} days`}
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 900, color: accent, fontSize: 16 }}>{u.xp.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: dark ? "#555" : "#aaa" }}>XP</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => normalizePersistedUser(getSession()));
  const [language, setLanguage] = useState(getInitialLanguage);
  useEffect(() => {
    saveLanguage(language);
  }, [language]);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);
  if (!user) return <AuthScreen onLogin={setUser} language={language} setLanguage={setLanguage} />;
  return <GymApp user={user} onLogout={() => { clearSession(); setUser(null); }} language={language} setLanguage={setLanguage} />;
}


function GymApp({ user, onLogout, language = "fa", setLanguage = () => {} }) {
  const runtimeUser = normalizePersistedUser(user);
  const persistedActivePlanRef = useRef(getActivePlan(user.id));
  const defaultProgressData = [
    { date: "۱۴۰۳/۱/۱", weight: 80 }, { date: "۱۴۰۳/۱/۸", weight: 79.5 },
    { date: "۱۴۰۳/۱/۱۵", weight: 79 }, { date: "۱۴۰۳/۱/۲۲", weight: 78.2 },
    { date: "۱۴۰۳/۲/۱", weight: 77.8 }, { date: "۱۴۰۳/۲/۸", weight: 77.1 },
  ];
  const [tab, setTab] = useState("home");
  const [dark, setDark] = useState(true);
  const [searchEx, setSearchEx] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("همه");
  const [selectedEx, setSelectedEx] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState(() => sanitizeWorkoutLog(getPerUserData(WORKOUT_LOG_KEY, user.id, [])));
  const [workoutLog, setWorkoutLog] = useState(() => sanitizeWorkoutLog(getPerUserData(ACTIVE_WORKOUT_KEY, user.id, [])));
  const [activeSet, setActiveSet] = useState({ name: "", weight: "", reps: "", sets: "" });
  const [logFeedback, setLogFeedback] = useState(null);
  const [restTimer, setRestTimer] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const timerRef = useRef(null);
  const [progressData, setProgressData] = useState(() => sanitizeProgressData(getPerUserData(PROGRESS_DATA_KEY, user.id, defaultProgressData), defaultProgressData));
  const [newWeight, setNewWeight] = useState("");
  const [foodLog, setFoodLog] = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [profileNotifications, setProfileNotifications] = useState({ workout: true, nutrition: true });
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [gameData, setGameData] = useState(() => getGameData(user.id));
  const [workoutPopup, setWorkoutPopup] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProgramDay, setSelectedProgramDay] = useState(persistedActivePlanRef.current?.selectedDay || 0);
  const [progressionTestScenario, setProgressionTestScenario] = useState(null);
  const [workoutCategoryFilter, setWorkoutCategoryFilter] = useState("all");
  const userProfile = {
    name: runtimeUser.name,
    goal: runtimeUser.goal,
    training_level: runtimeUser.training_level,
    sex: runtimeUser.sex,
    training_days_per_week: runtimeUser.training_days_per_week,
    session_duration: runtimeUser.session_duration,
    equipment_access: runtimeUser.equipment_access,
    recovery_quality: runtimeUser.recovery_quality,
    injury_or_limitation_flags: runtimeUser.injury_or_limitation_flags,
  };

  const levelInfo = getLevelInfo(gameData.xp);
  const xpProgress = ((gameData.xp - levelInfo.minXP) / (levelInfo.maxXP - levelInfo.minXP)) * 100;
  const allWorkoutLogs = [...workoutLog, ...workoutHistory];
  const sortedWorkoutLog = [...allWorkoutLogs].sort((a, b) => (Number(b.created_at) || 0) - (Number(a.created_at) || 0));
  const sortedWorkoutHistory = [...workoutHistory].sort((a, b) => (Number(b.created_at) || 0) - (Number(a.created_at) || 0));
  const progressLogs = sortedWorkoutHistory;
  const sessionKeyOf = (log) => log.created_at ? new Date(log.created_at).toDateString() : `${log.date}-${log.program_name || "free"}`;
  const uniqueSessionKeys = [...new Set(progressLogs.map(sessionKeyOf))];
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklySessionKeys = [
    ...new Set(
      progressLogs
        .filter(log => log.created_at ? Number(log.created_at) >= sevenDaysAgo : true)
        .map(sessionKeyOf)
    )
  ];
  const totalLoggedVolume = progressLogs.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0);
  const uniqueLoggedExercises = new Set(progressLogs.map(log => log.name)).size;
  const latestSessionKey = progressLogs[0] ? sessionKeyOf(progressLogs[0]) : null;
  const latestSessionEntries = latestSessionKey ? progressLogs.filter(log => sessionKeyOf(log) === latestSessionKey) : [];
  const latestSessionVolume = latestSessionEntries.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0);
  const latestSessionExercises = new Set(latestSessionEntries.map(log => log.name)).size;
  const sessionAdherenceMap = uniqueSessionKeys.reduce((acc, sessionKey) => {
    const sessionEntries = progressLogs.filter(log => sessionKeyOf(log) === sessionKey);
    const prescriptionTargets = sessionEntries
      .filter(log => log.prescribed_sets)
      .reduce((map, log) => {
        if (!map[log.name]) map[log.name] = Number(log.prescribed_sets) || 0;
        return map;
      }, {});
    const targetTotal = Object.values(prescriptionTargets).reduce((sum, sets) => sum + sets, 0);
    const completedTotal = Object.entries(prescriptionTargets).reduce((sum, [name, targetSets]) => {
      const loggedSets = sessionEntries
        .filter(log => log.name === name)
        .reduce((acc, log) => acc + (Number(log.sets) || 1), 0);
      return sum + Math.min(targetSets, loggedSets);
    }, 0);
    acc[sessionKey] = targetTotal ? completedTotal / targetTotal : null;
    return acc;
  }, {});
  const adherenceValues = Object.values(sessionAdherenceMap).filter(value => typeof value === "number");
  const averagePrescriptionAdherence = adherenceValues.length
    ? Math.round((adherenceValues.reduce((sum, value) => sum + value, 0) / adherenceValues.length) * 100)
    : null;
  const latestSessionAdherence = latestSessionKey && typeof sessionAdherenceMap[latestSessionKey] === "number"
    ? Math.round(sessionAdherenceMap[latestSessionKey] * 100)
    : null;
  const recentSessionKeys = uniqueSessionKeys.slice(0, 3);
  const previousSessionKeys = uniqueSessionKeys.slice(3, 6);
  const recentSessionEntries = progressLogs.filter(log => recentSessionKeys.includes(sessionKeyOf(log)));
  const previousSessionEntries = progressLogs.filter(log => previousSessionKeys.includes(sessionKeyOf(log)));
  const recentAdherenceValues = recentSessionKeys
    .map(key => sessionAdherenceMap[key])
    .filter(value => typeof value === "number");
  const previousAdherenceValues = previousSessionKeys
    .map(key => sessionAdherenceMap[key])
    .filter(value => typeof value === "number");
  const recentAverageAdherence = recentAdherenceValues.length
    ? Math.round((recentAdherenceValues.reduce((sum, value) => sum + value, 0) / recentAdherenceValues.length) * 100)
    : null;
  const previousAverageAdherence = previousAdherenceValues.length
    ? Math.round((previousAdherenceValues.reduce((sum, value) => sum + value, 0) / previousAdherenceValues.length) * 100)
    : null;
  const adherenceTrendDirection = getTrendDirection(recentAverageAdherence, previousAverageAdherence, 1);
  const recentAverageVolume = recentSessionKeys.length
    ? Math.round(recentSessionEntries.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0) / recentSessionKeys.length)
    : 0;
  const previousAverageVolume = previousSessionKeys.length
    ? Math.round(previousSessionEntries.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0) / previousSessionKeys.length)
    : 0;
  const volumeTrendDirection = getTrendDirection(recentAverageVolume, previousAverageVolume, 25);
  const sessionCadenceLabel = weeklySessionKeys.length >= 4
    ? (language === "fa" ? "ریتم تمرینت خوب و پایدار است" : "Your training rhythm is stable and strong")
    : weeklySessionKeys.length >= 2
      ? (language === "fa" ? "ریتم تمرینت متوسط است" : "Your training rhythm is moderate")
      : uniqueSessionKeys.length > 0
        ? (language === "fa" ? "ریتم تمرینت هنوز ناپایدار است" : "Your training rhythm is still inconsistent")
        : (language === "fa" ? "هنوز session کافی برای تحلیل ریتم نداری" : "There is not enough session data yet to analyze your rhythm");
  const sessionCadenceColor = weeklySessionKeys.length >= 4 ? "#0a8a2e" : weeklySessionKeys.length >= 2 ? "#b88400" : "#8a450a";
  const consistencySummary = adherenceTrendDirection === "up"
    ? (language === "fa" ? "پایبندی نسخه در چند جلسه اخیر بهتر شده" : "Prescription adherence has improved over the last few sessions")
    : adherenceTrendDirection === "down"
      ? (language === "fa" ? "پایبندی نسخه در چند جلسه اخیر افت کرده" : "Prescription adherence has dropped over the last few sessions")
      : recentAverageAdherence !== null
        ? (language === "fa" ? "پایبندی نسخه فعلاً پایدار مانده" : "Prescription adherence is stable for now")
        : (language === "fa" ? "هنوز داده کافی برای تحلیل پایبندی نداری" : "There is not enough data yet to analyze adherence");
  const volumeSummary = volumeTrendDirection === "up"
    ? (language === "fa" ? "میانگین حجم sessionهای اخیر بالاتر رفته" : "Average recent session volume has increased")
    : volumeTrendDirection === "down"
      ? (language === "fa" ? "میانگین حجم sessionهای اخیر پایین‌تر آمده" : "Average recent session volume has decreased")
      : recentAverageVolume > 0
        ? (language === "fa" ? "میانگین حجم sessionهای اخیر تقریباً ثابت مانده" : "Average recent session volume is roughly steady")
        : (language === "fa" ? "هنوز داده کافی برای تحلیل حجم نداری" : "There is not enough data yet to analyze volume");
  const currentWeightValue = progressData[progressData.length - 1]?.weight ?? null;
  const startingWeightValue = progressData[0]?.weight ?? null;
  const totalWeightChange = currentWeightValue !== null && startingWeightValue !== null
    ? (currentWeightValue - startingWeightValue).toFixed(1)
    : "0.0";
  const goalSpecificProgress = getGoalSpecificProgressInterpretation({
    goal: runtimeUser.goal,
    totalWeightChange,
    adherenceTrendDirection,
    volumeTrendDirection,
    recentAverageAdherence,
    weeklySessionCount: weeklySessionKeys.length,
  }, language);
  const parsedNewWeight = Number(newWeight);

  const userFilteredExercises = filterExercisesForUser(EXERCISES, runtimeUser);
  const muscles = ["همه", ...new Set(userFilteredExercises.map(e => getExercisePrimaryMuscle(e)))];
  const filteredEx = userFilteredExercises.filter(e =>
    (filterMuscle === "همه" || getExercisePrimaryMuscle(e) === filterMuscle) &&
    e.name.includes(searchEx)
  );
  const recommendedProgram = buildRecommendedProgram(runtimeUser, sortedWorkoutHistory);
  const staticPrograms = PROGRAMS.map(program => buildStaticProgram(program, runtimeUser, sortedWorkoutHistory));
  const workoutCategoryOptions = [
    { id: "all", label: language === "fa" ? "همه" : "All" },
    { id: "hypertrophy", label: language === "fa" ? "حجم" : "Hypertrophy" },
    { id: "strength", label: language === "fa" ? "قدرت" : "Strength" },
    { id: "fat_loss", label: language === "fa" ? "چربی‌سوزی" : "Fat Loss" },
  ];
  const workoutCategoryPrograms = [
    recommendedProgram,
    ...staticPrograms,
  ].filter(program => workoutCategoryFilter === "all" || (program.goal_key || normalizeGoal(program.goal)) === workoutCategoryFilter);
  const favoriteExercises = Object.entries(
    sortedWorkoutHistory.reduce((acc, log) => {
      acc[log.name] = (acc[log.name] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
  const recentWorkoutSessions = uniqueSessionKeys.slice(0, 4).map((sessionKey) => {
    const entries = progressLogs.filter(log => sessionKeyOf(log) === sessionKey);
    const first = entries[0];
    return {
      key: sessionKey,
      date: formatLocalizedDate(first?.created_at || first?.date, language),
      program: getProgramNameFromStoredLabel(first?.program_name, language) || (language === "fa" ? "بدون برنامه" : "No program"),
      day: getProgramDayLabel(first?.day_name, language),
      volume: entries.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0),
      count: entries.length,
    };
  });
  const splitNoteLabels = {
    beginner_downgrade: "به‌خاطر سطح فعلی، split ساده‌تر انتخاب شد.",
    low_recovery_downgrade: "به‌خاطر ریکاوری پایین، ساختار سبک‌تر انتخاب شد.",
    six_day_restricted: "ساختار ۶ روزه برای V1 محدود شد.",
    short_session_adjusted: "به‌خاطر زمان کم هر جلسه، split جمع‌وجورتر شد.",
    equipment_adjusted: "به‌خاطر محدودیت تجهیزات، split عملی‌تر انتخاب شد.",
  };
  const currentProgramDay = selectedProgram?.days?.[selectedProgramDay] || null;
  const currentProgramPrescriptions = currentProgramDay?.prescriptions || [];
  const currentDayLogs = currentProgramDay
    ? workoutLog.filter(log => log.day_name === currentProgramDay.day)
    : [];
  const currentDayLoggedNames = currentDayLogs.map(log => log.name);
  const nextSuggestedExercise = currentProgramDay
    ? currentProgramDay.exercises.find(ex => !currentDayLoggedNames.includes(ex)) || null
    : null;
  const activeExercisePrescription = currentProgramPrescriptions.find(item => item.name === activeSet.name)
    || currentProgramPrescriptions[0]
    || null;
  const activeExercise = activeExercisePrescription ? getExerciseByName(activeExercisePrescription.name) : null;
  const activeExerciseHistory = activeExercisePrescription
    ? sortedWorkoutLog.filter(log => log.name === activeExercisePrescription.name).slice(0, 5)
    : [];
  const activeExerciseProgression = progressionTestScenario
    ? getForcedProgressionSuggestion(progressionTestScenario, activeExercise, activeExercisePrescription, activeExerciseHistory)
    : getProgressionSuggestion(activeExercise, activeExercisePrescription, activeExerciseHistory, language);
  const currentExerciseLoggedSets = activeExercisePrescription
    ? currentDayLogs
        .filter(log => log.name === activeExercisePrescription.name)
        .reduce((sum, log) => sum + (Number(log.sets) || 1), 0)
    : 0;
  const currentExerciseTargetSets = Number(activeExercisePrescription?.sets) || 0;
  const currentExerciseRemainingSets = Math.max(0, currentExerciseTargetSets - currentExerciseLoggedSets);
  const currentExerciseAdherence = currentExerciseTargetSets
    ? Math.min(100, Math.round((currentExerciseLoggedSets / currentExerciseTargetSets) * 100))
    : null;
  const dayPrescriptionTargets = currentProgramPrescriptions.map(item => ({
    name: item.name,
    sets: Number(item.sets) || 0,
  }));
  const completedDayPrescriptionUnits = dayPrescriptionTargets.reduce((sum, target) => {
    const loggedSets = currentDayLogs
      .filter(log => log.name === target.name)
      .reduce((acc, log) => acc + (Number(log.sets) || 1), 0);
    return sum + Math.min(target.sets, loggedSets);
  }, 0);
  const totalDayPrescriptionUnits = dayPrescriptionTargets.reduce((sum, target) => sum + target.sets, 0);
  const currentDayPrescriptionAdherence = totalDayPrescriptionUnits
    ? Math.round((completedDayPrescriptionUnits / totalDayPrescriptionUnits) * 100)
    : null;
  const completedProgramDayExercises = currentProgramDay
    ? currentProgramDay.exercises.filter(exerciseName => currentDayLoggedNames.includes(exerciseName)).length
    : 0;
  const remainingProgramDayExercises = currentProgramDay
    ? Math.max(0, currentProgramDay.exercises.length - completedProgramDayExercises)
    : 0;
  const currentWorkoutContext = selectedProgram ? {
    program_name: selectedProgram.name,
    day_name: currentProgramDay?.day || null,
    split_family: selectedProgram.split?.split_family || null,
    is_recommended: !!selectedProgram.isRecommended,
  } : null;
  const planSummaryItems = [
    { label: language === "fa" ? "هدف" : "Goal", value: getDisplayGoal(runtimeUser.goal, language) },
    { label: language === "fa" ? "سطح" : "Level", value: getDisplayTrainingLevel(runtimeUser.training_level, language) },
    { label: language === "fa" ? "تعداد جلسات" : "Sessions", value: language === "fa" ? `${runtimeUser.training_days_per_week || "؟"} روز در هفته` : `${runtimeUser.training_days_per_week || "?"} days/week` },
    { label: language === "fa" ? "مدت هر جلسه" : "Session Length", value: language === "fa" ? `${runtimeUser.session_duration || "؟"} دقیقه` : `${runtimeUser.session_duration || "?"} min` },
    { label: language === "fa" ? "split انتخاب‌شده" : "Selected Split", value: getSplitLabel(recommendedProgram.split.split_family, language) },
    { label: language === "fa" ? "منطق برنامه" : "Programming Style", value: getProgrammingStyleLabel(recommendedProgram.goal_key || recommendedProgram.goal, language) },
    { label: language === "fa" ? "تجهیزات" : "Equipment", value: getDisplayEquipmentLabel(runtimeUser.equipment_access, language) },
    { label: language === "fa" ? "ریکاوری" : "Recovery", value: getDisplayRecoveryLabel(runtimeUser.recovery_quality, language) },
  ];
  const planTrustCopy = language === "fa"
    ? "این خلاصه از روی هدف، سطح، تعداد جلسات، ریکاوری، تجهیزات و محدودیت‌های تو ساخته شده و برنامه پیشنهادی پایین بر همان اساس انتخاب شده است."
    : "This summary is built from your goal, level, session count, recovery, equipment, and limitations, and the recommendation below is selected on that basis.";
  const planDisclaimerCopy = language === "fa"
    ? "اگر محدودیت یا درد واقعی داری، برنامه را محافظه‌کارانه اجرا کن و حرکات دردزا را حذف یا جایگزین کن."
    : "If you have real pain or limitations, run the plan conservatively and remove or replace any painful movement.";
  const planExplanation = buildPlanExplanation(runtimeUser, recommendedProgram, language);
  const aiContextSummaryItems = [
    { label: tr(language, "ai_login_context_goal"), value: getDisplayGoal(userProfile.goal, language) },
    { label: tr(language, "ai_login_context_level"), value: getDisplayTrainingLevel(userProfile.training_level, language) },
    { label: tr(language, "ai_login_context_active_program"), value: currentWorkoutContext?.program_name ? getProgramNameFromStoredLabel(currentWorkoutContext.program_name, language) : tr(language, "active_program_none") },
    { label: tr(language, "ai_login_context_active_day"), value: currentWorkoutContext?.day_name ? getProgramDayLabel(currentWorkoutContext.day_name, language) : tr(language, "active_program_none") },
    { label: tr(language, "ai_login_context_split"), value: getSplitLabel(currentWorkoutContext?.split_family || recommendedProgram.split.split_family, language) || tr(language, "unknown") },
    { label: tr(language, "ai_login_context_limitations"), value: getDisplayLimitations(userProfile.injury_or_limitation_flags || [], language) },
  ];
  const aiSafetyMode = getAiSafetyMode({
    limitations: userProfile.injury_or_limitation_flags || [],
    prompt: aiPrompt,
  });
  const aiSafetyTitle = aiSafetyMode === "high"
    ? (language === "fa" ? "حالت محافظه‌کارانه بالا فعال است" : "High Conservative Mode Is Active")
    : aiSafetyMode === "elevated"
      ? (language === "fa" ? "حالت محافظه‌کارانه فعال است" : "Conservative Mode Is Active")
      : (language === "fa" ? "حالت پاسخ عمومی فعال است" : "General Guidance Mode Is Active");
  const aiSafetyCopy = aiSafetyMode === "high"
    ? (language === "fa"
      ? "به‌خاطر محدودیت ثبت‌شده و محتوای ریسکی سؤال، پاسخ AI باید محافظه‌کارانه بماند، از تشخیص و فشار روی ناحیه درد دوری کند، و توقف حرکت دردزا/ارجاع به متخصص را یادآوری کند."
      : "Because of a recorded limitation and a higher-risk question, the AI response should stay conservative, avoid diagnosis and direct loading on the painful area, and remind the user to stop painful movements and seek a qualified specialist.")
    : aiSafetyMode === "elevated"
      ? (language === "fa"
        ? "در این سؤال یا پروفایل، نشانه‌ای از محدودیت/درد وجود دارد. پاسخ باید محتاط بماند و از توصیه فشار مستقیم روی ناحیه حساس دوری کند."
        : "This question or profile suggests a limitation or pain signal. The response should remain cautious and avoid recommending direct loading on the sensitive area.")
      : (language === "fa"
        ? "در این حالت، AI فقط راهنمایی عمومی تمرینی می‌دهد و همچنان جای متخصص حضوری را نمی‌گیرد."
        : "In this mode, the AI only provides general training guidance and still does not replace an in-person professional.");
  const totalCals = foodLog.reduce((a, f) => a + f.cal, 0);
  const totalProtein = foodLog.reduce((a, f) => a + f.p, 0);
  const totalCarbs = foodLog.reduce((a, f) => a + f.c, 0);
  const totalFat = foodLog.reduce((a, f) => a + f.f, 0);
  const coachRecommendations = [
    {
      title: language === "fa" ? "توصیه شخصی برنامه" : "Personalized Program Recommendation",
      body: planExplanation.reasons[0] || (language === "fa" ? "برنامه فعلی با هدف و ریکاوری تو هم‌راستاست." : "Your current plan aligns with your goal and recovery profile."),
    },
    {
      title: language === "fa" ? "توصیه شخصی پیشروی" : "Personalized Progression Recommendation",
      body: activeExerciseProgression?.message || (language === "fa" ? "برای حرکت فعال، هنوز توصیه پیشروی در دسترس نیست." : "No progression recommendation is available yet for the active exercise."),
    },
    {
      title: language === "fa" ? "توصیه شخصی تغذیه" : "Personalized Nutrition Recommendation",
      body: totalProtein > 0
        ? (language === "fa" ? `تا الان ${Math.round(totalProtein)} گرم پروتئین ثبت کرده‌ای؛ وعده بعدی را حول پروتئین و ریکاوری بچین.` : `You have logged ${Math.round(totalProtein)}g of protein so far; build the next meal around protein and recovery.`)
        : (language === "fa" ? "هنوز لاگ غذایی کافی نداری؛ با یک وعده ساده شروع کن تا coach توصیه دقیق‌تری بدهد." : "You do not have enough nutrition logs yet; start with one simple meal so the coach can guide you more precisely."),
    },
  ];
  const workoutAdviceText = activeExerciseProgression
    ? getProgressionExplanation(activeExerciseProgression, language)
    : (language === "fa" ? "وقتی برای حرکت فعال history کافی داشته باشیم، advice تمرینی دقیق‌تر اینجا می‌آید." : "Once the active exercise has enough history, more specific workout advice will appear here.");
  const nutritionAdviceText = totalCals > 0
    ? (language === "fa" ? `امروز ${Math.round(totalCals)} کالری ثبت شده. تعادل پروتئین، کربوهیدرات و چربی را با توجه به هدفت نگه دار.` : `${Math.round(totalCals)} calories are logged today. Keep protein, carbs, and fat aligned with your goal.`)
    : (language === "fa" ? "هنوز لاگ تغذیه‌ای ثبت نشده. با ثبت اولین وعده، nutrition advice شخصی‌تر می‌شود." : "No nutrition log is recorded yet. Once you log your first meal, nutrition advice becomes more personalized.");
  const planAdjustmentText = planExplanation.nextChecks[0]
    || planExplanation.adjustments[0]
    || (language === "fa" ? "اگر adherence پایین بماند یا trendها تغییر کنند، plan adjustment اینجا توضیح داده می‌شود." : "If adherence stays low or trends change, plan adjustment logic will be explained here.");
  const nextBadge = BADGES.find(b => !(gameData.badges || []).includes(b.id)) || null;
  const nextBadgeLabel = nextBadge ? getBadgeLabel(nextBadge, language) : null;
  const applyProgressionTestScenario = (scenario) => {
    if (!activeExercisePrescription) return;
    setProgressionTestScenario(scenario);
    setLogFeedback({
      name: activeExercisePrescription.name,
      nextExercise: `سناریوی تست ${scenario} اعمال شد`,
    });
  };
  const clearProgressionTestScenario = () => {
    if (!activeExercisePrescription) return;
    setProgressionTestScenario(null);
    setLogFeedback({
      name: activeExercisePrescription.name,
      nextExercise: "لاگ تستی این حرکت پاک شد",
    });
  };
  const activateProgram = (program) => {
    setProgressionTestScenario(null);
    setWorkoutLog([]);
    clearPerUserData(ACTIVE_WORKOUT_KEY, user.id);
    setLogFeedback(null);
    stopRest();
    setSelectedProgram(program);
    setSelectedProgramDay(0);
    const firstExercise = program.days?.[0]?.exercises?.[0] || "";
    setActiveSet({ name: firstExercise, weight: "", reps: "", sets: "" });
    setTab("workout");
  };
  const selectProgramDay = (dayIndex) => {
    setProgressionTestScenario(null);
    setLogFeedback(null);
    stopRest();
    setSelectedProgramDay(dayIndex);
    const firstExercise = selectedProgram?.days?.[dayIndex]?.exercises?.[0] || "";
    if (firstExercise) setActiveSet({ name: firstExercise, weight: "", reps: "", sets: "" });
  };
  const applyPrescriptionToActiveSet = () => {
    if (!activeExercisePrescription) return;
    setActiveSet(s => ({
      ...s,
      name: activeExercisePrescription.name,
      reps: getRecommendedRepsFromRange(activeExercisePrescription.rep_range),
      sets: String(activeExercisePrescription.sets || ""),
    }));
    setRestDuration(getSuggestedRestSeconds(activeExercisePrescription.rest_range));
  };

  // Rest timer
  useEffect(() => {
    if (restRunning && restTimer > 0) {
      timerRef.current = setTimeout(() => setRestTimer(t => t - 1), 1000);
    } else if (restTimer === 0) {
      setRestRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [restRunning, restTimer]);

  useEffect(() => {
    if (!logFeedback) return;
    const timer = setTimeout(() => setLogFeedback(null), 1800);
    return () => clearTimeout(timer);
  }, [logFeedback]);

  useEffect(() => {
    savePerUserData(ACTIVE_WORKOUT_KEY, user.id, sanitizeWorkoutLog(workoutLog));
  }, [user.id, workoutLog]);

  useEffect(() => {
    savePerUserData(WORKOUT_LOG_KEY, user.id, sanitizeWorkoutLog(workoutHistory));
  }, [user.id, workoutHistory]);

  useEffect(() => {
    savePerUserData(PROGRESS_DATA_KEY, user.id, sanitizeProgressData(progressData, defaultProgressData));
  }, [user.id, progressData]);

  useEffect(() => {
    if (!selectedProgram?.days?.length) return;
    if (selectedProgramDay < selectedProgram.days.length) return;
    setSelectedProgramDay(0);
  }, [selectedProgram, selectedProgramDay]);

  useEffect(() => {
    const validExerciseNames = currentProgramDay?.exercises?.length
      ? currentProgramDay.exercises
      : userFilteredExercises.map(ex => ex.name);
    if (!validExerciseNames.length) return;
    if (activeSet.name && validExerciseNames.includes(activeSet.name)) return;
    setActiveSet({
      name: validExerciseNames[0] || "",
      weight: "",
      reps: "",
      sets: "",
    });
  }, [activeSet.name, currentProgramDay, userFilteredExercises]);

  useEffect(() => {
    if (selectedProgram) return;
    const persisted = persistedActivePlanRef.current;
    if (!persisted?.programId) return;
    const restoredProgram = persisted.programId === "recommended"
      ? recommendedProgram
      : staticPrograms.find(program => String(program.id) === String(persisted.programId));
    if (restoredProgram) {
      setSelectedProgram(restoredProgram);
      setSelectedProgramDay(Math.min(persisted.selectedDay || 0, Math.max(restoredProgram.days.length - 1, 0)));
    }
    persistedActivePlanRef.current = null;
  }, [recommendedProgram, selectedProgram, staticPrograms]);

  useEffect(() => {
    if (!selectedProgram) {
      clearActivePlan(user.id);
      return;
    }
    saveActivePlan(user.id, {
      programId: selectedProgram.id,
      selectedDay: selectedProgramDay,
    });
  }, [user.id, selectedProgram, selectedProgramDay]);

  const startRest = () => { setRestTimer(restDuration); setRestRunning(true); };
  const stopRest = () => { setRestRunning(false); setRestTimer(0); };

  const logSet = () => {
    const parsedWeight = Number(activeSet.weight);
    const parsedReps = Number(activeSet.reps);
    const parsedSets = Math.max(1, Number(activeSet.sets) || 1);
    if (!activeSet.name || parsedWeight <= 0 || parsedReps <= 0) return;
    const prescribed = currentProgramPrescriptions.find(item => item.name === activeSet.name) || null;
    const entry = {
      ...activeSet,
      id: Date.now(),
      created_at: Date.now(),
      date: new Date().toLocaleDateString("fa-IR"),
      weight: parsedWeight,
      reps: parsedReps,
      sets: parsedSets,
      program_name: currentWorkoutContext?.program_name || null,
      day_name: currentWorkoutContext?.day_name || null,
      split_family: currentWorkoutContext?.split_family || null,
      is_recommended: currentWorkoutContext?.is_recommended || false,
      prescribed_sets: prescribed?.sets || null,
      prescribed_rep_range: prescribed?.rep_range || null,
      prescribed_rest_range: prescribed?.rest_range || null,
      prescribed_effort: prescribed?.effort || null,
    };
    setWorkoutLog(prev => [entry, ...prev]);
    const nextExercise = currentProgramDay
      ? currentProgramDay.exercises.find(ex => ex !== activeSet.name && !currentDayLoggedNames.includes(ex))
      : null;
    setActiveSet(s => ({
      ...s,
      name: nextExercise || s.name,
      weight: "",
      reps: "",
      sets: "",
    }));
    setLogFeedback({
      name: activeSet.name,
      nextExercise: nextExercise || null,
    });
    startRest();
  };

  const finishWorkout = () => {
    if (workoutLog.length === 0) return;
    stopRest();
    const uniqueExercises = new Set(workoutLog.map(log => log.name)).size;
    const completedSets = workoutLog.reduce((sum, log) => sum + (Number(log.sets) || 1), 0);
    const sessionVolume = workoutLog.reduce((sum, log) => sum + ((Number(log.weight) || 0) * (Number(log.reps) || 0) * (Number(log.sets) || 1)), 0);
    const completedDayExercises = currentProgramDay
      ? new Set(workoutLog.filter(log => log.day_name === currentProgramDay.day).map(log => log.name)).size
      : 0;
    const dayTotalExercises = currentProgramDay?.exercises?.length || 0;
    const dayLogs = currentProgramDay
      ? workoutLog.filter(log => log.day_name === currentProgramDay.day)
      : [];
    const prescriptionTargets = currentProgramPrescriptions.map(item => ({
      name: item.name,
      sets: Number(item.sets) || 0,
    }));
    const completedPrescriptionUnits = prescriptionTargets.reduce((sum, target) => {
      const loggedSetsForExercise = dayLogs
        .filter(log => log.name === target.name)
        .reduce((acc, log) => acc + (Number(log.sets) || 1), 0);
      return sum + Math.min(target.sets, loggedSetsForExercise);
    }, 0);
    const totalPrescriptionUnits = prescriptionTargets.reduce((sum, target) => sum + target.sets, 0);
    const prescriptionAdherence = totalPrescriptionUnits
      ? completedPrescriptionUnits / totalPrescriptionUnits
      : null;
    const prescriptionSummary = totalPrescriptionUnits
      ? `${completedPrescriptionUnits} از ${totalPrescriptionUnits} ست هدف`
      : null;
    const remainingExercises = currentProgramDay
      ? currentProgramDay.exercises.filter(exerciseName => !dayLogs.some(log => log.name === exerciseName))
      : [];
    const newStreak = updateStreak(gameData);
    const xpEarned = calcXPForWorkout(workoutLog.length);
    const newXP = gameData.xp + xpEarned;
    const newTotalWorkouts = gameData.totalWorkouts + 1;
    const newTotalSets = gameData.totalSets + workoutLog.length;
    const newLevelInfo = getLevelInfo(newXP);

    const updatedGame = {
      ...gameData,
      xp: newXP,
      level: newLevelInfo.level,
      streak: newStreak,
      lastWorkoutDate: new Date().toDateString(),
      totalWorkouts: newTotalWorkouts,
      totalSets: newTotalSets,
      badges: [
        ...(gameData.badges || []),
        ...checkNewBadges({ ...gameData, xp: newXP, level: newLevelInfo.level, streak: newStreak, totalWorkouts: newTotalWorkouts, totalSets: newTotalSets }).map(b => b.id)
      ]
    };

    const newBadges = checkNewBadges({ ...gameData, xp: newXP, level: newLevelInfo.level, streak: newStreak, totalWorkouts: newTotalWorkouts, totalSets: newTotalSets });
    const nextDayIndex = selectedProgram?.days?.length ? (selectedProgramDay + 1) % selectedProgram.days.length : null;
    const nextDay = nextDayIndex !== null ? selectedProgram.days[nextDayIndex] : null;
    const completionGuidance = getCompletionGuidance({
      adherence: prescriptionAdherence,
      currentProgramDay,
      nextDay,
      remainingExercises,
    });

    saveGameData(user.id, updatedGame);
    setGameData(updatedGame);
    setWorkoutHistory(prev => [...workoutLog, ...prev]);
    setWorkoutPopup({
      xpEarned,
      newXP,
      newStreak,
      sets: workoutLog.length,
      unique_exercises: uniqueExercises,
      completed_sets: completedSets,
      session_volume: sessionVolume,
      day_completed_exercises: completedDayExercises,
      day_total_exercises: dayTotalExercises,
      prescription_adherence: prescriptionAdherence,
      prescription_summary: prescriptionSummary,
      totalWorkouts: newTotalWorkouts,
      newBadges,
      program_name: currentWorkoutContext?.program_name || null,
      day_name: currentWorkoutContext?.day_name || null,
      next_day_name: nextDay?.day || null,
      guidance_title: completionGuidance.title,
      guidance_tone: completionGuidance.tone,
      next_step: completionGuidance.message,
    });
    setWorkoutLog([]);
    clearPerUserData(ACTIVE_WORKOUT_KEY, user.id);
    if (selectedProgram && nextDay) {
      setSelectedProgramDay(nextDayIndex);
      setActiveSet({ name: nextDay.exercises?.[0] || "", weight: "", reps: "", sets: "" });
    } else {
      setActiveSet(s => ({ ...s, weight: "", reps: "", sets: "" }));
    }
  };

  const suggestedMeals = language === "fa"
    ? ["صبحانه پروتئینی", "ناهار متعادل", "میان‌وعده سبک", "شام ریکاوری"]
    : ["Protein Breakfast", "Balanced Lunch", "Light Snack", "Recovery Dinner"];

  const addFood = (food) => setFoodLog(prev => [{ ...food, id: Date.now() }, ...prev]);

  const askAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: language === "fa"
            ? `تو یه مربی بدنسازی حرفه‌ای ایرانی هستی. جواب‌ها را به فارسی و کوتاه بده.
قواعد ایمنی:
- هرگز نقش پزشک، فیزیوتراپیست یا تشخیص‌گر آسیب را بازی نکن.
- اگر محدودیت، درد، یا آسیب در پروفایل یا سؤال دیده می‌شود، پاسخ را محافظه‌کارانه نگه دار.
- حرکت دردزا را تایید نکن؛ بگو متوقفش کند و فقط جایگزین‌های کم‌ریسک/عمومی پیشنهاد بده.
- برای ناحیه درد یا آسیب، افزایش بار، افزایش فشار، یا نسخه تهاجمی نده.
- اگر درد مداوم، درد تیز، بی‌حسی، یا علائم پزشکی مطرح شد، صریحاً ارجاع به متخصص واجد صلاحیت بده.
- اگر اطلاعات کافی برای توصیه ایمن نداری، عدم قطعیت را واضح بگو و محافظه‌کار بمان.
پروفایل کاربر:
- نام: ${userProfile.name} | جنسیت: ${getDisplaySexLabel(userProfile.sex, language) || "؟"} | سن: ${runtimeUser.age || "؟"} | قد: ${runtimeUser.height || "؟"}cm | وزن: ${runtimeUser.weight || "؟"}kg
- هدف: ${getDisplayGoal(userProfile.goal, language) || "؟"} | سطح: ${getDisplayTrainingLevel(userProfile.training_level, language) || "؟"}
- تمرین: ${userProfile.training_days_per_week || "؟"} روز/هفته · ${userProfile.session_duration || "؟"} دقیقه · تجهیزات: ${getDisplayEquipmentLabel(userProfile.equipment_access, language) || "؟"}
- ریکاوری: ${getDisplayRecoveryLabel(userProfile.recovery_quality, language) || "؟"} | محدودیت‌ها: ${getDisplayLimitations(userProfile.injury_or_limitation_flags || [], language)}
- برنامه فعال: ${currentWorkoutContext?.program_name ? getProgramNameFromStoredLabel(currentWorkoutContext.program_name, language) : "ندارد"}${currentWorkoutContext?.day_name ? ` · ${getProgramDayLabel(currentWorkoutContext.day_name, language)}` : ""}
- split فعلی: ${getSplitLabel(currentWorkoutContext?.split_family || recommendedProgram.split.split_family, language)}
- حرکات سازگار فعلی: ${userFilteredExercises.slice(0, 6).map(ex => getExerciseDisplayName(ex, language)).join("، ") || "نامشخص"}
- حالت ایمنی فعلی AI: ${aiSafetyMode}`
            : `You are a professional fitness coach. Answer in English, clearly and concisely.
Safety Rules:
- Never act as a doctor, physiotherapist, or injury diagnostician.
- If limitations, pain, or injury appear in the profile or question, keep the response conservative.
- Do not endorse painful movements; tell the user to stop and only suggest low-risk, general alternatives.
- Do not prescribe aggressive loading, pressure, or progression for a painful or injured area.
- If persistent pain, sharp pain, numbness, or medical warning signs are mentioned, explicitly refer the user to a qualified professional.
- If you do not have enough information for safe guidance, state uncertainty clearly and stay conservative.
User Profile:
- Name: ${userProfile.name} | Sex: ${getDisplaySexLabel(userProfile.sex, language) || "?"} | Age: ${runtimeUser.age || "?"} | Height: ${runtimeUser.height || "?"}cm | Weight: ${runtimeUser.weight || "?"}kg
- Goal: ${getDisplayGoal(userProfile.goal, language) || "?"} | Level: ${getDisplayTrainingLevel(userProfile.training_level, language) || "?"}
- Training: ${userProfile.training_days_per_week || "?"} days/week · ${userProfile.session_duration || "?"} min · Equipment: ${getDisplayEquipmentLabel(userProfile.equipment_access, language) || "?"}
- Recovery: ${getDisplayRecoveryLabel(userProfile.recovery_quality, language) || "?"} | Limitations: ${getDisplayLimitations(userProfile.injury_or_limitation_flags || [], language)}
- Active Program: ${currentWorkoutContext?.program_name ? getProgramNameFromStoredLabel(currentWorkoutContext.program_name, language) : "None"}${currentWorkoutContext?.day_name ? ` · ${getProgramDayLabel(currentWorkoutContext.day_name, language)}` : ""}
- Current Split: ${getSplitLabel(currentWorkoutContext?.split_family || recommendedProgram.split.split_family, language)}
- Current Compatible Exercises: ${userFilteredExercises.slice(0, 6).map(ex => getExerciseDisplayName(ex, language)).join(", ") || "Unknown"}
- Current AI Safety Mode: ${aiSafetyMode}`,
          messages: [{ role: "user", content: aiPrompt }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || (language === "fa" ? "خطا در دریافت پاسخ" : "Error receiving response"));
    } catch {
      setAiResult(language === "fa" ? "خطا در اتصال به سرویس AI" : "Error connecting to the AI service");
    }
    setAiLoading(false);
  };

  const progressWeights = progressData.map(d => d.weight);
  const maxW = progressWeights.length ? Math.max(...progressWeights) : 0;
  const minW = progressWeights.length ? Math.min(...progressWeights) : 0;
  const range = maxW - minW || 1;

  const bg = dark ? "#0a0a0a" : "#f5f5f0";
  const card = dark ? "#141414" : "#ffffff";
  const border = dark ? "#2a2a2a" : "#e0e0e0";
  const text = dark ? "#f0f0f0" : "#111111";
  const sub = dark ? "#888" : "#666";
  const accent = "#e8ff00";
  const red = "#ff3b3b";

  const tabs = [
    { id: "home", icon: "🏠", label: language === "fa" ? "خانه" : "Home" },
    { id: "workout", icon: "⚡", label: tr(language, "workout_tab") },
    { id: "nutrition", icon: "🥗", label: tr(language, "nutrition_tab") },
    { id: "coach", icon: "🤖", label: tr(language, "coach_tab") },
    { id: "profile", icon: "👤", label: language === "fa" ? "پروفایل" : "Profile" },
  ];

  const s = {
    app: { minHeight: "100vh", background: bg, color: text, fontFamily: "'Vazirmatn', 'Tahoma', sans-serif", direction: language === "fa" ? "rtl" : "ltr", paddingBottom: 80 },
    header: { background: card, borderBottom: `1px solid ${border}`, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px", color: accent },
    darkBtn: { background: "none", border: `1px solid ${border}`, color: text, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 16 },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: card, borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 100 },
    navBtn: (active) => ({ background: "none", border: "none", color: active ? accent : sub, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 10, fontFamily: "inherit", padding: "4px 8px", transition: "color 0.2s" }),
    page: { padding: "20px 16px" },
    card: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 16, marginBottom: 12 },
    title: { fontSize: 22, fontWeight: 800, marginBottom: 16, color: text },
    input: { width: "100%", background: dark ? "#1e1e1e" : "#f0f0f0", border: `1px solid ${border}`, borderRadius: 10, padding: "10px 14px", color: text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    btn: (color = accent) => ({ background: color, color: color === accent ? "#000" : "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "opacity 0.2s" }),
    tag: (color = "#333") => ({ background: color, color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 20, display: "inline-block" }),
    row: { display: "flex", gap: 8, alignItems: "center" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    stat: { textAlign: "center", padding: 14, background: dark ? "#1a1a1a" : "#f8f8f8", borderRadius: 12 },
  };

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.logo}>💪 {language === "fa" ? "آیرون‌فا" : "IronFa"}</span>
        <div style={{ flex: 1, margin: "0 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: levelInfo.color, fontWeight: 700 }}>Lv.{levelInfo.level} {getLevelTitle(levelInfo, language)}</span>
            <span style={{ color: sub }}>{gameData.xp} XP</span>
          </div>
          <div style={{ height: 4, background: dark ? "#2a2a2a" : "#ddd", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${xpProgress}%`, background: levelInfo.color, borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>
        <div style={s.row}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: 3, borderRadius: 999, background: dark ? "#171717" : "#efefef", border: `1px solid ${border}` }}>
            <button type="button" onClick={() => setLanguage("en")} style={{ minWidth: 28, textAlign: "center", padding: "4px 6px", borderRadius: 999, fontSize: 10, fontWeight: 800, color: language === "en" ? "#111" : sub, background: language === "en" ? accent : "transparent", border: "none", cursor: "pointer" }}>EN</button>
            <button type="button" onClick={() => setLanguage("fa")} style={{ minWidth: 28, textAlign: "center", padding: "4px 6px", borderRadius: 999, fontSize: 10, fontWeight: 800, color: language === "fa" ? "#111" : sub, background: language === "fa" ? accent : "transparent", border: "none", cursor: "pointer" }}>فا</button>
          </div>
          <span style={{ color: "#ff6600", fontWeight: 700, fontSize: 13 }}>🔥{gameData.streak}</span>
          <button style={s.darkBtn} onClick={() => setDark(d => !d)}>{dark ? "☀️" : "🌙"}</button>
          <button style={{ ...s.darkBtn, color: "#ff6b6b", border: "1px solid #5a1a1a" }} onClick={onLogout}>{tr(language, "logout")}</button>
        </div>
      </div>

      {/* Pages */}
      <div style={s.page}>

        {/* HOME */}
        {tab === "home" && (
          <div>
            <div style={s.title}>{language === "fa" ? "خانه" : "Home"}</div>

            <div style={{ ...s.card, background: dark ? "#121800" : "#fbffe9", border: `1px solid ${accent}` }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "تمرین امروز" : "Today’s Workout"}</div>
              <div style={{ color: sub, fontSize: 13, marginBottom: 10 }}>
                {currentProgramDay
                  ? (language === "fa"
                    ? `${getProgramDayLabel(currentProgramDay.day, language)} · ${currentProgramDay.exercises.length} حرکت`
                    : `${getProgramDayLabel(currentProgramDay.day, language)} · ${currentProgramDay.exercises.length} exercises`)
                  : (language === "fa" ? "هنوز روز فعالی انتخاب نشده است." : "No active workout day has been selected yet.")}
              </div>
              <button style={{ ...s.btn(), width: "100%" }} onClick={() => setTab("workout")}>
                {language === "fa" ? "شروع تمرین" : "Start Workout"}
              </button>
            </div>

            <div style={s.grid2}>
              <div style={s.card}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "اسنپ‌شات برنامه فعال" : "Active Program Snapshot"}</div>
                <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 10 }}>
                  <div>{selectedProgram ? getProgramNameLabel(selectedProgram, language) : (language === "fa" ? "بدون برنامه فعال" : "No active program")}</div>
                  <div>{language === "fa" ? "Split" : "Split"}: {selectedProgram?.split?.split_family ? getSplitLabel(selectedProgram.split.split_family, language) : tr(language, "unknown")}</div>
                  <div>{language === "fa" ? "پایبندی اخیر" : "Recent Adherence"}: {latestSessionAdherence !== null ? `${latestSessionAdherence}%` : "—"}</div>
                </div>
                <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, width: "100%" }} onClick={() => setTab("workout")}>
                  {language === "fa" ? "باز کردن برنامه" : "Open Program"}
                </button>
              </div>

              <div style={s.card}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "برنامه غذایی امروز" : "Today’s Meal Plan"}</div>
                <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 10 }}>
                  <div>{language === "fa" ? "کالری مصرف‌شده" : "Calories Consumed"}: {Math.round(totalCals)} kcal</div>
                  <div>{language === "fa" ? "وضعیت امروز" : "Today’s Status"}: {foodLog.length > 0 ? (language === "fa" ? "ثبت فعال" : "Active logging") : (language === "fa" ? "بدون ثبت" : "No log yet")}</div>
                </div>
                <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, width: "100%" }} onClick={() => setTab("nutrition")}>
                  {language === "fa" ? "باز کردن تغذیه" : "Open Nutrition"}
                </button>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "اکشن‌های سریع" : "Quick Actions"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: language === "fa" ? "ثبت تمرین" : "Log Workout", onClick: () => setTab("workout") },
                  { label: language === "fa" ? "ثبت وزن" : "Log Weight", onClick: () => setTab("progress") },
                  { label: language === "fa" ? "سؤال از مربی" : "Ask Coach", onClick: () => setTab("coach") },
                  { label: language === "fa" ? "ثبت غذا" : "Add Food", onClick: () => setTab("nutrition") },
                ].map((action) => (
                  <button key={action.label} style={{ ...s.btn(dark ? "#222" : "#eee"), color: text }} onClick={action.onClick}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...s.card, background: dark ? "#15131d" : "#f7f3ff" }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "نکته روز / بینش مربی" : "Coach Tip / Daily Insight"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>{goalSpecificProgress.title}</div>
                <div>{goalSpecificProgress.summary}</div>
              </div>
              <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, width: "100%" }} onClick={() => setTab("coach")}>
                {language === "fa" ? "باز کردن مربی" : "Open Coach"}
              </button>
            </div>

            <div style={{ ...s.grid2, marginBottom: 12 }}>
              {[
                { label: language === "fa" ? "جلسات" : "Sessions", val: uniqueSessionKeys.length, color: "#0af" },
                { label: language === "fa" ? "حجم" : "Volume", val: totalLoggedVolume, color: accent },
                { label: language === "fa" ? "استریک" : "Streak", val: gameData.streak, color: "#ff6600" },
                { label: language === "fa" ? "پایبندی" : "Adherence", val: averagePrescriptionAdherence !== null ? `${averagePrescriptionAdherence}%` : "—", color: "#8a5cff" },
              ].map((item) => (
                <div key={item.label} style={{ ...s.stat, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "خلاصه پیشرفت" : "Progress Summary"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 10 }}>
                <div>{language === "fa" ? "روند اخیر" : "Recent trend"}: {goalSpecificProgress.title}</div>
                <div>{consistencySummary}</div>
              </div>
              <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, width: "100%" }} onClick={() => setTab("progress")}>
                {language === "fa" ? "مشاهده پیشرفت" : "View Progress"}
              </button>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "اسنپ‌شات XP / امتیاز" : "Points / XP Snapshot"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 10 }}>
                <div>{language === "fa" ? "سطح" : "Level"}: {levelInfo.level} · {getLevelTitle(levelInfo, language)}</div>
                <div>XP: {gameData.xp}</div>
                <div>{language === "fa" ? "بج بعدی" : "Next Badge"}: {nextBadgeLabel ? nextBadgeLabel.title : (language === "fa" ? "همه باز شده‌اند" : "All unlocked")}</div>
              </div>
              <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, width: "100%" }} onClick={() => setTab("profile")}>
                {language === "fa" ? "باز کردن پروفایل" : "Open Profile"}
              </button>
            </div>
          </div>
        )}

        {/* EXERCISES */}
        {tab === "exercises" && (
          <div>
            <div style={s.title}>{tr(language, "exercises_bank")}</div>
            <input style={{ ...s.input, marginBottom: 10 }} placeholder={tr(language, "search_placeholder")} value={searchEx} onChange={e => setSearchEx(e.target.value)} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {muscles.map(m => (
                <button key={m} onClick={() => setFilterMuscle(m)} style={{ ...s.btn(filterMuscle === m ? accent : (dark ? "#222" : "#eee")), color: filterMuscle === m ? "#000" : text, padding: "6px 14px", fontSize: 13 }}>
                  {m === "همه" ? (language === "fa" ? "همه" : "All") : localizedLabel(MUSCLE_DISPLAY, m, language)}
                </button>
              ))}
            </div>
            {selectedEx ? (
              <div style={s.card}>
                <button onClick={() => setSelectedEx(null)} style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, marginBottom: 12 }}>{tr(language, "back_label")}</button>
                <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8 }}>{selectedEx.gif}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{getExerciseDisplayName(selectedEx, language)}</div>
                <div style={{ ...s.row, marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
                  <span style={s.tag("#e8440a")}>{getExercisePrimaryMuscleLabel(selectedEx, language)}</span>
                  <span style={s.tag("#0a7ce8")}>{getExerciseEquipmentLabel(selectedEx, language)}</span>
                  <span style={s.tag(getExerciseDifficulty(selectedEx) === "مبتدی" ? "#0a8a2e" : getExerciseDifficulty(selectedEx) === "متوسط" ? "#e87e0a" : "#8a0a0a")}>{getExerciseDifficultyLabel(selectedEx, language)}</span>
                  {selectedEx.movement_pattern && <span style={s.tag("#444")}>{selectedEx.movement_pattern}</span>}
                </div>
                <p style={{ color: sub, lineHeight: 1.8, fontSize: 14 }}>{selectedEx.desc}</p>
                <div style={{ color: sub, fontSize: 12, lineHeight: 1.9, marginBottom: 10 }}>
                  <div>{language === "fa" ? "عضلات ثانویه" : "Secondary Muscles"}: {getExerciseSecondaryMusclesLabel(selectedEx, language)}</div>
                  <div>{language === "fa" ? "تکرار پیش‌فرض" : "Default Rep Range"}: {selectedEx.default_rep_range || tr(language, "unknown")} · {language === "fa" ? "استراحت" : "Rest"}: {selectedEx.default_rest_range || tr(language, "unknown")}</div>
                  <div>{language === "fa" ? "اهداف مناسب" : "Best For"}: {getExerciseGoalLabels(selectedEx, language).join(language === "fa" ? "، " : ", ")}</div>
                </div>
                <button style={{ ...s.btn(), width: "100%", marginTop: 12 }} onClick={() => { setActiveSet(s => ({ ...s, name: selectedEx.name })); setTab("workout"); setSelectedEx(null); }}>
                  {tr(language, "add_to_today_workout")}
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {filteredEx.map(ex => (
                  <div key={ex.id} style={{ ...s.card, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, marginBottom: 0 }} onClick={() => setSelectedEx(ex)}>
                    <span style={{ fontSize: 32 }}>{ex.gif}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{getExerciseDisplayName(ex, language)}</div>
                      <div style={s.row}>
                        <span style={s.tag("#e8440a")}>{getExercisePrimaryMuscleLabel(ex, language)}</span>
                        <span style={s.tag("#0a7ce8")}>{getExerciseEquipmentLabel(ex, language)}</span>
                      </div>
                    </div>
                    <span style={{ color: sub }}>←</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WORKOUT */}
        {tab === "workout" && (
          <div>
            <div style={s.title}>{tr(language, "today_workout")}</div>

            <div style={{ ...s.card, background: dark ? "#11161a" : "#f6fbff" }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "برنامه فعال" : "Active Program"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 10 }}>
                <div>{selectedProgram ? getProgramNameLabel(selectedProgram, language) : (language === "fa" ? "هنوز برنامه‌ای فعال نشده" : "No active program yet")}</div>
                <div>{language === "fa" ? "روز فعال" : "Active Day"}: {currentProgramDay ? getProgramDayLabel(currentProgramDay.day, language) : "—"}</div>
              </div>
              <button style={{ ...s.btn(), width: "100%" }} onClick={() => currentProgramDay ? setTab("workout") : activateProgram(recommendedProgram)}>
                {language === "fa" ? "باز کردن امروز" : "Open Today"}
              </button>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "تمرین‌های پیشنهادی" : "Recommended Workouts"}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {[recommendedProgram, ...staticPrograms.slice(0, 2)].map((prog) => (
                  <div key={prog.id} style={{ background: dark ? "#1a1a1a" : "#fafafa", border: `1px solid ${border}`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{getProgramNameLabel(prog, language)}</div>
                    <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                      {getSplitLabel(prog.split.split_family, language)} · {language === "fa" ? `${prog.days.length} روز` : `${prog.days.length} days`}
                    </div>
                    <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, width: "100%" }} onClick={() => activateProgram(prog)}>
                      {language === "fa" ? "استفاده از پیشنهاد" : "Use Recommendation"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "دسته‌بندی تمرین" : "Workout Categories"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {workoutCategoryOptions.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setWorkoutCategoryFilter(category.id)}
                    style={{ ...s.btn(workoutCategoryFilter === category.id ? accent : (dark ? "#222" : "#eee")), color: workoutCategoryFilter === category.id ? "#000" : text, padding: "6px 12px", fontSize: 12 }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {workoutCategoryPrograms.slice(0, 3).map((prog) => (
                  <div key={`${workoutCategoryFilter}-${prog.id}`} style={{ background: dark ? "#171717" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{getProgramNameLabel(prog, language)}</div>
                    <div style={{ color: sub, fontSize: 12 }}>{getProgrammingStyleLabel(prog.goal_key || prog.goal, language)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "کتابخانه حرکات" : "Exercise Library"}</div>
              <input style={{ ...s.input, marginBottom: 10 }} placeholder={tr(language, "search_placeholder")} value={searchEx} onChange={e => setSearchEx(e.target.value)} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {muscles.slice(0, 6).map(m => (
                  <button key={m} onClick={() => setFilterMuscle(m)} style={{ ...s.btn(filterMuscle === m ? accent : (dark ? "#222" : "#eee")), color: filterMuscle === m ? "#000" : text, padding: "6px 10px", fontSize: 12 }}>
                    {m === "همه" ? (language === "fa" ? "همه" : "All") : localizedLabel(MUSCLE_DISPLAY, m, language)}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {filteredEx.slice(0, 4).map(ex => (
                  <div key={ex.id} style={{ background: dark ? "#171717" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{ex.gif}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{getExerciseDisplayName(ex, language)}</div>
                      <div style={{ color: sub, fontSize: 12 }}>{getExercisePrimaryMuscleLabel(ex, language)}</div>
                    </div>
                    <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, padding: "6px 10px", fontSize: 12 }} onClick={() => { setActiveSet(s => ({ ...s, name: ex.name })); setLogFeedback({ name: ex.name, nextExercise: null }); }}>
                      {language === "fa" ? "انتخاب" : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.grid2}>
              <div style={s.card}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "ذخیره‌شده‌ها / محبوب‌ها" : "Saved Workouts / Favorites"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {favoriteExercises.length > 0 ? favoriteExercises.map((exerciseName) => (
                    <button
                      key={exerciseName}
                      style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, padding: "6px 10px", fontSize: 12 }}
                      onClick={() => setActiveSet(s => ({ ...s, name: exerciseName }))}
                    >
                      {getExerciseDisplayName(exerciseName, language)}
                    </button>
                  )) : (
                    <div style={{ color: sub, fontSize: 12 }}>{language === "fa" ? "هنوز آیتمی برای علاقه‌مندی یا quick access نداری." : "No favorites or quick-access items yet."}</div>
                  )}
                </div>
              </div>

              <div style={s.card}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "تاریخچه تمرین" : "Workout History"}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {recentWorkoutSessions.length > 0 ? recentWorkoutSessions.slice(0, 3).map((session) => (
                    <div key={session.key} style={{ background: dark ? "#171717" : "#fff", border: `1px solid ${border}`, borderRadius: 10, padding: "8px 10px" }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{session.date}</div>
                      <div style={{ color: sub, fontSize: 12 }}>{session.program}{session.day ? ` · ${session.day}` : ""}</div>
                      <div style={{ color: sub, fontSize: 11 }}>{session.count} {language === "fa" ? "ثبت" : "entries"} · {session.volume} {language === "fa" ? "حجم" : "volume"}</div>
                    </div>
                  )) : (
                    <div style={{ color: sub, fontSize: 12 }}>{language === "fa" ? "هنوز session ثبت نشده است." : "No sessions logged yet."}</div>
                  )}
                </div>
              </div>
            </div>

            {selectedProgram && (
              <div style={{ ...s.card, border: `1px solid ${accent}`, background: dark ? "#121800" : "#fbffe9" }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                  {language === "fa" ? (selectedProgram.isRecommended ? "برنامه فعال پیشنهادی" : "برنامه فعال") : (selectedProgram.isRecommended ? "Recommended Active Program" : "Active Program")}
                </div>
                <div style={{ color: sub, fontSize: 13, marginBottom: 10 }}>
                  {getProgramNameLabel(selectedProgram, language)}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {selectedProgram.days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => selectProgramDay(i)}
                      style={{
                        background: i === selectedProgramDay ? accent : (dark ? "#1f1f1f" : "#fff"),
                        color: i === selectedProgramDay ? "#000" : text,
                        border: `1px solid ${i === selectedProgramDay ? accent : border}`,
                        padding: "6px 10px",
                        borderRadius: 10,
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit"
                      }}
                    >
                      {getProgramDayLabel(day.day, language)}
                    </button>
                  ))}
                </div>
                <div style={{ color: sub, fontSize: 12 }}>
                  {currentProgramDay
                    ? (language === "fa" ? `روز فعال: ${getProgramDayLabel(currentProgramDay.day, language)} — حرکت پیش‌فرض برای ثبت ست از همین روز انتخاب می‌شود.` : `Active day: ${getProgramDayLabel(currentProgramDay.day, language)} — the default exercise for logging is selected from this day.`)
                    : (language === "fa" ? "حرکت پیش‌فرض برای ثبت ست از روز اول انتخاب شده. می‌توانی از لیست پایین آن را تغییر بدهی." : "The default exercise for logging is selected from day one. You can change it from the list below.")}
                </div>
              </div>
            )}

            {currentProgramDay && (
              <div style={{ ...s.card, background: dark ? "#10161d" : "#f4fbff", border: "1px solid #2f6ea5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>{language === "fa" ? "وضعیت روز فعال" : "Active Day Status"}</div>
                    <div style={{ color: sub, fontSize: 12 }}>
                      {language === "fa"
                        ? `${completedProgramDayExercises} از ${currentProgramDay.exercises.length} حرکت این روز حداقل یک ثبت دارند.`
                        : `${completedProgramDayExercises} of ${currentProgramDay.exercises.length} exercises in this day have at least one logged set.`}
                    </div>
                  </div>
                  {currentDayPrescriptionAdherence !== null && (
                    <div style={{ textAlign: "left" }}>
                      <div style={{ color: sub, fontSize: 11, marginBottom: 2 }}>{language === "fa" ? "پایبندی امروز" : "Today's Adherence"}</div>
                      <div style={{ color: accent, fontSize: 22, fontWeight: 900 }}>{currentDayPrescriptionAdherence}%</div>
                    </div>
                  )}
                </div>
                <div style={{ height: 8, background: dark ? "#202a34" : "#d9ebf9", borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${currentDayPrescriptionAdherence || 0}%`,
                      background: currentDayPrescriptionAdherence >= 80 ? accent : "#6db7ff",
                      borderRadius: 999,
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: language === "fa" ? "ست هدف ثبت‌شده" : "Logged Target Sets", value: totalDayPrescriptionUnits ? `${completedDayPrescriptionUnits}/${totalDayPrescriptionUnits}` : (language === "fa" ? "بدون نسخه" : "No Prescription") },
                    { label: language === "fa" ? "حرکت باقی‌مانده" : "Remaining Exercises", value: remainingProgramDayExercises },
                    { label: language === "fa" ? "حرکت بعدی" : "Next Exercise", value: nextSuggestedExercise ? getExerciseDisplayName(nextSuggestedExercise, language) : (language === "fa" ? "پایان روز" : "Day Complete") },
                  ].map(item => (
                    <div key={item.label} style={{ background: dark ? "#171f27" : "#fff", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{item.value}</div>
                      <div style={{ color: sub, fontSize: 11 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                ...s.card,
                background: dark ? "#241600" : "#fff4d9",
                border: "2px dashed #c98a00",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8, color: dark ? "#f0d7a0" : "#7b5200" }}>{language === "fa" ? "ابزار تست پیشروی" : "Progression Test Tools"}</div>
              <div style={{ color: sub, fontSize: 12, lineHeight: 1.8, marginBottom: 10 }}>
                {language === "fa"
                  ? "برای بررسی حالت‌های `افزایش وزنه`، `افزایش تکرار`، `ریست پلاتو` و `دیلود کوتاه` از این دکمه‌ها استفاده کن."
                  : "Use these buttons to inspect `Increase Load`, `Increase Reps`, `Plateau Reset`, and `Short Deload` states."}
              </div>
              <div
                style={{
                  background: dark ? "#1b1b1b" : "#fff",
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  marginBottom: 10,
                  fontSize: 12,
                  color: text,
                }}
              >
                {language === "fa" ? "وضعیت فعلی تست:" : "Current Test State:"}
                {" "}
                <strong>
                  {getProgressionStrategyLabel(activeExerciseProgression?.strategy, language)}
                </strong>
                {progressionTestScenario && (
                  <span style={{ color: sub }}>{language === "fa" ? " · سناریوی تست فعال است" : " · Test scenario is active"}</span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                <button
                  style={{ ...s.btn("#0a8a2e"), color: "#fff", padding: "6px 10px", fontSize: 12 }}
                  onClick={() => applyProgressionTestScenario("increase_load")}
                  disabled={!activeExercisePrescription}
                >
                  {language === "fa" ? "تست افزایش وزنه" : "Test Increase Load"}
                </button>
                <button
                  style={{ ...s.btn("#2f6ea5"), color: "#fff", padding: "6px 10px", fontSize: 12 }}
                  onClick={() => applyProgressionTestScenario("increase_reps")}
                  disabled={!activeExercisePrescription}
                >
                  {language === "fa" ? "تست افزایش تکرار" : "Test Increase Reps"}
                </button>
                <button
                  style={{ ...s.btn("#8a450a"), color: "#fff", padding: "6px 10px", fontSize: 12 }}
                  onClick={() => applyProgressionTestScenario("plateau_reset")}
                  disabled={!activeExercisePrescription}
                >
                  {language === "fa" ? "تست ریست پلاتو" : "Test Plateau Reset"}
                </button>
                <button
                  style={{ ...s.btn("#8a0a0a"), color: "#fff", padding: "6px 10px", fontSize: 12 }}
                  onClick={() => applyProgressionTestScenario("deload")}
                  disabled={!activeExercisePrescription}
                >
                  {language === "fa" ? "تست دیلود" : "Test Deload"}
                </button>
              </div>
              <button
                style={{ ...s.btn(dark ? "#2a2a2a" : "#ddd"), color: text, padding: "6px 10px", fontSize: 12 }}
                onClick={clearProgressionTestScenario}
                disabled={!activeExercisePrescription}
              >
                {language === "fa" ? "پاک کردن لاگ تستی این حرکت" : "Clear Test Logs For This Exercise"}
              </button>
            </div>

            {/* Rest Timer */}
            <div style={{ ...s.card, textAlign: "center", background: restRunning ? (dark ? "#1a1100" : "#fffbea") : card }}>
              <div style={{ fontSize: 13, color: sub, marginBottom: 6 }}>{language === "fa" ? "تایمر استراحت" : "Rest Timer"}</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: restRunning ? accent : text, letterSpacing: -2, marginBottom: 10 }}>
                {String(Math.floor(restTimer / 60)).padStart(2, "0")}:{String(restTimer % 60).padStart(2, "0")}
              </div>
              <div style={s.row}>
                <select style={{ ...s.input, width: "auto" }} value={restDuration} onChange={e => setRestDuration(Number(e.target.value))}>
                  <option value={60}>{language === "fa" ? "۶۰ ثانیه" : "60 sec"}</option>
                  <option value={90}>{language === "fa" ? "۹۰ ثانیه" : "90 sec"}</option>
                  <option value={120}>{language === "fa" ? "۲ دقیقه" : "2 min"}</option>
                  <option value={180}>{language === "fa" ? "۳ دقیقه" : "3 min"}</option>
                </select>
                {restRunning ? <button style={s.btn(red)} onClick={stopRest}>{language === "fa" ? "توقف" : "Stop"}</button> : <button style={s.btn()} onClick={startRest}>{language === "fa" ? "شروع" : "Start"}</button>}
              </div>
            </div>

            {/* Log Set */}
            <div style={s.card}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>{language === "fa" ? "ثبت ست جدید" : "Log New Set"}</div>
              {logFeedback && (
                <div style={{
                  background: dark ? "#0d1800" : "#efffe5",
                  border: "1px solid #4b8f1a",
                  color: dark ? "#c9ff8a" : "#255d00",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 12,
                  marginBottom: 10
                }}>
                  {language === "fa"
                    ? <>ست برای <strong>{getExerciseDisplayName(logFeedback.name, language)}</strong> ذخیره شد.{logFeedback.nextExercise ? ` حرکت بعدی پیشنهادی: ${getExerciseDisplayName(logFeedback.nextExercise, language)}` : " می‌توانی همین حرکت را ادامه بدهی یا تمرین را تمام کنی."}</>
                    : <>Set saved for <strong>{getExerciseDisplayName(logFeedback.name, language)}</strong>. {logFeedback.nextExercise ? `Suggested next exercise: ${getExerciseDisplayName(logFeedback.nextExercise, language)}` : "You can continue this exercise or finish the workout."}</>
                  }
                </div>
              )}
              {currentProgramDay && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                    {language === "fa" ? `حرکت‌های ${getProgramDayLabel(currentProgramDay.day, language)}` : `${getProgramDayLabel(currentProgramDay.day, language)} exercises`}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {currentProgramDay.exercises.map(ex => (
                      <button
                        key={ex}
                        onClick={() => setActiveSet(s => ({ ...s, name: ex }))}
                        style={{
                          ...s.btn(activeSet.name === ex ? accent : (dark ? "#222" : "#eee")),
                          color: activeSet.name === ex ? "#000" : text,
                          padding: "6px 12px",
                          fontSize: 12
                        }}
                      >
                        {getExerciseDisplayName(ex, language)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentProgramDay && (
                <div style={{ color: sub, fontSize: 12, marginBottom: 10 }}>
                  {nextSuggestedExercise
                    ? (language === "fa" ? `قدم بعدی پیشنهادی: ${getExerciseDisplayName(nextSuggestedExercise, language)}` : `Suggested next step: ${getExerciseDisplayName(nextSuggestedExercise, language)}`)
                    : (language === "fa" ? "برای تمام حرکت‌های روز فعال حداقل یک ثبت انجام شده است." : "At least one set has been logged for every exercise in the active day.")}
                </div>
              )}
              {activeExercisePrescription && (
                <div style={{
                  background: dark ? "#111a24" : "#eef7ff",
                  border: "1px solid #2f6ea5",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 10,
                  fontSize: 12,
                  color: dark ? "#dfefff" : "#214b77"
                }}>
                  {language === "fa" ? <>نسخه پیشنهادی برای <strong>{getExerciseDisplayName(activeExercisePrescription.name, language)}</strong>:</> : <>Recommended prescription for <strong>{getExerciseDisplayName(activeExercisePrescription.name, language)}</strong>:</>}
                  {" "} {language === "fa"
                    ? `${activeExercisePrescription.sets} ست · ${activeExercisePrescription.rep_range} تکرار · استراحت ${getRestRangeLabel(activeExercisePrescription.rest_range, language)} · شدت ${activeExercisePrescription.effort}`
                    : `${activeExercisePrescription.sets} sets · ${activeExercisePrescription.rep_range} reps · rest ${getRestRangeLabel(activeExercisePrescription.rest_range, language)} · effort ${activeExercisePrescription.effort}`}
                  {activeExercisePrescription.programming_focus ? ` · ${language === "fa" ? activeExercisePrescription.programming_focus : getProgrammingStyleLabel(runtimeUser.goal, language)}` : ""}
                  {activeExercisePrescription.adjustment_note && (
                    <div style={{ marginTop: 8, color: dark ? "#c4dfff" : "#214b77" }}>
                      {language === "fa" ? activeExercisePrescription.adjustment_note : "This exercise has been adjusted from recent training history and recovery trends."}
                    </div>
                  )}
                  {currentExerciseAdherence !== null && (
                    <>
                      <div style={{ marginTop: 8, color: dark ? "#b7d9ff" : "#214b77" }}>
                        {language === "fa" ? `پیشرفت این حرکت: ${currentExerciseLoggedSets}/${currentExerciseTargetSets} ست` : `Exercise progress: ${currentExerciseLoggedSets}/${currentExerciseTargetSets} sets`}
                        {currentExerciseRemainingSets > 0
                          ? (language === "fa" ? ` · ${currentExerciseRemainingSets} ست دیگر تا تکمیل نسخه` : ` · ${currentExerciseRemainingSets} more sets to complete the prescription`)
                          : (language === "fa" ? " · نسخه این حرکت کامل شده" : " · Prescription complete for this exercise")}
                      </div>
                      <div style={{ height: 6, background: dark ? "#243140" : "#d7e7f7", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${currentExerciseAdherence}%`,
                            background: currentExerciseAdherence >= 100 ? accent : "#6db7ff",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    <button
                      style={{ ...s.btn("#2f6ea5"), color: "#fff", padding: "6px 10px", fontSize: 12 }}
                      onClick={applyPrescriptionToActiveSet}
                    >
                      {language === "fa" ? "پر کردن فرم از نسخه" : "Fill From Prescription"}
                    </button>
                    <button
                      style={{ ...s.btn(dark ? "#243140" : "#d7e7f7"), color: dark ? "#e6f2ff" : "#214b77", padding: "6px 10px", fontSize: 12 }}
                      onClick={() => setRestDuration(getSuggestedRestSeconds(activeExercisePrescription.rest_range))}
                    >
                      {language === "fa" ? "تنظیم تایمر طبق نسخه" : "Set Timer From Prescription"}
                    </button>
                  </div>
                </div>
              )}
              {activeExerciseProgression && (
                <div style={{
                  background: dark ? "#16151f" : "#f6f1ff",
                  border: "1px solid #6d4cc2",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 10,
                  fontSize: 12,
                  color: dark ? "#e7ddff" : "#4d347d"
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{language === "fa" ? "پیشنهاد پیشروی جلسه بعد" : "Next Session Progression Suggestion"}</div>
                  <div style={{ marginBottom: 8 }}>{activeExerciseProgression.message}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {activeExerciseProgression.strategy && (
                      <span style={s.tag(
                        activeExerciseProgression.strategy === "deload" ? "#8a0a0a"
                          : activeExerciseProgression.strategy === "plateau_reset" ? "#8a450a"
                          : activeExerciseProgression.strategy === "increase_load" ? "#0a8a2e"
                          : activeExerciseProgression.strategy === "consolidate" ? "#b88400"
                          : activeExerciseProgression.strategy === "hold" ? "#8a450a"
                          : "#6d4cc2"
                      )}>
                        {getProgressionStrategyLabel(activeExerciseProgression.strategy, language)}
                      </span>
                    )}
                    {typeof activeExerciseProgression.average_adherence === "number" && (
                      <span style={s.tag("#444")}>{language === "fa" ? `میانگین پایبندی اخیر: ${activeExerciseProgression.average_adherence}%` : `Recent average adherence: ${activeExerciseProgression.average_adherence}%`}</span>
                    )}
                    {typeof activeExerciseProgression.average_reps === "number" && (
                      <span style={s.tag("#444")}>{language === "fa" ? `میانگین تکرار اخیر: ${activeExerciseProgression.average_reps}` : `Recent average reps: ${activeExerciseProgression.average_reps}`}</span>
                    )}
                  </div>
                  <div style={{ color: dark ? "#beb4d8" : "#5f4f83", fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
                    {getProgressionExplanation(activeExerciseProgression, language)}
                  </div>
                  <button
                    style={{ ...s.btn("#6d4cc2"), color: "#fff", padding: "6px 10px", fontSize: 12 }}
                    onClick={() => setActiveSet(s => ({
                      ...s,
                      name: activeExercisePrescription.name,
                      weight: String(activeExerciseProgression.suggestedWeight || ""),
                      reps: String(activeExerciseProgression.suggestedReps || ""),
                      sets: String(activeExerciseProgression.suggestedSets || ""),
                    }))}
                  >
                    {language === "fa" ? "استفاده از پیشنهاد" : "Use Suggestion"}
                  </button>
                </div>
              )}
              <select style={{ ...s.input, marginBottom: 8 }} value={activeSet.name} onChange={e => setActiveSet(s => ({ ...s, name: e.target.value }))}>
                <option value="">{language === "fa" ? "انتخاب حرکت..." : "Select Exercise..."}</option>
                {userFilteredExercises.map(e => <option key={e.id} value={e.name}>{getExerciseDisplayName(e, language)}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                <input style={s.input} type="number" placeholder={language === "fa" ? "وزن (kg)" : "Weight (kg)"} value={activeSet.weight} onChange={e => setActiveSet(s => ({ ...s, weight: e.target.value }))} />
                <input style={s.input} type="number" placeholder={language === "fa" ? "تکرار" : "Reps"} value={activeSet.reps} onChange={e => setActiveSet(s => ({ ...s, reps: e.target.value }))} />
                <input style={s.input} type="number" placeholder={language === "fa" ? "ست" : "Sets"} value={activeSet.sets} onChange={e => setActiveSet(s => ({ ...s, sets: e.target.value }))} />
              </div>
              {activeExercisePrescription && (
                <div style={{ color: sub, fontSize: 12, marginBottom: 10, lineHeight: 1.8 }}>
                  {language === "fa"
                    ? <>هدف سریع این حرکت: {activeExercisePrescription.sets} ست در بازه {activeExercisePrescription.rep_range}{activeExerciseProgression?.suggestedWeight ? ` · اگر فرم خوب بود ${activeExerciseProgression.suggestedWeight}kg را هم در نظر بگیر` : ""}</>
                    : <>Quick target for this exercise: {activeExercisePrescription.sets} sets in the {activeExercisePrescription.rep_range} range{activeExerciseProgression?.suggestedWeight ? ` · if form stays clean, consider ${activeExerciseProgression.suggestedWeight}kg` : ""}</>}
                </div>
              )}
              <button
                style={{
                  ...s.btn(activeSet.name && activeSet.weight && activeSet.reps ? accent : (dark ? "#2a2a2a" : "#ddd")),
                  width: "100%",
                  color: activeSet.name && activeSet.weight && activeSet.reps ? "#000" : sub,
                  cursor: activeSet.name && activeSet.weight && activeSet.reps ? "pointer" : "not-allowed"
                }}
                onClick={logSet}
                disabled={!(activeSet.name && activeSet.weight && activeSet.reps)}
              >
                {language === "fa" ? "✅ ثبت ست" : "✅ Log Set"}
              </button>
            </div>

            {/* Finish Workout */}
            {workoutLog.length > 0 && (
              <button style={{ ...s.btn("#22aa44"), width: "100%", marginBottom: 12, fontSize: 16, padding: "14px 0" }} onClick={finishWorkout}>
                {language === "fa" ? `🏁 پایان تمرین و دریافت XP (+${calcXPForWorkout(workoutLog.length)} XP)` : `🏁 Finish Workout and Earn XP (+${calcXPForWorkout(workoutLog.length)} XP)`}
              </button>
            )}

            {/* Log History */}
            {workoutLog.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, color: sub }}>{language === "fa" ? "ثبت‌های جلسه جاری" : "Current Session Logs"}</div>
                {workoutLog.map(l => (
                  <div key={l.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "12px 16px" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{getExerciseDisplayName(l.name, language)}</div>
                      <div style={{ color: sub, fontSize: 12 }}>
                        {l.date}
                        {l.program_name ? ` · ${language === "fa" ? l.program_name : "Smart Recommendation"}` : ""}
                        {l.day_name ? ` · ${getProgramDayLabel(l.day_name, language)}` : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ color: accent, fontWeight: 800 }}>{l.weight}kg</span>
                      <span style={{ color: sub, fontSize: 13 }}>{language === "fa" ? ` × ${l.reps} تکرار` : ` × ${l.reps} reps`}</span>
                      {l.sets && <span style={{ color: sub, fontSize: 13 }}>{language === "fa" ? ` × ${l.sets} ست` : ` × ${l.sets} sets`}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROGRAMS */}
        {tab === "programs" && (
          <div>
            <div style={s.title}>{tr(language, "workout_programs")}</div>
            <div style={{ ...s.card, background: dark ? "#101010" : "#fffdf5", border: `1px solid ${border}` }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{language === "fa" ? "خلاصه برنامه شما" : "Your Program Summary"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9, marginBottom: 14 }}>
                {planTrustCopy}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {planSummaryItems.map(item => (
                  <div key={item.label} style={{ background: dark ? "#171717" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {(runtimeUser.injury_or_limitation_flags || []).length > 0 && !runtimeUser.injury_or_limitation_flags.includes("ندارم") && (
                <div style={{ color: sub, fontSize: 12, marginBottom: 10 }}>
                  {language === "fa" ? "محدودیت‌های درنظرگرفته‌شده" : "Included limitations"}: {getDisplayLimitations(runtimeUser.injury_or_limitation_flags, language)}
                </div>
              )}
              <div style={{
                background: dark ? "#17131f" : "#faf5ff",
                border: "1px solid #6d4cc2",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 10
              }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "چرا این برنامه برای تو انتخاب شد" : "Why This Program Was Chosen For You"}</div>
                <div style={{ color: sub, fontSize: 12, lineHeight: 1.9 }}>
                  {planExplanation.reasons.map((item, index) => (
                    <div key={index}>• {item}</div>
                  ))}
                  {planExplanation.adjustments.map((item, index) => (
                    <div key={`a-${index}`}>• {item}</div>
                  ))}
                </div>
              </div>
              <div style={{
                background: dark ? "#121922" : "#f3f8ff",
                border: `1px solid ${dark ? "#2b4157" : "#c7d9ef"}`,
                borderRadius: 12,
                padding: "10px 12px",
                color: sub,
                fontSize: 12,
                lineHeight: 1.9,
                marginBottom: 10
              }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>{language === "fa" ? "یادآوری اعتماد و ایمنی" : "Trust & Safety Reminder"}</div>
                <div>{language === "fa" ? TRUST_BASELINE_COPY : TRUST_BASELINE_COPY_EN}</div>
                <div style={{ marginTop: 4 }}>{planDisclaimerCopy}</div>
              </div>
              <button style={{ ...s.btn(), width: "100%" }} onClick={() => activateProgram(recommendedProgram)}>
                {language === "fa" ? "مشاهده و شروع برنامه پیشنهادی" : "View and Start Recommended Program"}
              </button>
            </div>
            <div style={{ ...s.card, border: `1px solid ${accent}`, background: dark ? "#141b00" : "#f8ffe7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 17, marginBottom: 6 }}>{getProgramNameLabel(recommendedProgram, language)}</div>
                  <div style={{ color: sub, fontSize: 13, marginBottom: 8 }}>
                    {language === "fa" ? "این پیشنهاد از روی هدف، سطح، تعداد روز، ریکاوری و مدت‌زمان جلسه تو ساخته شده." : "This recommendation is built from your goal, level, training days, recovery, and session duration."}
                  </div>
                  <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                    {getProgrammingStyleLabel(recommendedProgram.goal_key || recommendedProgram.goal, language)}
                    {recommendedProgram.programming_cue ? ` · ${getProgrammingCueLabel(recommendedProgram.goal_key || recommendedProgram.goal, language)}` : ""}
                  </div>
                  <div style={s.row}>
                    <span style={s.tag("#0a8a2e")}>{getDisplayTrainingLevel(recommendedProgram.training_level, language)}</span>
                    <span style={s.tag("#5a2de8")}>{getDisplayGoal(recommendedProgram.goal_key || recommendedProgram.goal, language)}</span>
                    <span style={s.tag("#b38b00")}>{getSplitLabel(recommendedProgram.split.split_family, language)}</span>
                  </div>
                </div>
              </div>
              {recommendedProgram.split.notes.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  {recommendedProgram.split.notes.map(note => (
                    <div key={note} style={{ color: sub, fontSize: 12, marginBottom: 4 }}>
                      • {splitNoteLabels[note] || note}
                    </div>
                  ))}
                </div>
              )}
              <div style={{
                background: dark ? "#171717" : "#fff",
                border: `1px solid ${border}`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 12
              }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "منطق انتخاب این پیشنهاد" : "Selection Logic Behind This Recommendation"}</div>
                <div style={{ color: sub, fontSize: 12, lineHeight: 1.9, marginBottom: planExplanation.nextChecks.length ? 8 : 0 }}>
                  {planExplanation.reasons.map((item, index) => (
                    <div key={`r-${index}`}>• {item}</div>
                  ))}
                  {planExplanation.adjustments.map((item, index) => (
                    <div key={`adj-${index}`}>• {item}</div>
                  ))}
                </div>
                {planExplanation.nextChecks.length > 0 && (
                  <div style={{ color: sub, fontSize: 12, lineHeight: 1.9, borderTop: `1px solid ${border}`, paddingTop: 8 }}>
                    <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>{language === "fa" ? "چه چیزی بعداً این برنامه را تغییر می‌دهد" : "What Will Change This Program Later"}</div>
                    {planExplanation.nextChecks.map((item, index) => (
                      <div key={`n-${index}`}>• {item}</div>
                    ))}
                  </div>
                )}
              </div>
              {recommendedProgram.days.map((day, i) => (
                <div key={i} style={{ background: dark ? "#1a1a1a" : "#fff", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: accent }}>{getProgramDayLabel(day.day, language)}</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {(day.prescriptions || []).map((item, j) => (
                      <div key={j} style={{ background: dark ? "#2a2a2a" : "#eee", padding: "8px 10px", borderRadius: 8, fontSize: 13 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{getExerciseDisplayName(item.name, language)}</div>
                        <div style={{ color: sub, fontSize: 12 }}>
                          {language === "fa" ? `${item.sets} ست · ${item.rep_range} تکرار · استراحت ${getRestRangeLabel(item.rest_range, language)} · شدت ${item.effort}` : `${item.sets} sets · ${item.rep_range} reps · rest ${getRestRangeLabel(item.rest_range, language)} · effort ${item.effort}`}
                        </div>
                        {item.adjustment_note && (
                          <div style={{ color: sub, fontSize: 11, marginTop: 4 }}>{language === "fa" ? item.adjustment_note : "Prescription adjusted from recent history and recovery context."}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button style={{ ...s.btn(), width: "100%", marginTop: 6 }} onClick={() => activateProgram(recommendedProgram)}>
                {language === "fa" ? "✨ استفاده از برنامه پیشنهادی" : "✨ Use Recommended Program"}
              </button>
            </div>
            {staticPrograms.map(prog => (
              <div key={prog.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{getProgramNameLabel(prog, language)}</div>
                    <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                      {getProgrammingStyleLabel(prog.goal_key || prog.goal, language)}
                      {prog.programming_cue ? ` · ${getProgrammingCueLabel(prog.goal_key || prog.goal, language)}` : ""}
                    </div>
                    <div style={s.row}>
                      <span style={s.tag(getDisplayTrainingLevel(prog.training_level) === "مبتدی" ? "#0a8a2e" : getDisplayTrainingLevel(prog.training_level) === "متوسط" ? "#e87e0a" : "#8a0a0a")}>
                        {getDisplayTrainingLevel(prog.training_level, language)}
                      </span>
                      <span style={s.tag("#5a2de8")}>{getDisplayGoal(prog.goal_key || prog.goal, language)}</span>
                      {prog.split?.split_family && <span style={s.tag("#b38b00")}>{getSplitLabel(prog.split.split_family, language)}</span>}
                    </div>
                  </div>
                </div>
                {prog.days.map((day, i) => (
                  <div key={i} style={{ background: dark ? "#1a1a1a" : "#f8f8f8", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, color: accent }}>{getProgramDayLabel(day.day, language)}</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {(day.prescriptions || []).map((item, j) => (
                        <div key={j} style={{ background: dark ? "#2a2a2a" : "#eee", padding: "8px 10px", borderRadius: 8, fontSize: 13 }}>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>{getExerciseDisplayName(item.name, language)}</div>
                          <div style={{ color: sub, fontSize: 12 }}>
                            {language === "fa" ? `${item.sets} ست · ${item.rep_range} تکرار · استراحت ${getRestRangeLabel(item.rest_range, language)} · شدت ${item.effort}` : `${item.sets} sets · ${item.rep_range} reps · rest ${getRestRangeLabel(item.rest_range, language)} · effort ${item.effort}`}
                          </div>
                          {item.adjustment_note && (
                            <div style={{ color: sub, fontSize: 11, marginTop: 4 }}>{language === "fa" ? item.adjustment_note : "Prescription adjusted from recent history and recovery context."}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button style={{ ...s.btn(), width: "100%", marginTop: 6 }} onClick={() => activateProgram(prog)}>
                  {language === "fa" ? "🚀 شروع این برنامه" : "🚀 Start This Program"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PROGRESS */}
        {tab === "progress" && (
          <div>
            <div style={s.title}>{tr(language, "progress_tracking")}</div>

            {/* Stats */}
            <div style={{ ...s.grid2, marginBottom: 14 }}>
              {[
                { label: tr(language, "current_weight"), val: currentWeightValue !== null ? `${currentWeightValue} kg` : "—", color: accent },
                { label: tr(language, "total_change"), val: `${totalWeightChange} kg`, color: red },
                { label: tr(language, "sessions_last_7_days"), val: weeklySessionKeys.length, color: "#0af" },
                { label: tr(language, "logged_exercises"), val: uniqueLoggedExercises, color: "#a0f" },
                { label: tr(language, "average_adherence"), val: averagePrescriptionAdherence !== null ? `${averagePrescriptionAdherence}%` : "—", color: "#8a5cff" },
                { label: tr(language, "latest_adherence"), val: latestSessionAdherence !== null ? `${latestSessionAdherence}%` : "—", color: "#6d4cc2" },
              ].map((item, i) => (
                <div key={i} style={{ ...s.stat, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ ...s.card, background: dark ? "#11161a" : "#f6fbff" }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "خلاصه عملکرد تمرینی" : "Training Performance Summary"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: latestSessionEntries.length ? 12 : 0 }}>
                <div style={{ background: dark ? "#1a1f24" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: accent }}>{uniqueSessionKeys.length}</div>
                  <div style={{ fontSize: 12, color: sub }}>{language === "fa" ? "کل sessionهای ثبت‌شده" : "Total Logged Sessions"}</div>
                </div>
                <div style={{ background: dark ? "#1a1f24" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: accent }}>{totalLoggedVolume}</div>
                  <div style={{ fontSize: 12, color: sub }}>{language === "fa" ? "حجم کل ثبت‌شده" : "Total Logged Volume"}</div>
                </div>
              </div>
              {latestSessionEntries.length > 0 ? (
                <div style={{ color: sub, fontSize: 13, lineHeight: 1.9 }}>
                  <div>{language === "fa" ? "آخرین جلسه:" : "Latest session:"} {formatLocalizedDate(latestSessionEntries[0].created_at || latestSessionEntries[0].date, language)}{latestSessionEntries[0].program_name ? ` · ${getProgramNameFromStoredLabel(latestSessionEntries[0].program_name, language)}` : ""}{latestSessionEntries[0].day_name ? ` · ${getProgramDayLabel(latestSessionEntries[0].day_name, language)}` : ""}</div>
                  <div>{latestSessionExercises} {language === "fa" ? "حرکت منحصربه‌فرد" : "unique exercises"} · {language === "fa" ? "حجم تقریبی" : "Approx. volume"} {latestSessionVolume}</div>
                  {latestSessionAdherence !== null && (
                    <div>{language === "fa" ? "پایبندی به prescription در آخرین جلسه" : "Latest session prescription adherence"}: {latestSessionAdherence}%</div>
                  )}
                </div>
              ) : (
                <div style={{ color: sub, fontSize: 13 }}>{tr(language, "no_sessions_yet")}</div>
              )}
            </div>

            <div style={{ ...s.card, background: dark ? "#12131b" : "#faf7ff" }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "تحلیل روند اخیر" : "Recent Trend Analysis"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[
                  {
                    label: language === "fa" ? "روند پایبندی" : "Adherence Trend",
                    val: adherenceTrendDirection === "up" ? (language === "fa" ? "رو به بهبود" : "Improving")
                      : adherenceTrendDirection === "down" ? (language === "fa" ? "رو به افت" : "Declining")
                      : recentAverageAdherence !== null ? (language === "fa" ? "پایدار" : "Stable") : (language === "fa" ? "نامشخص" : "Unknown"),
                    color: adherenceTrendDirection === "up" ? "#0a8a2e" : adherenceTrendDirection === "down" ? "#c43c3c" : "#8a5cff",
                  },
                  {
                    label: language === "fa" ? "روند حجم" : "Volume Trend",
                    val: volumeTrendDirection === "up" ? (language === "fa" ? "رو به افزایش" : "Rising")
                      : volumeTrendDirection === "down" ? (language === "fa" ? "رو به کاهش" : "Falling")
                      : recentAverageVolume > 0 ? (language === "fa" ? "تقریباً ثابت" : "Mostly steady") : (language === "fa" ? "نامشخص" : "Unknown"),
                    color: volumeTrendDirection === "up" ? "#0af" : volumeTrendDirection === "down" ? "#e87e0a" : "#6d4cc2",
                  },
                  {
                    label: language === "fa" ? "ریتم هفتگی" : "Weekly Rhythm",
                    val: weeklySessionKeys.length >= 4 ? (language === "fa" ? "پایدار" : "Stable")
                      : weeklySessionKeys.length >= 2 ? (language === "fa" ? "متوسط" : "Moderate")
                      : uniqueSessionKeys.length > 0 ? (language === "fa" ? "ناپایدار" : "Inconsistent") : (language === "fa" ? "نامشخص" : "Unknown"),
                    color: sessionCadenceColor,
                  },
                ].map(item => (
                  <div key={item.label} style={{ background: dark ? "#1a1d26" : "#fff", borderRadius: 10, padding: "12px 10px" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: item.color, marginBottom: 4 }}>{item.val}</div>
                    <div style={{ fontSize: 12, color: sub }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gap: 8, fontSize: 12, color: sub, lineHeight: 1.9 }}>
                <div>• {consistencySummary}</div>
                <div>• {volumeSummary}</div>
                <div>• {sessionCadenceLabel}</div>
                {recentAverageAdherence !== null && previousAverageAdherence !== null && (
                  <div>
                    • {language === "fa"
                      ? `میانگین پایبندی ۳ جلسه اخیر: ${recentAverageAdherence}% در برابر ${previousAverageAdherence}% در ۳ جلسه قبل`
                      : `Average adherence across the last 3 sessions: ${recentAverageAdherence}% vs ${previousAverageAdherence}% in the previous 3 sessions`}
                  </div>
                )}
                {recentAverageVolume > 0 && previousAverageVolume > 0 && (
                  <div>
                    • {language === "fa"
                      ? `میانگین حجم ۳ جلسه اخیر: ${recentAverageVolume} در برابر ${previousAverageVolume} در ۳ جلسه قبل`
                      : `Average volume across the last 3 sessions: ${recentAverageVolume} vs ${previousAverageVolume} in the previous 3 sessions`}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                ...s.card,
                background: goalSpecificProgress.tone === "strong"
                  ? (dark ? "#0f1911" : "#f1fff2")
                  : goalSpecificProgress.tone === "caution"
                    ? (dark ? "#1f1408" : "#fff8ea")
                    : (dark ? "#15131d" : "#f7f3ff"),
                border: `1px solid ${goalSpecificProgress.tone === "strong"
                  ? "#0a8a2e"
                  : goalSpecificProgress.tone === "caution"
                    ? "#b88400"
                    : "#6d4cc2"}`,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8 }}>
                {language === "fa" ? "تفسیر این روند برای هدف" : "How To Read This Trend For"} {getDisplayGoal(runtimeUser.goal, language)}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  marginBottom: 6,
                  color: goalSpecificProgress.tone === "strong"
                    ? "#0a8a2e"
                    : goalSpecificProgress.tone === "caution"
                      ? "#b88400"
                      : "#8a5cff",
                }}
              >
                {goalSpecificProgress.title}
              </div>
              <div style={{ color: sub, fontSize: 12, lineHeight: 1.9 }}>
                {goalSpecificProgress.summary}
              </div>
            </div>

            {/* Chart */}
            <div style={s.card}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>{language === "fa" ? "نمودار وزن" : "Weight Chart"}</div>
              <svg width="100%" height="140" viewBox={`0 0 ${progressData.length * 60} 140`} style={{ overflow: "visible" }}>
                <polyline
                  points={progressData.map((d, i) => `${i * 60 + 20},${120 - ((d.weight - minW) / range) * 100}`).join(" ")}
                  fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round"
                />
                {progressData.map((d, i) => (
                  <g key={i}>
                    <circle cx={i * 60 + 20} cy={120 - ((d.weight - minW) / range) * 100} r="5" fill={accent} />
                    <text x={i * 60 + 20} y={135} textAnchor="middle" fill={sub} fontSize="10">{d.weight}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Add Weight */}
            <div style={s.card}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{language === "fa" ? "ثبت وزن امروز" : "Log Today’s Weight"}</div>
              <div style={s.row}>
                <input style={s.input} type="number" placeholder={language === "fa" ? "وزن (kg)" : "Weight (kg)"} value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                <button
                  style={{
                    ...s.btn(parsedNewWeight > 0 ? accent : (dark ? "#2a2a2a" : "#ddd")),
                    color: parsedNewWeight > 0 ? "#000" : sub,
                    cursor: parsedNewWeight > 0 ? "pointer" : "not-allowed"
                  }}
                  disabled={!(parsedNewWeight > 0)}
                  onClick={() => {
                    if (!(parsedNewWeight > 0)) return;
                    setProgressData(p => [...p, { created_at: Date.now(), date: formatLocalizedDate(Date.now(), language), weight: parsedNewWeight }]);
                    setNewWeight("");
                  }}
                >{language === "fa" ? "ثبت" : "Save"}</button>
              </div>
            </div>
          </div>
        )}

        {/* GAMIFICATION */}
        {tab === "profile" && (
          <div>
            <div style={s.title}>{language === "fa" ? "پروفایل" : "Profile"}</div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "اطلاعات حساب" : "Account Info"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9 }}>
                <div>{language === "fa" ? "نام" : "Name"}: {runtimeUser.name}</div>
                <div>{language === "fa" ? "ایمیل" : "Email"}: {runtimeUser.email}</div>
                <div>{language === "fa" ? "جنسیت" : "Sex"}: {getDisplaySexLabel(runtimeUser.sex, language)}</div>
                <div>{language === "fa" ? "قد / وزن" : "Height / Weight"}: {runtimeUser.height || "—"}cm / {runtimeUser.weight || "—"}kg</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "اهداف" : "Goals"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={s.stat}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: accent }}>{getDisplayGoal(runtimeUser.goal, language)}</div>
                  <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{language === "fa" ? "هدف فعلی" : "Current Goal"}</div>
                </div>
                <div style={s.stat}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0af" }}>{getDisplayTrainingLevel(runtimeUser.training_level, language)}</div>
                  <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{language === "fa" ? "سطح تمرینی" : "Training Level"}</div>
                </div>
              </div>
              <div style={{ color: sub, fontSize: 12, marginTop: 10, lineHeight: 1.8 }}>
                {language === "fa"
                  ? `${runtimeUser.training_days_per_week || "—"} روز در هفته · ${runtimeUser.session_duration || "—"} دقیقه · ${getDisplayEquipmentLabel(runtimeUser.equipment_access, language)}`
                  : `${runtimeUser.training_days_per_week || "—"} days/week · ${runtimeUser.session_duration || "—"} min · ${getDisplayEquipmentLabel(runtimeUser.equipment_access, language)}`}
              </div>
            </div>

            <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 15 }}>{language === "fa" ? "🏅 دستاوردها و نشان‌ها" : "🏅 Achievements & Badges"}</div>

            <div style={{ ...s.card, background: dark ? "#0e0e1a" : "#f0f0ff", border: `2px solid ${levelInfo.color}44`, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: sub, marginBottom: 2 }}>{language === "fa" ? "اسنپ‌شات لول" : "Level Snapshot"}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: levelInfo.color }}>Level {levelInfo.level}</div>
                  <div style={{ fontSize: 15, color: text, fontWeight: 700 }}>{getLevelTitle(levelInfo, language)}</div>
                </div>
                <div style={{ fontSize: 52 }}>
                  {["🌱","⚡","💫","🔥","🏅","🏆","⚔️","💎","👑","🔮"][levelInfo.level - 1]}
                </div>
              </div>
              <div style={{ height: 10, background: dark ? "#2a2a2a" : "#ddd", borderRadius: 5, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${xpProgress}%`, background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}88)`, borderRadius: 5, boxShadow: `0 0 10px ${levelInfo.color}66` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: sub }}>
                <span>{gameData.xp} XP</span>
                <span>{language === "fa" ? `تا لول بعدی: ${levelInfo.maxXP - gameData.xp} XP` : `To next level: ${levelInfo.maxXP - gameData.xp} XP`}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { icon: "🔥", label: language === "fa" ? "استریک" : "Streak", val: language === "fa" ? `${gameData.streak} روز` : `${gameData.streak} days`, color: "#ff6600" },
                { icon: "⚡", label: language === "fa" ? "کل XP" : "Total XP", val: gameData.xp.toLocaleString(), color: accent },
                { icon: "💪", label: language === "fa" ? "کل تمرین" : "Total Workouts", val: gameData.totalWorkouts, color: "#0af" },
                { icon: "🎯", label: language === "fa" ? "کل ست" : "Total Sets", val: gameData.totalSets, color: "#a0f" },
              ].map((item, i) => (
                <div key={i} style={{ ...s.card, textAlign: "center", padding: 16, marginBottom: 0 }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: sub }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {BADGES.map(b => {
                const earned = (gameData.badges || []).includes(b.id);
                const badgeLabel = getBadgeLabel(b, language);
                return (
                  <div key={b.id} style={{ ...s.card, padding: "14px 12px", marginBottom: 0, opacity: earned ? 1 : 0.35, border: earned ? `1px solid ${accent}44` : `1px solid ${border}` }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{badgeLabel.title}</div>
                    <div style={{ fontSize: 11, color: sub }}>{badgeLabel.desc}</div>
                    {earned && <div style={{ fontSize: 10, color: accent, marginTop: 4, fontWeight: 700 }}>{language === "fa" ? "✅ کسب‌شده" : "✅ Earned"}</div>}
                  </div>
                );
              })}
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "اشتراک" : "Subscription"}</div>
              <div style={{ color: sub, fontSize: 13, lineHeight: 1.9 }}>
                <div>{language === "fa" ? "وضعیت پلن" : "Plan Status"}: {language === "fa" ? "نسخه محلی / توسعه" : "Local Build / Development"}</div>
                <div>{language === "fa" ? "وضعیت دسترسی" : "Access"}: {language === "fa" ? "همه قابلیت‌های فعلی باز هستند" : "Current features are unlocked in this build"}</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "نوتیفیکیشن‌ها" : "Notifications"}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { key: "workout", label: language === "fa" ? "یادآور تمرین" : "Workout Reminder" },
                  { key: "nutrition", label: language === "fa" ? "یادآور تغذیه" : "Nutrition Reminder" },
                ].map((item) => (
                  <div key={item.key} style={{ ...s.stat, display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "unset" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{item.label}</div>
                    <button
                      style={{ ...s.btn(profileNotifications[item.key] ? accent : (dark ? "#2a2a2a" : "#ddd")), color: profileNotifications[item.key] ? "#000" : sub, padding: "8px 12px", fontSize: 12 }}
                      onClick={() => setProfileNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    >
                      {profileNotifications[item.key]
                        ? (language === "fa" ? "روشن" : "On")
                        : (language === "fa" ? "خاموش" : "Off")}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "زبان" : "Language"}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: 4, borderRadius: 999, background: dark ? "#171717" : "#efefef", border: `1px solid ${border}` }}>
                <button type="button" onClick={() => setLanguage("en")} style={{ minWidth: 52, textAlign: "center", padding: "8px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: language === "en" ? "#111" : sub, background: language === "en" ? accent : "transparent", border: "none", cursor: "pointer" }}>English</button>
                <button type="button" onClick={() => setLanguage("fa")} style={{ minWidth: 52, textAlign: "center", padding: "8px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: language === "fa" ? "#111" : sub, background: language === "fa" ? accent : "transparent", border: "none", cursor: "pointer" }}>فارسی</button>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "تنظیمات" : "Settings"}</div>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ ...s.stat, display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "unset" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{language === "fa" ? "حالت نمایش" : "Appearance"}</div>
                    <div style={{ fontSize: 11, color: sub }}>{dark ? (language === "fa" ? "تیره" : "Dark") : (language === "fa" ? "روشن" : "Light")}</div>
                  </div>
                  <button style={{ ...s.btn(dark ? "#2a2a2a" : "#ddd"), color: text, padding: "8px 12px", fontSize: 12 }} onClick={() => setDark(d => !d)}>
                    {dark ? (language === "fa" ? "روشن" : "Light Mode") : (language === "fa" ? "تیره" : "Dark Mode")}
                  </button>
                </div>
                <div style={{ ...s.stat, display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "unset" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{language === "fa" ? "حساب کاربری" : "Account"}</div>
                    <div style={{ fontSize: 11, color: sub }}>{language === "fa" ? "خروج از این دستگاه" : "Sign out from this device"}</div>
                  </div>
                  <button style={{ ...s.btn("#5a1a1a"), padding: "8px 12px", fontSize: 12 }} onClick={onLogout}>
                    {tr(language, "logout")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NUTRITION */}
        {tab === "nutrition" && (
          <div>
            <div style={s.title}>{tr(language, "nutrition_title")}</div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "خلاصه تغذیه" : "Nutrition Summary"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: language === "fa" ? "کالری" : "Calories", value: `${Math.round(totalCals)} kcal`, color: accent },
                  { label: language === "fa" ? "وضعیت امروز" : "Daily Status", value: foodLog.length > 0 ? (language === "fa" ? "ثبت فعال" : "Active logging") : (language === "fa" ? "بدون ثبت" : "No logs yet"), color: "#0af" },
                  { label: language === "fa" ? "پروتئین / کرب / چربی" : "Protein / Carbs / Fat", value: `${Math.round(totalProtein)} / ${Math.round(totalCarbs)} / ${Math.round(totalFat)}g`, color: "#8a5cff" },
                  { label: language === "fa" ? "آب" : "Water", value: `${waterGlasses} ${language === "fa" ? "لیوان" : "glasses"}`, color: "#2f6ea5" },
                ].map((item) => (
                  <div key={item.label} style={{ ...s.stat, border: `1px solid ${border}` }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...s.card, background: dark ? "#0f1800" : "#f5ffe8" }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: accent }}>{language === "fa" ? "شمارش کالری" : "Calorie Counter"}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: accent, marginBottom: 8 }}>{Math.round(totalCals)} <span style={{ fontSize: 18, color: sub }}>kcal</span></div>
              <div style={{ color: sub, fontSize: 12 }}>{language === "fa" ? "مصرف فعلی امروز" : "Current intake today"}</div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "ماکروها" : "Macros"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[[language === "fa" ? "پروتئین" : "Protein", totalProtein, "#0af"], [language === "fa" ? "کربوهیدرات" : "Carbs", totalCarbs, "#fa0"], [language === "fa" ? "چربی" : "Fat", totalFat, "#f0a"]].map(([label, val, color]) => (
                  <div key={label} style={s.stat}>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{Math.round(val)}g</div>
                    <div style={{ fontSize: 11, color: sub }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontWeight: 700, marginBottom: 8 }}>{language === "fa" ? "لاگ غذا" : "Food Log"}</div>
            {FOODS.map((food, i) => (
              <div key={i} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{getFoodDisplayName(food, language)}</div>
                  <div style={{ color: sub, fontSize: 12 }}>{food.cal} kcal | P:{food.p}g C:{food.c}g F:{food.f}g</div>
                </div>
                <button style={{ ...s.btn(), padding: "6px 14px", fontSize: 13 }} onClick={() => addFood(food)}>+</button>
              </div>
            ))}

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "ردیاب آب" : "Water Tracker"}</div>
              <div style={{ color: sub, fontSize: 13, marginBottom: 10 }}>{language === "fa" ? "لیوان‌های امروز را ثبت کن" : "Track today’s glasses"}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button style={{ ...s.btn(dark ? "#222" : "#eee"), color: text }} onClick={() => setWaterGlasses(v => Math.max(0, v - 1))}>-</button>
                <div style={{ fontWeight: 900, fontSize: 22, minWidth: 40, textAlign: "center" }}>{waterGlasses}</div>
                <button style={s.btn()} onClick={() => setWaterGlasses(v => v + 1)}>+</button>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "برنامه غذایی" : "Meal Plan"}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {suggestedMeals.map((meal) => (
                  <div key={meal} style={{ background: dark ? "#171717" : "#fff", border: `1px solid ${border}`, borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontWeight: 700 }}>{meal}</div>
                  </div>
                ))}
              </div>
            </div>

            {foodLog.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, color: sub }}>{language === "fa" ? "ثبت‌های امروز" : "Today's Entries"}</div>
                {foodLog.map(f => (
                  <div key={f.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", padding: "10px 14px", marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{getFoodDisplayName(f, language)}</span>
                    <span style={{ color: accent, fontWeight: 700 }}>{f.cal} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI COACH */}
        {tab === "coach" && (
          <div>
            <div style={s.title}>{tr(language, "smart_coach")}</div>
            <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
              <div style={s.card}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>{language === "fa" ? "توصیه‌های شخصی‌سازی‌شده" : "Personalized Recommendations"}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {coachRecommendations.map((item) => (
                    <div
                      key={item.title}
                      style={{
                        background: dark ? "#171717" : "#f7f7f7",
                        border: `1px solid ${border}`,
                        borderRadius: 12,
                        padding: "10px 12px"
                      }}
                    >
                      <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ color: sub, fontSize: 13, lineHeight: 1.8 }}>{item.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={s.card}>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "راهنمای تمرین" : "Workout Advice"}</div>
                  <div style={{ color: sub, fontSize: 13, lineHeight: 1.8 }}>{workoutAdviceText}</div>
                </div>
                <div style={s.card}>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "راهنمای تغذیه" : "Nutrition Advice"}</div>
                  <div style={{ color: sub, fontSize: 13, lineHeight: 1.8 }}>{nutritionAdviceText}</div>
                </div>
              </div>

              <div style={s.card}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{language === "fa" ? "منطق تغییر برنامه" : "Plan Adjustment"}</div>
                <div style={{ color: sub, fontSize: 13, lineHeight: 1.8 }}>{planAdjustmentText}</div>
              </div>
            </div>

            <div style={{ ...s.card, background: dark ? "#0a0a1a" : "#f0f0ff", border: `1px solid ${dark ? "#2a2a5a" : "#c0c0ff"}` }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{language === "fa" ? "چت با مربی AI" : "AI Chat"}</div>
              <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>{tr(language, "ai_intro")}</div>
              <div style={{
                background: dark ? "#11162a" : "#f6f4ff",
                border: `1px solid ${dark ? "#38407a" : "#d2cbff"}`,
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 12,
                color: sub,
                lineHeight: 1.9,
                marginBottom: 12
              }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>{tr(language, "ai_boundary")}</div>
                <div>{language === "fa" ? "پاسخ‌های این بخش برای راهنمایی عمومی تمرینی هستند و جای پزشک، فیزیوتراپیست یا مربی حضوری را نمی‌گیرند." : "Answers in this section are for general training guidance and do not replace a doctor, physiotherapist, or in-person coach."}</div>
                <div style={{ marginTop: 4 }}>{language === "fa" ? DISCLAIMER_BASELINE_COPY : DISCLAIMER_BASELINE_COPY_EN}</div>
              </div>
              <div style={{
                background: dark ? "#101625" : "#eef4ff",
                border: `1px solid ${dark ? "#2f4069" : "#c3d4f5"}`,
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 12
              }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 8 }}>{tr(language, "ai_context")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {aiContextSummaryItems.map((item) => (
                    <div key={item.label} style={{ background: dark ? "#171d31" : "#fff", borderRadius: 10, padding: "8px 10px" }}>
                      <div style={{ fontSize: 11, color: sub, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: text }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                background: aiSafetyMode === "high"
                  ? (dark ? "#24110c" : "#fff1eb")
                  : aiSafetyMode === "elevated"
                    ? (dark ? "#21190d" : "#fff7ea")
                    : (dark ? "#121820" : "#f7fbff"),
                border: `1px solid ${aiSafetyMode === "high" ? "#c43c3c" : aiSafetyMode === "elevated" ? "#b88400" : "#2f6ea5"}`,
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 12,
                fontSize: 12,
                color: sub,
                lineHeight: 1.9,
              }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 6 }}>{aiSafetyTitle}</div>
                <div>{aiSafetyCopy}</div>
              </div>
              <div style={{ fontWeight: 800, color: text, marginBottom: 8 }}>{language === "fa" ? "سؤال‌های پیشنهادی" : "Suggested Questions"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {(language === "fa"
                  ? ["برنامه هفته آینده؟", "برای حجم چی بخورم؟", "چطور زانو درد ندم؟", "بهترین حرکت سرشانه؟"]
                  : ["Next week's plan?", "What should I eat for muscle gain?", "How do I avoid knee pain?", "Best shoulder exercise?"]
                ).map(q => (
                  <button key={q} style={{ ...s.btn(dark ? "#1a1a3a" : "#e8e8ff"), color: dark ? "#aaf" : "#44f", padding: "6px 12px", fontSize: 12 }} onClick={() => setAiPrompt(q)}>{q}</button>
                ))}
              </div>
              <textarea
                style={{ ...s.input, minHeight: 80, resize: "vertical", marginBottom: 10 }}
                placeholder={tr(language, "ai_prompt_placeholder")}
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
              />
              <button style={{ ...s.btn("#5a2de8"), width: "100%", color: "#fff" }} onClick={askAI} disabled={aiLoading}>
                {aiLoading ? tr(language, "ai_processing") : tr(language, "ask_ai")}
              </button>
            </div>

            {aiResult && (
              <div style={{ ...s.card, background: dark ? "#0a1a0a" : "#f0fff0", border: `1px solid ${dark ? "#1a4a1a" : "#a0e0a0"}` }}>
                <div style={{ fontWeight: 700, color: "#0a8", marginBottom: 8 }}>{tr(language, "ai_answer")}</div>
                <p style={{ color: text, lineHeight: 1.9, fontSize: 14, whiteSpace: "pre-wrap" }}>{aiResult}</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Workout Complete Popup */}
      {workoutPopup && (
        <WorkoutCompletePopup
          result={workoutPopup}
          onClose={() => setWorkoutPopup(null)}
          dark={dark}
        />
      )}

      {/* Bottom Nav */}
      <nav style={s.nav}>
        {tabs.map(t => (
          <button key={t.id} style={s.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
