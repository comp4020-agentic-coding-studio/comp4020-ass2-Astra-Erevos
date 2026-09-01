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
