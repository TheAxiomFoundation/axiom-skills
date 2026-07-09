---
name: engine-api
description: >-
  ALWAYS LOAD THIS SKILL before compiling or executing RuleSpec, calling the
  axiom-rules-engine from Rust/Python/CLI, or debugging engine output.
  Triggers: "compile rulespec", "run-compiled", "compiled artifact",
  "axiom-rules-engine", "axiom-rules", "explain trace", "dense", "batch execution",
  "CompiledDenseProgram", "PyO3", "WASM", "check-sources", "durable ID",
  "cross-period", "lifetime reduction", "runtime package", "execution request".
---

# Axiom rules engine — usage

## What it is

Rust crate `axiom-rules-engine` (the `axiom-rules` checkout is the same codebase)
compiling RuleSpec (`format: rulespec/v1`) to a JSON `CompiledProgramArtifact` and
executing it. Engine is infra-only — production content lives in rulespec-* repos.

**There are two CLIs — don't conflate them:**
- **Rust binary** (`axiom-rules-engine`): `compile` (`--program`, `--output`,
  repeatable `--corpus-provisions` to join source URLs into the artifact),
  `run-compiled` (`--artifact`, request JSON on **stdin**), `emit-schemas`
  (only under `--features schema`), and a bare mode that runs an
  `ExecutionRequest` from stdin. That's all of them.
- **Python CLI** (`python -m axiom_rules_engine.cli`): this is where
  `check-sources` (`--repo`, `--verify-r2` checks R2 existence + SHA-256) and
  `concepts search|show|validate|list` live.

```sh
axiom-rules-engine compile --program program.yaml --output compiled.json \
  --corpus-provisions provisions/          # optional; joins source links
echo '{"mode":"explain","dataset":{...},"queries":[{"entity_id":"hh-1",
  "period":{"kind":"year","start":"2026-01-01","end":"2026-12-31"},
  "outputs":["benefit"]}]}' | axiom-rules-engine run-compiled --artifact compiled.json
```

## Execution semantics that matter

1. **`mode` is a request field, not a flag**: `"explain"` (full trace of which rules
   fired and why — use it when debugging, don't reverse-engineer outputs) or
   `"fast"` (no trace; silently falls back to explain on unsupported features,
   recording `fallback_reason`).
2. **Outputs resolve by rule name OR durable ID** (`"benefit"` or
   `"us:statutes/7/2017/a#benefit"`). Unknown references are hard typed errors
   (`UnknownDerived`, `InvalidDatasetInputReference`) — never silent.
3. **Rounding is declared per rule in RuleSpec**, not passed at run time:
   `rounding: half_up|half_even|floor|ceil`, valid only on `derived` rules whose
   unit is a Currency with `minor_units`. FNS whole-dollar behavior = unit
   `USD { minor_units: 0 }` + a rounding mode. Default carries cents — expect ±$1
   parity noise against whole-dollar programs otherwise.
4. **Cross-period ("lifetime") outputs** use over-periods reductions
   (`sum_top_n_over_periods`, `sum/max/count_over_periods` — built for OASDI
   highest-35). Rules: lifetime execution only accepts outputs containing a
   reduction; reductions can't nest; their inputs must be period-invariant; `n`
   must be a period-invariant integer in `1..=period_count`. All violations are
   typed errors.

## Python

`python/axiom_rules_engine/` is a **pure-Python subprocess wrapper** around the
binary. The fast path is the separate **PyO3 extension crate `python-ext/`**
(`maturin develop --release --manifest-path python-ext/Cargo.toml`), wrapped as:

```python
from axiom_rules_engine import CompiledDenseProgram
prog = CompiledDenseProgram.from_file("compiled.json", entity="Household")
res = prog.execute_f64(period_kind="year", start="2026-01-01", end="2026-12-31",
                       inputs={"earnings": np.array([...])}, outputs=["benefit"])
# .execute() = exact decimal; .execute_lifetime_f64() = cross-period outputs
```

Use the columnar interface for batch/population runs (the axiom-microsim path) —
never loop single-case calls.

## Contracts you must not break

- **The core is filesystem/env/clock-free.** Consumers (PyO3 dense, wasm, finbot)
  build with `default-features = false` and supply modules via `ModuleSource`. Never
  add `std::fs`/`std::env`/wall-clock reads to core — it must stay
  `wasm32-unknown-unknown`-clean. The `wasm/` sub-crate builds with **wasm-pack**
  and exports `compile`/`execute`/`engine_version` over a JSON boundary.
- **Artifact format is versioned**: IR-breaking changes bump
  `ARTIFACT_FORMAT_VERSION`; additive serde fields deliberately don't. Treat
  `artifact_format_version()` as the compatibility handshake.
- **Schemas mirror serde exactly** (`schemas/*.v1.schema.json`, draft-07, golden-file
  tested under `--features schema`) — never hand-tidy them.
- Default subprocess timeout is 600s — pass an explicit one for longer runs.

## Consuming compiled packages remotely

Prefer the hosted API / MCP server when you don't need in-process execution:
`/v1/runtime/packages` lists compiled packages registry-driven (don't hardcode
program lists) and `/v1/calculate` executes them; the npm `@axiom-foundation/mcp`
server exposes the same as agent tools.
