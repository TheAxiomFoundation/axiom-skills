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

Thin concept-keyed `Case`/`Entity` dataclasses (with `Concepts` as the concept-ID
namespace) are projected by adapters into each engine's input language; normalized
results are compared with per-concept tolerances and a mismatch taxonomy. Any engine
can be compared with any other via the `axiom-oracles` CLI:

```
axiom-oracles compare axiom policyengine \
  --population enhanced-cps --category tax --period 2026 \
  --axiom-program /path/to/rulespec-us/statutes/26/6401.yaml
```

## The oracle bench (choices for `compare <left> <right>`)

| Oracle | Scope | Notes |
|---|---|---|
| `policyengine` | US + UK | primary US oracle; golden/contract cases live in axiom-api |
| `taxsim` (NBER) | US income tax | bundled executable supports tax years **through 2024** — defaults there unless `--period` says otherwise |
| `taxcalc` (Tax-Calculator) | US income tax | third US tax oracle |
| `prd` (Atlanta Fed) | US benefits | PRD SNAP maps to PE `snap` by default |
| `accessnyc` | NYC screening | public Drools rules + Screening API; scoped to census place GEOID 3651000 |
| `euromod` | UK (UKMOD) / Belgium | runs the .NET `EM_Executable.dll` via the `euromod` PyPI connector; x86_64 — Rosetta venv on Apple Silicon. Belgium is the only suite-backed EU state |
| `axiom` | everything | shells to the engine binary (`axiom-rules-engine … run-compiled`; override with `AXIOM_RULES_ENGINE_BINARY`) |

SOUTHMOD country models (ET/GH/UG/ZM/RW…) are the *documented* next step — same
`EuromodPlatformRunner`, bundles via the UNU-WIDER request form (see
`docs/euromod-platform-playbook.md`); suites are landing via open PRs, so check what
has actually merged before claiming coverage.

## Traps that produce silently-wrong conclusions

1. **Population pinning (the big one).** The default US population is the
   content-pinned certified artifact `populace://policyengine/populace-us/populace_us_2024.h5`
   (`POPULACE_PINS`: HF revision + verified sha256; mismatch refuses to run) —
   **never HF-latest**, which is a sparse L0 refit that zeroes ~80 engine input bases
   and scores everything against ~$0. If aggregates look absurdly low, check the pin.
2. **`--population enhanced-cps` is a legacy label** — it resolves to the certified
   populace artifact, not actual eCPS; the only remaining real-eCPS path is the NYC
   per-city file (populace has no place/county geography). An unpinned
   `--ecps-dataset populace://…` reference resolves at HF-latest — trap #1.
3. **Known populace gaps shape coverage**: no immigration/SSN columns (everyone is a
   citizen), degenerate housing tenure. Rule branches gated on those inputs are NOT
   exercised — absence of mismatches there is not validation.
4. **There is no `--tolerance` flag.** Tolerances and priorities are per-concept in
   the mapping config (`ProgramMapping.tolerance/.relative_tolerance/.priority`) and
   surfaced in the report. Default `policyengine`-vs-`taxsim` compares the
   `fiitax`/`siitax` intersection at $15 tolerance; parent concepts compare parent
   output only unless `--include-components`.
5. **Rounding conventions**: the SNAP chain carries cents; FNS rounds to whole
   dollars — ±$1 on QC replays is a known convention gap, not a rule bug.
6. **Self-graded ≠ validated.** A compiled runtime package with no oracle case yet is
   executable, not verified. Say so explicitly in anything user-facing (axiom-writing).
7. **Concept mapping is an intersection** — comparisons cover only concepts both
   engines map after target-scope/locale filtering. 100% over 3 shared concepts is
   weaker than 95% over 40; report the denominator.

## Reading reports

Two distinct axes: **mismatch kinds** (`amount_difference`, `eligibility_left_only`,
`eligibility_right_only`, `missing_left/right/both`, `value_mismatch`) say *what*
diverged; **dispositions** (`explained_residual`, `upstream_engine_gap`,
`bridge_artifact`, `axiom_encoding_gap`, `unexplained`) say *whose fault it is*.
Reports also carry `summary.weighted`, per-concept aggregates, and the tolerances
used — cite those, not raw counts.
