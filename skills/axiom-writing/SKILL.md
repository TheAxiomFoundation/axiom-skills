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
2. **Date and scope every validation claim.** "validated against PolicyEngine" →
   "0 PE mismatches on the full CO population (Jun 2026)". Include the
   denominator: "3/3 canonical parity cases", "99.52% on US federal income tax".
3. **Use the product-tier vocabulary exactly**: **GA** (live, supported), **Preview**
   (usable, evolving), **Demo** (curated surface), **Coming** (announced, waitlisted).
   Don't invent synonyms; don't promote a tier in copy before it's promoted in fact.
4. **Self-graded packages are labeled as such.** A compiled package with no oracle
   case yet is "compiled and executable; independent validation pending" — never
   "validated".
5. **Cite the law.** When describing what a rule does, link the durable ID or the
   statute citation, so the reader can read the statute next to the code that runs
   it.
6. **The canonical three-layer explanation** (use it; don't freelance new framings):
   Axiom makes the law itself the software → AI writes the rules, a deterministic
   gauntlet decides what ships (grounding → compile → tests → oracle agreement →
   signed manifest) → the AI never gets to grade its own work.
7. **Active voice, plain sentences, no em-dash-heavy marketing cadence.** Write like
   an auditor who is pleased with the findings.

## Sentences

These rules come from the review of the launch post for Receipt, Axiom's open-source
verifier for records produced by agents (2026-09-10). Each example pair shows a
sentence the reviewers struck and the sentence that replaced it: struck → rewritten.
Apply them to everything Axiom publishes and to the reports agents write for the team.

8. **Every sentence has an actor doing something.** "Trust anchors live in the
   consumer's committed code, never in configuration a producer could swap" → "The
   auditor writes the keys and timestamp authorities they trust into their own
   committed code, where a producer cannot change them." If the subject of a
   sentence is a concept, find the person or program that acts on it.
9. **Describe what happens.** "A hand edit, a swapped key or a dropped gate refuses
   with a named reason" → "If someone edits a published file by hand, its bytes no
   longer match the hash the journal recorded, and Receipt refuses." A test-case
   label or a paper-table heading is a name for a scenario; the sentence describes
   the scenario.
10. **No glosses and no argument pointers.** A sentence whose subject is the text's own
    word ("Witnessed means…", "in other words", "that is,") or the text's own
    reasoning ("This is why…", "the point is", "the upshot") has no actor in the
    world. Give the definition an actor ("Receipt counts a record as witnessed
    when an outside timestamp authority the auditor chose in advance has recorded
    it") and let the facts carry the argument.
11. **Introduce each role once and keep to it.** Name the parties the reader needs
    (for Receipt, the producer and the auditor) and use only those names. A role
    that appears once, uninvited ("the consumer"), is a bug. A term of art belongs
    only in a sentence where an actor does the thing it names; "pinned", "gate" and
    "trust anchor" on their own are not plain language.
12. **Mechanism claims come from the code.** Before you write what a system does,
    open the code or the test that does it, and write what you read. The sentence
    nobody checked against the code is the one that ships wrong.
13. **After one flagged sentence, reread everything.** When a reviewer strikes one
    instance of any rule here, reread the whole document for the same pattern before
    you reply. Fixing only the flagged sentence leaves its siblings in place.
14. **No "X, not Y" and no "instead of Y".** "A claim that it ran, not proof that it
    passed" → "A declared check tells Receipt only that the producer says it ran."
    "A fix reaches every future encoding instead of one file" → "A fix reaches every
    future encoding." State the fact; the negative pole is either invented or already
    implied. A real limit stays as its own plain sentence ("Receipt does not say which
    model produced a record").
15. **Introduce a thing the first time you name it.** Give the name its noun phrase at
    first mention: "Receipt, our new open source verifier for records produced by
    agents, collects that machinery in one package." A reader who meets the name
    before the noun phrase has to guess what it is.
16. **Name it or cut it.** A sentence that alludes to something the reader cannot see
    ("three systems we work on had each answered it in their own code") carries
    nothing. Either name the systems or delete the sentence.
17. **One idea per sentence, one pass per reader.** If a reviewer has to read a
    sentence twice, split it. Three whether-clauses hanging on one verb become three
    sentences, each asking its own question.

## Words to avoid

"revolutionary", "AI-powered" as a selling point (say what the gauntlet checks),
"guarantees", "always accurate", "replaces caseworkers", "fully validated" (without
scope+date), "cannot be wrong".
