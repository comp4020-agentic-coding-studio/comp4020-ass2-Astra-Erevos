# Your harness

The platform under this repo is fixed and documented in `README.md`. The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or
build.

## Principles carried forward from earlier prototypes

- Treat the rendered page as ground truth at both 1920×1080 and 390×844.
  Automated viewport checks do not verify visual usability.
- Before claiming completion, run `pnpm check` and `pnpm check:evidence`,
  inspect the live GitHub Pages result, and verify relative links.
- Review the prototype from a first-time-user perspective: the scenario, task,
  primary action, and any reset/reversal must be understandable without prior
  subject-matter expertise. A prototype that quietly requires domain knowledge
  unrelated to its thesis is testing the wrong thing.
- When the intended experience depends on a comparison or progression, design
  the core interaction so every visitor encounters it directly, rather than
  depending on a particular choice path or on the visitor remembering earlier
  state. A choice space that a visitor can navigate around the point is not
  reliable enough to carry the thesis, however good the code behind it is.
- For any interaction built on a repeated or multi-step sequence, manually
  exercise the entire sequence — every stage, not just the first step or a
  single pass — before declaring it done. Passing typecheck/build/lint/tests
  and reading the initial markup does not surface bugs that are properties of
  the sequence across many repetitions (off-screen content, steps collapsing
  into one, dead ends).

## Visual/UX acceptance is user-led

- Visual and UX sign-off on this project is done by the student, in a real
  browser, not by the agent. For any change that affects rendered appearance,
  run the dev server and hand back the exact URL(s) to check — do not install
  Playwright/Chromium system dependencies to take headless screenshots, and do
  not treat a headless screenshot as a substitute for the student's own
  visual judgement.

## Course content authority

When writing course content, use `A2_COURSE_DESIGN_SOURCE_OF_TRUTH.md` as the
conceptual authority. Students are artificial agents; human cats are the
humans receiving care.

## Project-specific rules learned from the first public CI run

- CI's `check` job only runs once the repo is public, so a check declared as
  "only runs in CI" (links, evidence, secrets) is genuinely unverified by
  `pnpm check` until the repo is shipped — the first `/comp4020:ship` run is
  the first time these have ever executed for real, not a formality after
  weeks of green runs.
