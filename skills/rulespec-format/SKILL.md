---
name: rulespec-format
description: >-
  ALWAYS LOAD THIS SKILL before reading, writing, reviewing, or debugging any RuleSpec
  YAML in a rulespec-* repo. Covers the rulespec/v1 module format, durable legal IDs,
  companion tests, source verification, imports, program compose specs, and the
  governance machinery (signed manifests, ratcheted debt files).
  Triggers: "rulespec", "encode", "rule module", "module kind", "composition",
  "durable legal ID", "companion test", ".test.yaml", "source_verification",
  "corpus_citation_path", "imports", "program spec", "acknowledged_incomplete",
  "encoding manifest", "known-validation-gaps", "money atom", "provision",
  "statute YAML", "regulation YAML", any file under rulespec-us/, rulespec-uk/, rulespec-ca/.
---

# RuleSpec format (rulespec/v1)

## The one rule that governs everything

**Never hand-edit statute/regulation/policy YAML in a rulespec repo.** Live RuleSpec is
installed only via `encode --apply`, which writes an HMAC-signed apply-manifest under
`.axiom/encoding-manifests/`. CI (`guard-generated`) rejects modules that drift from
their manifest. If a rule is wrong, fix it through the encoder (see the encode-cli
skill), not with an editor.

## Layout: the file path IS the durable legal ID

- One YAML per legal provision, companion test beside it:
  `us/statutes/7/2015/e.yaml` + `us/statutes/7/2015/e.test.yaml`
  → durable ID `us:statutes/7/2015/e`.
- Outputs are addressed as `<durable-id>#<output>`:
  `us:statutes/7/2017/a#snap_regular_month_allotment`.
- Jurisdiction dirs: `us/` (federal), `us-co/`, `us-ca/`, … under rulespec-us;
  country repos mirror the shape (`statutes/`, `regulations/`, `policies/`).
- Program compose specs live in `programs/` — one YAML per
  (jurisdiction, program, period). They are explicitly *not law*: they declare
  `program`, `period`, `outputs`, `scope`, `transformations`, and
  `acknowledged_incomplete`, and are assembled by axiom-compose.

## Module anatomy

```yaml
format: rulespec/v1
module:
  kind: composition            # or rule kinds; composition modules import atoms
  summary: <one-line, faithful to the provision>
  source_verification:
    corpus_citation_path: <path into axiom-corpus provisions>
    # optional: source_sha256 pin — enables staleness checks
imports:
  - us:statutes/7/2014/...     # durable IDs only; cross-jurisdiction allowed (us:, us-co:)
```

- Every monetary value needs a proof atom citing a provision — additions without one
  land in `known-missing-money-atoms.yaml` (see ratchets below).
- Judgment vs scalar outputs are typed; temporal values use periods/intervals.
  The parser currently rejects if-expressions in judgment position (known limitation).

## Governance machinery you must not fight

- `.axiom/toolchain.toml` pins the validation toolchain by commit SHA — don't bump casually.
- `.axiom/index/provisions_to_rules.json` is a generated reverse index; CI fails if
  stale. Regenerate rather than editing. Bulk PRs contend on this file — rebase, don't merge-fix.
- **Three ratcheted debt files** fail CI both on *new* entries and on *silently fixed*
  entries (they may only shrink, explicitly): `known-dangling.yaml`,
  `known-validation-gaps.yaml`, `known-missing-money-atoms.yaml`. If your change fixes
  a listed gap, remove the entry in the same PR.

## Review checklist

1. Path/durable-ID matches the actual citation; companion test exists.
2. `source_verification.corpus_citation_path` resolves; summary is neutral and faithful.
3. Imports are durable IDs (never relative paths); no orphaned eligibility outputs
   (compose auto-AND-gates and will refuse).
4. Signed manifest present for generated content (`guard-generated` will check anyway).
5. Ratchet files updated in the same PR when applicable.
