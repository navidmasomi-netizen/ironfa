import { useState } from 'react';
import { tr, localizedLabel } from '../utils/translations.js';
import {
  SEX_LABELS, GOAL_DISPLAY, LEVEL_DISPLAY, EQUIPMENT_DISPLAY,
  RECOVERY_DISPLAY, LIMITATION_DISPLAY,
} from '../utils/constants.js';
import { getUsers, saveUsers, saveSession, normalizePersistedUser } from '../utils/storage.js';

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

export default Onboarding;
