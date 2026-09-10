---
name: axiom-writing
description: >-
  ALWAYS LOAD THIS SKILL before writing anything public-facing or partner-facing for
  Axiom — READMEs, launch/blog posts, docs pages, partner emails, coverage claims,
  demo copy, PR descriptions on public repos, grant text.
  Triggers: "write a blog post", "announcement", "launch copy", "README",
  "partner email", "coverage page", "describe validation", "docs page",
  "marketing copy", "landing page text", "grant application", "one-pager".
---

# Axiom writing voice

## The stance

Axiom's credibility rests on being the project that *never overclaims about law*.
Every sentence should survive a skeptical technical evaluator — that's the primary
audience. Neutral, quantitative, citation-forward; no advocacy, no hype adjectives.

## Hard rules

1. **"Not encoded" over guessing.** Never imply coverage that doesn't exist. FinBot's
   grounded side says "not encoded" rather than answering — all copy follows the same
   principle.
2. **Date and scope every validation claim.** Not "validated against PolicyEngine"
   but "0 PE mismatches on the full CO population (Jun 2026)". Include the
   denominator: "3/3 canonical parity cases", "99.52% on US federal income tax".
3. **Use the product-tier vocabulary exactly**: **GA** (live, supported), **Preview**
   (usable, evolving), **Demo** (curated surface), **Coming** (announced, waitlisted).
   Don't invent synonyms; don't promote a tier in copy before it's promoted in fact.
4. **Self-graded packages are labeled as such.** A compiled package with no oracle
   case yet is "compiled and executable; independent validation pending" — never
   "validated".
5. **Cite the law, not our paraphrase.** When describing what a rule does, link the
   durable ID / statute citation. The whole pitch is "read the statute next to the
   code that runs it" — copy should model that behavior.
6. **The canonical three-layer explanation** (use it; don't freelance new framings):
   Axiom makes the law itself the software → AI writes the rules, a deterministic
   gauntlet decides what ships (grounding → compile → tests → oracle agreement →
   signed manifest) → the AI never gets to grade its own work.
7. **Active voice, plain sentences, no em-dash-heavy marketing cadence.** Write like
   an auditor who is pleased with the findings.

## Sentences

Rules that came out of the Receipt launch post (2026-09-10), each from a sentence Max
struck. They apply to every register: blog, README, partner email, and the reports
agents write back to the team.

8. **Every sentence has an actor doing something.** Not "Trust anchors live in the
   consumer's committed code, never in configuration a producer could swap" but "The
   auditor writes the keys and timestamp authorities they trust into their own
   committed code, where a producer cannot change them." If the subject of the
   sentence is a concept, find the person or program that acts on it.
9. **Describe the action, not the scenario name.** Not "A hand edit, a swapped key or
   a dropped gate refuses with a named reason" but "If someone edits a published file
   by hand, its bytes no longer match the hash the journal recorded, and Receipt
   refuses." Test-case labels and paper-table headings are not prose.
10. **No glosses and no argument pointers.** A sentence whose subject is the text's own
    word ("Witnessed means…", "in other words", "that is,") or the text's own
    reasoning ("This is why…", "the point is", "the upshot") has no actor in the
    world. Give the definition an agent ("Receipt counts a record as witnessed
    when an outside timestamp authority the auditor chose in advance has recorded
    it") and let facts carry the argument.
11. **Two roles, introduced once.** Name the parties a reader needs (the producer,
    the auditor) and keep to them. A third role that appears once, uninvited
    ("the consumer"), is a bug. A term of art may appear only in a sentence where an
    agent does the thing it names; "pinned", "gate", "trust anchor", "base" and
    "commit" on their own are not plain language.
12. **Mechanism claims come from the code, read this session.** Before writing what
    a system does, open the code or the test that does it, and write what you read.
    A sentence that sounds right and was not checked is the sentence that gets
    published wrong.
13. **One flagged sentence means a full pass.** When a reviewer strikes one instance
    of any of these, reread the whole document for the same pattern before
    replying. Fixing only the flagged sentence is the failure mode.
14. **No "X, not Y" and no "instead of Y".** "A claim that it ran, not proof that it
    passed" → "A declared check tells Receipt only that the producer says it ran."
    "A fix reaches every future encoding instead of one file" → "A fix reaches every
    future encoding." State the fact; the negative pole is either invented or already
    implied. A real limit stays as its own plain sentence ("Receipt does not say which
    model produced a record").

## Words to avoid

"revolutionary", "AI-powered" (as a selling point — the gauntlet is the point),
"guarantees", "always accurate", "replaces caseworkers", "fully validated" (without
scope+date), "cannot be wrong".
