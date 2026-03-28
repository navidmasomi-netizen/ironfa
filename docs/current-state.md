# Current Project State

  ## Project
  IronFa

  ## Date
  Current working state after moving from specification into real implementation.

  ---

  ## 1. Executive Status

  IronFa is no longer in the idea or pure-spec phase.

  The project now has:
  - a completed phase 1 specification foundation
  - implementation issues defined in GitHub
  - real code changes applied to the current app
  - a working MVP backbone that is materially stronger than the original prototype

  The project is now in:
  - implementation and hardening mode

  ---

  ## 2. Current Phase

  Current phase:
  - specification closed
  - first implementation wave active
  - core loop partially implemented
  - compatibility cleanup in progress
  - next build work should continue from the product backbone, not side features

  ---

  ## 3. What Was Completed Before Coding

  ### Product Foundation
  Completed:
  - product scope
  - training engine foundation
  - core user flow
  - trust and safety baseline
  - technical foundation
  - roadmap
  - decision extraction
  - execution readiness review
  - phase 1 build issue planning

  ### Training Logic Specification
  Completed:
  - split selection spec
  - hypertrophy programming spec
  - progression and deload spec
  - beginner safety spec
  - exercise metadata spec
  - substitution engine spec
  - strength programming spec
  - fat loss programming spec
  - recomposition programming spec

  ### Core Flow Specification
  Completed:
  - onboarding field spec
  - onboarding order spec
  - onboarding question design
  - plan summary spec
  - logging interaction spec
  - workout screen spec
  - disclaimer and trust copy spec
  - workout completion and progress feedback spec

  ---

  ## 4. Current Implementation Issues

  The main implementation issues created for phase 1 are:

  - Implement final onboarding field set
  - Implement onboarding question order
  - Implement split selection baseline
  - Implement hypertrophy logic baseline
  - Implement beginner-safe filtering baseline
  - Implement exercise metadata schema
  - Implement substitution baseline
  - Implement plan summary screen structure
  - Implement workout screen structure
  - Implement logging interaction baseline
  - Implement workout completion and progress feedback baseline
  - Implement disclaimer baseline
  - Implement trust copy baseline

  ---

  ## 5. What Has Already Been Implemented in Code

  ### A. Onboarding V1 Rewrite
  The onboarding in `Downloads/gym-app.jsx` has been rewritten toward the version 1 model.

  Implemented:
  - leaner onboarding field model
  - 5-step onboarding structure
  - version 1 summary screen
  - cleaned onboarding output contract
  - step-level validation
  - normalized user persistence path

  Current onboarding model includes:
  - goal
  - training_level
  - age
  - sex
  - weight
  - height
  - training_days_per_week
  - equipment_access
  - injury_or_limitation_flags
  - session_duration
  - recovery_quality

  ### B. Split Selection Baseline
  A real split-selection baseline exists in code.

  Implemented:
  - normalized split families
  - `chooseSplit(...)`
  - goal-aware split defaults
  - frequency-aware rules
  - beginner restrictions
  - recovery-based downgrade behavior
  - disallowed-case handling
  - stable split output contract

  Supported split families:
  - full_body
  - upper_lower
  - ppl
  - strength_split

  ### C. Recommended Program Generation
  Recommended programs are no longer static-only.

  Implemented:
  - `buildRecommendedProgram(...)`
  - recommendation based on onboarding-derived inputs
  - recommendation card in programs tab
  - activation of recommended program into workout flow

  ### D. Exercise Metadata Schema
  Exercise objects are now materially richer.

  Implemented metadata includes:
  - name_fa
  - name_en
  - primary_muscles
  - secondary_muscles
  - movement_pattern
  - equipment
  - difficulty
  - complexity
  - suitable_goals
  - contraindications
  - joint_stress_flags
  - default_rep_range
  - default_rest_range
  - progression_type
  - substitution_list

  ### E. Filtering and Substitution Baseline
  Metadata is now connected to behavior.

  Implemented:
  - beginner-safe filtering
  - equipment-aware filtering
  - limitation-aware filtering
  - substitution baseline

  ### F. Workout Flow Backbone
  The workout flow is now program-aware and day-aware.

  Implemented:
  - selected program
  - selected program day
  - day switching
  - active day exercise quick-picks
  - active program display
  - active day context in workout flow

  ### G. Logging Interaction Baseline
  Logging is no longer a raw form only.

  Implemented:
  - save confirmation
  - disabled save until required inputs exist
  - next-step clarity after save
  - active program/day context inside logs
  - suggested next exercise behavior

  ### H. Workout Completion and Feedback
  Workout completion is now more product-like.

  Implemented:
  - completion popup with real session summary
  - unique exercises count
  - completed sets count
  - approximate session volume
  - active-day coverage
  - next-step message
  - automatic next-day preparation when a program is active

  ### I. Persistence
  Core workout loop data is now persisted.

  Implemented:
  - persisted session user
  - persisted active program
  - persisted active program day
  - persisted workout log
  - persisted progress data

  ### J. Progress Tab Hardening
  The progress tab now uses more real session-derived data.

  Implemented:
  - unique session count
  - recent session count
  - total logged volume
  - unique logged exercise count
  - last-session summary
  - persisted weight progress

  ### K. AI Prompt Sync
  The AI prompt is now aligned with the newer user model.

  Implemented:
  - no dependency on removed onboarding fields like motivation, diet, supplements, timeline
  - uses current user model
  - uses active program/day context
  - uses filtered exercises context

  ---

  ## 6. Recent Hardening and Cleanup Work

  ### Runtime Model Hardening
  A normalized runtime user path is now active.

  Implemented:
  - `normalizePersistedUser(...)`
  - normalized demo login path
  - normalized runtime user usage inside `GymApp`

  ### Compatibility Debt Reduction
  Compatibility cleanup has progressed.

  Already reduced:
  - runtime logic now relies more on normalized user structure
  - onboarding output is normalized before persistence
  - filtering and recommendation helpers self-normalize
  - demo user and signup seed are leaner and closer to V1
  - static programs now use cleaner goal and level vocabulary
  - shared goal and level label maps exist

  Remaining compatibility debt is now mostly intentional and limited to:
  - legacy aliases kept in `normalizePersistedUser(...)`
  - legacy aliases still present in some exercise objects
  - compatibility fields preserved where needed to avoid breaking older persisted state

  ---

  ## 7. Current Engine Behavior Status

  ### Fully Active Enough
  These are active enough to be considered real implemented baselines:
  - onboarding V1 input model
  - split selection baseline
  - metadata filtering baseline
  - substitution baseline
  - recommended program activation
  - workout logging baseline
  - workout completion baseline
  - progress persistence baseline

  ### Partially Implemented but Improving
  These are active but still in a baseline or bridge form:
  - goal-specific programming depth
  - advanced progression logic
  - plan quality explanation
  - trust/disclaimer placement
  - full app-wide normalization

  ---

  ## 8. Current Goal-Specific Programming Status

  ### Hypertrophy Baseline
  Implemented:
  - exercise prescription layer exists for recommended programs
  - set count, rep range, rest range, and effort are generated
  - hypertrophy prescription favors:
    - moderate-to-higher volume
    - moderate reps
    - controlled proximity to failure

  ### Strength Baseline
  Implemented:
  - lower rep prescriptions
  - longer rest prescriptions
  - more technique-focused effort tone

  ### Fat Loss Baseline
  Implemented:
  - denser prescriptions
  - shorter rest prescriptions
  - controlled fatigue approach

  ### Recomposition Baseline
  Implemented:
  - balanced prescription style
  - moderate sets and recovery-aware structure

  This means recommended programs are no longer only split + exercise names.
  They now also carry baseline training prescriptions.

  ---

  ## 9. Current Real Product Loop

  The current MVP backbone now looks like this:

  1. user signs up or logs in
  2. user completes V1 onboarding
  3. app normalizes user model
  4. split selection baseline chooses a split
  5. recommended program is generated
  6. user activates a program
  7. user selects a day
  8. user logs sets with program/day context
  9. app shows save feedback
  10. user completes workout
  11. app shows session summary and next-step guidance
  12. progress and logs persist across sessions

  This is the strongest implemented loop so far.

  ---

  ## 10. What Is Stable Enough Right Now

  Stable enough:
  - onboarding rewrite direction
  - split selection baseline
  - program activation flow
  - day-aware workout flow
  - logging with context
  - completion popup summary
  - persistence for key loop data
  - progress tab baseline
  - normalized runtime user approach

  Not yet fully hardened:
  - advanced progression logic
  - full trust/disclaimer integration
  - full removal of all legacy aliases
  - deeper prescription adherence tracking
  - perfect plan-generation depth

  ---

  ## 11. What Should Not Be Reopened Casually

  The following are effectively locked for version 1 direction:
  - workout-first product direction
  - rule-based engine approach
  - support for hypertrophy / strength / fat loss / recomposition
  - lean onboarding approach
  - beginner/intermediate first orientation
  - split selection as a real engine layer
  - metadata-driven filtering and substitution
  - implementation-first execution rather than endless new specs

  These should not be reopened without a strong reason.

  ---

  ## 12. Immediate Next Logical Work

  The most logical next work items are:

  1. continue goal-specific programming baselines
  2. strengthen prescription-aware workout behavior
  3. improve trust / disclaimer product surfaces
  4. reduce remaining compatibility debt
  5. harden the current loop with more runtime verification

  ---

  ## 13. Recommended Next Focus

  Recommended next focus:
  - continue implementation from the current codebase
  - stay on engine and workout-loop issues
  - avoid drifting into unrelated side features
  - keep working from `Downloads/gym-app.jsx` until the backbone is stronger

  If continuing from the current momentum, the best next topic is:
  - prescription-aware progress and adherence logic
  or
  - trust / disclaimer baseline completion

  ---

  ## 14. Resume Instruction

  When resuming work later, use this message:

  ```text
  ادامه پروژه IronFa از docs/current-state.md

  حالت کار: implementation
  فایل فعلی: /Users/user/Downloads/gym-app.jsx
  تمرکز فعلی: [نام issue یا موضوع فعلی]

  لطفاً:
  1. وضعیت فعلی را از روی current-state.md مبنا بگیر
  2. تغییرات واقعی اعمال‌شده در gym-app.jsx را ادامه بده
  3. از آخرین implementation state ادامه بده
  4. اگر لازم است، قدم بعدی را اجرایی و code-facing بچین

  ———

  ## 15. Short Resume Versions

  ### General Resume

  ادامه پروژه IronFa از docs/current-state.md
  حالت: implementation
  فایل فعلی: /Users/user/Downloads/gym-app.jsx

  ### If continuing engine work

  ادامه پروژه IronFa از docs/current-state.md
  حالت: implementation
  فایل فعلی: /Users/user/Downloads/gym-app.jsx
  تمرکز: engine and recommendation layer

  ### If continuing workout loop work

  ادامه پروژه IronFa از docs/current-state.md
  حالت: implementation
  فایل فعلی: /Users/user/Downloads/gym-app.jsx
  تمرکز: workout loop hardening

  ———

  ## 16. Summary

  IronFa has moved from planning into real implementation.

  The project now has:

  - a rewritten onboarding backbone
  - a real split-selection baseline
  - metadata-driven exercise logic
  - recommended program generation
  - day-aware workout flow
  - logging and completion feedback
  - persistence for core loop data
  - a stronger progress layer
  - early goal-specific programming prescriptions

  The project should now continue through focused implementation and hardening, not a return to broad planning.

