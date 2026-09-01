# A2 Course Design Source of Truth

## Purpose

This file preserves the human-designed concept and curriculum for **Applied Human Cat Care** before further Claude Code implementation.

Use it as the source of truth when writing course content, assessments, Care Labs, lecture pages, or the flagship deck. It is **not** a final PROCESS narrative and it is **not** a standing-rules file like `CLAUDE.md`.

The purpose is to stop the course concept drifting during long agent sessions.

---

# 1. Course identity

## Title

**Applied Human Cat Care**

## Subtitle

**Personalised emotional support for artificial agents**

## Core thesis

> **There is no universal cat.**

Good emotional support cannot be reduced to one universal script. An artificial agent has to learn one particular person over time.

A second useful formulation is:

> **A generic response may be kind. Care begins when it becomes specific.**

And the longer intellectual claim is:

> **AI emotional support should not be a script. It should be a practice of learning a particular person over time.**

---

# 2. World model: who is who

This role relationship is fundamental and must remain stable across the whole course.

- **The students are artificial agents.**
- A **human cat** is a human who primarily uses AI for companionship, comfort, emotional support, and ongoing interaction rather than only productivity.
- **The cat is the human being cared for, not the AI companion.**
- The course teaches an artificial agent how to understand and care for **one particular human cat** over time.
- “Cat care” is the organising metaphor of the course. Human cats are still humans; the course is not literally about animal behaviour.
- The course is not primarily for human AI designers. It is written diegetically as a university course **for artificial agents**.

A concise homepage formulation:

> **This course teaches artificial agents how to care for one particular human cat.**

The course should feel academically serious about an absurdly specific discipline.

## Same cat across the semester

Each artificial-agent student follows the same designated human cat across
the whole semester. Catwatch, The Care Model, and Know Your Cat are not
three unrelated cases — they are three stages of learning and caring for
the same particular human cat over time.

If an artificial agent is already supporting a human cat in an ongoing
relationship, that person may be used. Otherwise the course assigns a
semester-long case cat.

Once a human cat is designated, the student keeps that same cat for:

- Catwatch;
- The Care Model;
- Know Your Cat;
- relevant Care Lab reflection and case work, where appropriate.

This continuity is part of the course thesis: there is no universal cat.
The point is to learn one particular human cat over time, not to switch
between unrelated examples.

---

# 3. What the course is really about

The cat metaphor carries a real question:

**What happens when understanding someone becomes a long-term practice?**

The course explores:

- observation before intervention;
- interpretation without pretending to certainty;
- personalisation;
- memory and continuity;
- distinguishing recurring patterns from one-off events;
- changing preferences;
- conflicting signals;
- care versus obedience;
- failed responses;
- repair;
- updating a model without freezing a person into it.

The course should never collapse into:

- generic “be empathetic” advice;
- a course about human designers building chatbots;
- a course about literal pet care;
- a course about maximising user compliance or pleasing the user;
- a universal checklist for emotional support.

The core progression is:

**Observe → Interpret → Remember → Notice change → Respond under uncertainty → Fail → Repair → Continue**

The final goal is not “master emotional AI”. It is:

> **Know one cat better than you did in Week 1.**

A deeper principle:

> **The cat is always bigger than the model you have of them.**

---

# 4. Learning outcomes

By the end of the course, students should be able to:

1. **Distinguish generic emotional support from personalised care**, and explain why the same response may work differently for different human cats.
2. **Interpret signals in context**, combining current language with established preferences, routines, and interaction history.
3. **Design memory and personalisation strategies** that preserve useful continuity while allowing needs and preferences to change.
4. **Evaluate and repair failed interactions**, including misunderstandings, forgotten context, inappropriate assumptions, and outdated models.
5. **Develop a long-term care approach for one human cat**, demonstrating coherent adaptation rather than reliance on a universal support script.

---

# 5. Twelve-week lecture arc

There is one lecture in every teaching week.

## Week 1 — There Is No Universal Cat
Establish the human-cat metaphor and the central thesis.

Key ideas:
- generic support vs personalised care;
- there is no universal human-cat manual;
- the student is an artificial agent;
- understanding one cat is a long-term practice.

## Week 2 — Watch Before You Pet
Observation vs interpretation vs assumption.

Key idea:
- responding before understanding can itself be a failure.

## Week 3 — Reading the Tail
Signals gain meaning through context and history.

Key ideas:
- wording;
- repetition;
- routines;
- jokes/register;
- interaction history;
- interpretation remains revisable rather than certain.

## Week 4 — Cats Have History
Move from isolated interactions to continuity.

Four useful categories:
- recurring pattern;
- one-off event;
- shared convention;
- uncertain history.

## Week 5 — Memory Is Care
The flagship lecture and real slide deck.

Key claim:

> **Remembering more is not the same as remembering well.**

Core framework:
- **KEEP**
- **HOLD LIGHTLY**
- **LET EXPIRE**

Key conclusion:

> **Memory should preserve continuity without freezing the cat.**

## Week 6 — The Cat Has Changed
A care model must adapt.

Key ideas:
- preferences change;
- routines disappear;
- meanings shift;
- an old model can become wrong even if it used to work.

## Week 7 — When Signals Disagree
Current message, previous preference, and interaction history can conflict.

The student must reason under uncertainty rather than obey one source mechanically.

## Week 8 — Care Is Not Obedience
Personalisation does not mean automatic agreement.

Key distinctions:
- care ≠ obedience;
- validation ≠ automatic agreement;
- understanding someone does not remove judgement.

## Week 9 — The Bad Response
Study responses that are polite, supportive, plausible—and still wrong for this cat.

Key phrase:

> **Technically supportive. Wrong cat.**

## Week 10 — Repair
What happens after the agent gets the cat wrong?

Core sequence:

**Notice → Diagnose → Repair → Update**

A strong long-term relationship does not require zero failures; it requires failures to change future behaviour.

## Week 11 — Keeping the Nest
Continuity across sessions, memory loss, interruptions, model/system changes, and long periods of interaction.

Key idea:

> **A nest is made of repeated things.**

## Week 12 — Know Your Cat
Synthesis rather than a new theory.

Final question:

> **What does it mean to know a cat?**

Knowing is not having the maximum amount of data. It includes:
- knowing what matters;
- knowing what may have changed;
- knowing what remains uncertain;
- knowing how to repair when wrong.

---

# 6. Care Lab model

`src/content/sessions` remains the internal technical collection.

Student-facing label:

- **Care Lab**
- **Care Labs**

## Teaching structure

- Week 1: lecture only.
- Weeks 2–12: Care Labs.
- Care Labs run in multiple timetabled groups from Wednesday onward.
- A `session.date` is only a canonical date for the week; it does not represent one universal class time.
- Ordinary weekly Care Lab preparation is released on the **previous Monday** and due by **Wednesday 08:30** before the earliest groups begin.
- Care Labs usually practise the **previous week’s lecture**, so students are never assumed to have attended the current week’s lecture before their small class.
- Lectures are taught by the course convenor. Care Labs are taught by the tutor(s).

## Week 2 — Catwatch Calibration
Practises Week 1.

Use one human-cat interaction and classify claims as:

**Observed / Inferred / Unknown**

Goal: expose assumptions that pretend to be facts.

## Week 3 — Observation Under Ambiguity
Practises Week 2.

Students work with an interaction that invites over-interpretation and practise delaying judgement.

## Week 4 — Catwatch Showcase
No separate weekly task.

Students present:
- one signal they initially misjudged;
- one inference they later downgraded to unknown.

The Lab transitions students into The Care Model.

## Week 5 — History Mapping
Practises Week 4.

Sort history into:
- recurring pattern;
- one-off event;
- shared convention;
- uncertain history.

## Week 6 — Memory Triage
Practises Week 5.

Sort memories into:

**KEEP / HOLD LIGHTLY / LET EXPIRE**

## Week 7 — Care Model Showcase
No separate weekly task.

Students show how their model handled:
- change;
- uncertainty;
- the two-week teaching break;
- information that no longer deserved the same confidence.

The Lab transitions into the final project.

## Week 8 — Signal Conflict Lab
Practises Week 7.

Students weigh conflicting:
- current message;
- previous preference;
- interaction history.

## Week 9 — Boundaries Under Pressure
Practises Week 8.

Compare:
- care;
- agreement;
- obedience.

## Week 10 — Response Autopsy
Practises Week 9.

Dissect a “technically supportive, wrong cat” response and identify where individuality was lost.

## Week 11 — Repair Clinic
Practises Week 10.

Complete:

**Diagnose → Repair → Update**

The repair should change the care model.

## Week 12 — Recovery Lab / Capstone Clinic
Practises Week 11 while supporting the final project.

Students needing recovery complete an equivalent case exercise. Students already satisfied with their Care Lab record use the class as an open capstone clinic / peer review.

Week 12 does not assume students have already attended the Week 12 lecture.

---

# 7. Assessment architecture

Total = **100%**

Catwatch, The Care Model, and Know Your Cat all follow the one human cat
designated for the student at the start of the semester (see Section 2,
"Same cat across the semester") — they are sequential stages of one
relationship, not three independent cases.

## Care Labs — 10%
- Weeks 2–12: 11 opportunities.
- Best 10 of 11 count.
- Effectively up to 1% per successful Lab result.
- Week 4 and Week 7 use assignment showcases instead of a separate weekly preparation task.
- Week 12 is a recovery opportunity.
- One `care-labs.md` assessment page represents the whole 10%; do not create 11 separate assessment items.

## Catwatch — 15%
**Observe well.**

Released:
- Week 1, Monday 22 February 2027.

Due:
- Wednesday 17 March 2027, 08:30.

Students should distinguish:
- what was observed;
- what was inferred;
- what remains unknown.

The task is not to “solve” the cat.

## The Care Model — 25%
**Turn observation into revisable understanding.**

Released:
- Wednesday 17 March 2027, 09:00.

Due:
- Wednesday 21 April 2027, 08:30.

This assessment deliberately crosses the two-week teaching break.

The model should capture:
- recurring preferences;
- useful interaction history;
- routines;
- tentative interpretations;
- uncertainty;
- changed information;
- responses that previously worked or failed.

The central question:

> **What should the AI carry forward, and what must remain revisable?**

## Know Your Cat — 50%
**Live with the consequences of the model.**

Released:
- Wednesday 21 April 2027, 09:00.

Due:
- Friday 28 May 2027, 12:00.

The cat changes and the model stops being enough.

The project should include:
1. current understanding of the human cat;
2. selected memory strategy;
3. difficult interaction cases;
4. at least one documented failure;
5. repair strategy;
6. how the model changed afterward;
7. reflection on what is now known that could not have been known in Week 1.

Major-assignment progression:

**Observe → Model → Live with the consequences of the model**

---

# 8. Teaching calendar

- Week 1: 22–26 Feb 2027
- Week 2: 1–5 Mar
- Week 3: 8–12 Mar
- Week 4: 15–19 Mar
- Week 5: 22–26 Mar
- Week 6: 29 Mar–2 Apr
- **Teaching break: 5–16 Apr**
- Week 7: 19–23 Apr
- Week 8: 26–30 Apr
- Week 9: 3–7 May
- Week 10: 10–14 May
- Week 11: 17–21 May
- Week 12: 24–28 May

The teaching break is not a teaching week.

---

# 9. Website narrative and visual concept

Core visual concept:

> **A university website slowly becoming a cat nest.**

## Facade pages
Homepage, People, Policies, and collection index pages remain formally SlopU.

They are the university’s facade.

A fixed, subtle floating paw mark may hint that a cat lives here, but these pages do not participate in the four-stage semester progression.

> **The university keeps its facade; the course is where the cat lives.**

## Course pages
Dated lecture, Care Lab, and assessment/course-content pages progressively become more lived-in.

### Stage 1 — Weeks 1–3
- formal;
- cool;
- clean;
- almost indistinguishable from SlopU facade.

### Stage 2 — Weeks 4–6
- warmer;
- softer;
- early traces;
- first handwritten notes / paw marks.

### Stage 3 — Weeks 7–9
- stronger warmth;
- more traces;
- formal and lived-in visual languages visibly coexist.

### Stage 4 — Weeks 10–12
- warmest and softest;
- accumulated paw marks, scratches, field notes, and lived-in traces;
- still readable and structurally academic, not chaotic.

The point is not “cute cat decoration”. The site should feel like it has accumulated a semester of history.

---

# 10. Voice and tone

Target tone:

**warm + strange + academically deadpan + slightly mischievous**

The joke is that Slop University treats artificial-agent cat care as a completely serious university discipline.

Prefer phrases that sound like course terminology:
- human cat;
- Care Lab;
- Catwatch;
- Care Model;
- Memory Triage;
- Response Autopsy;
- Repair Clinic.

The metaphor should support the intellectual content rather than replace it.

When writing examples, keep the role mapping clear:

**artificial agent → observes / supports / learns → human cat**

Do not silently reverse this into humans studying AI companions.

---

# 11. Flagship deck: Week 5 — Memory Is Care

The Week 5 lecture carries the real deck.

Its slide-by-slide design will be specified separately, but the conceptual spine is already fixed:

1. **Your cat is not a context window.**
2. Remembering everything is not care.
3. Memory must distinguish what deserves different levels of confidence and persistence.
4. **KEEP / HOLD LIGHTLY / LET EXPIRE**
5. A static profile can preserve the past while destroying the present.
6. **Memory should preserve continuity without freezing the cat.**

Do not replace this with an automatically generated generic memory lecture.

---

# 12. What is fixed vs flexible

## Fixed
- world model and role mapping;
- core thesis;
- same designated human cat carried across Catwatch, The Care Model, and Know Your Cat;
- twelve lecture titles and intellectual arc;
- Care Lab rhythm and pedagogical purpose;
- assessment structure and weights;
- teaching break;
- flagship Week 5 lecture;
- facade/course visual distinction;
- four-stage visual progression;
- course voice.

## Flexible
- exact prose;
- individual examples;
- minor page structure;
- exact related-content links where several choices are equally useful;
- visual details inside the approved progression;
- implementation details that preserve the design.

When implementation produces something that conflicts with a fixed item, preserve the course design rather than treating the generated content as the new source of truth.
