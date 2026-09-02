import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Every ordinary page must carry exactly one <h1>. astro-theme-university's
// own axe check missed this: `page-has-heading-one` is a best-practice rule,
// not part of the default WCAG2A/AA tag set most axe runs check, so a page
// with zero headings passes accessibility CI silently. A real instance of
// this shipped in the lectures/assessments/people index pages: their MDX
// frontmatter sets `heroTitle` but no `heroImage`, and BaseLayout's Hero
// (the only thing that renders an <h1> for a bare .mdx page under the
// default layout) only renders when both are set — ContentLayout falls back
// to a bare <h1> when there's no hero image, but the implicit MdxPageLayout
// path has no such fallback. Deck pages are excluded: one <h1> per slide is
// correct there, checked instead by astromotion's own structural check.
const distFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return distFiles(full);
    return extname(entry.name) === ".html" ? [full] : [];
  });

const pageFiles = distFiles("dist").filter((f) => !f.startsWith(join("dist", "decks")));

// A hand-written root-absolute href in an .astro file (href="/sessions/")
// skips Astro's base-path rewriting: it works under `pnpm dev` (which serves
// at the site root by default) and 404s once deployed under the GitHub Pages
// `/<repo>/` prefix. The build's own "all internal links respect base" check
// and astro-broken-links-checker both missed a real instance of this in
// src/pages/index.astro — neither walks literal string attributes in .astro
// template markup — so this is a standing static-source check instead.
const ROOT_ABSOLUTE_HREF = /href="\/(?!\/)[^"]*"/g;

const astroFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return astroFiles(full);
    return extname(entry.name) === ".astro" ? [full] : [];
  });

describe("base path links", () => {
  it.each(astroFiles("src"))("%s: has no hand-written root-absolute href", (file) => {
    const source = readFileSync(file, "utf8");
    const matches = [...source.matchAll(ROOT_ABSOLUTE_HREF)].map((m) => m[0]);
    expect(matches, `${relative(".", file)} should use withBase(...) instead of a literal href`).toEqual([]);
  });
});

describe("heading structure", () => {
  it.each(pageFiles)("%s: has exactly one <h1>", (file) => {
    const html = readFileSync(file, "utf8");
    const count = [...html.matchAll(/<h1[ >]/g)].length;
    expect(count, `${relative(".", file)} should render exactly one page heading`).toBe(1);
  });
});
