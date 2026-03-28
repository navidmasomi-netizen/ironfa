import { useState, useEffect, useRef } from "react";

const USERS_KEY = "ironfа_users";
const SESSION_KEY = "ironfa_session";
const ACTIVE_PLAN_KEY = "ironfa_active_plan";
const WORKOUT_LOG_KEY = "ironfa_workout_log";
const ACTIVE_WORKOUT_KEY = "ironfa_active_workout";
const PROGRESS_DATA_KEY = "ironfa_progress_data";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }
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
      date: entry.date || new Date().toLocaleDateString("fa-IR"),
      weight: Number(entry.weight) || 0,
    }))
    .filter(entry => entry.weight > 0);
}

function normalizePersistedUser(user) {
  if (!user) return null;
  const trainingLevel = user.training_level || user.level || "مبتدی";
  const sex = user.sex || user.gender || "مرد";
  const trainingDays = Number(user.training_days_per_week || user.workoutDays || 3);
  const sessionDuration = Number(user.session_duration || user.sessionLength || 60);
  const equipmentAccess = user.equipment_access || ({
    "باشگاه": "باشگاه کامل",
    "خانه": "هوم جیم",
    "ترکیبی": "دمبل و کش",
    "فضای باز": "وزن بدن",
  }[user.place] || "باشگاه کامل");
  const recoveryQuality = user.recovery_quality || ({
    "ضعیف": "پایین",
    "کم": "بالا",
    "خوب": "بالا",
    "عالی": "بالا",
    "زیاد": "پایین",
  }[user.sleepQuality] || {
    "زیاد": "پایین",
    "کم": "بالا",
  }[user.stressLevel] || "متوسط");
  const limitations = user.injury_or_limitation_flags || (user.injury ? (Array.isArray(user.injury) ? user.injury : [user.injury]) : ["ندارم"]);

  return {
    ...user,
    training_level: trainingLevel,
    level: trainingLevel,
    sex,
    gender: sex,
    training_days_per_week: trainingDays,
    workoutDays: trainingDays,
    session_duration: sessionDuration,
    sessionLength: sessionDuration,
    equipment_access: equipmentAccess,
    recovery_quality: recoveryQuality,
    injury_or_limitation_flags: limitations,
    injury: limitations,
    goal_label: user.goal_label || user.goal,
  };
}

const DEMO_USER = {
  id: 0, name: "کاربر دمو", email: "test@ironfa.com", password: "ironfa123",
  goal: "حجم عضلانی", goal_label: "حجم عضلانی", training_level: "متوسط", age: 25, height: 178, weight: 80, sex: "مرد",
  training_days_per_week: 4, session_duration: 60, equipment_access: "باشگاه کامل", injury_or_limitation_flags: ["ندارم"],
  recovery_quality: "بالا",
  onboarded: true
};

const TRUST_BASELINE_COPY = "این برنامه از روی هدف، سطح، تعداد جلسات، تجهیزات، ریکاوری و محدودیت‌های ثبت‌شده تو ساخته می‌شود و قرار نیست جای تشخیص پزشکی یا مربی حضوری را بگیرد.";
const DISCLAIMER_BASELINE_COPY = "اگر درد، آسیب، یا وضعیت پزشکی خاص داری، قبل از اجرای برنامه با متخصص واجد صلاحیت مشورت کن و هر حرکت دردزا را متوقف کن.";

// ── Onboarding ──────────────────────────────────────────────────────────────
function Onboarding({ baseUser, onFinish }) {
  const accent = "#e8ff00";
  const [step, setStep] = useState(0);
  const normalizedBaseUser = normalizePersistedUser(baseUser);
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
    goal: normalizeGoal(normalizedBaseUser.goal),
    training_level: normalizeLevel(normalizedBaseUser.training_level),
    age: normalizedBaseUser.age || "",
    sex: normalizeSex(normalizedBaseUser.sex),
    weight: normalizedBaseUser.weight || "",
    height: normalizedBaseUser.height || "",
    training_days_per_week: String(normalizedBaseUser.training_days_per_week || 3),
    equipment_access: normalizeEquipment(normalizedBaseUser.equipment_access),
    injury_or_limitation_flags: normalizeLimitations(normalizedBaseUser.injury_or_limitation_flags),
    session_duration: String(normalizedBaseUser.session_duration || 60),
    recovery_quality: normalizeRecovery(normalizedBaseUser.recovery_quality),
  });

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggle = (k, v) => setData(d => {
    const arr = Array.isArray(d[k]) ? d[k] : [d[k]];
    if (arr.includes(v)) return { ...d, [k]: arr.length > 1 ? arr.filter(x => x !== v) : arr };
    if (v === "ندارم") return { ...d, [k]: ["ندارم"] };
    return { ...d, [k]: [...arr.filter(x => x !== "ندارم"), v] };
  });

  const STEPS = [
    {
      icon: "🎯", title: "هدف و سطح", subtitle: "اول جهت تمرینت را مشخص کنیم",
      fields: (
        <div>
          <Row label="هدف اصلی">
            <Chips options={["حجم عضلانی", "چربی‌سوزی", "قدرت", "ریکامپوزیشن"]} value={data.goal} onChange={v => set("goal", v)} accent={accent} />
          </Row>
          <Row label="سطح تمرینی">
            <Chips options={["مبتدی", "متوسط", "پیشرفته"]} value={data.training_level} onChange={v => set("training_level", v)} accent={accent} />
          </Row>
        </div>
      )
    },
    {
      icon: "🧬", title: "پروفایل بدنی", subtitle: "اطلاعات پایه بدنت را وارد کن",
      fields: (
        <div>
          <Row label="سن (سال)">
            <NumInput value={data.age} onChange={v => set("age", v)} placeholder="مثلاً ۲۵" />
          </Row>
          <Row label="جنسیت">
            <Chips options={["مرد", "زن"]} value={data.sex} onChange={v => set("sex", v)} accent={accent} />
          </Row>
          <Row label="وزن (kg)">
            <NumInput value={data.weight} onChange={v => set("weight", v)} placeholder="مثلاً ۷۵" />
          </Row>
          <Row label="قد (cm)">
            <NumInput value={data.height} onChange={v => set("height", v)} placeholder="مثلاً ۱۷۵" />
          </Row>
        </div>
      )
    },
    {
      icon: "📅", title: "ساختار تمرین", subtitle: "برنامه باید با زندگی واقعی تو جور باشد",
      fields: (
        <div>
          <Row label="روزهای تمرین در هفته">
            <Chips options={["۳", "۴", "۵", "۶"]} value={data.training_days_per_week} onChange={v => set("training_days_per_week", v)} accent={accent} />
          </Row>
          <Row label="تجهیزات در دسترس">
            <Chips options={["باشگاه کامل", "هوم جیم", "دمبل و کش", "وزن بدن"]} value={data.equipment_access} onChange={v => set("equipment_access", v)} accent={accent} />
          </Row>
          <Row label="مدت هر جلسه (دقیقه)">
            <Chips options={["۳۰", "۴۵", "۶۰", "۹۰"]} value={data.session_duration} onChange={v => set("session_duration", v)} accent={accent} />
          </Row>
        </div>
      )
    },
    {
      icon: "🛡️", title: "محدودیت و ریکاوری", subtitle: "برنامه باید برای بدنت واقع‌بینانه باشد",
      fields: (
        <div>
          <Row label="آسیب‌دیدگی یا محدودیت" hint="چند مورد انتخاب کن">
            <MultiChips options={["ندارم", "زانو", "کمر", "شانه", "مچ", "گردن", "لگن"]} value={data.injury_or_limitation_flags} onToggle={v => toggle("injury_or_limitation_flags", v)} accent={accent} />
          </Row>
          <Row label="کیفیت ریکاوری فعلی">
            <Chips options={["پایین", "متوسط", "بالا"]} value={data.recovery_quality} onChange={v => set("recovery_quality", v)} accent={accent} />
          </Row>
        </div>
      )
    },
    {
      icon: "✅", title: "مرور نهایی", subtitle: "قبل از ساخت برنامه، ورودی‌ها را چک کن",
      summary: true
    }
  ];

  const current = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const s = {
    wrap: { minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Vazirmatn','Tahoma',sans-serif", direction: "rtl", display: "flex", flexDirection: "column" },
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
        return !!data.goal && !!data.training_level;
      case 1:
        return !!data.age && !!data.sex && !!data.weight && !!data.height;
      case 2:
        return !!data.training_days_per_week && !!data.equipment_access && !!data.session_duration;
      case 3:
        return !!data.recovery_quality && Array.isArray(data.injury_or_limitation_flags);
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
      goal_label: data.goal,
      onboarded: true,
    });
    const users = getUsers();
    const idx = users.findIndex(u => u.id === baseUser.id);
    if (idx >= 0) { users[idx] = updated; saveUsers(users); }
    saveSession(updated);
    onFinish(updated);
  };

  const arr = (v) => Array.isArray(v) ? v.join("، ") : (v || "—");
  const summaryItems = [
    { label: "هدف", val: data.goal, highlight: true },
    { label: "سطح تمرینی", val: data.training_level },
    { label: "سن / جنسیت", val: `${data.age} سال · ${data.sex}` },
    { label: "قد / وزن", val: `${data.height}cm · ${data.weight}kg` },
    { label: "برنامه هفتگی", val: `${data.training_days_per_week} روز در هفته · ${data.session_duration} دقیقه` },
    { label: "تجهیزات", val: data.equipment_access },
    { label: "ریکاوری", val: data.recovery_quality },
    ...(data.injury_or_limitation_flags?.length && !data.injury_or_limitation_flags.includes("ندارم")
      ? [{ label: "محدودیت‌ها", val: arr(data.injury_or_limitation_flags) }]
      : []),
  ];

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.brand}>💪 آیرون‌فا</div>
        <div style={s.progressBar}><div style={s.progressFill} /></div>
        <div style={s.stepCount}>مرحله {step + 1} از {STEPS.length}</div>
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
              <div style={{ fontWeight: 700, marginBottom: 4 }}>مرز محصول</div>
              <div>{TRUST_BASELINE_COPY}</div>
              <div style={{ color: "#87a7c9", marginTop: 6 }}>{DISCLAIMER_BASELINE_COPY}</div>
            </div>
          </div>
        ) : current.fields}
      </div>

      <div style={s.footer}>
        {step > 0 && <button style={s.btnBack} onClick={() => setStep(s => s - 1)}>← قبلی</button>}
        <button
          style={{ ...s.btnNext, opacity: isStepValid() ? 1 : 0.5, cursor: isStepValid() ? "pointer" : "not-allowed" }}
          onClick={() => {
            if (!isStepValid()) return;
            step < STEPS.length - 1 ? setStep(s => s + 1) : finish();
          }}
        >
          {step < STEPS.length - 1 ? "بعدی ←" : "🚀 ساخت برنامه"}
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
      {options.map(o => {
        const selected = arr.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)} style={{
            padding: "8px 16px", borderRadius: 20,
            border: `1.5px solid ${selected ? accent : "#2a2a2a"}`,
            background: selected ? accent : "#141414",
            color: selected ? "#000" : "#aaa",
            fontFamily: "inherit", fontWeight: selected ? 700 : 400,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s",
            position: "relative"
          }}>
            {selected && <span style={{ marginLeft: 4 }}>✓ </span>}{o}
          </button>
        );
      })}
    </div>
  );
}
function Chips({ options, value, onChange, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${value === o ? accent : "#2a2a2a"}`,
          background: value === o ? accent : "#141414", color: value === o ? "#000" : "#aaa",
          fontFamily: "inherit", fontWeight: value === o ? 700 : 400, fontSize: 14, cursor: "pointer", transition: "all 0.15s"
        }}>{o}</button>
      ))}
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
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [onboardUser, setOnboardUser] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const accent = "#e8ff00";
  const s = {
    wrap: { minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Vazirmatn','Tahoma',sans-serif", direction: "rtl", padding: 20 },
    logo: { fontSize: 48, marginBottom: 8 },
    brand: { fontSize: 28, fontWeight: 900, color: accent, marginBottom: 4, letterSpacing: -1 },
    sub: { fontSize: 14, color: "#666", marginBottom: 40 },
    card: { background: "#141414", border: "1px solid #2a2a2a", borderRadius: 20, padding: 28, width: "100%", maxWidth: 380 },
    tabs: { display: "flex", marginBottom: 24, background: "#0a0a0a", borderRadius: 12, padding: 4 },
    tab: (active) => ({ flex: 1, padding: "10px 0", border: "none", borderRadius: 10, fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer", background: active ? accent : "transparent", color: active ? "#000" : "#666", transition: "all 0.2s" }),
    input: { width: "100%", background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 12, padding: "12px 16px", color: "#f0f0f0", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 },
    btn: { width: "100%", background: accent, color: "#000", border: "none", borderRadius: 12, padding: "14px 0", fontFamily: "inherit", fontWeight: 900, fontSize: 16, cursor: "pointer", marginTop: 4 },
    error: { background: "#1a0a0a", border: "1px solid #5a1a1a", color: "#ff6b6b", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 12, textAlign: "center" },
    success: { background: "#0a1a0a", border: "1px solid #1a5a1a", color: "#6bff6b", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 12, textAlign: "center" },
  };

  const handle = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setError(""); };

  const doLogin = () => {
    if (form.email === DEMO_USER.email && form.password === DEMO_USER.password) {
      const normalizedDemo = normalizePersistedUser(DEMO_USER);
      saveSession(normalizedDemo); onLogin(normalizedDemo); return;
    }
    const users = getUsers();
    const user = users.find(u => u.email === form.email && u.password === form.password);
    if (!user) { setError("ایمیل یا رمز عبور اشتباه است"); return; }
    const normalizedUser = normalizePersistedUser(user);
    saveSession(normalizedUser); onLogin(normalizedUser);
  };

  const doSignup = () => {
    if (!form.name || !form.email || !form.password) { setError("همه فیلدها را پر کنید"); return; }
    if (form.password.length < 6) { setError("رمز عبور حداقل ۶ کاراکتر باشد"); return; }
    const users = getUsers();
    const isTestEmail = form.email === "navid.masomi@gmail.com";
    if (!isTestEmail && users.find(u => u.email === form.email)) { setError("این ایمیل قبلاً ثبت شده است"); return; }
    const filteredUsers = isTestEmail ? users.filter(u => u.email !== form.email) : users;
    const newUser = normalizePersistedUser({
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      goal: "حجم عضلانی",
      goal_label: "حجم عضلانی",
      training_level: "مبتدی",
      onboarded: false,
    });
    saveUsers([...filteredUsers, newUser]);
    setSuccess("حساب ساخته شد! در حال تکمیل پروفایل...");
    setTimeout(() => setOnboardUser(newUser), 600);
  };

  if (onboardUser) return <Onboarding baseUser={onboardUser} onFinish={onLogin} />;

  return (
    <div style={s.wrap}>
      <div style={s.logo}>💪</div>
      <div style={s.brand}>آیرون‌فا</div>
      <div style={s.sub}>مربی هوشمند بدنسازی شما</div>
      <div style={s.card}>
        <div style={s.tabs}>
          <button style={s.tab(mode === "login")} onClick={() => { setMode("login"); setError(""); }}>ورود</button>
          <button style={s.tab(mode === "signup")} onClick={() => { setMode("signup"); setError(""); }}>ثبت‌نام</button>
        </div>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}
        {mode === "signup" && <input style={s.input} placeholder="نام شما" value={form.name} onChange={handle("name")} />}
        <input style={s.input} type="email" placeholder="ایمیل" value={form.email} onChange={handle("email")} />
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            style={{ ...s.input, marginBottom: 0, paddingLeft: 44 }}
            type={showPass ? "text" : "password"}
            placeholder="رمز عبور"
            value={form.password}
            onChange={handle("password")}
          />
          <button
            onClick={() => setShowPass(p => !p)}
            style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 18,
              color: "#666", padding: 0, lineHeight: 1
            }}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
        <button style={s.btn} onClick={mode === "login" ? doLogin : doSignup}>
          {mode === "login" ? "ورود به اپ" : "ساخت حساب"}
        </button>
        {mode === "login" && (
          <button style={{ ...s.btn, background: "#1e1e1e", color: "#aaa", border: "1px solid #2a2a2a", marginTop: 10 }}
            onClick={() => {
              const normalizedDemo = normalizePersistedUser(DEMO_USER);
              saveSession(normalizedDemo);
              onLogin(normalizedDemo);
            }}>
            🎮 ورود با حساب دمو
          </button>
        )}
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
    progression_type: "load", substitution_list: ["پرس پا", "لانج"], muscle: "پا", level: "متوسط",
    desc: "پادشاه حرکات پایه — زانوها بیرون، کمر صاف، تا موازی پایین برو.", gif: "🏋️"
  },
  {
    id: 2, name: "ددلیفت", name_fa: "ددلیفت", name_en: "Deadlift",
    primary_muscles: ["پشت"], secondary_muscles: ["پشت ران", "سرینی"], movement_pattern: "hinge",
    equipment: "هالتر", difficulty: "پیشرفته", complexity: "compound",
    suitable_goals: ["strength", "hypertrophy"], contraindications: ["کمر پایین"],
    joint_stress_flags: ["lower_back_stress"], default_rep_range: "3-6", default_rest_range: "150-210 ثانیه",
    progression_type: "load", substitution_list: ["رومانیایی"], muscle: "پشت", level: "پیشرفته",
    desc: "کمر صاف، باسن به عقب، هالتر نزدیک ساق پا بکش بالا.", gif: "💪"
  },
  {
    id: 3, name: "پرس سینه", name_fa: "پرس سینه", name_en: "Bench Press",
    primary_muscles: ["سینه"], secondary_muscles: ["سرشانه", "پشت بازو"], movement_pattern: "horizontal_press",
    equipment: "هالتر", difficulty: "مبتدی", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["شانه", "مچ"],
    joint_stress_flags: ["shoulder_stress", "wrist_stress"], default_rep_range: "4-10", default_rest_range: "90-150 ثانیه",
    progression_type: "load", substitution_list: ["پرس سرشانه", "پشت بازو سیمکش"], muscle: "سینه", level: "مبتدی",
    desc: "آرنج ۴۵ درجه، کنترل در پایین، انفجاری بالا بیار.", gif: "🔥"
  },
  {
    id: 4, name: "پول‌آپ", name_fa: "پول‌آپ", name_en: "Pull-Up",
    primary_muscles: ["پشت"], secondary_muscles: ["بازو", "کور"], movement_pattern: "vertical_pull",
    equipment: "میله", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["شانه", "آرنج"],
    joint_stress_flags: ["shoulder_stress"], default_rep_range: "4-10", default_rest_range: "90-150 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["جلو بازو"], muscle: "پشت", level: "متوسط",
    desc: "از آویزان کامل شروع کن، کتف‌ها را جمع کن، چانه بالای میله.", gif: "⬆️"
  },
  {
    id: 5, name: "پرس سرشانه", name_fa: "پرس سرشانه", name_en: "Overhead Press",
    primary_muscles: ["سرشانه"], secondary_muscles: ["پشت بازو", "کور"], movement_pattern: "vertical_press",
    equipment: "هالتر", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["شانه", "کمر پایین"],
    joint_stress_flags: ["shoulder_stress"], default_rep_range: "4-8", default_rest_range: "90-150 ثانیه",
    progression_type: "load", substitution_list: ["پرس سینه"], muscle: "سرشانه", level: "متوسط",
    desc: "هسته محکم، هالتر را مستقیم بالا ببر، سر جلو نره.", gif: "🎯"
  },
  {
    id: 6, name: "جلو بازو", name_fa: "جلو بازو", name_en: "Dumbbell Curl",
    primary_muscles: ["بازو"], secondary_muscles: [], movement_pattern: "elbow_flexion",
    equipment: "دمبل", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["آرنج", "مچ"],
    joint_stress_flags: ["wrist_stress"], default_rep_range: "8-15", default_rest_range: "45-75 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["پول‌آپ"], muscle: "بازو", level: "مبتدی",
    desc: "آرنج ثابت، کامل باز کن، در بالا فشار بده.", gif: "💪"
  },
  {
    id: 7, name: "پشت بازو سیمکش", name_fa: "پشت بازو سیمکش", name_en: "Cable Pushdown",
    primary_muscles: ["بازو"], secondary_muscles: [], movement_pattern: "elbow_extension",
    equipment: "دستگاه", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["آرنج"],
    joint_stress_flags: ["elbow_stress"], default_rep_range: "10-15", default_rest_range: "45-75 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["پرس سینه"], muscle: "بازو", level: "مبتدی",
    desc: "آرنج ثابت کنار بدن، کامل باز کن، کنترل برگرد.", gif: "🎯"
  },
  {
    id: 8, name: "لانج", name_fa: "لانج", name_en: "Lunge",
    primary_muscles: ["پا"], secondary_muscles: ["سرینی", "کور"], movement_pattern: "single_leg",
    equipment: "دمبل", difficulty: "مبتدی", complexity: "compound",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["زانو", "تعادل"],
    joint_stress_flags: ["knee_stress"], default_rep_range: "8-12", default_rest_range: "60-90 ثانیه",
    progression_type: "reps_then_load", substitution_list: ["پرس پا", "اسکوات"], muscle: "پا", level: "مبتدی",
    desc: "گام بلند بردار، زانو به زمین نزنه، تنه صاف.", gif: "🦵"
  },
  {
    id: 9, name: "کرانچ", name_fa: "کرانچ", name_en: "Crunch",
    primary_muscles: ["شکم"], secondary_muscles: [], movement_pattern: "trunk_flexion",
    equipment: "بدون ابزار", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["fat_loss", "hypertrophy", "recomposition"], contraindications: ["گردن"],
    joint_stress_flags: ["neck_stress"], default_rep_range: "12-20", default_rest_range: "30-45 ثانیه",
    progression_type: "reps", substitution_list: ["پلانک"], muscle: "شکم", level: "مبتدی",
    desc: "پشت خم نشه، شکم را سفت کن، آهسته پایین بیا.", gif: "⚡"
  },
  {
    id: 10, name: "پلانک", name_fa: "پلانک", name_en: "Plank",
    primary_muscles: ["کور"], secondary_muscles: ["شکم", "سرشانه"], movement_pattern: "anti_extension",
    equipment: "بدون ابزار", difficulty: "مبتدی", complexity: "isolation",
    suitable_goals: ["fat_loss", "recomposition", "strength"], contraindications: ["شانه", "کمر پایین"],
    joint_stress_flags: ["shoulder_stress"], default_rep_range: "20-60 ثانیه", default_rest_range: "30-45 ثانیه",
    progression_type: "time", substitution_list: ["کرانچ"], muscle: "کور", level: "مبتدی",
    desc: "بدن مثل خط‌کش، باسن بالا نره، نفس بکش.", gif: "🧱"
  },
  {
    id: 11, name: "رومانیایی", name_fa: "رومانیایی", name_en: "Romanian Deadlift",
    primary_muscles: ["پشت ران"], secondary_muscles: ["سرینی", "کمر"], movement_pattern: "hinge",
    equipment: "هالتر", difficulty: "متوسط", complexity: "compound",
    suitable_goals: ["hypertrophy", "strength", "recomposition"], contraindications: ["کمر پایین"],
    joint_stress_flags: ["lower_back_stress"], default_rep_range: "6-10", default_rest_range: "90-150 ثانیه",
    progression_type: "load", substitution_list: ["ددلیفت", "لانج"], muscle: "پشت ران", level: "متوسط",
    desc: "زانو کمی خم، لگن را به عقب ببر، کمر صاف بمونه.", gif: "🏆"
  },
  {
    id: 12, name: "پرس پا", name_fa: "پرس پا", name_en: "Leg Press",
    primary_muscles: ["پا"], secondary_muscles: ["سرینی"], movement_pattern: "squat_pattern",
    equipment: "دستگاه", difficulty: "مبتدی", complexity: "compound",
    suitable_goals: ["hypertrophy", "fat_loss", "recomposition"], contraindications: ["زانو", "کمر پایین"],
    joint_stress_flags: ["knee_stress"], default_rep_range: "8-15", default_rest_range: "75-120 ثانیه",
    progression_type: "load", substitution_list: ["اسکوات", "لانج"], muscle: "پا", level: "مبتدی",
    desc: "پاها عرض شانه، کمر به تکیه‌گاه، کامل باز نکن.", gif: "🦵"
  },
];

const getExercisePrimaryMuscle = (exercise) => exercise.primary_muscles?.[0] || exercise.muscle || "نامشخص";
const getExerciseDifficulty = (exercise) => exercise.difficulty || exercise.level || "مبتدی";
const getExerciseEquipment = (exercise) => exercise.equipment || "نامشخص";
const getExerciseGoalsLabel = (exercise) => (exercise.suitable_goals || []).map(goal => ({
  hypertrophy: "حجم",
  fat_loss: "چربی‌سوزی",
  strength: "قدرت",
  recomposition: "ریکامپوزیشن",
}[goal] || goal));
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

function getExerciseByName(name) {
  return EXERCISES.find(ex => ex.name === name) || null;
}

function parseRepRange(repRange) {
  if (!repRange) return { min: null, max: null };
  const match = String(repRange).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { min: null, max: null };
  return { min: Number(match[1]), max: Number(match[2]) };
}

function getProgressionTrend(logs = []) {
  if (!logs.length) {
    return {
      averageReps: 0,
      averageAdherence: null,
      recentConsistency: 0,
      stalled: false,
      needsConsolidation: false,
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
  const previousBestReps = Math.max(...recentLogs.slice(1).map(log => Number(log.reps) || 0), 0);
  const stalled = recentLogs.length >= 2 && latestReps <= previousBestReps;
  const needsConsolidation = averageAdherence !== null && averageAdherence < 0.7;

  let trendLabel = "stable";
  if (needsConsolidation) trendLabel = "consolidate";
  else if (!stalled && latestReps > previousBestReps) trendLabel = "advancing";
  else if (stalled) trendLabel = "stalled";

  return {
    averageReps,
    averageAdherence,
    recentConsistency,
    stalled,
    needsConsolidation,
    trendLabel,
  };
}

function getProgressionSuggestion(exercise, prescription, logs = []) {
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
      message: `برای اولین اجرای این حرکت، از بازه ${min}-${max} شروع کن و اول فرم تمیز و کامل بودن ست‌های هدف را تثبیت کن.`,
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

  if (!min || !max) return null;

  let suggestedWeight = lastWeight;
  let suggestedReps = lastReps || min;
  let message = `آخرین ثبت: ${lastWeight || "بدون وزن"}kg × ${lastReps} تکرار × ${lastSets} ست`;
  let strategy = "steady";

  if (trend.needsConsolidation) {
    suggestedWeight = lastWeight;
    suggestedReps = Math.max(min, lastReps || min);
    strategy = "consolidate";
    message = "چند جلسه اخیر کامل ثبت نشده. اول همین نسخه را تمیز و کامل اجرا کن، بعد سراغ افزایش برو.";
  } else if (trend.stalled && lastWeight > 0) {
    suggestedWeight = lastWeight;
    suggestedReps = Math.max(min, lastReps || min);
    strategy = "hold";
    message = `پیشروی این حرکت کمی ایست کرده. یک جلسه دیگر ${lastWeight}kg را با فرم تمیز تثبیت کن و بعد افزایش بده.`;
  } else if (progressionType === "reps_then_load") {
    if (lastReps >= max && lastWeight > 0) {
      suggestedWeight = Number((lastWeight + 2.5).toFixed(1));
      suggestedReps = min;
      strategy = "increase_load";
      message = `آخرین ست به سقف بازه رسید. جلسه بعد ${suggestedWeight}kg را با ${min}-${max} تکرار شروع کن.`;
    } else {
      suggestedReps = Math.min(max, Math.max(min, lastReps + 1));
      strategy = "increase_reps";
      message = `اولویت جلسه بعد: با ${lastWeight || "وزن فعلی"}kg یک تکرار بیشتر بزن و به بازه ${min}-${max} نزدیک شو.`;
    }
  } else if (progressionType === "reps") {
    suggestedReps = Math.min(max, Math.max(min, lastReps + 1));
    strategy = "increase_reps";
    message = `برای جلسه بعد روی ${suggestedReps} تکرار با فرم تمیز تمرکز کن.`;
  } else if (progressionType === "time") {
    suggestedReps = Math.min(max, Math.max(min, lastReps + 5));
    strategy = "extend_time";
    message = `برای جلسه بعد کمی زمان/تکرار را بالا ببر و فرم را حفظ کن.`;
  } else {
    if (lastReps >= max && lastWeight > 0) {
      suggestedWeight = Number((lastWeight + 2.5).toFixed(1));
      suggestedReps = min;
      strategy = "increase_load";
      message = `آخرین ثبت خوب بود. جلسه بعد ${suggestedWeight}kg را در بازه ${min}-${max} هدف بگیر.`;
    } else {
      suggestedReps = Math.min(max, Math.max(min, lastReps + 1));
      strategy = "increase_reps";
      message = `قبل از افزایش وزنه، همین وزنه را در بازه ${min}-${max} کامل‌تر کن.`;
    }
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
    average_reps: trend.averageReps ? Number(trend.averageReps.toFixed(1)) : null,
    average_adherence: typeof trend.averageAdherence === "number"
      ? Math.round(trend.averageAdherence * 100)
      : null,
  };
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

function getProgressionExplanation(progression) {
  if (!progression) return null;

  if (progression.strategy === "consolidate") {
    return "دلیل این تصمیم: پایبندی چند جلسه اخیر پایین بوده و app فعلاً به‌جای افزایش، تثبیت اجرای نسخه را امن‌تر می‌داند.";
  }
  if (progression.strategy === "hold") {
    return "دلیل این تصمیم: عملکرد حرکت در چند ثبت اخیر جلو نرفته، پس app یک جلسه تثبیت با همین بار را ترجیح می‌دهد.";
  }
  if (progression.strategy === "increase_load") {
    return "دلیل این تصمیم: ثبت‌های اخیر به سقف بازه هدف رسیده‌اند، پس افزایش وزنه منطقی‌تر از افزایش تکرار است.";
  }
  if (progression.strategy === "increase_reps") {
    return "دلیل این تصمیم: هنوز جا برای پر کردن بازه تکرار وجود دارد، پس app قبل از افزایش وزنه، تکرار را بالا می‌برد.";
  }
  if (progression.strategy === "extend_time") {
    return "دلیل این تصمیم: این حرکت بیشتر با زمان/تداوم بهتر می‌شود تا افزایش مستقیم بار.";
  }
  return "این پیشنهاد از روی ثبت‌های اخیر و prescription فعلی ساخته شده است.";
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

function buildPlanExplanation(user, recommendedProgram) {
  const normalizedUser = normalizePersistedUser(user);
  const split = recommendedProgram?.split || {};
  const reasons = [];
  const adjustments = [];
  const nextChecks = [];

  reasons.push(`هدف فعلی تو ${normalizedUser.goal_label || normalizedUser.goal || "نامشخص"} است، بنابراین منطق برنامه روی ${recommendedProgram.programming_style || "پیشروی پایه"} تنظیم شده.`);
  reasons.push(`${normalizedUser.training_days_per_week || "؟"} جلسه در هفته باعث شده split ${SPLIT_LABELS[split.split_family] || split.split_family || "فعلی"} انتخاب شود.`);

  if (normalizedUser.session_duration <= 45) {
    adjustments.push("مدت جلسه کوتاه‌تر است، پس حجم هر روز کمی جمع‌وجورتر نگه داشته شده.");
  } else if (normalizedUser.session_duration >= 90) {
    adjustments.push("مدت جلسه مناسب‌تر است، پس برنامه فضای بیشتری برای حرکات اصلی و ست‌های کامل‌تر دارد.");
  }

  if (normalizedUser.recovery_quality === "پایین") {
    adjustments.push("به‌خاطر ریکاوری پایین، ساختار تمرین محافظه‌کارانه‌تر نگه داشته شده.");
  } else if (normalizedUser.recovery_quality === "بالا") {
    adjustments.push("ریکاوری بهتر اجازه داده split و prescription کمی تهاجمی‌تر بمانند.");
  }

  if ((normalizedUser.injury_or_limitation_flags || []).length > 0 && !normalizedUser.injury_or_limitation_flags.includes("ندارم")) {
    adjustments.push(`به‌خاطر محدودیت‌های ${normalizedUser.injury_or_limitation_flags.join("، ")}, بعضی حرکت‌ها فیلتر یا جایگزین شده‌اند.`);
  }

  if (split.notes?.length) {
    split.notes.forEach(note => adjustments.push(splitNoteToExplanation(note)));
  }

  nextChecks.push("اگر پایبندی روزهای فعال پایین بماند، progression به‌جای افزایش به حالت تثبیت یا نگه‌داشتن بار می‌رود.");
  nextChecks.push("اگر ثبت‌ها کامل و پایدار باشند، app برای حرکت‌های اصلی افزایش تکرار یا وزنه را پیشنهاد می‌دهد.");

  return { reasons, adjustments, nextChecks };
}

function splitNoteToExplanation(note) {
  return ({
    beginner_downgrade: "به‌خاطر سطح فعلی، split ساده‌تر انتخاب شده تا اجرای برنامه پایدار بماند.",
    low_recovery_downgrade: "به‌خاطر ریکاوری پایین، ساختار تمرین سبک‌تر شده تا فشار اضافه جمع نشود.",
    six_day_restricted: "حالت ۶ روزه برای این نسخه محدود شده تا loop فعلی قابل‌ریکاوری بماند.",
    short_session_adjusted: "به‌خاطر زمان محدود هر جلسه، ساختار انتخابی فشرده‌تر و عملی‌تر شده.",
    equipment_adjusted: "به‌خاطر محدودیت تجهیزات، انتخاب حرکت‌ها و ساختار روزها عملی‌تر شده است.",
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
      effort: prescription?.effort || "2 RIR",
      progression_state: "baseline",
      adjustment_note: null,
    };
  }

  const normalizedUser = normalizePersistedUser(user);
  const trend = getProgressionTrend(logs);
  const isIsolation = exercise.complexity === "isolation";
  const minSets = isIsolation ? 2 : 3;
  let sets = Number(prescription.sets) || minSets;
  let effort = prescription.effort;
  let progression_state = "baseline";
  let adjustment_note = null;

  if (trend.needsConsolidation) {
    sets = Math.max(minSets, sets - 1);
    effort = "3-4 RIR";
    progression_state = "consolidate";
    adjustment_note = "به‌خاطر پایبندی پایین در چند جلسه اخیر، حجم این حرکت کمی محافظه‌کارانه‌تر نگه داشته شده.";
  } else if (trend.stalled) {
    effort = "2-3 RIR";
    progression_state = "hold";
    adjustment_note = "به‌خاطر ایست نسبی در ثبت‌های اخیر، فشار این حرکت فعلاً تثبیت شده تا اجرای آن تمیزتر شود.";
  } else if (
    trend.trendLabel === "advancing" &&
    trend.averageAdherence !== null &&
    trend.averageAdherence >= 0.85 &&
    normalizeSplitRecovery(normalizedUser.recovery_quality) === "high" &&
    !isIsolation &&
    sets < 5
  ) {
    sets += 1;
    progression_state = "progress";
    adjustment_note = "به‌خاطر ثبت‌های پایدار اخیر و ریکاوری خوب، این حرکت کمی حجم بیشتری گرفته است.";
  }

  return {
    sets,
    effort,
    progression_state,
    adjustment_note,
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
  const adjustment = getHistoryAwarePrescriptionAdjustment(exercise, basePrescription, historyLogs, normalizedUser);

  return {
    name: exerciseName,
    sets: adjustment.sets,
    rep_range: basePrescription.rep_range,
    rest_range: basePrescription.rest_range,
    effort: adjustment.effort,
    programming_focus: PROGRAMMING_STYLE_LABELS[goal] || "پیشروی پایه",
    progression_state: adjustment.progression_state,
    adjustment_note: adjustment.adjustment_note,
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
  const levelLabel = LEVEL_LABELS[normalizeSplitLevel(normalizedUser.training_level)] || "مبتدی";

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
    level: levelLabel,
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
    level: LEVEL_LABELS[program.training_level] || program.level,
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
    id: 1, name: "پایه قدرت — ۳ روز", training_level: "beginner", level: "مبتدی", goal_key: "strength", goal: "قدرت",
    days: [
      { day: "روز A", exercises: ["اسکوات", "پرس سینه", "پول‌آپ"] },
      { day: "روز B", exercises: ["ددلیفت", "پرس سرشانه", "جلو بازو"] },
      { day: "روز C", exercises: ["لانج", "رومانیایی", "پلانک"] },
    ]
  },
  {
    id: 2, name: "Push Pull Legs — ۶ روز", training_level: "intermediate", level: "متوسط", goal_key: "hypertrophy", goal: "حجم عضلانی",
    days: [
      { day: "Push", exercises: ["پرس سینه", "پرس سرشانه", "پشت بازو سیمکش"] },
      { day: "Pull", exercises: ["پول‌آپ", "ددلیفت", "جلو بازو"] },
      { day: "Legs", exercises: ["اسکوات", "پرس پا", "لانج", "رومانیایی"] },
    ]
  },
  {
    id: 3, name: "فول‌بادی — ۴ روز", training_level: "advanced", level: "پیشرفته", goal_key: "fat_loss", goal: "چربی‌سوزی",
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
function LeaderboardTab({ dark, currentUser, gameData }) {
  const accent = "#e8ff00";
  const mockUsers = [
    { name: "علی رضایی", xp: 4250, streak: 14, level: 5 },
    { name: "سارا محمدی", xp: 3800, streak: 21, level: 4 },
    { name: "محمد کریمی", xp: 3200, streak: 8, level: 4 },
    { name: currentUser.name, xp: gameData.xp, streak: gameData.streak, level: gameData.level, isMe: true },
    { name: "نیما احمدی", xp: 2100, streak: 5, level: 3 },
    { name: "فاطمه حسینی", xp: 1800, streak: 3, level: 3 },
    { name: "رضا تهرانی", xp: 1200, streak: 0, level: 2 },
  ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));

  const s = {
    card: { background: dark ? "#141414" : "#fff", border: `1px solid ${dark ? "#2a2a2a" : "#eee"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 },
  };

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>🏆 لیدربورد هفتگی</div>
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
                {u.name} {u.isMe && "(من)"}
              </div>
              <div style={{ fontSize: 12, color: dark ? "#666" : "#999" }}>
                Level {u.level} · 🔥 {u.streak} روز
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
  if (!user) return <AuthScreen onLogin={setUser} />;
  return <GymApp user={user} onLogout={() => { clearSession(); setUser(null); }} />;
}


function GymApp({ user, onLogout }) {
  const runtimeUser = normalizePersistedUser(user);
  const persistedActivePlanRef = useRef(getActivePlan(user.id));
  const defaultProgressData = [
    { date: "۱۴۰۳/۱/۱", weight: 80 }, { date: "۱۴۰۳/۱/۸", weight: 79.5 },
    { date: "۱۴۰۳/۱/۱۵", weight: 79 }, { date: "۱۴۰۳/۱/۲۲", weight: 78.2 },
    { date: "۱۴۰۳/۲/۱", weight: 77.8 }, { date: "۱۴۰۳/۲/۸", weight: 77.1 },
  ];
  const [tab, setTab] = useState("exercises");
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
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [gameData, setGameData] = useState(() => getGameData(user.id));
  const [workoutPopup, setWorkoutPopup] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProgramDay, setSelectedProgramDay] = useState(persistedActivePlanRef.current?.selectedDay || 0);
  const userProfile = {
    name: runtimeUser.name,
    goal: runtimeUser.goal,
    level: runtimeUser.training_level,
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
  const currentWeightValue = progressData[progressData.length - 1]?.weight ?? null;
  const startingWeightValue = progressData[0]?.weight ?? null;
  const totalWeightChange = currentWeightValue !== null && startingWeightValue !== null
    ? (currentWeightValue - startingWeightValue).toFixed(1)
    : "0.0";
  const parsedNewWeight = Number(newWeight);

  const userFilteredExercises = filterExercisesForUser(EXERCISES, runtimeUser);
  const muscles = ["همه", ...new Set(userFilteredExercises.map(e => getExercisePrimaryMuscle(e)))];
  const filteredEx = userFilteredExercises.filter(e =>
    (filterMuscle === "همه" || getExercisePrimaryMuscle(e) === filterMuscle) &&
    e.name.includes(searchEx)
  );
  const recommendedProgram = buildRecommendedProgram(runtimeUser, sortedWorkoutHistory);
  const staticPrograms = PROGRAMS.map(program => buildStaticProgram(program, runtimeUser, sortedWorkoutHistory));
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
  const activeExerciseProgression = getProgressionSuggestion(activeExercise, activeExercisePrescription, activeExerciseHistory);
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
    { label: "هدف", value: runtimeUser.goal_label || runtimeUser.goal || "نامشخص" },
    { label: "سطح", value: runtimeUser.training_level || "نامشخص" },
    { label: "تعداد جلسات", value: `${runtimeUser.training_days_per_week || "؟"} روز در هفته` },
    { label: "مدت هر جلسه", value: `${runtimeUser.session_duration || "؟"} دقیقه` },
    { label: "split انتخاب‌شده", value: SPLIT_LABELS[recommendedProgram.split.split_family] || recommendedProgram.split.split_family },
    { label: "منطق برنامه", value: recommendedProgram.programming_style || "پیشروی پایه" },
    { label: "تجهیزات", value: runtimeUser.equipment_access || "نامشخص" },
    { label: "ریکاوری", value: runtimeUser.recovery_quality || "نامشخص" },
  ];
  const planTrustCopy = "این خلاصه از روی هدف، سطح، تعداد جلسات، ریکاوری، تجهیزات و محدودیت‌های تو ساخته شده و برنامه پیشنهادی پایین بر همان اساس انتخاب شده است.";
  const planDisclaimerCopy = "اگر محدودیت یا درد واقعی داری، برنامه را محافظه‌کارانه اجرا کن و حرکات دردزا را حذف یا جایگزین کن.";
  const planExplanation = buildPlanExplanation(runtimeUser, recommendedProgram);
  const aiContextSummaryItems = [
    { label: "هدف", value: userProfile.goal || "نامشخص" },
    { label: "سطح", value: userProfile.level || "نامشخص" },
    { label: "برنامه فعال", value: currentWorkoutContext?.program_name || "ندارد" },
    { label: "روز فعال", value: currentWorkoutContext?.day_name || "ندارد" },
    { label: "split", value: currentWorkoutContext?.split_family || recommendedProgram.split.split_family || "نامشخص" },
    { label: "محدودیت‌ها", value: (userProfile.injury_or_limitation_flags || []).join("، ") || "ندارد" },
  ];
  const activateProgram = (program) => {
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

  const totalCals = foodLog.reduce((a, f) => a + f.cal, 0);
  const totalProtein = foodLog.reduce((a, f) => a + f.p, 0);
  const totalCarbs = foodLog.reduce((a, f) => a + f.c, 0);
  const totalFat = foodLog.reduce((a, f) => a + f.f, 0);

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
          system: `تو یه مربی بدنسازی حرفه‌ای ایرانی هستی. جواب‌ها را به فارسی و کوتاه بده.
پروفایل کاربر:
- نام: ${userProfile.name} | جنسیت: ${userProfile.sex || "؟"} | سن: ${runtimeUser.age || "؟"} | قد: ${runtimeUser.height || "؟"}cm | وزن: ${runtimeUser.weight || "؟"}kg
- هدف: ${userProfile.goal || "؟"} | سطح: ${userProfile.level || "؟"}
- تمرین: ${userProfile.training_days_per_week || "؟"} روز/هفته · ${userProfile.session_duration || "؟"} دقیقه · تجهیزات: ${userProfile.equipment_access || "؟"}
- ریکاوری: ${userProfile.recovery_quality || "؟"} | محدودیت‌ها: ${(userProfile.injury_or_limitation_flags || []).join("، ") || "ندارم"}
- برنامه فعال: ${currentWorkoutContext?.program_name || "ندارد"}${currentWorkoutContext?.day_name ? ` · ${currentWorkoutContext.day_name}` : ""}
- split فعلی: ${currentWorkoutContext?.split_family || recommendedProgram.split.split_family}
- حرکات سازگار فعلی: ${userFilteredExercises.slice(0, 6).map(ex => ex.name).join("، ") || "نامشخص"}`,
          messages: [{ role: "user", content: aiPrompt }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || "خطا در دریافت پاسخ");
    } catch {
      setAiResult("خطا در اتصال به سرویس AI");
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
    { id: "exercises", icon: "🏋️", label: "حرکات" },
    { id: "workout", icon: "⚡", label: "تمرین" },
    { id: "programs", icon: "📋", label: "برنامه" },
    { id: "progress", icon: "📊", label: "پیشرفت" },
    { id: "gamification", icon: "🏆", label: "امتیاز" },
    { id: "nutrition", icon: "🥗", label: "تغذیه" },
    { id: "ai", icon: "🤖", label: "مربی" },
  ];

  const s = {
    app: { minHeight: "100vh", background: bg, color: text, fontFamily: "'Vazirmatn', 'Tahoma', sans-serif", direction: "rtl", paddingBottom: 80 },
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
        <span style={s.logo}>💪 آیرون‌فا</span>
        <div style={{ flex: 1, margin: "0 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: levelInfo.color, fontWeight: 700 }}>Lv.{levelInfo.level} {levelInfo.title}</span>
            <span style={{ color: sub }}>{gameData.xp} XP</span>
          </div>
          <div style={{ height: 4, background: dark ? "#2a2a2a" : "#ddd", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${xpProgress}%`, background: levelInfo.color, borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>
        <div style={s.row}>
          <span style={{ color: "#ff6600", fontWeight: 700, fontSize: 13 }}>🔥{gameData.streak}</span>
          <button style={s.darkBtn} onClick={() => setDark(d => !d)}>{dark ? "☀️" : "🌙"}</button>
          <button style={{ ...s.darkBtn, color: "#ff6b6b", borderColor: "#5a1a1a" }} onClick={onLogout}>خروج</button>
        </div>
      </div>

      {/* Pages */}
      <div style={s.page}>

        {/* EXERCISES */}
        {tab === "exercises" && (
          <div>
            <div style={s.title}>🏋️ بانک حرکات</div>
            <input style={{ ...s.input, marginBottom: 10 }} placeholder="جستجو..." value={searchEx} onChange={e => setSearchEx(e.target.value)} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {muscles.map(m => (
                <button key={m} onClick={() => setFilterMuscle(m)} style={{ ...s.btn(filterMuscle === m ? accent : (dark ? "#222" : "#eee")), color: filterMuscle === m ? "#000" : text, padding: "6px 14px", fontSize: 13 }}>{m}</button>
              ))}
            </div>
            {selectedEx ? (
              <div style={s.card}>
                <button onClick={() => setSelectedEx(null)} style={{ ...s.btn(dark ? "#222" : "#eee"), color: text, marginBottom: 12 }}>← برگشت</button>
                <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8 }}>{selectedEx.gif}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{selectedEx.name}</div>
                <div style={{ ...s.row, marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
                  <span style={s.tag("#e8440a")}>{getExercisePrimaryMuscle(selectedEx)}</span>
                  <span style={s.tag("#0a7ce8")}>{getExerciseEquipment(selectedEx)}</span>
                  <span style={s.tag(getExerciseDifficulty(selectedEx) === "مبتدی" ? "#0a8a2e" : getExerciseDifficulty(selectedEx) === "متوسط" ? "#e87e0a" : "#8a0a0a")}>{getExerciseDifficulty(selectedEx)}</span>
                  {selectedEx.movement_pattern && <span style={s.tag("#444")}>{selectedEx.movement_pattern}</span>}
                </div>
                <p style={{ color: sub, lineHeight: 1.8, fontSize: 14 }}>{selectedEx.desc}</p>
                <div style={{ color: sub, fontSize: 12, lineHeight: 1.9, marginBottom: 10 }}>
                  <div>عضلات ثانویه: {(selectedEx.secondary_muscles || []).join("، ") || "ندارد"}</div>
                  <div>تکرار پیش‌فرض: {selectedEx.default_rep_range || "نامشخص"} · استراحت: {selectedEx.default_rest_range || "نامشخص"}</div>
                  <div>اهداف مناسب: {getExerciseGoalsLabel(selectedEx).join("، ") || "عمومی"}</div>
                </div>
                <button style={{ ...s.btn(), width: "100%", marginTop: 12 }} onClick={() => { setActiveSet(s => ({ ...s, name: selectedEx.name })); setTab("workout"); setSelectedEx(null); }}>
                  + اضافه به تمرین امروز
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {filteredEx.map(ex => (
                  <div key={ex.id} style={{ ...s.card, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, marginBottom: 0 }} onClick={() => setSelectedEx(ex)}>
                    <span style={{ fontSize: 32 }}>{ex.gif}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{ex.name}</div>
                      <div style={s.row}>
                        <span style={s.tag("#e8440a")}>{getExercisePrimaryMuscle(ex)}</span>
                        <span style={s.tag("#0a7ce8")}>{getExerciseEquipment(ex)}</span>
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
            <div style={s.title}>⚡ تمرین امروز</div>

            {selectedProgram && (
              <div style={{ ...s.card, border: `1px solid ${accent}`, background: dark ? "#121800" : "#fbffe9" }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                  {selectedProgram.isRecommended ? "برنامه فعال پیشنهادی" : "برنامه فعال"}
                </div>
                <div style={{ color: sub, fontSize: 13, marginBottom: 10 }}>
                  {selectedProgram.name}
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
                      {day.day}
                    </button>
                  ))}
                </div>
                <div style={{ color: sub, fontSize: 12 }}>
                  {currentProgramDay
                    ? `روز فعال: ${currentProgramDay.day} — حرکت پیش‌فرض برای ثبت ست از همین روز انتخاب می‌شود.`
                    : "حرکت پیش‌فرض برای ثبت ست از روز اول انتخاب شده. می‌توانی از لیست پایین آن را تغییر بدهی."}
                </div>
              </div>
            )}

            {currentProgramDay && (
              <div style={{ ...s.card, background: dark ? "#10161d" : "#f4fbff", border: "1px solid #2f6ea5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>وضعیت روز فعال</div>
                    <div style={{ color: sub, fontSize: 12 }}>
                      {completedProgramDayExercises} از {currentProgramDay.exercises.length} حرکت این روز حداقل یک ثبت دارند.
                    </div>
                  </div>
                  {currentDayPrescriptionAdherence !== null && (
                    <div style={{ textAlign: "left" }}>
                      <div style={{ color: sub, fontSize: 11, marginBottom: 2 }}>پایبندی امروز</div>
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
                    { label: "ست هدف ثبت‌شده", value: totalDayPrescriptionUnits ? `${completedDayPrescriptionUnits}/${totalDayPrescriptionUnits}` : "بدون نسخه" },
                    { label: "حرکت باقی‌مانده", value: remainingProgramDayExercises },
                    { label: "حرکت بعدی", value: nextSuggestedExercise || "پایان روز" },
                  ].map(item => (
                    <div key={item.label} style={{ background: dark ? "#171f27" : "#fff", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{item.value}</div>
                      <div style={{ color: sub, fontSize: 11 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest Timer */}
            <div style={{ ...s.card, textAlign: "center", background: restRunning ? (dark ? "#1a1100" : "#fffbea") : card }}>
              <div style={{ fontSize: 13, color: sub, marginBottom: 6 }}>تایمر استراحت</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: restRunning ? accent : text, letterSpacing: -2, marginBottom: 10 }}>
                {String(Math.floor(restTimer / 60)).padStart(2, "0")}:{String(restTimer % 60).padStart(2, "0")}
              </div>
              <div style={s.row}>
                <select style={{ ...s.input, width: "auto" }} value={restDuration} onChange={e => setRestDuration(Number(e.target.value))}>
                  <option value={60}>۶۰ ثانیه</option>
                  <option value={90}>۹۰ ثانیه</option>
                  <option value={120}>۲ دقیقه</option>
                  <option value={180}>۳ دقیقه</option>
                </select>
                {restRunning ? <button style={s.btn(red)} onClick={stopRest}>توقف</button> : <button style={s.btn()} onClick={startRest}>شروع</button>}
              </div>
            </div>

            {/* Log Set */}
            <div style={s.card}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>ثبت ست جدید</div>
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
                  ست برای <strong>{logFeedback.name}</strong> ذخیره شد.
                  {logFeedback.nextExercise ? ` حرکت بعدی پیشنهادی: ${logFeedback.nextExercise}` : " می‌توانی همین حرکت را ادامه بدهی یا تمرین را تمام کنی."}
                </div>
              )}
              {currentProgramDay && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                    حرکت‌های {currentProgramDay.day}
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
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentProgramDay && (
                <div style={{ color: sub, fontSize: 12, marginBottom: 10 }}>
                  {nextSuggestedExercise
                    ? `قدم بعدی پیشنهادی: ${nextSuggestedExercise}`
                    : "برای تمام حرکت‌های روز فعال حداقل یک ثبت انجام شده است."}
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
                  نسخه پیشنهادی برای <strong>{activeExercisePrescription.name}</strong>:
                  {" "} {activeExercisePrescription.sets} ست · {activeExercisePrescription.rep_range} تکرار · استراحت {activeExercisePrescription.rest_range} · شدت {activeExercisePrescription.effort}
                  {activeExercisePrescription.programming_focus ? ` · ${activeExercisePrescription.programming_focus}` : ""}
                  {activeExercisePrescription.adjustment_note && (
                    <div style={{ marginTop: 8, color: dark ? "#c4dfff" : "#214b77" }}>
                      {activeExercisePrescription.adjustment_note}
                    </div>
                  )}
                  {currentExerciseAdherence !== null && (
                    <>
                      <div style={{ marginTop: 8, color: dark ? "#b7d9ff" : "#214b77" }}>
                        پیشرفت این حرکت: {currentExerciseLoggedSets}/{currentExerciseTargetSets} ست
                        {currentExerciseRemainingSets > 0
                          ? ` · ${currentExerciseRemainingSets} ست دیگر تا تکمیل نسخه`
                          : " · نسخه این حرکت کامل شده"}
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
                      پر کردن فرم از نسخه
                    </button>
                    <button
                      style={{ ...s.btn(dark ? "#243140" : "#d7e7f7"), color: dark ? "#e6f2ff" : "#214b77", padding: "6px 10px", fontSize: 12 }}
                      onClick={() => setRestDuration(getSuggestedRestSeconds(activeExercisePrescription.rest_range))}
                    >
                      تنظیم تایمر طبق نسخه
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
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>پیشنهاد پیشروی جلسه بعد</div>
                  <div style={{ marginBottom: 8 }}>{activeExerciseProgression.message}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {activeExerciseProgression.strategy && (
                      <span style={s.tag(
                        activeExerciseProgression.strategy === "increase_load" ? "#0a8a2e"
                          : activeExerciseProgression.strategy === "consolidate" ? "#b88400"
                          : activeExerciseProgression.strategy === "hold" ? "#8a450a"
                          : "#6d4cc2"
                      )}>
                        {activeExerciseProgression.strategy === "increase_load" ? "افزایش وزنه"
                          : activeExerciseProgression.strategy === "increase_reps" ? "افزایش تکرار"
                          : activeExerciseProgression.strategy === "consolidate" ? "تثبیت اجرا"
                          : activeExerciseProgression.strategy === "hold" ? "نگه‌داشتن بار"
                          : "پیشروی پایه"}
                      </span>
                    )}
                    {typeof activeExerciseProgression.average_adherence === "number" && (
                      <span style={s.tag("#444")}>میانگین پایبندی اخیر: {activeExerciseProgression.average_adherence}%</span>
                    )}
                    {typeof activeExerciseProgression.average_reps === "number" && (
                      <span style={s.tag("#444")}>میانگین تکرار اخیر: {activeExerciseProgression.average_reps}</span>
                    )}
                  </div>
                  <div style={{ color: dark ? "#beb4d8" : "#5f4f83", fontSize: 12, lineHeight: 1.8, marginBottom: 8 }}>
                    {getProgressionExplanation(activeExerciseProgression)}
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
                    استفاده از پیشنهاد
                  </button>
                </div>
              )}
              <select style={{ ...s.input, marginBottom: 8 }} value={activeSet.name} onChange={e => setActiveSet(s => ({ ...s, name: e.target.value }))}>
                <option value="">انتخاب حرکت...</option>
                {userFilteredExercises.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                <input style={s.input} type="number" placeholder="وزن (kg)" value={activeSet.weight} onChange={e => setActiveSet(s => ({ ...s, weight: e.target.value }))} />
                <input style={s.input} type="number" placeholder="تکرار" value={activeSet.reps} onChange={e => setActiveSet(s => ({ ...s, reps: e.target.value }))} />
                <input style={s.input} type="number" placeholder="ست" value={activeSet.sets} onChange={e => setActiveSet(s => ({ ...s, sets: e.target.value }))} />
              </div>
              {activeExercisePrescription && (
                <div style={{ color: sub, fontSize: 12, marginBottom: 10, lineHeight: 1.8 }}>
                  هدف سریع این حرکت:
                  {" "} {activeExercisePrescription.sets} ست در بازه {activeExercisePrescription.rep_range}
                  {activeExerciseProgression?.suggestedWeight ? ` · اگر فرم خوب بود ${activeExerciseProgression.suggestedWeight}kg را هم در نظر بگیر` : ""}
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
                ✅ ثبت ست
              </button>
            </div>

            {/* Finish Workout */}
            {workoutLog.length > 0 && (
              <button style={{ ...s.btn("#22aa44"), width: "100%", marginBottom: 12, fontSize: 16, padding: "14px 0" }} onClick={finishWorkout}>
                🏁 پایان تمرین و دریافت XP (+{calcXPForWorkout(workoutLog.length)} XP)
              </button>
            )}

            {/* Log History */}
            {workoutLog.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, color: sub }}>ثبت‌های جلسه جاری</div>
                {workoutLog.map(l => (
                  <div key={l.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "12px 16px" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{l.name}</div>
                      <div style={{ color: sub, fontSize: 12 }}>
                        {l.date}
                        {l.program_name ? ` · ${l.program_name}` : ""}
                        {l.day_name ? ` · ${l.day_name}` : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ color: accent, fontWeight: 800 }}>{l.weight}kg</span>
                      <span style={{ color: sub, fontSize: 13 }}> × {l.reps} تکرار</span>
                      {l.sets && <span style={{ color: sub, fontSize: 13 }}> × {l.sets} ست</span>}
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
            <div style={s.title}>📋 برنامه‌های تمرینی</div>
            <div style={{ ...s.card, background: dark ? "#101010" : "#fffdf5", border: `1px solid ${border}` }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>خلاصه برنامه شما</div>
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
                  محدودیت‌های درنظرگرفته‌شده: {runtimeUser.injury_or_limitation_flags.join("، ")}
                </div>
              )}
              <div style={{
                background: dark ? "#17131f" : "#faf5ff",
                border: "1px solid #6d4cc2",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 10
              }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>چرا این برنامه برای تو انتخاب شد</div>
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
                <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>یادآوری اعتماد و ایمنی</div>
                <div>{TRUST_BASELINE_COPY}</div>
                <div style={{ marginTop: 4 }}>{planDisclaimerCopy}</div>
              </div>
              <button style={{ ...s.btn(), width: "100%" }} onClick={() => activateProgram(recommendedProgram)}>
                مشاهده و شروع برنامه پیشنهادی
              </button>
            </div>
            <div style={{ ...s.card, border: `1px solid ${accent}`, background: dark ? "#141b00" : "#f8ffe7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 17, marginBottom: 6 }}>{recommendedProgram.name}</div>
                  <div style={{ color: sub, fontSize: 13, marginBottom: 8 }}>
                    این پیشنهاد از روی هدف، سطح، تعداد روز، ریکاوری و مدت‌زمان جلسه تو ساخته شده.
                  </div>
                  <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                    {recommendedProgram.programming_style}
                    {recommendedProgram.programming_cue ? ` · ${recommendedProgram.programming_cue}` : ""}
                  </div>
                  <div style={s.row}>
                    <span style={s.tag("#0a8a2e")}>{recommendedProgram.level}</span>
                    <span style={s.tag("#5a2de8")}>{recommendedProgram.goal}</span>
                    <span style={s.tag("#b38b00")}>{SPLIT_LABELS[recommendedProgram.split.split_family]}</span>
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
                <div style={{ fontWeight: 800, marginBottom: 8 }}>منطق انتخاب این پیشنهاد</div>
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
                    <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>چه چیزی بعداً این برنامه را تغییر می‌دهد</div>
                    {planExplanation.nextChecks.map((item, index) => (
                      <div key={`n-${index}`}>• {item}</div>
                    ))}
                  </div>
                )}
              </div>
              {recommendedProgram.days.map((day, i) => (
                <div key={i} style={{ background: dark ? "#1a1a1a" : "#fff", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: accent }}>{day.day}</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {(day.prescriptions || []).map((item, j) => (
                      <div key={j} style={{ background: dark ? "#2a2a2a" : "#eee", padding: "8px 10px", borderRadius: 8, fontSize: 13 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                        <div style={{ color: sub, fontSize: 12 }}>
                          {item.sets} ست · {item.rep_range} تکرار · استراحت {item.rest_range} · شدت {item.effort}
                        </div>
                        {item.adjustment_note && (
                          <div style={{ color: sub, fontSize: 11, marginTop: 4 }}>{item.adjustment_note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button style={{ ...s.btn(), width: "100%", marginTop: 6 }} onClick={() => activateProgram(recommendedProgram)}>
                ✨ استفاده از برنامه پیشنهادی
              </button>
            </div>
            {staticPrograms.map(prog => (
              <div key={prog.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{prog.name}</div>
                    <div style={{ color: sub, fontSize: 12, marginBottom: 8 }}>
                      {prog.programming_style}
                      {prog.programming_cue ? ` · ${prog.programming_cue}` : ""}
                    </div>
                    <div style={s.row}>
                      <span style={s.tag((LEVEL_LABELS[prog.training_level] || prog.level) === "مبتدی" ? "#0a8a2e" : (LEVEL_LABELS[prog.training_level] || prog.level) === "متوسط" ? "#e87e0a" : "#8a0a0a")}>
                        {LEVEL_LABELS[prog.training_level] || prog.level}
                      </span>
                      <span style={s.tag("#5a2de8")}>{GOAL_LABELS[prog.goal_key] || prog.goal}</span>
                      {prog.split?.split_family && <span style={s.tag("#b38b00")}>{SPLIT_LABELS[prog.split.split_family] || prog.split.split_family}</span>}
                    </div>
                  </div>
                </div>
                {prog.days.map((day, i) => (
                  <div key={i} style={{ background: dark ? "#1a1a1a" : "#f8f8f8", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, color: accent }}>{day.day}</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {(day.prescriptions || []).map((item, j) => (
                        <div key={j} style={{ background: dark ? "#2a2a2a" : "#eee", padding: "8px 10px", borderRadius: 8, fontSize: 13 }}>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
                          <div style={{ color: sub, fontSize: 12 }}>
                            {item.sets} ست · {item.rep_range} تکرار · استراحت {item.rest_range} · شدت {item.effort}
                          </div>
                          {item.adjustment_note && (
                            <div style={{ color: sub, fontSize: 11, marginTop: 4 }}>{item.adjustment_note}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button style={{ ...s.btn(), width: "100%", marginTop: 6 }} onClick={() => activateProgram(prog)}>
                  🚀 شروع این برنامه
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PROGRESS */}
        {tab === "progress" && (
          <div>
            <div style={s.title}>📊 ردیابی پیشرفت</div>

            {/* Stats */}
            <div style={{ ...s.grid2, marginBottom: 14 }}>
              {[
                { label: "وزن فعلی", val: currentWeightValue !== null ? `${currentWeightValue} kg` : "—", color: accent },
                { label: "تغییر کل", val: `${totalWeightChange} kg`, color: red },
                { label: "جلسات ۷ روز اخیر", val: weeklySessionKeys.length, color: "#0af" },
                { label: "حرکت ثبت‌شده", val: uniqueLoggedExercises, color: "#a0f" },
                { label: "میانگین پایبندی", val: averagePrescriptionAdherence !== null ? `${averagePrescriptionAdherence}%` : "—", color: "#8a5cff" },
                { label: "پایبندی آخرین جلسه", val: latestSessionAdherence !== null ? `${latestSessionAdherence}%` : "—", color: "#6d4cc2" },
              ].map((item, i) => (
                <div key={i} style={{ ...s.stat, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ ...s.card, background: dark ? "#11161a" : "#f6fbff" }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>خلاصه عملکرد تمرینی</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: latestSessionEntries.length ? 12 : 0 }}>
                <div style={{ background: dark ? "#1a1f24" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: accent }}>{uniqueSessionKeys.length}</div>
                  <div style={{ fontSize: 12, color: sub }}>کل sessionهای ثبت‌شده</div>
                </div>
                <div style={{ background: dark ? "#1a1f24" : "#fff", border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: accent }}>{totalLoggedVolume}</div>
                  <div style={{ fontSize: 12, color: sub }}>حجم کل ثبت‌شده</div>
                </div>
              </div>
              {latestSessionEntries.length > 0 ? (
                <div style={{ color: sub, fontSize: 13, lineHeight: 1.9 }}>
                  <div>آخرین جلسه: {latestSessionEntries[0].date}{latestSessionEntries[0].program_name ? ` · ${latestSessionEntries[0].program_name}` : ""}{latestSessionEntries[0].day_name ? ` · ${latestSessionEntries[0].day_name}` : ""}</div>
                  <div>{latestSessionExercises} حرکت منحصربه‌فرد · حجم تقریبی {latestSessionVolume}</div>
                  {latestSessionAdherence !== null && (
                    <div>پایبندی به prescription در آخرین جلسه: {latestSessionAdherence}%</div>
                  )}
                </div>
              ) : (
                <div style={{ color: sub, fontSize: 13 }}>هنوز جلسه‌ای ثبت نشده. اولین تمرین را از تب برنامه یا تمرین شروع کن.</div>
              )}
            </div>

            {/* Chart */}
            <div style={s.card}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>نمودار وزن</div>
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
              <div style={{ fontWeight: 700, marginBottom: 10 }}>ثبت وزن امروز</div>
              <div style={s.row}>
                <input style={s.input} type="number" placeholder="وزن (kg)" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
                <button
                  style={{
                    ...s.btn(parsedNewWeight > 0 ? accent : (dark ? "#2a2a2a" : "#ddd")),
                    color: parsedNewWeight > 0 ? "#000" : sub,
                    cursor: parsedNewWeight > 0 ? "pointer" : "not-allowed"
                  }}
                  disabled={!(parsedNewWeight > 0)}
                  onClick={() => {
                    if (!(parsedNewWeight > 0)) return;
                    setProgressData(p => [...p, { date: new Date().toLocaleDateString("fa-IR"), weight: parsedNewWeight }]);
                    setNewWeight("");
                  }}
                >ثبت</button>
              </div>
            </div>
          </div>
        )}

        {/* GAMIFICATION */}
        {tab === "gamification" && (
          <div>
            <div style={s.title}>🏆 امتیازات من</div>

            {/* Level Card */}
            <div style={{ ...s.card, background: dark ? "#0e0e1a" : "#f0f0ff", border: `2px solid ${levelInfo.color}44`, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: sub, marginBottom: 2 }}>سطح فعلی</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: levelInfo.color }}>Level {levelInfo.level}</div>
                  <div style={{ fontSize: 15, color: text, fontWeight: 700 }}>{levelInfo.title}</div>
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
                <span>تا لول بعدی: {levelInfo.maxXP - gameData.xp} XP</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { icon: "🔥", label: "Streak", val: `${gameData.streak} روز`, color: "#ff6600" },
                { icon: "⚡", label: "کل XP", val: gameData.xp.toLocaleString(), color: accent },
                { icon: "💪", label: "کل تمرین", val: gameData.totalWorkouts, color: "#0af" },
                { icon: "🎯", label: "کل ست", val: gameData.totalSets, color: "#a0f" },
              ].map((item, i) => (
                <div key={i} style={{ ...s.card, textAlign: "center", padding: 16, marginBottom: 0 }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: sub }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 15 }}>🏅 نشان‌های من</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {BADGES.map(b => {
                const earned = (gameData.badges || []).includes(b.id);
                return (
                  <div key={b.id} style={{ ...s.card, padding: "14px 12px", marginBottom: 0, opacity: earned ? 1 : 0.35, border: earned ? `1px solid ${accent}44` : `1px solid ${border}` }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: sub }}>{b.desc}</div>
                    {earned && <div style={{ fontSize: 10, color: accent, marginTop: 4, fontWeight: 700 }}>✅ کسب‌شده</div>}
                  </div>
                );
              })}
            </div>

            {/* Leaderboard */}
            <LeaderboardTab dark={dark} currentUser={user} gameData={gameData} />
          </div>
        )}

        {/* NUTRITION */}
        {tab === "nutrition" && (
          <div>
            <div style={s.title}>🥗 تغذیه</div>

            {/* Macros Summary */}
            <div style={{ ...s.card, background: dark ? "#0f1800" : "#f5ffe8" }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: accent }}>کالری امروز</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: accent, marginBottom: 8 }}>{Math.round(totalCals)} <span style={{ fontSize: 18, color: sub }}>kcal</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["پروتئین", totalProtein, "#0af"], ["کربوهیدرات", totalCarbs, "#fa0"], ["چربی", totalFat, "#f0a"]].map(([label, val, color]) => (
                  <div key={label} style={s.stat}>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{Math.round(val)}g</div>
                    <div style={{ fontSize: 11, color: sub }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food List */}
            <div style={{ fontWeight: 700, marginBottom: 8 }}>اضافه کردن غذا</div>
            {FOODS.map((food, i) => (
              <div key={i} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{food.name}</div>
                  <div style={{ color: sub, fontSize: 12 }}>{food.cal} kcal | P:{food.p}g C:{food.c}g F:{food.f}g</div>
                </div>
                <button style={{ ...s.btn(), padding: "6px 14px", fontSize: 13 }} onClick={() => addFood(food)}>+</button>
              </div>
            ))}

            {foodLog.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, color: sub }}>لاگ امروز</div>
                {foodLog.map(f => (
                  <div key={f.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", padding: "10px 14px", marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{f.name}</span>
                    <span style={{ color: accent, fontWeight: 700 }}>{f.cal} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI COACH */}
        {tab === "ai" && (
          <div>
            <div style={s.title}>🤖 مربی هوشمند</div>
            <div style={{ ...s.card, background: dark ? "#0a0a1a" : "#f0f0ff", border: `1px solid ${dark ? "#2a2a5a" : "#c0c0ff"}` }}>
              <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>سوالت رو بپرس — جواب شخصی‌سازی‌شده بر اساس پروفایل تو</div>
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
                <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>مرز مربی AI</div>
                <div>پاسخ‌های این بخش برای راهنمایی عمومی تمرینی هستند و جای پزشک، فیزیوتراپیست یا مربی حضوری را نمی‌گیرند.</div>
                <div style={{ marginTop: 4 }}>{DISCLAIMER_BASELINE_COPY}</div>
              </div>
              <div style={{
                background: dark ? "#101625" : "#eef4ff",
                border: `1px solid ${dark ? "#2f4069" : "#c3d4f5"}`,
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 12
              }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 8 }}>کانتکست فعلی که به مربی AI داده می‌شود</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {aiContextSummaryItems.map((item) => (
                    <div key={item.label} style={{ background: dark ? "#171d31" : "#fff", borderRadius: 10, padding: "8px 10px" }}>
                      <div style={{ fontSize: 11, color: sub, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: text }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {["برنامه هفته آینده؟", "برای حجم چی بخورم؟", "چطور زانو درد ندم؟", "بهترین حرکت سرشانه؟"].map(q => (
                  <button key={q} style={{ ...s.btn(dark ? "#1a1a3a" : "#e8e8ff"), color: dark ? "#aaf" : "#44f", padding: "6px 12px", fontSize: 12 }} onClick={() => setAiPrompt(q)}>{q}</button>
                ))}
              </div>
              <textarea
                style={{ ...s.input, minHeight: 80, resize: "vertical", marginBottom: 10 }}
                placeholder="سوالت رو بنویس..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
              />
              <button style={{ ...s.btn("#5a2de8"), width: "100%", color: "#fff" }} onClick={askAI} disabled={aiLoading}>
                {aiLoading ? "⏳ در حال پردازش..." : "🚀 سوال از مربی AI"}
              </button>
            </div>

            {aiResult && (
              <div style={{ ...s.card, background: dark ? "#0a1a0a" : "#f0fff0", border: `1px solid ${dark ? "#1a4a1a" : "#a0e0a0"}` }}>
                <div style={{ fontWeight: 700, color: "#0a8", marginBottom: 8 }}>🤖 پاسخ مربی:</div>
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
