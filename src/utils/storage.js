// Storage utilities extracted from App.jsx
import {
  USERS_KEY, SESSION_KEY, ACTIVE_PLAN_KEY, WORKOUT_LOG_KEY,
  ACTIVE_WORKOUT_KEY, PROGRESS_DATA_KEY,
} from './constants.js';

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



export {
  canUseStorage, getUsers, saveUsers, getSession, saveSession, clearSession,
  getActivePlans, getActivePlan, saveActivePlan, clearActivePlan,
  getPerUserStoredMap, getPerUserData, savePerUserData, clearPerUserData,
  sanitizeWorkoutLog, sanitizeProgressData,
  normalizePersistedLevel, normalizePersistedSex, normalizePersistedEquipment,
  normalizePersistedRecovery, normalizePersistedLimitations,
  toCanonicalUserShape, migrateLegacyUserShape, normalizePersistedUser,
  migratePersistedAuthData,
};
