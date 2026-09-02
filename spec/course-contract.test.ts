import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface ApiEdge {
  from: string;
  to: string;
}

interface CourseApi {
  nodes: ApiNode[];
  edges: ApiEdge[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

const lectures = api.nodes.filter((node) => node.type === "lectures");
const sessions = api.nodes.filter((node) => node.type === "sessions");
const assessments = api.nodes.filter((node) => node.type === "assessments");

const byWeek = (nodes: ApiNode[], week: number) =>
  nodes.filter((node) => node.meta?.week === week);

// Lecture and Care Lab dates are authored as plain YYYY-MM-DD, so plain
// Date.parse (UTC midnight, no offset) is safe for day-count arithmetic —
// unlike the assessment `due` timestamps, which carry a real +10:00 offset
// and must go through formatCourseDateTime (see date-rendering.test.ts).
const daysBetween = (a: unknown, b: unknown): number =>
  (Date.parse(String(b)) - Date.parse(String(a))) / 86_400_000;

describe("teaching rhythm", () => {
  it("has exactly one lecture in each of Weeks 1-12", () => {
    for (let week = 1; week <= 12; week += 1) {
      const found = byWeek(lectures, week);
      expect(found.length, `Week ${week} has ${found.length} lectures, not 1`).toBe(1);
    }
  });

  it("has exactly one Care Lab in each of Weeks 2-12, and none in Week 1", () => {
    expect(byWeek(sessions, 1).length, "Week 1 should be lecture-only").toBe(0);
    for (let week = 2; week <= 12; week += 1) {
      const found = byWeek(sessions, week);
      expect(found.length, `Week ${week} has ${found.length} Care Labs, not 1`).toBe(1);
    }
  });
});

describe("teaching team", () => {
  it("has every lecture taught solely by the convenor, Marisol Quaye", () => {
    for (const lecture of lectures) {
      expect(lecture.meta?.teachers, `${lecture.id} has no teachers listed`).toEqual([
        "marisol-quaye",
      ]);
    }
  });

  it("has every Care Lab taught by the same three tutors", () => {
    const theThreeTutors = new Set(["idris-fenn", "mina-vale", "rowan-pike"]);
    for (const session of sessions) {
      const teachers = new Set((session.meta?.teachers as string[] | undefined) ?? []);
      expect(teachers, `${session.id} does not carry all three Care Lab tutors`).toEqual(
        theThreeTutors,
      );
    }
  });
});

describe("assessment architecture", () => {
  it("sum to exactly 100 across the whole course", () => {
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);
    expect(total, `assessment weights sum to ${total}, not 100`).toBe(100);
  });

  it("weights each stage of the one-cat progression as designed", () => {
    const expectedWeights: Record<string, number> = {
      "assessments/care-labs": 10,
      "assessments/catwatch": 15,
      "assessments/care-model": 25,
      "assessments/know-your-cat": 50,
    };
    for (const [id, weight] of Object.entries(expectedWeights)) {
      const node = assessments.find((assessment) => assessment.id === id);
      expect(node, `no assessment node found for ${id}`).toBeDefined();
      expect(node?.meta?.weight, `${id} is weighted ${node?.meta?.weight}, not ${weight}`).toBe(
        weight,
      );
    }
  });
});

describe("semester structure", () => {
  const weekGap = (nodes: ApiNode[], weekA: number, weekB: number): number => {
    const a = byWeek(nodes, weekA)[0];
    const b = byWeek(nodes, weekB)[0];
    return daysBetween(a?.meta?.date, b?.meta?.date);
  };

  it("keeps lecture dates a week apart, except the deliberate break before Week 7", () => {
    for (let week = 1; week < 12; week += 1) {
      const expected = week === 6 ? 21 : 7;
      expect(
        weekGap(lectures, week, week + 1),
        `Week ${week} to Week ${week + 1} lecture gap should be ${expected} days`,
      ).toBe(expected);
    }
  });

  it("keeps Care Lab dates a week apart, except the deliberate break before Week 7", () => {
    for (let week = 2; week < 12; week += 1) {
      const expected = week === 6 ? 21 : 7;
      expect(
        weekGap(sessions, week, week + 1),
        `Week ${week} to Week ${week + 1} Care Lab gap should be ${expected} days`,
      ).toBe(expected);
    }
  });
});

describe("course graph", () => {
  it("has every lecture participating in at least one related-content edge", () => {
    const connected = new Set(api.edges.flatMap((edge) => [edge.from, edge.to]));
    for (const lecture of lectures) {
      expect(connected.has(lecture.id), `${lecture.id} has no related-content edge`).toBe(true);
    }
  });
});

describe("lecture decks", () => {
  it("has at least one lecture that links to a real, built deck", () => {
    const withSlides = lectures.filter(
      (node) => typeof node.meta?.slides === "string" && node.meta.slides.length > 0,
    );
    expect(withSlides.length, "no lecture names a deck via `slides:`").toBeGreaterThan(0);

    const builtDecks = withSlides.filter((node) => {
      const slug = String(node.meta?.slides).replace(/^\/decks\//, "").replace(/\/$/, "");
      return existsSync(resolve("dist/decks", slug, "index.html"));
    });
    expect(builtDecks.length, "no linked deck actually built to dist/decks/<slug>/").toBeGreaterThan(0);
  });
});
