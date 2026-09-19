import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Deck slides are image-backed: the .sr-only block on each slide is not a
// caption, it is the ONLY accessible record of that slide's content (see
// deck-assets.test.ts for why the background image itself is invisible to
// every other check). scripts/import-deck.ts falls back to a placeholder
// `# Slide N` heading when a PDF page has no extractable text layer. That
// fallback is valid MDX and a real heading, so nothing else in the harness
// catches it — it silently ships a deck that is functionally blank to a
// screen reader. This file targets exactly that failure mode.
const deckFiles = readdirSync(resolve("src/decks")).filter((f) => f.endsWith(".deck.mdx"));

const srOnlyBlocks = (deckPath: string): string[] => {
  const source = readFileSync(deckPath, "utf8");
  return [...source.matchAll(/<div class="sr-only">\n\n([\s\S]*?)\n\n<\/div>/g)].map((m) => m[1]!.trim());
};

// Matches only the exact importer fallback shape (see scripts/import-deck.ts's
// `usedFallback` block): a single `# Slide <n>` heading and nothing else.
// This is deliberately narrow — it must not reject a legitimately minimal
// real title slide that happens to be short, only the literal placeholder.
const isFallbackOnly = (block: string): boolean => /^# Slide \d+$/.test(block);

// Weeks 1-4's credits slides name the sources as plain text ("created by
// Slidesgo, and includes icons by Flaticon..."); weeks 5-12 render them as
// markdown links (`[Slidesgo,](https://slidesgo.com/)`). Match the source
// names themselves so either accessible representation counts.
const attributionPattern = /slidesgo|flaticon|freepik/i;

describe("deck accessible content", () => {
  it.each(deckFiles)("%s: no slide's accessible text is import-fallback placeholder-only", (deckFile) => {
    const deckPath = resolve("src/decks", deckFile);
    const blocks = srOnlyBlocks(deckPath);
    expect(blocks.length, `${deckFile} has no .sr-only blocks`).toBeGreaterThan(0);
    blocks.forEach((block, i) => {
      expect(
        isFallbackOnly(block),
        `${deckFile} slide ${i + 1}'s accessible text is only "${block}" — the importer's fallback for a page with no extractable text, not a real transcription`,
      ).toBe(false);
    });
  });

  it.each(deckFiles)("%s: final credits slide keeps its template attribution accessible", (deckFile) => {
    const deckPath = resolve("src/decks", deckFile);
    const blocks = srOnlyBlocks(deckPath);
    expect(blocks.length, `${deckFile} has no .sr-only blocks`).toBeGreaterThan(0);
    const lastBlock = blocks[blocks.length - 1]!;
    expect(
      attributionPattern.test(lastBlock),
      `${deckFile}'s final slide has no accessible Slidesgo/Flaticon/Freepik attribution text`,
    ).toBe(true);
  });
});
