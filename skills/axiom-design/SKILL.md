---
name: axiom-design
description: >-
  ALWAYS LOAD THIS SKILL before building or modifying any Axiom demo, dashboard,
  web app, or frontend surface — new demos especially.
  Triggers: "new demo", "demo app", "dashboard", "landing page", "frontend",
  "web app", "Vercel", "deploy the demo", "UI", "widget", "embed", "calculator",
  "graph viewer", "add analytics", "mobile".
---

# Axiom demo & frontend conventions

## Before you scaffold anything

1. **Check the constellation first.** axiom-demo-shell's README is the canonical URL
   registry and the three-layer story (01 Infrastructure / 02 Validation /
   03 Application). A new demo must (a) fit one layer, (b) get its card + canonical
   URL registered there, (c) not duplicate an existing demo — extend instead.
2. **Registry-driven, never hardcoded.** Program/package lists come from
   `/v1/runtime/packages` (the graph-viewer retired its hardcoded allowlist; don't
   reintroduce the pattern). New runtime packages should appear in your demo without
   a code change.
3. **API keys never reach the browser.** Use the same-origin proxy pattern from
   rulespec-graph-viewer: Vite dev proxy locally; in prod a single Vercel function
   `api/axiom.ts` behind a `vercel.json` rewrite (`/api/axiom/:path*` → `/api/axiom`)
   injecting the key from `AXIOM_API_KEY` server-side. Client reads
   `VITE_AXIOM_API_BASE ?? "/api/axiom"`.

## Brand assets — never rebuild the logo by hand

The **∀XIOM** wordmark (flipped-A universal quantifier + XIOM, Geist, outlined to
paths) lives in **TheAxiomFoundation/axiom-brand** — SVG masters in six colors ×
three weights plus channel-ready PNGs (Zoom, LinkedIn, OG, avatars, favicons).
Browse/download: https://axiom-brand-sigma.vercel.app. Rules: use the kit files —
never retype the wordmark in a live font; **outward-facing surfaces default to the
FULL lockup (FOUNDATION under AXIOM) until brand recognition is established** —
compact ∀XIOM only where space forbids; amber gradient (`#b45309→#8a3d08`) on
paper, paper wordmark on ink/amber; the ∀ tile is the only square-format mark;
clear space ≥ half the ∀'s width. In app code use the `AxiomLogo` component from
`@axiom-foundation/ui` (currentColor-based), not copied SVG. Caution: the bare
`axiom-brand.vercel.app` domain belongs to an unrelated company — always use the
URLs above.

## Design tokens (from `packages/ui/src/tokens` — contrast-tested in CI)

| Role | Token | Value |
|---|---|---|
| Surface / elevated | paper / paperElevated | `#faf9f6` / `#ffffff` |
| Text / secondary / muted | ink / inkSecondary / inkMuted | `#1c1917` / `#57534e` / `#78716c` |
| Accent (links, primary, focus ring) | accent | `#92400e` (hover `#7c2d12`) |
| Border decorative / interactive | rule / ruleStrong | `#e7e5e4` / `#78716c` |
| Status success / warning / error | — | `#166534` / `#92400e` / `#991b1b` |
| Code surface | codeBg / codeText | `#1c1917` / `#e7e5e4` |

Fonts: **GeistSans** (default body sans), **Newsreader** (editorial serif, display),
**JetBrains Mono** (code/data). Interactive borders use `ruleStrong` (3:1 non-text
contrast); `rule` is decorative-only. Don't invent colors — these pairs are
contrast-asserted in `__tests__/contrast.test.ts` and drift fails CI.

## Stack defaults

- Prefer dependency-light. Static (demo-shell) or Vite+React for interactive; the
  main site is Next.js — don't add Next to a demo unless it needs SSR.
- Heavy compute goes to Modal (the finbot pattern: Rust engine at a Modal URL,
  frontend on Vercel reads `AXIOM_ENGINE_URL`); client-side compute uses the WASM
  build (the playground/reg-demo pattern: "no data leaves the page" — say so in the UI).
- Deploy: Vercel, project name = repo name, register the URL in demo-shell.
- **After every push, verify the deploy actually succeeded** (`vercel ls | head -5`);
  if status is Error, reproduce with a local build before touching config. Deploy
  fragility is a known launch risk — don't assume green.

## Every demo ships with

- **GA4 analytics wired to the Axiom CRM property `G-2YHG89FY0N`** (the convention
  every existing demo follows).
- **Mobile-friendly layout** — partners open launch links on phones; this is a
  repeated retrofit cost, do it upfront.
- **Tier label** (GA / Preview / Demo / Coming) consistent with the coverage page —
  see axiom-writing for the vocabulary rules.
- **Citations that link out** — any number derived from law links its durable ID /
  source via the foundation.org document API (the finbot pattern).

## Voice in UI copy

Follows axiom-writing: validation claims dated and scoped, "not encoded" over
guessing, no hype. Empty states explain what's *not* covered rather than hiding it.
