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

## The named-release visibility model (the #1 confusion)

`corpus.current_provisions` (what the app reads) follows a per-`(jurisdiction,
document_class)` **active map** (`corpus.active_scope_pointer`). Serving moves
only when a release is **activated** — three deliberate steps, never as a side
effect:

- `load-supabase` **stages immutable version rows only; it never changes
  visibility.** There is no publish-on-load, no scope auto-registration, no
  mutable `current` release, and no per-scope `publish`/`unpublish` commands —
  if you remember that model, it's retired.
- A tracked named selector (`manifests/releases/<name>.json`) is only a cut
  plan. `scripts/publish_corpus.py` content-addresses and reads back the R2
  artifacts, checks exact staged provision *and* navigation counts,
  deep-validates, then creates an Ed25519-signed release object. **Publication
  does not move serving either.**
- Activation (`scripts/activate_release.py`, or `publish_corpus.py
  --activate`) rechecks counts and repoints serving for exactly the
  `(jurisdiction, document_class)` pairs the release carries — it never
  un-serves another jurisdiction; overlaps resolve last-activation-wins per
  pair, and every takeover lands in `corpus.scope_activation_history`. Preview
  with `--dry-run`.
- **`navigation_nodes` follows the same active map** — staged nav rows coexist
  with served ones. `verify-release-coverage` exists precisely to catch
  nav/provision mismatch; run it before activating.
- Missing-parent synthesis does not exist: staging a provision whose parent is
  absent fails as a corpus defect.
- If data "isn't showing up," check the active map and release before debugging
  the extractor. Full model: `docs/named-release-publication.md`.

## Working a state statute (the standard task shape)

One jurisdiction at a time from `manifests/state-statute-agent-queue.yaml`; add or
repair one source-first adapter **and wire it through `extract-state-statutes`
or a dedicated CLI command**; a successful task writes **all four scoped artifacts**
(`sources/`, `inventory/`, `provisions/`, `coverage/`); coverage must be complete
before proposing a release cut.

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
