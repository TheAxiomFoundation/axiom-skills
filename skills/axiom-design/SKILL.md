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
3. **API keys never reach the browser.** Use the same-origin proxy pattern
   (rulespec-graph-viewer: Vite dev proxy locally, a Vercel function
   `api/axiom/[...path].ts` in prod injecting the key server-side).

## Stack defaults

- Prefer dependency-light. Static (demo-shell) or Vite+React for interactive; the
  main site is Next.js — don't add Next to a demo unless it needs SSR.
- Heavy compute goes to Modal (the finbot pattern: Rust engine at a Modal URL,
  frontend on Vercel reads `AXIOM_ENGINE_URL`); client-side compute uses the WASM
  build (the playground/reg-demo pattern: "no data leaves the page" — say so in the UI).
- Deploy: Vercel, project name = repo name, register the URL in demo-shell.

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
