---
name: oracles-usage
description: >-
  ALWAYS LOAD THIS SKILL before running parity/validation comparisons or interpreting
  oracle results. Covers axiom-oracles adapters, the compare CLI, and the traps.
  Triggers: "parity", "oracle", "compare against PolicyEngine", "TAXSIM", "UKMOD",
  "EUROMOD", "SOUTHMOD", "ACCESS NYC", "mismatch", "golden cases", "contract cases",
  "populace", "Enhanced CPS", "validation dashboard", "triangulation", "conformance".
---

# axiom-oracles — cross-engine validation

## Mental model

Thin concept-keyed `Case`/`Entity`/`Concepts` objects are projected by adapters into
each engine's input language; normalized `EngineResult`s are compared with per-concept
tolerances and a mismatch taxonomy. Any engine can be compared with any other:
`compare axiom policyengine`, `compare policyengine taxsim`, `compare accessnyc policyengine`.

## The oracle bench

| Oracle | Scope | Notes |
|---|---|---|
| PolicyEngine | US + UK | primary US oracle; golden/contract cases live in axiom-api |
| NBER TAXSIM | US income tax | third oracle for triangulation (CO suite live) |
| Atlanta Fed PRD | US benefits | |
| ACCESS NYC | NYC screening | public Drools rules + Screening API; scoped to GEOID 3651000 |
| UKMOD / EUROMOD | UK / BE-EU | runs .NET EM_Executable via `euromod` connector; Rosetta on Apple Silicon |
| SOUTHMOD models | ET/ZM/UG/GH/RW | in-progress country suites + `*-dispy` capstones |
| Axiom itself | everything | adapter shells to the `axiom-rules` binary |

## Traps that produce silently-wrong conclusions

1. **Population pinning (the big one).** The default US population is the
   content-pinned certified `populace-us` artifact (`populace://…@revision`, verified
   sha256) — **never HF-latest**, which is a sparse L0 refit that zeroes ~80 engine
   input bases and scores everything against ~$0. If aggregate results look absurdly
   low, check the population pin first.
2. **Known populace gaps shape coverage**: no immigration/SSN columns (everyone is a
   citizen), degenerate housing tenure. Rule branches gated on those inputs are NOT
   exercised — absence of mismatches there is not validation.
3. **Rounding conventions**: the SNAP chain carries cents; FNS rounds to whole
   dollars — a ±$1 mismatch on QC replays is a known convention gap, not a rule bug.
4. **Self-graded ≠ validated.** A compiled runtime package with "no oracle case yet"
   (e.g. the Jul-2026 TANF/SCRETD/OASDI additions) is executable, not verified. Say so
   explicitly in anything user-facing (see axiom-writing).
5. **Concept mapping is an intersection** — comparisons only cover concepts both
   engines map after scope/locale filtering. A "100% pass" over 3 shared concepts is
   weaker than 95% over 40; report the denominator.
