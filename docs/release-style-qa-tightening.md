# Release-Style QA Tightening

## Purpose
This checklist defines the short release-style QA tightening pass after the main runtime verification wave.

Its purpose is to reduce release risk without opening a new feature wave.

---

## 1. Snapshot Alignment

- [ ] Confirm `docs/current-state.md` reflects the latest implementation checkpoint.
- [ ] Confirm the latest verification and progression commits are represented in the project snapshot.

---

## 2. Git Cleanliness

- [ ] Confirm no intended product changes remain uncommitted.
- [ ] Confirm unrelated files are still excluded from product commits.

---

## 3. Runtime Entry

- [ ] Confirm the local runtime harness still builds successfully.
- [ ] Confirm the dev server can still start from the repo workspace.

---

## 4. Core Loop Sanity

- [ ] Confirm onboarding still reaches the main app.
- [ ] Confirm recommendation still renders after the latest progression changes.
- [ ] Confirm workout logging still works after the latest progression changes.
- [ ] Confirm completion popup still works after the latest progression changes.

---

## 5. Progression and Adaptive Behavior

- [ ] Confirm progression labels still render correctly after plateau/deload updates.
- [ ] Confirm adaptive prescription notes still render correctly in the programs tab.
- [ ] Confirm no obvious copy mismatch exists between progression state and prescription adjustment note.

---

## 6. Persistence and Restore

- [ ] Confirm refresh/reload behavior still restores active plan and workout draft correctly.
- [ ] Confirm completed history remains separate from active workout draft.

---

## 7. Risk Register

Record any remaining release-facing risks here:

- [ ] Snapshot lag
- [ ] Runtime harness mismatch
- [ ] Progression copy mismatch
- [ ] Restore/persistence regression
- [ ] No new issues found
