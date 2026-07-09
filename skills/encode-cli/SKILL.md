---
name: encode-cli
description: >-
  ALWAYS LOAD THIS SKILL before running or debugging the axiom-encode pipeline —
  encoding a provision, validating, applying, or investigating a failed run.
  Triggers: "encode a provision", "axiom-encode", "encoding run", "gauntlet",
  "proof-validate", "eval-suite", "apply manifest", "guard-generated",
  "source staleness", "repair.json", "encoding backend", "codex", "run log",
  "readiness gates", "oracle coverage", "encode --apply".
---

# axiom-encode — the factory and its gauntlet

## Mental model

The AI writes the code; it never gets to grade its own work. Generation backend is
Codex/gpt-5.5; judges MUST run on a Claude-family model — Claude tiers are reserved
for orchestration and review, not net-new statutory encoding. `encode --backend
codex|openai|claude` (default `codex`); eval commands take a separate
`--gpt-backend codex|openai`.

## The pipeline

```
encode "26 USC 32(a)(1)"     # resolves citation → corpus.provisions (local JSONL → Supabase fallback)
  └─ generates RuleSpec YAML
validate                      # engine compile
proof-validate                # explicit proof trees; source-claim IDs resolved against
                              # axiom-corpus/claims; missing/placeholder claims REJECTED
<oracle comparison>           # against the pinned axiom-oracles version
eval-suite                    # manifest benchmarks → readiness gates: success rate,
                              # compile rate, CI pass rate, zero-ungrounded rate,
                              # PE pass rate, mean cost. Exit 0 only if ALL pass.
encode --apply                # validates in a temp policy-repo overlay, then writes a
                              # SIGNED JSON apply-manifest (.axiom/encoding-manifests/)
                              # — requires AXIOM_ENCODE_APPLY_SIGNING_KEY
```

## Rules of the road

1. **Never bypass `--apply`.** Hand-written or hand-patched statute YAML without a
   validly signed manifest is rejected by the `guard-generated` check (an
   axiom-encode subcommand that the *consuming policy repo's* CI runs). There is no
   legitimate workflow that edits generated YAML directly.
2. **Ground or defer.** Modules carry `source_verification.corpus_citation_path`
   (local corpus artifacts preferred, Supabase is the network fallback). **Grounding
   to a below-statute source (manual, guidance, form, CMS table, state plan)
   *requires* `upstream_source_check`** — status, checked paths, rationale, with at
   least one statute/regulation path checked first; validation rejects without it.
   If the corpus can't isolate the subsection (known limitation with period-marked
   subsections like "1." / "A."), defer rather than encode from adjacent text.
3. **Money atoms are a gate**: `proof-validate --require-money-atoms` derives a
   proof obligation for every policy-bearing monetary value; missing atoms beyond
   the ratchet fail.
4. **Failed runs leave `*.repair.json`** — read it before re-running; runs are
   event-sourced into the run-log (Supabase telemetry feeds the public ops dashboard).
5. **Oracle pins**: encode pins its axiom-oracles version for coverage; bumping the
   pin is a deliberate act (it changes what "passing" means), not a routine chore.
6. **All readiness gates must pass** (eval-suite exits 0 only then): min cases,
   success rate, compile pass rate, CI pass rate, zero-ungrounded rate, generalist
   review pass rate, PolicyEngine pass rate, mean estimated cost.
7. **PR discipline** (AGENTS.md): every encoder PR goes through the `/cycle`
   review-fix loop before ready and again before merge; never merge on red, stale,
   or pending CI without an explicit maintainer override.

## Env vars that matter

`AXIOM_ENCODE_APPLY_SIGNING_KEY` (required by `--apply`) · `OPENAI_API_KEY`
(codex/openai backends) · `ANTHROPIC_API_KEY` (Claude backend + judges) ·
`CODEX_HOME` / `AXIOM_ENCODE_CODEX_BIN` · `AXIOM_CORPUS_REPO` / `AXIOM_CORPUS_ROOT`
(corpus resolution) · `AXIOM_ENCODE_SUPABASE_URL` / `AXIOM_ENCODE_SUPABASE_SECRET_KEY`
(run-log sync) · `AXIOM_JUDGE_MODEL` · `AXIOM_ENCODE_DISABLE_RUN_LOG`.

## Known limitation queue (as of Jul 2026 — check the issue tracker, these age)

Sibling-module rule-name collisions; amendment acts fail compile (missing
`source_relation.amendment.operation`); source-scope check misclassifies non-US
statute strings; if-expressions rejected in judgment position.
