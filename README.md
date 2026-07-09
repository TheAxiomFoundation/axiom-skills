# axiom-skills

Shared agent/skill infrastructure for the Axiom Foundation — the org-wide layer that
gives every Claude Code (and, later, Codex) session the same Axiom knowledge and
conventions, in every repo.

## Install (team members)

One time, on your machine:

```
/plugin marketplace add TheAxiomFoundation/axiom-skills
/plugin install essential@axiom-skills
```

Or do nothing: repos that ship the settings template (below) will prompt you to
enable the plugins on first open.

| Bundle | Contents | Who |
|---|---|---|
| `essential` | axiom-ecosystem, rulespec-format, engine-api, axiom-writing + the Axiom MCP server | everyone |
| `encoding` | encode-cli, corpus-usage, oracles-usage | pipeline contributors |
| `craft` | axiom-design, axiom-writing | demo/app builders |
| `complete` | everything | maintainers |

Installing `essential` or `complete` also wires the **Axiom MCP server**
(`@axiom-foundation/mcp`) so agents can search rules, fetch sources, and run
calculations against the production API. Set `AXIOM_API_KEY` in your environment
(self-serve trial keys: `POST /v1/keys/trial`).

## How this works (the interaction model)

- **Skills auto-trigger.** Each skill's description + trigger list is loaded into
  every session; Claude loads the full skill when a task matches ("new demo" →
  axiom-design; "encode a provision" → encode-cli). Humans don't need to remember
  the catalog — the model does.
- **The dashboard** — live at https://axiom-skills.vercel.app — is the visual layer for humans: what exists,
  which bundle carries it, and search. It renders `catalog.json`, generated from the
  same manifest the plugin uses, so it can't drift.
- **Updates flow automatically** — bump versions here; installed plugins update on
  marketplace refresh.

## Enabling in an Axiom repo

Copy `templates/repo-settings.json` into the repo as `.claude/settings.json`
(merge if one exists) and pick bundles for the repo type: pipeline repos →
`essential` + `encoding`; demo/app repos → `essential` + `craft`.

## Repository layout

```
.claude-plugin/marketplace.json   # bundles → skills mapping (the source of truth)
skills/<name>/SKILL.md            # portable skill folders (harness-agnostic)
agents/                           # org-wide agents (empty in v1; see agents/README.md
                                  # for the repo-local → org-wide promotion path)
mcp/axiom.json                    # MCP server config shipped with essential/complete
templates/repo-settings.json     # drop-in .claude/settings.json for other repos
dashboard/                        # static catalog viewer (Vercel-ready)
scripts/build-catalog.mjs         # regenerates dashboard/catalog.json (CI-checked)
```

Validate locally with `claude plugin validate .` (CI also checks the manifest,
skill frontmatter, and catalog freshness).

## Contributing a skill

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: portable `SKILL.md` with
trigger-rich frontmatter, added to the right bundle(s) in the marketplace manifest,
`node scripts/build-catalog.mjs` run before committing. When you learn something
reusable, it belongs here as a PR — not in your head.

## Roadmap

- **v1 (now):** knowledge + craft skills, MCP wiring, catalog dashboard.
- **v2:** operational agents (encoding-runner, parity-verifier, encoding-reviewer) —
  pending a decision on how plugin-distributed agents handle signing/API keys.
- **Later:** Codex install script (skills are already portable SKILL.md folders),
  CI usage of agents (PR review bots), dashboard Gaps/Duplicates views.
