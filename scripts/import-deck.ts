#!/usr/bin/env node
// Turns an approved PDF deck into an image-backed Astromotion deck, the same
// way the Week 5 deck (src/decks/week-05.deck.mdx) was hand-built: one
// full-bleed `![bg contain]` background image per PDF page, paired with a
// hidden `.sr-only` block carrying that page's real text and links so the
// deck stays useful to screen readers and text export.
//
// PDF rendering uses `mupdf` (pure WASM, no system deps) because this repo
// has no working PDF rasteriser otherwise: no poppler/ImageMagick/Ghostscript
// on the host, and sharp's bundled libvips lists a "pdf" format ID but has no
// actual codec behind it (`sharp.format.pdf` reports every input/output flag
// false, and rendering throws "unsupported image format").
//
// Usage: pnpm import:deck -- --week 6 --pdf local-reference/week6/approved.pdf
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import * as mupdf from "mupdf";
import sharp from "sharp";

const TARGET_WIDTH = 1920;
const ASPECT_16_9 = 16 / 9;
const ASPECT_TOLERANCE = 0.02;
const MIN_VISIBLE_FONT_SIZE = 4; // below this: invisible link-hotspot text duplicates (seen on Week 5's credits page)
const LINK_MATCH_TOLERANCE = 2; // points

interface Args {
  week: number;
  pdf: string;
  force: boolean;
  quality: number;
  allowPlaceholderText: boolean;
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };

  const weekRaw = get("--week");
  const pdf = get("--pdf");
  const force = argv.includes("--force");
  const qualityRaw = get("--quality");
  const allowPlaceholderText = argv.includes("--allow-placeholder-text");

  if (!weekRaw || !/^\d+$/.test(weekRaw)) {
    throw new Error("--week <n> is required and must be a positive integer, e.g. --week 6");
  }
  if (!pdf) {
    throw new Error("--pdf <path> is required, e.g. --pdf local-reference/week6/approved.pdf");
  }

  return {
    week: Number(weekRaw),
    pdf,
    force,
    quality: qualityRaw ? Number(qualityRaw) : 55,
    allowPlaceholderText,
  };
}

interface VisibleSpan {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  size: number;
}

interface PageBlock {
  spans: VisibleSpan[];
  maxSize: number;
  y: number;
}

interface PdfLink {
  uri: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Structured text -> reading-order blocks of visible spans, each block's
 *  own max font size, dropping the sub-4pt invisible link-hotspot duplicates
 *  that sit on top of Week 5's real credits text. */
function extractBlocks(page: mupdf.Page): PageBlock[] {
  const stext = page.toStructuredText("preserve-spans");
  const parsed = JSON.parse(stext.asJSON()) as {
    blocks: Array<{
      type: string;
      bbox: { y: number };
      lines?: Array<{
        bbox: { x: number; y: number; w: number; h: number };
        font: { size: number };
        text: string;
      }>;
    }>;
  };

  const blocks: PageBlock[] = [];
  for (const block of parsed.blocks) {
    if (block.type !== "text" || !block.lines) continue;
    const spans: VisibleSpan[] = block.lines
      .filter((line) => line.font.size >= MIN_VISIBLE_FONT_SIZE)
      .map((line) => ({
        text: line.text,
        x: line.bbox.x,
        y: line.bbox.y,
        w: line.bbox.w,
        h: line.bbox.h,
        size: line.font.size,
      }))
      // mupdf's "lines" for a style-mixed paragraph are per-run, not
      // strictly in reading order (Week 5's credits page emits the
      // invisible link-hotspot runs before the visible paragraph runs
      // that start it) — sort by position so concatenation reads right.
      .sort((a, b) => (Math.abs(a.y - b.y) > 2 ? a.y - b.y : a.x - b.x));
    if (spans.length === 0) continue;
    blocks.push({ spans, maxSize: Math.max(...spans.map((s) => s.size)), y: block.bbox.y });
  }
  return blocks.sort((a, b) => a.y - b.y);
}

function extractLinks(page: mupdf.Page): PdfLink[] {
  return page.getLinks().map((link) => {
    const [x0, y0, x1, y1] = link.getBounds();
    return { uri: link.getURI(), x0, y0, x1, y1 };
  });
}

function findLinkFor(span: VisibleSpan, links: PdfLink[]): PdfLink | undefined {
  const cx = span.x + span.w / 2;
  const cy = span.y + span.h / 2;
  return links.find(
    (link) =>
      cx >= link.x0 - LINK_MATCH_TOLERANCE &&
      cx <= link.x1 + LINK_MATCH_TOLERANCE &&
      cy >= link.y0 - LINK_MATCH_TOLERANCE &&
      cy <= link.y1 + LINK_MATCH_TOLERANCE,
  );
}

const MDX_ESCAPES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "{": "&#123;",
  "}": "&#125;",
};

function escapeMdx(text: string): string {
  return text.replace(/[<>{}]/g, (ch) => MDX_ESCAPES[ch] ?? ch);
}

/** One block's spans -> a single line of text, substituting matched PDF
 *  links for `[label](url)` markdown so real attribution links survive.
 *  Spans that start a new line within the block (e.g. a wrapped bullet, or
 *  a compound two-line title in one text frame) get a space inserted ahead
 *  of them even when the PDF's own span text carries no trailing/leading
 *  whitespace, otherwise adjacent lines glue together word-to-word. */
function renderBlockText(block: PageBlock, links: PdfLink[], usedUris: Set<string>): string {
  let out = "";
  let prevY: number | undefined;
  let prevRight: number | undefined;
  for (const span of block.spans) {
    const newLine = prevY !== undefined && Math.abs(span.y - prevY) > 2;
    // Side-by-side spans on the same line (e.g. adjacent table/column cells)
    // sometimes carry no gap of their own in the PDF's text ("KEEP" then
    // "HOLD LIGHTLY" flush against it) — a real horizontal gap between them
    // means they're visually separate labels, so still insert a space.
    const sameLineGap = !newLine && prevRight !== undefined && span.x - prevRight > 3;
    if (newLine || sameLineGap) out += " ";
    prevY = span.y;
    prevRight = span.x + span.w;

    const link = findLinkFor(span, links);
    if (link) {
      const leading = span.text.match(/^\s*/)?.[0] ?? "";
      const trailing = span.text.match(/\s*$/)?.[0] ?? "";
      const label = escapeMdx(span.text.trim());
      out += `${leading}[${label}](${link.uri})${trailing}`;
      usedUris.add(link.uri);
    } else {
      out += escapeMdx(span.text);
    }
  }
  return out.replace(/\s+/g, " ").trim();
}

interface PageContentItem {
  text: string;
  isHeading: boolean;
}

interface PageAccessibleContent {
  items: PageContentItem[];
  linksPreserved: number;
  /** True when the page's structured-text extraction returned zero blocks
   *  (a flattened/rasterized PDF page with no live text layer), so `items`
   *  is only the `Slide N` placeholder, not a real transcription. */
  usedFallback: boolean;
}

/** Reduce a page's text blocks to an ordered list of heading/paragraph
 *  items. Exactly one item (the block carrying the page's largest font) is
 *  marked as the heading, but it is left in its natural page position
 *  rather than hoisted to the front — a title that spans two text frames
 *  (a small lead-in line feeding a larger second line) would otherwise have
 *  its lead-in stranded after the heading, reading out of order. */
function extractAccessibleContent(page: mupdf.Page, pageNumber: number): PageAccessibleContent {
  const blocks = extractBlocks(page);
  const links = extractLinks(page);
  const usedUris = new Set<string>();

  if (blocks.length === 0) {
    return { items: [{ text: `Slide ${pageNumber}`, isHeading: true }], linksPreserved: 0, usedFallback: true };
  }

  const headingBlock = blocks.reduce((max, b) => (b.maxSize > max.maxSize ? b : max), blocks[0]!);
  const items = blocks
    .map((block) => ({ text: renderBlockText(block, links, usedUris), isHeading: block === headingBlock }))
    .filter((item) => item.text.length > 0);

  if (!items.some((item) => item.isHeading)) {
    items.unshift({ text: `Slide ${pageNumber}`, isHeading: true });
  }

  return { items, linksPreserved: usedUris.size, usedFallback: false };
}

function loadLectureFrontmatter(week: number): { title?: string } {
  const path = resolve(`src/content/lectures/week-${String(week).padStart(2, "0")}.md`);
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8");
  const title = raw.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
  return { title };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const weekPadded = String(args.week).padStart(2, "0");
  const pdfPath = resolve(args.pdf);
  const assetsDir = resolve(`src/decks/assets/week-${weekPadded}`);
  const deckPath = resolve(`src/decks/week-${weekPadded}.deck.mdx`);

  if (!existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`);
  }

  const existingAssets = existsSync(assetsDir) ? readdirSync(assetsDir) : [];
  const deckExists = existsSync(deckPath);
  if ((existingAssets.length > 0 || deckExists) && !args.force) {
    const found = [
      ...(deckExists ? [deckPath] : []),
      ...(existingAssets.length > 0 ? [`${assetsDir} (${existingAssets.length} files)`] : []),
    ];
    throw new Error(
      `Week ${args.week} already has output:\n  ${found.join("\n  ")}\nPass --force to replace it deliberately.`,
    );
  }
  if (args.force && existsSync(assetsDir)) {
    rmSync(assetsDir, { recursive: true, force: true });
  }
  mkdirSync(assetsDir, { recursive: true });

  const buffer = readFileSync(pdfPath);
  const doc = mupdf.Document.openDocument(buffer, "application/pdf");
  const pageCount = doc.countPages();
  if (pageCount < 1) {
    throw new Error(`${pdfPath} has no pages`);
  }
  console.log(`${basename(pdfPath)}: ${pageCount} pages`);

  const warnings: string[] = [];
  const slides: PageAccessibleContent[] = [];
  let totalLinksPreserved = 0;

  for (let i = 0; i < pageCount; i += 1) {
    const pageNumber = i + 1;
    const slideName = `slide-${String(pageNumber).padStart(2, "0")}`;
    const page = doc.loadPage(i);
    const [x0, y0, x1, y1] = page.getBounds();
    const widthPts = x1 - x0;
    const heightPts = y1 - y0;
    const aspect = widthPts / heightPts;
    if (Math.abs(aspect - ASPECT_16_9) > ASPECT_TOLERANCE) {
      warnings.push(
        `page ${pageNumber}: aspect ratio ${aspect.toFixed(4)} is not 16:9 (${ASPECT_16_9.toFixed(4)}) — ` +
          `will still render via 'bg contain', letterboxed rather than cropped`,
      );
    }

    const zoom = TARGET_WIDTH / widthPts;
    const pixmap = page.toPixmap(mupdf.Matrix.scale(zoom, zoom), mupdf.ColorSpace.DeviceRGB, false);
    const png = pixmap.asPNG();
    const avifPath = resolve(assetsDir, `${slideName}.avif`);
    await sharp(Buffer.from(png)).avif({ quality: args.quality }).toFile(avifPath);

    const meta = await sharp(avifPath).metadata();
    if (!meta.width || !meta.height) {
      throw new Error(`${avifPath} was written but has no readable dimensions`);
    }

    const accessible = extractAccessibleContent(page, pageNumber);
    slides.push(accessible);
    totalLinksPreserved += accessible.linksPreserved;
  }

  const fallbackPages = slides
    .map((slide, i) => (slide.usedFallback ? i + 1 : undefined))
    .filter((n): n is number => n !== undefined);
  if (fallbackPages.length > 0) {
    const message =
      `${basename(pdfPath)}: page(s) ${fallbackPages.join(", ")} have no extractable text layer ` +
      `(this PDF is likely flattened/rasterized) — the accessible content for ${fallbackPages.length === 1 ? "that slide" : "those slides"} ` +
      `will be a bare "Slide N" placeholder with no real transcription. This must be hand-repaired in the ` +
      `generated deck before it ships (see spec/deck-accessibility.test.ts).`;
    if (!args.allowPlaceholderText) {
      throw new Error(
        `${message}\nRe-run with --allow-placeholder-text to generate the deck anyway and repair it by hand.`,
      );
    }
    warnings.push(message);
  }

  const { title: lectureTitle } = loadLectureFrontmatter(args.week);
  const firstHeading = slides[0]?.items.find((item) => item.isHeading)?.text;
  const title = lectureTitle ?? firstHeading ?? `Week ${args.week}`;
  const description = `Week ${args.week} deck imported from ${basename(pdfPath)}`;

  const slideBlocks = slides.map((slide, i) => {
    const pageNumber = i + 1;
    const slideName = `slide-${String(pageNumber).padStart(2, "0")}`;
    const body = slide.items.map((item) => (item.isHeading ? `# ${item.text}` : item.text)).join("\n\n");
    return `![bg contain](./assets/week-${weekPadded}/${slideName}.avif)\n\n<div class="sr-only">\n\n${body}\n\n</div>`;
  });

  const mdx = `---
title: ${title}
description: ${description}
---

\`\`\`comment
Imported from ${basename(pdfPath)} via \`pnpm import:deck\`. Every slide is a
full-bleed rendering of the corresponding approved PDF page, sized \`contain\`
against its native aspect ratio so nothing crops or stretches. The
\`.sr-only\` block on each slide is not a caption --- the background image
carries no text to a screen reader or the page's text export, so it is the
only accessible record of that slide's content, extracted from the PDF's own
text and link annotations.
\`\`\`

${slideBlocks.join("\n\n---\n\n")}
`;
  writeFileSync(deckPath, mdx);

  // Post-generation validation: the deck file and the assets on disk must
  // actually agree with what we just claimed to build.
  const writtenMdx = readFileSync(deckPath, "utf8");
  const imageRefs = [...writtenMdx.matchAll(/!\[bg contain\]\(\.\/assets\/week-\d+\/(slide-\d+\.avif)\)/g)].map(
    (m) => m[1]!,
  );
  if (imageRefs.length !== pageCount) {
    throw new Error(`generated deck has ${imageRefs.length} slide images but the PDF has ${pageCount} pages`);
  }
  for (const ref of imageRefs) {
    const assetPath = resolve(assetsDir, ref);
    if (!existsSync(assetPath)) {
      throw new Error(`deck references ${ref} but ${assetPath} does not exist`);
    }
  }

  console.log(`\nWrote ${deckPath}`);
  console.log(`Wrote ${pageCount} slide images to ${assetsDir}`);
  console.log(`Preserved ${totalLinksPreserved} PDF link(s) as markdown links`);
  if (warnings.length > 0) {
    console.log(`\nWarnings:`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
}

main().catch((err) => {
  console.error(`\nimport-deck failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
