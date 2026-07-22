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

The AI writes the code; it never gets to grade its own work. Generation runs on
a GPT-family backend through the Codex CLI by default, with escalation flags for
a stronger model on validator-rejected retries; judges MUST run on a
Claude-family model — Claude tiers are reserved for orchestration, gating, and
review, not net-new statutory encoding. `encode --backend codex|openai|claude`
(default `codex`); eval commands take a separate `--gpt-backend codex|openai`.
Current default/escalation model IDs live in the axiom-encode README — don't
trust a skill (or your memory) for them.

## The toolchain contract (read this before your first run)

Corpus-backed commands resolve citations **only** through the signed, immutable
corpus release pinned by the target RuleSpec checkout's `.axiom/toolchain.toml`
(strict schema: `axiom_corpus_release`, `axiom_corpus_release_content_sha256`,
`validation_waiver_set_sha256`) — no ambient checkout discovery, no remote
fallback, no mutable `current`. A checkout still declaring the legacy
commit-ref schema (a repo mid-migration) **fails toolchain validation by
design**; that repo's legacy `axiom_encode_version` field names the encoder
that matches it. Never edit `.axiom/toolchain.toml` in a feature PR — pins move
only in dedicated gated PRs.

## The pipeline

```
encode "26 USC 32(a)(1)"     # resolves citation → exactly one active provision in the
  └─ generates RuleSpec YAML #   pinned signed corpus release; stops before any model
                              #   call if the release or an unambiguous row is missing
validate                      # engine compile
proof-validate                # explicit proof trees; atoms must cite immutable
                              # release-bound corpus text or a hashed RuleSpec import
<oracle comparison>           # against the pinned axiom-oracles version
eval-suite                    # manifest benchmarks → readiness gates: success rate,
                              # compile rate, CI pass rate, zero-ungrounded rate,
                              # PE pass rate, mean cost. Exit 0 only if ALL pass.
encode --apply                # validates in a temp policy-repo overlay, then writes an
                              # Ed25519 domain-signed apply-manifest ("ed25519-domain-v1")
                              # under .axiom/encoding-manifests/, via the protected
                              # signing broker (three-root config)
```

## Rules of the road

1. **Never bypass `--apply`.** Hand-written or hand-patched statute YAML without a
   validly signed manifest is rejected by the `guard-generated` check (an
   axiom-encode subcommand that the *consuming policy repo's* CI runs). There is no
   legitimate workflow that edits generated YAML directly.
2. **Ground or defer.** Modules carry `source_verification.corpus_citation_path`,
   resolved against the pinned signed corpus release. **Grounding
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

`OPENAI_API_KEY` (codex/openai backends; the Codex CLI's `~/.codex/auth.json`
also satisfies the check) · `ANTHROPIC_API_KEY` (Claude backend + judges) ·
`CODEX_HOME` / `AXIOM_ENCODE_CODEX_BIN` · `AXIOM_ENCODE_SUPABASE_URL` /
`AXIOM_ENCODE_SUPABASE_SECRET_KEY` (run-log sync) · `AXIOM_JUDGE_MODEL` ·
`AXIOM_ENCODE_DISABLE_RUN_LOG`. Corpus resolution takes an explicit
`--corpus-path` to a canonical local checkout — the old `AXIOM_CORPUS_REPO`/
`AXIOM_CORPUS_ROOT` env vars are gone, and `AXIOM_ENCODE_APPLY_SIGNING_KEY` is
the legacy signing path superseded by the protected signing broker.

## Known limitation queue (as of Jul 2026 — check the issue tracker, these age)

Sibling-module rule-name collisions; amendment acts fail compile (missing
`source_relation.amendment.operation`); source-scope check misclassifies non-US
statute strings; if-expressions rejected in judgment position.
