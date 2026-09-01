import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

const sessions = api.nodes.filter((node) => node.type === "sessions");
const lectures = api.nodes.filter((node) => node.type === "lectures");
const assessments = api.nodes.filter((node) => node.type === "assessments");

describe("twelve dated teaching weeks", () => {
  it("has a session in every week from 1 to 12", () => {
    const weeks = new Set(sessions.map((node) => node.meta?.week));
    for (let week = 1; week <= 12; week += 1) {
      expect(weeks.has(week), `no session scheduled for week ${week}`).toBe(true);
    }
  });
});

describe("assessment weights", () => {
  it("sum to exactly 100 across the whole course", () => {
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);
    expect(total, `assessment weights sum to ${total}, not 100`).toBe(100);
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
