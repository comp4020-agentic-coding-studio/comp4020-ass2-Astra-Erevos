import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Deck background images are plain CSS `url(...)` strings built by
// astromotion's remark-deck-bg plugin (resolveAssetUrl), not astro:assets
// imports and not <img src> or <a href> — so neither Astro's build nor
// astro-broken-links-checker (which only walks `a[href]`) ever notices a
// deck referencing an image that doesn't exist. The slide would just render
// blank, silently, both in dev and on the built site.
const deckFiles = readdirSync(resolve("src/decks")).filter((f) => f.endsWith(".deck.mdx"));

const bgImageRefs = (deckPath: string): string[] => {
  const source = readFileSync(deckPath, "utf8");
  return [...source.matchAll(/!\[bg[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]!);
};

describe("deck background images", () => {
  it.each(deckFiles)("%s: every image-backed slide references a real source asset", (deckFile) => {
    const deckPath = resolve("src/decks", deckFile);
    const refs = bgImageRefs(deckPath);
    expect(refs.length, `${deckFile} has no ![bg ...] slides`).toBeGreaterThan(0);
    for (const ref of refs) {
      const assetPath = resolve(dirname(deckPath), ref);
      expect(existsSync(assetPath), `${deckFile} references ${ref}, but ${assetPath} does not exist`).toBe(true);
    }
  });

  it.each(deckFiles)("%s: every referenced asset survives into the production build", (deckFile) => {
    const deckPath = resolve("src/decks", deckFile);
    for (const ref of bgImageRefs(deckPath)) {
      // remark-deck-bg resolves relative to the deck file, finds `/src/` in
      // the result, and rewrites from there — so the built path is always
      // dist/src/decks/... regardless of the deck's own location.
      const sourceAbs = resolve(dirname(deckPath), ref);
      const srcIndex = sourceAbs.replace(/\\/g, "/").indexOf("/src/");
      expect(srcIndex, `could not locate /src/ in resolved path for ${ref}`).toBeGreaterThanOrEqual(0);
      const distPath = resolve("dist", sourceAbs.slice(srcIndex + 1));
      expect(existsSync(distPath), `${deckFile}'s ${ref} did not survive into ${distPath}`).toBe(true);
    }
  });
});
