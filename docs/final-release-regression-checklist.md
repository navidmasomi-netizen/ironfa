# Final Release Regression Checklist

## Purpose
This checklist defines the final release-style regression pass for IronFa before treating the current build as a release candidate.

Its purpose is to re-check the core loop after the latest implementation, hardening, verification, progression, and QA waves.

---

## 1. Workspace and Build

- [ ] Confirm the active workspace is `/Users/user/Desktop/Gym App`.
- [ ] Confirm the active app file is `gym-app.jsx`.
- [ ] Confirm `npm run build` succeeds without blocking errors.
- [ ] Confirm the local runtime harness still starts correctly.

---

## 2. Authentication and Session

- [ ] Login with the demo user.
- [ ] Refresh and confirm the session persists.
- [ ] Logout and confirm the session clears.
- [ ] Login again and confirm restore remains stable.

---

## 3. Onboarding Regression

- [ ] Register a fresh user and enter onboarding.
- [ ] Confirm the 5-step onboarding still works.
- [ ] Confirm required fields still block progress.
- [ ] Confirm the final summary still shows only V1 onboarding fields.
- [ ] Confirm onboarding completion still enters the app without crash.

---

## 4. Programs and Recommendation

- [ ] Confirm the recommended program renders.
- [ ] Confirm static programs render.
- [ ] Confirm prescriptions still show inside programs.
- [ ] Confirm explanation blocks still render.
- [ ] Confirm trust/disclaimer copy is still present.

---

## 5. Workout Flow

- [ ] Activate a program and confirm the workout tab opens correctly.
- [ ] Confirm day switching still works.
- [ ] Confirm workout logging still works.
- [ ] Confirm save feedback still appears.
- [ ] Confirm prescription controls still work.
- [ ] Confirm progression guidance still renders.

---

## 6. Completion and Restore

- [ ] Finish a workout and confirm the popup still works.
- [ ] Confirm the popup can scroll fully.
- [ ] Confirm the rest timer stops on workout completion.
- [ ] Confirm the active draft clears after completion.
- [ ] Confirm the next day still auto-selects when a program is active.

---

## 7. Persistence and History

- [ ] Refresh during an active workout and confirm the draft restores.
- [ ] Refresh after completion and confirm only completed history remains.
- [ ] Confirm progress stats still use completed history only.
- [ ] Confirm adaptive plans still ignore unfinished drafts.

---

## 8. Progression and Adaptive Behavior

- [ ] Confirm progression labels still render:
- [ ] `افزایش وزنه`
- [ ] `افزایش تکرار`
- [ ] `تثبیت اجرا`
- [ ] `نگه‌داشتن بار`
- [ ] Confirm plateau/deload labels render when triggered:
- [ ] `ریست پلاتو`
- [ ] `دیلود کوتاه`
- [ ] Confirm adaptive notes in the programs tab still match prescription changes.

---

## 9. Progress and AI

- [ ] Confirm the progress tab still renders session stats and adherence.
- [ ] Confirm the weight chart still renders.
- [ ] Confirm the AI disclaimer is still visible.
- [ ] Confirm the AI context summary still reflects the active program/day.

---

## 10. Final Gate

- [ ] No blocking runtime error appears during the main loop.
- [ ] No major persistence regression appears.
- [ ] No obvious UI break appears in the main surfaces.
- [ ] The current build is acceptable as a release candidate.

---

## Notes

- [ ] No new issues found
- [ ] Issues recorded separately
