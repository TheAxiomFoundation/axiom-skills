---
name: corpus-usage
description: >-
  ALWAYS LOAD THIS SKILL before ingesting sources, loading/publishing corpus data,
  or debugging why provisions aren't visible in the app.
  Triggers: "axiom-corpus", "ingest", "corpus", "provisions", "release scopes",
  "load-supabase", "sync-r2", "publish version", "unpublish", "navigation nodes",
  "current_provisions", "source snapshot", "state statute", "manifest",
  "coverage report", "provision not showing".
---

# axiom-corpus — ingestion and publication

## Mental model

```
official source document → manifest/catalog entry → extractor
  → data/corpus/{sources,inventory,provisions,coverage}
  → R2 bucket axiom-corpus (raw + artifacts)  +  Supabase corpus.provisions (serving projection)
```

Supabase is the **serving projection, not the canonical source of truth** — the
durable artifacts are the source snapshots, inventory, provision JSONL, coverage
reports, and release manifests. Never store executable encodings here; never add
durable Akoma Ntoso outputs.

## The release-scopes visibility model (the #1 confusion)

`corpus.current_provisions` (what the app reads) is a view filtered by
`corpus.release_scopes`: rows are visible **only if** a matching
`(jurisdiction, document_class, version)` row exists with `active = true`.

- `load-supabase` auto-registers the release-scope row `active=true` by default —
  "forgot to register" is no longer the silent-hiding failure mode.
- `--stage` loads with `active=false`; promote later with `publish`, reverse with
  `unpublish`; find limbo rows with `list-unpublished`.
- `sync-release-scopes` is upsert-incremental by default; `--exclusive`
  (deactivate-all-then-reinsert) only when the manifest is the *complete* intended
  active set.
- If data "isn't showing up," check release scopes before debugging the extractor.

## Working a state statute (the standard task shape)

One jurisdiction at a time from `manifests/state-statute-agent-queue.yaml`; add or
repair one source-first adapter; a successful task writes **all four scoped
artifacts** (`sources/`, `inventory/`, `provisions/`, `coverage/`); coverage must be
complete before proposing release promotion; run `verify-release-coverage` to check
navigation/provision consistency.

## Hard limits

- **Primary official sources only** — no Justia/FindLaw/LegiScan/summary ingestion.
- **Publication requires explicit user intent**: no R2 publish, Supabase production
  load, main-merge, or production-row deletion on your own initiative.
- Known gap: `as_of` point-in-time works only for eCFR; statute point-in-time is a
  no-op — don't build features assuming it exists.

## Checks before handoff

`uv run --extra dev ruff check .` · mypy on `src/axiom_corpus/corpus` ·
`pytest -q` (focused for the adapter you touched) · `towncrier check` · for
release-ready scopes, the `coverage --write` command from AGENTS.md.
