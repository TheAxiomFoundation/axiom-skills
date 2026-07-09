# Agents

Org-wide agents live here (none yet — v1 ships knowledge and craft skills only).

## The lifecycle

1. **Born repo-local.** An agent starts as `.claude/agents/<name>.md` in the repo
   where it's needed. It works for anyone who clones that repo. Experiment freely.
2. **Promoted when proven.** Once it's useful beyond its home repo (or has survived
   a couple of weeks of real use), promote it here via PR: copy the file to
   `agents/<name>.md`, add it to the right bundle's `"agents"` array in
   `.claude-plugin/marketplace.json`, bump versions, regenerate the catalog.
3. **Namespaced everywhere.** Installed users get it in every repo as
   `<bundle>:<name>`.

## Promotion checklist (reviewed on the PR)

- [ ] **No repo-cwd assumptions** — the agent may run in any repo; it must locate or
      clone what it needs, or take paths as input.
- [ ] **Minimum tool allowlist** — repo-local experiments can be permissive;
      promoted agents get only the tools the job requires.
- [ ] **Secrets by env-var name only** (`AXIOM_API_KEY`, never values); no writes to
      production surfaces without explicit user confirmation in the agent prompt.
- [ ] **Delegation-quality description** — the description is what makes Claude
      choose this agent; write it like a skill trigger list.
- [ ] **Repo-local copy retired** — *recommended, not required while we're building
      this out*: leave the local copy only if the repo genuinely needs a divergent
      variant, and note the divergence in both files. (A local agent with the same
      name shadows the shared one — silent drift is the failure mode to watch.)
