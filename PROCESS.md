# PROCESS

## 1. Designing one course around one cat

The first design call was giving the semester one idea to carry, not a syllabus of skills. **Applied Human Cat Care** commits every artificial-agent student to caring for one designated human cat, never the reverse, across the whole term:

> There is no universal cat.

A broader "AI emotional support" course collapses into being polite to anyone; specificity to one cat is what makes Catwatch, The Care Model, and Know Your Cat one progression, not three disconnected exercises. The teaching rhythm follows the same logic: a lecture each week, then a Care Lab practising the *previous* week's material, so no group depends on that week's own lecture; Weeks 4 and 7 are showcases, Week 12 a recovery capstone. The site enacts this structurally: facade pages stay fixed while pages for a specific week grow visibly warmer as the semester runs — the same claim, made twice (evidence: [3a11e61](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/3a11e6181c8f4c1a7d9fb131a9440211d732b7e8)).

## 2. Correcting drift through human review

`/start` initially read the brief's "12 dated teaching weeks" as "every week needs its own session," generating a course-contract test requiring a Care Lab every week; re-reading the brief against the real structure loosened it to the actual commitment, a dated lecture every week.

A more consequential drift was conceptual: early implementation partly reversed the relationship — humans studying AI companions, rather than agents caring for a human cat — and literalised the metaphor into feline body language instead of a human's words and history. I corrected this with an explicit contract, **artificial agent → learns/cares for → human cat**, and `A2_COURSE_DESIGN_SOURCE_OF_TRUTH.md` as a standing authority separate from `CLAUDE.md`, guarding against re-drift. The same review caught fixes Claude Code had reported as done that hadn't actually rendered — a due-date bug, a template branch that never applied. From then on, the rendered page was the acceptance source, not the agent's report (evidence: [6e1c899](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/6e1c8993acc221c6ab7e462b9d0293b97d25e121)).

## 3. Changing the division of labour

The Week 5 flagship deck was originally a CSS deck Claude Code designed — plausible, but not what had been approved. That mismatch led me to change the workflow: human-led, GPT-assisted visual and editorial work produced the final PDF artwork, which I approved, recorded as a standing rule in `CLAUDE.md`, while Claude Code's role became faithful implementation, not fresh design. I had Claude Code build `pnpm import:deck` to make that repeatable — rendering each page to an image and extracting its text into a parallel accessible block — and used it for all twelve decks (evidence: [55b5688](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/55b568838078bf1f9ad72b2d54695b3130cc807e)). Visual and editorial judgement stayed human; automation's job was faithful, bulk extraction from approved work.

## 4. Turning failures into sensors

A green `pnpm check` verifies structure, not whether the course is coherent or usable. Reading the rendered site as a student repeatedly surfaced gaps the harness had missed.

The clearest case: Weeks 6–12's decks rendered correctly as images, but their accessible text was only a placeholder heading, `# Slide N`, wherever the source PDF had no text layer — valid to every check, invisible to a screen reader. A human-directed whole-site audit, outside the automated harness, found it — not the suite. The fix went beyond that batch: `import:deck` now detects unusable text extraction and fails instead of silently shipping a placeholder, and `spec/deck-accessibility.test.ts` asserts no deck's accessible text is fallback-only and that every deck keeps its attribution (evidence: [57ea486](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/57ea48632f6779083f1fc5ca00ee1b84c1e465c5)).

That is the shape worth keeping: human-led review and audits outside the current harness kept finding what it couldn't, and the useful response each time was a constraint that would catch the same failure automatically.
