#!/usr/bin/env node
// Builds dashboard/catalog.json from .claude-plugin/marketplace.json + skill frontmatter.
// Usage: node scripts/build-catalog.mjs [--check]
// --check: exit 1 if the committed catalog differs from the freshly built one (CI drift guard).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const marketplace = JSON.parse(
  readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"),
);

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  let key = null;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      fm[key] = kv[2].replace(/^>-?\s*$/, "");
    } else if (key && /^\s+/.test(line)) {
      fm[key] = (fm[key] ? fm[key] + " " : "") + line.trim();
    }
  }
  return fm;
}

const skillsByPath = {};
const bundlesBySkill = {};
for (const plugin of marketplace.plugins) {
  for (const rel of plugin.skills ?? []) {
    (bundlesBySkill[rel] ??= []).push(plugin.name);
    if (skillsByPath[rel]) continue;
    const file = join(root, rel, "SKILL.md");
    if (!existsSync(file)) {
      console.error(`MISSING: ${rel}/SKILL.md (referenced by bundle "${plugin.name}")`);
      process.exitCode = 1;
      continue;
    }
    const fm = parseFrontmatter(readFileSync(file, "utf8"));
    if (!fm.name || !fm.description) {
      console.error(`INVALID: ${rel}/SKILL.md missing name or description frontmatter`);
      process.exitCode = 1;
    }
    skillsByPath[rel] = { path: rel, name: fm.name ?? rel, description: fm.description ?? "" };
  }
}

const catalog = {
  marketplace: { name: marketplace.name, version: marketplace.version, description: marketplace.description },
  bundles: marketplace.plugins.map((p) => ({
    name: p.name,
    description: p.description,
    category: p.category,
    skills: (p.skills ?? []).map((s) => skillsByPath[s]?.name ?? s),
    mcp: Boolean(p.mcpServers),
  })),
  skills: Object.values(skillsByPath)
    .map((s) => ({ ...s, bundles: bundlesBySkill[s.path] }))
    .sort((a, b) => a.name.localeCompare(b.name)),
};

const out = JSON.stringify(catalog, null, 2) + "\n";
const target = join(root, "dashboard/catalog.json");

if (process.argv.includes("--check")) {
  const current = existsSync(target) ? readFileSync(target, "utf8") : "";
  if (current !== out) {
    console.error("dashboard/catalog.json is stale — run: node scripts/build-catalog.mjs");
    process.exit(1);
  }
  console.log("catalog up to date");
} else {
  writeFileSync(target, out);
  console.log(`wrote dashboard/catalog.json (${catalog.skills.length} skills, ${catalog.bundles.length} bundles)`);
}
