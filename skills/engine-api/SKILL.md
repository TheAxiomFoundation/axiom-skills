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

Rust crate (`axiom-rules-engine`; the `axiom-rules` checkout is the same codebase)
that compiles RuleSpec (`format: rulespec/v1`) into a `CompiledProgramArtifact` and
executes it. Python bindings via PyO3 (`python/axiom_rules_engine/`, built with
maturin); a `wasm/` sub-crate compiles the engine for browser/client-side execution.
Engine is infra-only — production policy content lives in rulespec-* repos; only test
fixtures live in the engine repo.

## CLI essentials

- `compile` — RuleSpec → JSON compiled artifact. Source links from corpus provisions
  are joined into artifacts at compile time.
- `run-compiled` — execute an artifact against an execution request.
- `check-sources` — validates the source registry; `--verify-r2` also checks R2
  object existence + SHA-256.
- `concepts search|show|validate|list` — static repo-backed concept index.

## Non-negotiables when writing calling code

1. **Key public references by durable legal IDs** (`us:statutes/7/2017/a#output`) —
   never by file paths or invented names. Execution requests that don't will fail or,
   worse, silently bind to nothing.
2. **Use `explain` mode when debugging** — it emits a full trace of which rules fired
   and why; don't reverse-engineer from outputs.
3. **Typed outputs**: scalars vs judgments are distinct; temporal outputs come as
   period/interval series, not single numbers. Cross-period ("lifetime") reductions
   (e.g. `sum_top_n_over_periods`, built for OASDI highest-35-years) exist — don't
   re-implement them in calling code.
4. **Currency rounding is opt-in** — the engine carries cents by default. FNS-style
   whole-dollar program rules need the rounding flag or you'll see ±$1 parity noise.
5. **Batch/population runs**: use the columnar `CompiledDenseProgram` interface from
   Python (this is what axiom-microsim does) — never loop single-case calls.

## Consuming compiled packages remotely

Prefer the hosted API / MCP server when you don't need in-process execution:
`/v1/runtime/packages` lists compiled packages registry-driven (don't hardcode
program lists — the graph-viewer retired its allowlist for a reason), and
`/v1/calculate` executes them. The MCP server (`@axiom-foundation/mcp` on npm)
exposes the same as agent tools. JSON Schemas for module/test/compiled-artifact are
authoritative under `schemas/` in the engine repo (draft-07, golden-file tested).
