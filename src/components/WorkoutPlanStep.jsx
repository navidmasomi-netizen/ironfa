const WORKOUT_PLANS = [
  {
    value: "muscle_building",
    faLabel: "عضله‌سازی",
    enLabel: "Muscle Building",
    image: "/workout-plans/male/muscle-building.png",
  },
  {
    value: "fat_burn",
    faLabel: "چربی‌سوزی",
    enLabel: "Fat Burn",
    image: "/workout-plans/male/fat-burn.png",
  },
  {
    value: "strength",
    faLabel: "قدرتی",
    enLabel: "Strength",
    image: "/workout-plans/male/strength.png",
  },
  {
    value: "strong_legs",
    faLabel: "پاها",
    enLabel: "Strong Legs",
    image: "/workout-plans/male/strong-legs.png",
  },
  {
    value: "full_body",
    faLabel: "فول‌بادی",
    enLabel: "Full Body",
    image: "/workout-plans/male/full-body.png",
  },
  {
    value: "six_pack_abs",
    faLabel: "شکم",
    enLabel: "Six Pack Abs",
    image: "/workout-plans/male/6-pack-abs.png",
  },
];

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    color: "#101010",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 14px 18px",
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 900,
    margin: "12px 0 20px",
    color: "#111111",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: (selected, image) => ({
    position: "relative",
    height: 140,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    border: selected ? "2px solid #C9A84C" : "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
    backgroundColor: "#0f2231",
    backgroundImage: `url("${image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    appearance: "none",
    padding: 0,
    textAlign: "left",
  }),
  cardOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, rgba(5,20,30,0.94) 0%, rgba(6,24,36,0.82) 38%, rgba(6,24,36,0.28) 72%, rgba(6,24,36,0.14) 100%)",
  },
  cardCopy: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
  },
  faLabel: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  enLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  footer: {
    padding: "14px 14px 18px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
    background: "#ffffff",
  },
  continueBtn: (enabled) => ({
    width: "100%",
    height: 54,
    borderRadius: 14,
    border: "none",
    background: enabled ? "#C9A84C" : "#e1dfd8",
    color: enabled ? "#111111" : "#9e9886",
    fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
    fontSize: 18,
    fontWeight: 900,
    cursor: enabled ? "pointer" : "not-allowed",
    transition: "background 0.2s ease, color 0.2s ease",
  }),
};

export function getWorkoutPlanDisplay(value, language = "fa") {
  const plan = WORKOUT_PLANS.find((item) => item.value === value);
  if (!plan) return "—";
  return language === "fa" ? `${plan.faLabel} / ${plan.enLabel}` : plan.enLabel;
}

export default function WorkoutPlanStep({ value, onChange, onNext, language = "fa" }) {
  const title = language === "fa" ? "برنامه تمرینی‌ات را انتخاب کن" : "Select your workout plan";
  const continueLabel = language === "fa" ? "ادامه" : "Continue";
  const canContinue = Boolean(value);

  return (
    <div style={styles.wrap}>
      <div style={styles.body}>
        <div style={styles.header}>{title}</div>
        <div style={styles.stack}>
          {WORKOUT_PLANS.map((plan) => {
            const selected = value === plan.value;
            return (
              <button
                key={plan.value}
                type="button"
                style={styles.card(selected, plan.image)}
                onClick={() => onChange(plan.value)}
              >
                <div style={styles.cardOverlay} />
                <div style={styles.cardCopy}>
                  <div style={styles.faLabel}>{plan.faLabel}</div>
                  <div style={styles.enLabel}>{plan.enLabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={styles.footer}>
        <button
          type="button"
          style={styles.continueBtn(canContinue)}
          disabled={!canContinue}
          onClick={() => {
            if (!canContinue) return;
            onNext();
          }}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
