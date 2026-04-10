import { useState } from "react";
import {
  hashPassword,
  tr,
  getUsers,
  saveSession,
  normalizePersistedUser,
  DEMO_USER,
  Onboarding,
} from "../App";

const styles = {
  wrap: {
    width: '100%',
    minHeight: '100vh',
    background: '#030303',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  grain: {
    position: 'absolute', inset: 0,
    opacity: 0.04,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
    backgroundSize: '256px 256px',
    pointerEvents: 'none',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.55) 66%, rgba(0,0,0,0.97) 100%)',
    pointerEvents: 'none',
  },
  statusBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 20,
  },
  statusTime: {
    fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 0.2,
  },
  statusIcons: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: '#fff',
  },
  brandSection: {
    position: 'absolute', top: 52, right: 28,
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
    zIndex: 10,
  },
  brandName: { fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: -1, lineHeight: 1 },
  brandDivider: { width: 40, height: 2, background: '#fff', alignSelf: 'flex-end' },
  brandTagline: { fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase' },
  langSwitch: {
    position: 'absolute', top: 52, left: 28,
    display: 'flex', gap: 0,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 20, padding: 3,
    zIndex: 10,
    direction: 'ltr',
  },
  langBtn: (active) => ({
    background: active ? '#fff' : 'none',
    border: 'none',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    fontSize: 12, fontWeight: 700,
    color: active ? '#000' : 'rgba(255,255,255,0.4)',
    cursor: 'pointer', padding: '5px 12px', borderRadius: 16,
    transition: 'background .2s, color .2s',
  }),
  loginSection: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: '0 28px 38px',
    display: 'flex', flexDirection: 'column',
    zIndex: 5,
  },
  signinLabel: {
    fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)',
    textAlign: 'center', marginBottom: 13, letterSpacing: 1.5, textTransform: 'uppercase',
  },
  btnApple: {
    width: '100%', height: 54, borderRadius: 14, border: 'none',
    background: '#fff', color: '#000',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif", fontSize: 15, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginBottom: 11,
  },
  btnGoogle: {
    width: '100%', height: 54, borderRadius: 14,
    background: 'transparent', color: '#fff',
    border: '1px solid rgba(255,255,255,0.22)',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif", fontSize: 15, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginBottom: 11,
  },
  emailLink: {
    background: 'none', border: 'none',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif", fontSize: 13, fontWeight: 600,
    color: 'rgba(255,255,255,0.65)', cursor: 'pointer', textAlign: 'center',
    textDecoration: 'underline', textUnderlineOffset: 3,
    padding: '10px 0', width: '100%',
  },
  termsText: {
    fontSize: 11, color: 'rgba(255,255,255,0.22)', textAlign: 'center', lineHeight: 1.6,
    marginTop: 8,
  },
  sheet: (open) => ({
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: '#111',
    borderRadius: '20px 20px 0 0',
    padding: '24px 28px 44px',
    transform: open ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.35s ease',
    zIndex: 10,
  }),
  sheetHandle: {
    width: 40, height: 4, background: 'rgba(255,255,255,0.15)',
    borderRadius: 2, margin: '0 auto 20px',
  },
  sheetTitle: {
    fontSize: 20, fontWeight: 800, color: '#fff',
    textAlign: 'center', marginBottom: 20,
  },
  sheetInput: {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
    padding: '14px 16px', color: '#f0f0f0', fontSize: 15,
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    outline: 'none', boxSizing: 'border-box', marginBottom: 12,
  },
  sheetBtn: {
    width: '100%', height: 52, borderRadius: 12, border: 'none',
    background: '#fff', color: '#000',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 4,
  },
  sheetBack: {
    background: 'none', border: 'none',
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    fontSize: 13, fontWeight: 600,
    color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
    textAlign: 'center', padding: '12px 0', width: '100%',
  },
  errorBox: {
    background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
    color: '#ff6b6b', borderRadius: 10, padding: '10px 14px',
    fontSize: 13, marginBottom: 12, textAlign: 'center',
  },
};

function getNow() {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

export default function AuthScreen({ onLogin, language = "fa", setLanguage = () => {} }) {
  const [sheetView, setSheetView] = useState(null); // null | "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [onboardUser, setOnboardUser] = useState(null);
  const [time] = useState(getNow);

  const dir = language === "fa" ? "rtl" : "ltr";
  const sheetOpen = sheetView !== null;

  const handle = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const openSheet = (view) => {
    setForm({ name: "", email: "", password: "" });
    setError("");
    setSheetView(view);
  };

  const closeSheet = () => setSheetView(null);

  const doLogin = async () => {
    const hashed = await hashPassword(form.password);
    if (form.email === DEMO_USER.email && hashed === DEMO_USER.password) {
      const normalizedDemo = normalizePersistedUser(DEMO_USER);
      saveSession(normalizedDemo);
      onLogin(normalizedDemo);
      return;
    }
    const users = getUsers();
    const user = users.find(u => u.email === form.email && u.password === hashed);
    if (!user) { setError(tr(language, "invalid_login_error")); return; }
    const normalizedUser = normalizePersistedUser(user);
    saveSession(normalizedUser);
    onLogin(normalizedUser);
  };

  const doSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError(tr(language, "complete_fields_error")); return;
    }
    if (form.password.length < 6) {
      setError(tr(language, "password_length_error")); return;
    }
    const users = getUsers();
    const existingUser = users.find(u => u.email === form.email);
    if (existingUser) { setError(tr(language, "email_exists_error")); return; }

    const hashedPassword = await hashPassword(form.password);
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: hashedPassword,
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

  const doDemoLogin = () => {
    const normalizedDemo = normalizePersistedUser(DEMO_USER);
    saveSession(normalizedDemo);
    onLogin(normalizedDemo);
  };

  if (onboardUser) {
    return <Onboarding baseUser={onboardUser} onFinish={onLogin} language={language} setLanguage={setLanguage} />;
  }

  const isLogin = sheetView === "login";
  const isSignup = sheetView === "signup";

  const emailLinkLabel = language === "fa"
    ? "ورود / ثبت‌نام با ایمیل"
    : "Sign in / Sign up with Email";

  const appleLabel = language === "fa" ? "ادامه با Apple" : "Continue with Apple";
  const googleLabel = language === "fa" ? "ادامه با Google" : "Continue with Google";
  const termsLabel = language === "fa"
    ? "با ورود، شرایط استفاده و حریم خصوصی آیرون‌فا را می‌پذیری"
    : "By continuing, you agree to IronFa's Terms & Privacy Policy";

  return (
    <div style={{ ...styles.wrap, direction: dir }}>
      {/* Grain texture */}
      <div style={styles.grain} />
      {/* Gradient overlay */}
      <div style={styles.overlay} />

      {/* Status bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusTime}>{time}</div>
        <div style={styles.statusIcons}>
          <span>▲</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Language switcher — top left */}
      <div style={styles.langSwitch}>
        <button
          type="button"
          style={styles.langBtn(language === "fa")}
          onClick={() => setLanguage("fa")}
        >
          فا
        </button>
        <button
          type="button"
          style={styles.langBtn(language === "en")}
          onClick={() => setLanguage("en")}
        >
          En
        </button>
      </div>

      {/* Brand — top right */}
      <div style={styles.brandSection}>
        <div style={styles.brandName}>IRONFA</div>
        <div style={styles.brandDivider} />
        <div style={styles.brandTagline}>
          {language === "fa" ? "مربی هوشمند تو" : "Your Smart Coach"}
        </div>
      </div>

      {/* Bottom login section */}
      <div style={styles.loginSection}>
        <div style={styles.signinLabel}>
          {language === "fa" ? "ورود با" : "Sign in with"}
        </div>

        {/* Apple button */}
        <button style={styles.btnApple} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          {appleLabel}
        </button>

        {/* Google button */}
        <button style={styles.btnGoogle} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLabel}
        </button>

        {/* Email link */}
        <button style={styles.emailLink} type="button" onClick={() => openSheet("login")}>
          {emailLinkLabel}
        </button>

        <div style={styles.termsText}>{termsLabel}</div>
      </div>

      {/* Bottom sheet for email form */}
      <div style={styles.sheet(sheetOpen)}>
        <div style={styles.sheetHandle} />
        <div style={styles.sheetTitle}>
          {isSignup
            ? tr(language, "create_account")
            : tr(language, "login_to_app")}
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {isSignup && (
          <input
            style={styles.sheetInput}
            placeholder={tr(language, "name")}
            value={form.name}
            onChange={handle("name")}
          />
        )}
        <input
          style={styles.sheetInput}
          type="email"
          placeholder={tr(language, "email")}
          value={form.email}
          onChange={handle("email")}
          dir="ltr"
        />
        <input
          style={styles.sheetInput}
          type="password"
          placeholder={tr(language, "password")}
          value={form.password}
          onChange={handle("password")}
          dir="ltr"
        />

        <button
          style={styles.sheetBtn}
          type="button"
          onClick={isSignup ? doSignup : doLogin}
        >
          {isSignup
            ? tr(language, "continue_onboarding")
            : tr(language, "login_to_app")}
        </button>

        {isLogin && (
          <button type="button" onClick={doDemoLogin}
            style={{ ...styles.sheetBtn, background: 'rgba(255,255,255,0.08)', color: '#fff', marginTop: 10 }}>
            {tr(language, "demo_login")}
          </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {isLogin ? (
            <button style={styles.sheetBack} type="button" onClick={() => openSheet("signup")}>
              {language === "fa" ? "حساب ندارم — ثبت‌نام" : "No account — Sign up"}
            </button>
          ) : (
            <button style={styles.sheetBack} type="button" onClick={() => openSheet("login")}>
              {language === "fa" ? "قبلاً ثبت‌نام کردم — ورود" : "Already registered — Log in"}
            </button>
          )}
        </div>

        <button style={styles.sheetBack} type="button" onClick={closeSheet}>
          {tr(language, "back")}
        </button>
      </div>
    </div>
  );
}
