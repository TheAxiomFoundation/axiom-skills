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
`.axiom/encoding-manifests/` (note: per-jurisdiction — federal manifests live under
`us/.axiom/`, state ones under the repo-root `.axiom/`). CI enforcement runs through the
org reusable workflow `TheAxiomFoundation/.github/validate-rulespec.yml`, which rejects
modules that drift from their manifest. If a rule is wrong, fix it through the encoder
(see encode-cli), not with an editor.

## Layout: the file path IS the durable legal ID

- One YAML per legal provision, companion test beside it:
  `us/statutes/7/2015/e.yaml` + `us/statutes/7/2015/e.test.yaml`
  → durable ID `us:statutes/7/2015/e`. Outputs are rule names:
  `us:statutes/7/2017/a#snap_regular_month_allotment`.
- Jurisdiction dirs match `^[a-z]{2}(-[a-z0-9-]+)*$` and may contain only
  `statutes/`, `regulations/`, `policies/`, `legislation/`. The only YAML allowed at
  repo root: the three ratchet files (below). Layout is enforced by
  `tests/test_repository_layout.py`.
- **Banned generic rule names** (layout tests reject them): `amount`, `base`,
  `excess`, `rate`, `threshold`, `value`.

## Module anatomy — the real spine

An **atomic** module: `module:` holds `proof_validation.required: true`,
`source_verification`, `summary` (and often `deferred_outputs:`). The content is a
top-level `rules:` list — each rule is a named output:

```yaml
format: rulespec/v1
module:
  proof_validation: { required: true }
  source_verification:
    corpus_citation_path: us/statute/7/2015   # axiom-corpus path — singular "statute"
  summary: |-
    (e) Students ...
rules:
  - name: student_minimum_employment_hours_per_week
    kind: parameter                    # parameter | derived | data_relation | source_relation
    dtype: Count                       # Count | Judgment | Money | Decimal
    source: 7 U.S.C. 2015(e)(4)        # human citation string
    metadata:
      proof:
        atoms:                         # every value needs a proof atom citing a provision
          - path: versions[0].formula
            kind: amount               # atom kinds: amount, condition, exception, import, formula…
            source: { corpus_citation_path: us/statute/7/2015 }
    versions:
      - effective_from: '2008-10-01'
        formula: |-
          20
  - name: student_work_exception_applies
    kind: derived
    entity: Person                     # Person | Household
    dtype: Judgment
    period: Month
    versions:
      - effective_from: '2008-10-01'
        formula: |-
          employed_hours_per_week >= student_minimum_employment_hours_per_week
```

A **composition** module is the only place `module.kind: composition` and top-level
`imports:` appear — imports are durable IDs, cross-jurisdiction allowed
(`us:policies/usda/snap/fy-2026-cola/maximum-allotments`, `us-ca:regulations/mpp/63-503/324`).

`source_verification` variants: singular `corpus_citation_path`, plural
`corpus_citation_paths:` (list), and `upstream_source_check:` for lower-authority
sources. Monetary values without a proof atom land in `known-missing-money-atoms.yaml`.

## Companion tests — the real contract

`.test.yaml` is a top-level **list** of cases `{name, period, input, output}`:

```yaml
- name: half_time_student_with_no_exception_is_ineligible
  period: 2026-01                      # YYYY-MM
  input:
    us:statutes/7/2015/e#input.person_age_years: 25
    us:statutes/7/2015/e#input.employed_hours_per_week: 0
  output:
    us:statutes/7/2015/e#student_work_exception_applies: not_holds   # Judgments: holds / not_holds
```

Inputs are keyed `<durable-id>#input.<var>`; outputs `<durable-id>#<rule-name>`;
Judgment assertions are `holds`/`not_holds`, never true/false. Companion-test pairing
is CI-enforced.

## Program compose specs (`programs/`, explicitly *not law*)

One YAML per (jurisdiction, program, period): `program`, `period`, `outputs`,
optional `auto_gate_outputs` (compose AND-gates them against in-scope eligibility
rules), `scope` (**`federal:` entries resolve under `us:`, `state:` entries under the
program's own jurisdiction**), `transformations` (declarative patterns like
`conditional_value` that axiom-compose resolves — never program-specific code), and
`acknowledged_incomplete`. Every scope path must resolve to a real module **or** be
listed in `known-dangling.yaml`; a listed path that starts resolving also fails CI —
remove it in the same PR.

## Governance machinery you must not fight

- `.axiom/toolchain.toml` pins the validation toolchain by commit SHA.
- `.axiom/index/provisions_to_rules.json` is generated (provision → dependent
  modules); CI fails if stale — regenerate, don't edit. Bulk PRs contend on it:
  rebase, don't merge-fix.
- **Three ratcheted debt files at repo root** — CI fails on *new* entries and on
  *silently fixed* entries (they may only shrink): `known-dangling.yaml`,
  `known-validation-gaps.yaml`, `known-missing-money-atoms.yaml`.

## Review checklist

1. Path/durable-ID matches the citation; companion test exists with real cases.
2. `source_verification` resolves to a real corpus path; `summary` neutral and faithful.
3. Every rule has `kind`/`dtype` (+ `entity`/`period` for derived), a `source`
   citation, proof atoms, and `versions[]` with `effective_from`.
4. Composition imports are durable IDs; no orphaned eligibility outputs.
5. Signed manifest present for generated content; ratchet files updated in the same PR.
