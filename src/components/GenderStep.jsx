const MALE_PHOTO = "/male-athlete.jpg";
const FEMALE_PHOTO = "/female-athlete.jpg";
const GOLD = "#c9a84c";

const COPY = {
  fa: {
    step: "مرحله ۱ از ۵",
    title: "جنسیتت را انتخاب کن",
    subtitle: "یکی از کارت‌ها را انتخاب کن تا ادامه فعال شود.",
    male: "مرد",
    female: "زن",
    cta: "ادامه",
  },
  en: {
    step: "Step 1 of 5",
    title: "Choose your gender",
    subtitle: "Select one card to activate continue.",
    male: "مرد",
    female: "زن",
    cta: "Continue",
  },
};

export default function GenderStep({ value, onChange, onNext, language, setLanguage }) {
  const isRtl = language === "fa";
  const copy = COPY[language] || COPY.fa;
  const canNext = Boolean(value);

  const styles = {
    wrap: {
      minHeight: "100vh",
      background: "#050505",
      color: "#fff",
      fontFamily: "'Vazirmatn', Tahoma, sans-serif",
      direction: isRtl ? "rtl" : "ltr",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: "20px 20px 12px",
    },
    topRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 18,
    },
    langSwitch: {
      display: "inline-flex",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 999,
      padding: 3,
      direction: "ltr",
    },
    langBtn: (active) => ({
      border: "none",
      borderRadius: 999,
      padding: "6px 12px",
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "'Vazirmatn', Tahoma, sans-serif",
      background: active ? "#fff" : "transparent",
      color: active ? "#000" : "rgba(255,255,255,0.55)",
      cursor: "pointer",
    }),
    stepLabel: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.48)",
    },
    title: {
      fontSize: 28,
      fontWeight: 900,
      lineHeight: 1.15,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 1.6,
      color: "rgba(255,255,255,0.58)",
    },
    cards: {
      flex: 1,
      display: "grid",
      gridTemplateRows: "1fr 1fr",
      gap: 12,
      padding: "8px 20px 18px",
      minHeight: 0,
    },
    card: (selected) => ({
      position: "relative",
      width: "100%",
      height: "100%",
      padding: 0,
      appearance: "none",
      borderRadius: 24,
      overflow: "hidden",
      border: `2px solid ${selected ? GOLD : "rgba(255,255,255,0.08)"}`,
      boxShadow: selected ? `0 0 0 1px ${GOLD} inset` : "none",
      cursor: "pointer",
      background: "#111",
      minHeight: 0,
      textAlign: "left",
    }),
    image: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center center",
      display: "block",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.42) 42%, rgba(0,0,0,0.18) 100%)",
    },
    label: {
      position: "absolute",
      left: 18,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 28,
      fontWeight: 900,
      letterSpacing: -0.5,
      textShadow: "0 4px 18px rgba(0,0,0,0.45)",
    },
    selectedDot: (selected) => ({
      position: "absolute",
      top: 16,
      right: 16,
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: `1px solid ${selected ? GOLD : "rgba(255,255,255,0.25)"}`,
      background: selected ? GOLD : "rgba(0,0,0,0.18)",
    }),
    footer: {
      padding: "0 20px 28px",
    },
    cta: {
      width: "100%",
      height: 54,
      borderRadius: 16,
      border: "none",
      background: canNext ? "#fff" : "rgba(255,255,255,0.14)",
      color: canNext ? "#000" : "rgba(255,255,255,0.46)",
      fontSize: 15,
      fontWeight: 800,
      fontFamily: "'Vazirmatn', Tahoma, sans-serif",
      cursor: canNext ? "pointer" : "default",
      transition: "background .2s ease, color .2s ease",
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.topRow}>
          <div style={styles.stepLabel}>{copy.step}</div>
          <div style={styles.langSwitch}>
            <button type="button" style={styles.langBtn(language === "fa")} onClick={() => setLanguage("fa")}>فا</button>
            <button type="button" style={styles.langBtn(language === "en")} onClick={() => setLanguage("en")}>En</button>
          </div>
        </div>
        <div style={styles.title}>{copy.title}</div>
        <div style={styles.subtitle}>{copy.subtitle}</div>
      </div>

      <div style={styles.cards}>
        <button type="button" style={styles.card(value === "زن")} onClick={() => onChange("زن")}>
          <img style={styles.image} src={FEMALE_PHOTO} alt={copy.female} />
          <div style={styles.overlay} />
          <div style={styles.label}>{copy.female}</div>
          <div style={styles.selectedDot(value === "زن")} />
        </button>

        <button type="button" style={styles.card(value === "مرد")} onClick={() => onChange("مرد")}>
          <img style={styles.image} src={MALE_PHOTO} alt={copy.male} />
          <div style={styles.overlay} />
          <div style={styles.label}>{copy.male}</div>
          <div style={styles.selectedDot(value === "مرد")} />
        </button>
      </div>

      <div style={styles.footer}>
        <button type="button" style={styles.cta} disabled={!canNext} onClick={onNext}>
          {copy.cta}
        </button>
      </div>
    </div>
  );
}
