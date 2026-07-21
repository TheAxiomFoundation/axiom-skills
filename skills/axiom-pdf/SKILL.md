---
name: axiom-pdf
description: >-
  ALWAYS LOAD THIS SKILL before producing any Axiom-branded PDF or print
  document — proposals, funder one-pagers, partner briefs, letters, leave-behinds,
  memos meant to be printed or sent as PDF. Covers the HTML→PDF pipeline, the
  brand-font embedding, the kit wordmark, and the print type/layout rules.
  Triggers: "PDF", "one-pager", "one pager", "proposal", "funder brief",
  "partner brief", "leave-behind", "print", "export to PDF", "formatted PDF",
  "letter", "brief", "make this a PDF", "branded document".
---

# Axiom branded PDF & print documents

Produces on-brand PDFs (proposals, briefs, one-pagers) by rendering a self-contained
HTML file with headless Chrome. Same tokens as [axiom-design](../axiom-design/SKILL.md)
— this skill is the **print** counterpart: fixed page size, embedded fonts, no JS.

## Pipeline

1. Copy `assets/` (`template.html`, `fonts-embed.css`, `axiom-full-w350-gradient.svg`,
   `render.sh`) next to where the document will live — the three files must sit in
   the **same directory** as the HTML so the `@import` and `<img>`/wordmark resolve.
2. Fill `template.html` with content. Keep the component classes; don't invent new
   colors or fonts.
3. Render: `./render.sh page.html` → writes `page.pdf` and prints the page count.
4. **Verify before shipping** — screenshot the render and read it back (headless
   `--screenshot` with a tall `--window-size`, or open the PDF). Confirm the
   wordmark shows, the fonts are the real Geist/Newsreader (not a fallback), and
   nothing splits awkwardly across a page break.

## Non-negotiables

- **Wordmark = kit file, never a live font.** Use `axiom-full-w350-gradient.svg`
  (the canonical full lockup from `TheAxiomFoundation/axiom-brand`,
  `svg/wordmark/full/`). Outward-facing docs use the **FULL** lockup (FOUNDATION
  under ∀XIOM) until brand recognition is established — compact only where space
  forbids. Refresh from the brand repo if it has moved; don't retype the wordmark.
- **Embed the fonts.** Ship `fonts-embed.css` (base64 Geist, Geist Mono, Newsreader —
  all redistributable) so the PDF bakes in real glyphs with **no fallback**. Never
  rely on system fonts being present at render time. Regenerate with
  `rebuild-fonts.py` only if refreshing.
- **Body text ≥ 11pt.** The reading text — paragraphs, list items, callouts, and
  substantive asides — sits at an 11pt floor for legibility. Labels, table headers,
  and the kicker may be smaller, but never the prose. (A single page is not worth
  sacrificing legibility; let it run to more pages.)
- **Pure white background** (`#ffffff`) for print. No cream/paper tint — that reads
  as off-white on paper and on projectors. Callouts use borders, not fills.
- **Amber links, even when bold.** Links are `--accent`; bold-inside-a-link must
  stay amber via the `a strong { color: var(--accent); }` rule (bare `strong` is
  ink, which silently overrides link color otherwise).
- **Voice** follows [axiom-writing](../axiom-writing/SKILL.md): claims dated and
  scoped, no hype. Any headline stat re-verified against its live source before
  each send, with the snapshot date pinned in the text.

## Print tokens (subset of axiom-design, tuned for paper)

| Role | Value |
|---|---|
| Surface | `#ffffff` |
| Ink / secondary / muted | `#1c1917` / `#57534e` / `#78716c` |
| Accent (labels, links, badges, rules) | `#92400e` |
| Amber wordmark gradient | `#b45309 → #8a3d08` |
| Decorative / strong rule | `#e7e5e4` / `#78716c` |
| Display serif | Newsreader (title, dek, italic notes) |
| Body sans | Geist |
| Data / figures | Geist Mono (tabular, right-aligned amounts) |

## Components in `template.html`

`.masthead` (wordmark + `.kicker` + `.draft-tag`) · `h1`/`.dek` (Newsreader) ·
`h2` (amber uppercase section label) · `ol.steps` (amber numbered badges) ·
`ul.asks` (amber square bullets) · `.subhead` · `.note` (italic serif, amber
left-rule aside) · `.risk` (bordered caveat box) · `.budget-label` + `table`
(`.amt` mono figures, `tr.total` ruled total row) · `.sig` (centered footer).

Page break hygiene is built in: `table, tr, .note, .risk, li { break-inside: avoid }`
and headings avoid breaking away from what follows.

## Domain & naming

Use **axiom.org** (not axiom-foundation.org) for all links and email. Write
**"the Axiom Foundation"** in full — never bare "Axiom" — in body copy.
