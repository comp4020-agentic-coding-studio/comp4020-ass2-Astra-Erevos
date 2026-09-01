import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { formatCourseDateTime } from "../src/lib/dates";

// Regression test for a real bug: assessment `due` values are authored with
// an explicit +10:00 offset (fixed AEST), but the header rendered them a
// calendar day early because the formatter forced UTC. See src/lib/dates.ts.

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const assessments = api.nodes.filter((node) => node.type === "assessments");

const expectedRendering: Record<string, string> = {
  "assessments/catwatch": "Wed, 17 Mar 2027, 08:30",
  "assessments/care-model": "Wed, 21 Apr 2027, 08:30",
  "assessments/care-labs": "Wed, 26 May 2027, 08:30",
  "assessments/know-your-cat": "Fri, 28 May 2027, 12:00",
};

describe("assessment due-date rendering", () => {
  it("renders each due date on its intended Australian wall-clock day and time", () => {
    for (const [id, expected] of Object.entries(expectedRendering)) {
      const node = assessments.find((assessment) => assessment.id === id);
      expect(node, `no assessment node found for ${id}`).toBeDefined();
      const rendered = formatCourseDateTime(String(node?.meta?.due));
      expect(rendered, `${id} rendered "${rendered}", expected "${expected}"`).toBe(expected);
    }
  });
});
