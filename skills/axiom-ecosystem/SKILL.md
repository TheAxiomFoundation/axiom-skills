---
name: axiom-ecosystem
description: >-
  ALWAYS LOAD THIS SKILL when working in any Axiom Foundation repo — it defines repo
  boundaries (which repo owns what) and the org workflow rules, including the rule
  that PolicyEngine skills must not drive Axiom work.
  Triggers: working under TheAxiomFoundation, "which repo", "where does this live",
  "axiom-corpus", "axiom-encode", "rulespec", "axiom-rules-engine", "axiom-api",
  "repo boundaries", "PolicyEngine skill", "encode this", "add a source",
  "where do encodings go", "where do tests go".
---

# Axiom ecosystem — boundaries and org rules

## The rule that prevents the most damage

**Do not use PolicyEngine workflow or implementation skills for Axiom encoding,
RuleSpec, corpus, or oracle-parity tasks.** Many Axiom contributors also have the
PolicyEngine plugins installed; those skills encode PE's formats and conventions,
which are *different by design*. In Axiom, PolicyEngine is an **oracle/comparison
dependency, not the workflow owner**. If a reusable Axiom workflow is missing,
propose a skill for axiom-skills instead of borrowing a PE one.

## Who owns what

| Concern | Repo | Never put here |
|---|---|---|
| Source scrapers (official sites → corpus ingest input) | **axiom-scrapers** | normalization/publication (that's corpus) |
| Source text + provenance (statutes, regs, guidance) | **axiom-corpus** | executable encodings |
| Encoder + validation gauntlet | **axiom-encode** | policy content |
| Encoded law (RuleSpec YAML + companion tests) | **rulespec-\*** country repos | source payloads, generated formula artifacts |
| Program composition | **axiom-compose** (library) + `programs/` in rulespec repos | program-specific Python |
| Execution runtime | **axiom-rules-engine** | production policy content (fixtures only) |
| Cross-engine validation | **axiom-oracles** | product UI |
| Microsimulation over population data | **axiom-microsim** | policy content |
| Bill tracking / change signals | **axiom-bills** | encodings |
| Hosted API + runtime-package registry | **axiom-api** | — |
| Agent channel | **axiom-mcp** (npm `@axiom-foundation/mcp`) | — |
| Website + Axiom App | **axiom-foundation.org** | request-time GitHub reads (rule: ops `docs/distribution-and-integration-modes.md`; a legacy ISR-cached GitHub fallback still exists in `src/lib/supabase.ts` — don't extend it) |
| Org skills/agents (this layer) | **axiom-skills** | secrets, dated production stats |

Rule of thumb from axiom-corpus: *"When a provision repeats a value from another
source, represent that in the rules repo with RuleSpec metadata and source
verification. The corpus repo should only make the source text available."*

## Source discipline (applies org-wide)

- **Primary official government sources only.** Never ingest secondary summaries
  (State Options Reports, Justia, FindLaw, LegiScan) unless explicitly directed for
  a non-canonical experiment.
- Publication is a deliberate act: don't publish to R2, load Supabase production,
  or flip release-scope visibility unless explicitly asked.

## Local infrastructure paths

R2 credentials: `~/.config/axiom-foundation/r2-credentials.json` · converter cache:
`~/.axiom/` · encoding scratch: `~/.axiom/workspace`. The repo-boundaries map above
is machine-checked — foundation.org's `repo-map.test.ts` asserts a new repo family
is a three-part change.

## Contributing from outside the org

RuleSpec generation runs on the Foundation's supervised encoding runtime, and
content merged into the jurisdiction repos must carry the signed encoding
manifests that pipeline produces — so externally-run encodes can't merge, and
that's by design (the admission model is chartered in axiom-encode#1192; the
encode README's "Who runs this" section says it plainly). External
contributions land on the platform surfaces instead: scrapers
(axiom-scrapers), corpus sources and ingest (axiom-corpus), issues on the
`rulespec-*` repos for wrong or missing encodings, and anything built on the
published releases.

## Where knowledge lives

Repo-specific facts (build commands, local quirks) → that repo's CLAUDE.md.
Cross-repo conventions → a skill in axiom-skills (PR it — see CONTRIBUTING).
Dated production stats (package counts, parity numbers) → dated docs/dashboards,
never skills.
