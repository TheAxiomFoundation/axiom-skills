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
Codex/gpt-5.5 (via Codex CLI auth); Claude is reserved for orchestration, gating, and
review — not YAML generation. `--backend claude|openai` exists but the default split
is deliberate.

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
   validly signed manifest is rejected by `guard-generated` CI. There is no legitimate
   workflow that edits generated YAML directly.
2. **Ground or defer.** Modules carry `source_verification.corpus_citation_path`;
   pin `source_sha256` where freshness matters and run `check-source-staleness`.
   If the corpus can't isolate the subsection (known limitation with period-marked
   subsections like "1." / "A."), defer rather than encode from adjacent text.
3. **Failed runs leave `*.repair.json`** — read it before re-running; runs are
   event-sourced into the run-log (Supabase telemetry feeds the public ops dashboard).
4. **Oracle pins**: encode pins its axiom-oracles version for coverage; bumping the
   pin is a deliberate act (it changes what "passing" means), not a routine chore.
5. **Cost is a gate** — eval-suite tracks mean cost per module; don't disable it.

## Known limitation queue (check before filing new issues)

Sibling-module rule-name collisions; amendment acts fail compile (missing
`source_relation.amendment.operation`); source-scope check misclassifies non-US
statute strings; if-expressions rejected in judgment position.
