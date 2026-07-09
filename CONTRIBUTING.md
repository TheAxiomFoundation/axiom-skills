# Contributing to axiom-skills

## Adding or changing a skill

1. Create `skills/<kebab-name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <kebab-name>
   description: >-
     ALWAYS LOAD THIS SKILL before <the situation>. <One sentence of scope.>
     Triggers: "<phrase>", "<phrase>", ... (be aggressive — a skill with weak
     triggers is a skill that never fires)
   ---
   ```
2. Add the path to the right bundle(s) in `.claude-plugin/marketplace.json`
   (and to `complete`).
3. Regenerate the catalog: `node scripts/build-catalog.mjs` (CI fails on stale catalog).
4. Bump the marketplace `version` (and the touched bundle versions) — semver-ish:
   patch for content fixes, minor for new skills, major for removals/renames.

## Writing rules

- **Triggers are the product.** The description is what every session sees; the body
  loads only on match. Spend real effort on trigger phrases people actually type.
- **State constraints, not tutorials.** Skills exist to stop wrong behavior
  (hand-editing generated YAML, hardcoding program lists, leaking API keys to the
  browser) and encode conventions. Link out for long-form docs.
- **Portable first.** SKILL.md must be useful pasted into any harness — no
  Claude-specific syntax in skill bodies. Claude-only assets (commands, agents,
  hooks) get their own top-level dirs when we add them (v2).
- **Facts must be current.** Dated claims (package counts, validation numbers)
  belong in dated docs, not skills — skills should describe invariants and
  conventions that survive releases.

## Review & curation

One maintainer reviews skill PRs for trigger quality, factual currency, and overlap
with existing skills. Stale guidance that auto-loads is worse than no guidance —
when a convention changes, updating the skill is part of the change, same as the
ratchet files in rulespec repos.

## Secrets

Never put keys, tokens, or signing-key *values* in skills or MCP configs. Referencing
env var *names* (`AXIOM_API_KEY`, `AXIOM_ENCODE_APPLY_SIGNING_KEY`) is fine.
