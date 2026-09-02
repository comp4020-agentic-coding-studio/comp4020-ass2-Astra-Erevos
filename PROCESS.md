# PROCESS

## Initial direction

Before building the site, I decided to design **Applied Human Cat Care**, a course about personalised emotional support for people who use AI primarily for companionship, comfort and long-term interaction rather than productivity.

The course uses “cat care” as a deliberate metaphor. Its central idea is that good emotional support cannot be reduced to a universal script: an artificial agent has to learn one particular person over time.

The starting thesis is:

> There is no universal cat.

From that premise, I designed the semester around a progression from observation to interpretation, memory, personalisation, uncertainty, failure, repair and long-term continuity.

## Early design decisions

### One cat, not users in general

I rejected a broader course about “AI emotional support” because it could easily become a collection of generic advice about being polite, empathetic or supportive. The narrower course asks what changes when care has to become specific to one person.

### One relationship across the semester

The twelve weeks are designed as one continuous progression rather than twelve independent topics:

observe → interpret → remember → notice change → respond under uncertainty → fail → repair → continue.

The end goal is not to “master emotional AI”, but to understand one cat better than in Week 1.

### Assessment follows the same progression

The assessment structure is:

- **Catwatch — 20%:** observe without intervening
- **The Care Model — 30%:** turn interaction history into a revisable model
- **Know Your Cat — 50%:** handle contradiction, failure, repair and change

### The site should accumulate history

The site begins as a formal Slop University course website and gradually becomes more lived-in across the semester, accumulating notes, memory traces, paw marks and repaired interactions.

The visual idea is not a generic cute-cat theme. It is **a university website slowly becoming a cat nest**.

## First harness decision

During setup, I added a course-contract test requiring all twelve teaching weeks to contain at least one session.

The provisioned starter only contains Weeks 1 and 2, so this test intentionally begins red. I kept it red rather than generating placeholder weeks simply to satisfy the test, because the missing weeks represent real course-design work that still needs to happen.

This gives the project an automatic signal for a real promise made by the course: the test should only turn green once the twelve-week curriculum genuinely exists.

## Visual progression

Before implementation, I compared three visual directions: a system-wide colour progression, accumulated handwritten field notes, and a content/deck-led redesign. I combined the first two rather than choosing either alone: the course pages use their existing week metadata to drive a four-stage shift from cold institutional styling to a warm, lived-in cat nest, while paw marks and field notes accumulate as a separate narrative layer.

I also separated the site into facade and course pages. Homepage, People, Policies and collection indexes remain visually formal regardless of semester progress; only pages belonging to a particular week evolve. I rejected stage previews on collection cards because they weakened the contrast and added another visual system without improving the core idea. The intended transition is deliberate: the university keeps its facade; the course is where the cat lives.

## Visual progression and human review

Claude proposed three visual directions: a system-driven colour progression, accumulated handwritten field notes, and a content/deck-led redesign. I combined the first two. Week metadata now drives a four-stage shift from the formal SlopU baseline toward a warmer, softer course environment, while paw marks, scratches and field notes accumulate as a separate narrative layer.

I also separated the site into facade and course pages. Homepage, People, Policies and collection indexes remain formal, while dated course pages evolve with their week. I deliberately rejected stage previews on collection cards to preserve the contrast: the university keeps its facade; the course is where the cat lives.

Manual browser review then changed the implementation. The original floating facade paw was visually right but collided with the hero. A technically more robust replacement moved it into document flow, but this lost the hanging/floating quality I wanted, so I rejected that solution. I restored the approved floating mechanism and moved the paw to the bottom-left, where it avoids the sticky navigation and hero while preserving the original visual idea. The final A+B system was then accepted through manual browser inspection. Evidence: [3a11e61](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/3a11e6181c8f4c1a7d9fb131a9440211d732b7e8).

## Correcting an over-tightened course contract

`/start` interpreted A2's "12 dated teaching weeks" requirement as "12 weeks, each with a session", and generated a course-contract test enforcing that. Re-reading the brief against the real COMP4020/8020 course structure showed this was a stronger promise than the brief actually asks for: the fixed commitment is a dated lecture every week, not a Care Lab (the collection technically named `sessions`) mechanically attached to every one of them.

I corrected the test to require a lecture in every week from 1 to 12, and dropped the per-week session requirement — Care Labs now accompany lectures where the teaching logic calls for one, not by a fixed weekly cadence. Evidence: [a456a77](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/a456a77fe99ca9c93fd465ff8e69c782f2696271).

## Curriculum architecture pivot

That sensor correction turned out to be the first sign of a larger pivot, not an isolated fix. `/start` had concretised "12 dated teaching weeks" as "every week must have a session"; re-reading the published brief showed that over-constrained the actual requirement. `sessions` stays the repo's internal technical collection name, but the student-facing identity is redesigned as Care Labs.

Rather than the six checkpoint-style sessions I first sketched, I based the rhythm on a real lecture/tutorial structure: Week 1 is lecture-only, and Weeks 2–12 run continuous Care Labs, each practising the *previous* week's lecture so no timetabled group depends on having already sat that week's lecture. An ordinary week's task releases the prior Monday and is due 08:30 the following Wednesday, ahead of that week's earliest timetabled group. Eleven Care Labs run in total, best 10 of 11 = 10% of the course; Weeks 4 and 7 replace their independent task with an assignment showcase, and Week 12 doubles as a recovery opportunity.

The semester metadata already supported a deliberate two-week teaching break between Weeks 6 and 7, and The Care Model is the one major assignment designed to span it. The major-assignment progression remains Observe (Catwatch) → Model (The Care Model) → Live with the consequences of the model (Know Your Cat).

## Correcting a drifted world model through manual review

The first Weeks 1–4 implementation preserved much of the intended intellectual arc, but manual browser review found the world model itself had drifted: the homepage partly framed humans as studying AI companions, rather than artificial agents learning one human cat. I fixed this by establishing an explicit role contract — artificial agent → cares for / learns → human cat — and introducing `A2_COURSE_DESIGN_SOURCE_OF_TRUTH.md` as an on-demand conceptual authority for course content, rather than folding that much concept detail into `CLAUDE.md`.

A second manual review found a different kind of drift, once that role contract held: Week 3's operational teaching material had literalised the cat metaphor (real tail/ear body language) instead of reading a human cat's words and history, and all four assessment pages had inherited real-COMP4020-style "brief"/"spec"/"mechanically checkable" scaffolding that never belonged to the fictional course. Rather than discarding the intellectual structure that had already been approved — Week 4's four-category history framework, the Care Lab 2–4 mechanics, the assessment weights and architecture — I used targeted, iterative human review to reground each of those pieces inside the fictional discipline while leaving their approved mechanics untouched.

That same review also caught a real assessment-date rendering bug: due datetimes authored with an explicit Australian `+10:00` offset were being formatted through a UTC-forced `Intl.DateTimeFormat`, silently rolling the displayed calendar date back a day whenever the due time was earlier than the UTC offset. I fixed the formatter rather than compensating with shifted fake dates, and added a regression test against the built course API. The same review cycle also caught a shared-template branch I had reported as corrected but that did not actually render — an `id` comparison against the wrong string shape — which held only until the rendered HTML, not my own summary, was checked directly. From then on the rendered page, not the agent's report, was treated as the acceptance source.

The final assessment progression became Catwatch → The Care Model → Know Your Cat, all three following the same designated human cat across the semester, with Care Labs supporting that continuity rather than existing as separate, unrelated exercises. Evidence: [6e1c899](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/6e1c8993acc221c6ab7e462b9d0293b97d25e121).

## A green build hid a broken student journey

With the core course structurally complete — 12 lectures, Weeks 2–12 Care Labs, four assessments, four teaching staff, People and Policies — I ran a repo-wide semantic audit before starting the remaining artwork, reading the implemented course the way a student actually would rather than re-running `pnpm check`. The mechanical suite was already fully green; the audit found three problems it had no way to see.

The Lectures, Care Labs and Assessment index pages still carried literal starter/theme-author copy (one was a one-line author TODO, "Weights should sum to 100.") instead of describing that part of the course — `pnpm check:evidence` only greps for `STARTER_CONTENT`-marked fragments, so unlabelled leftover prose passed silently. The course graph had a genuine orphan: Week 3's lecture, "Reading the Tail," carried no `related:` edge at all, so it never surfaced as feeding into Catwatch or the Week 4 showcase, even though its closing line already gestured at exactly that connection. And the Week 12 lecture and the capstone assessment share an intentional title, "Know Your Cat," which the platform's `RelatedContent` component rendered as two indistinguishable links on the same page with no way to tell which target either one pointed to.

I fixed the first two directly: real course copy on all three index pages, and a `related:` declaration on Week 3 pointing at Catwatch and the Week 4 showcase (the graph is undirected, so declaring it on one side is enough for both pages to show the connection), plus a small addition in the showcase asking students to name which of Week 3's ideas — repetition, routine, register, interaction history — explains a signal that changed meaning, without turning the showcase back into a new weekly task. The title collision needed a structural fix rather than a wording patch on one page: I wrote a local `src/components/RelatedContent.astro` that wraps the platform's own `getRelatedEntries` helper and appends a type suffix (" — Lecture" / " — Assessment") only when a title actually collides, then swapped it into all three `[slug].astro` templates so the rule applies everywhere the graph could produce an ambiguous pair, not just the one known case. I also brought Idris Fenn's contact wording into parity with Mina and Rowan's, and corrected the Source of Truth's Care Lab release-timing sentence to state the actual rhythm plainly, without changing any date.

This is the same lesson as the earlier drifted-world-model review, applied one layer down: a fully green mechanical suite verifies structure, not whether the course reads coherently as a journey through it. Evidence: [b3ce4e1](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Astra-Erevos/commit/b3ce4e16ffe3035f785d9d32451b75f69cad19a9).
