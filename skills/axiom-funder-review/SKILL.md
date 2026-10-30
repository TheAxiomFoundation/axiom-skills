---
name: axiom-funder-review
description: >-
  ALWAYS LOAD THIS SKILL before any funder-facing document leaves the Axiom Foundation,
  and whenever someone asks for a review of one: proposals, scopes of work, concept
  notes, LOIs, budget narratives, funder updates, renewals, milestone reports. It
  reconciles every number against its source and reads the document the way a program
  officer will. Triggers: "review the proposal", "before we send", "funder lens",
  "read it like a program officer", "pressure test the proposal", "scope of work",
  "grant budget", "budget narrative", "concept note", "LOI", "renewal",
  "funder update", "milestone report", "check the numbers", "does this line up".
---

# Funder review

Run this review before a funder-facing document goes out. The review finds problems;
the `axiom-writing` skill governs how to fix the prose. Report findings first, and edit
the document only when the owner asks.

The eight lenses in Step 2 adapt a decision lens that Matt Zieger, a program officer,
shared publicly in a LinkedIn post (Oct 2026). They describe how one experienced funder reads a proposal.
Use them to find gaps. Do not turn them into a score.

## Step 1: Reconcile the numbers

Check every figure before you read for argument. A program officer who finds one wrong
number rereads every other number with less trust.

- **Budget.** Compare each figure with the budget workbook's cell values, never with an
  earlier narrative. Seat rows add up to the staff line. Direct costs plus indirect
  equal the request. FTE-years equal the sum over seats of FTE × months on the grant ÷ 12 (one
  full-time seat for twelve months is 1.0 FTE-year). Rounded seat
  figures still add up to the rounded total.
- **Dates.** Compare each date with the plan artifact the document names.
- **Changes.** Take every "changed from" figure from the version the funder actually
  received. A later working draft that never went out is the wrong baseline.
- **Sources.** Every outside statistic has its link in the same sentence or table row.
- **Status words.** Signed, awarded, committed, in contracting and under discussion each
  match the real status on the day the document goes out.
- **Restricted figures.** Embargoed award amounts and unnamed anchor funders appear only
  where the governing agreement or the agreed disclosure language allows. Check the
  agreement's disclosure clause; do not assume a private document is exempt.

Report each mismatch with the document's value, the source's value, and where the
source value lives (file and cell, or file and section).

## Step 2: Read through the eight lenses

For each lens, record whether the document answers it, where, and what is missing. The
bracketed text translates the lens into Axiom's work. Several lenses come from workforce
funding, where "employers" and "placement" are the demand side. For Axiom, the demand
side is builders, navigators, agencies and AI developers.

1. **Human outcome.** Who benefits, and what changes in their lives? [Name the people,
   such as households facing job loss, reduced hours or new caregiving, and the tool
   through which our rules reach them.]
2. **Activity versus results.** Reach, adoption, completion and durable change measure
   different things. [Separate what we deliver (encodings, releases, an open API and
   MCP server), what we report (builders onboarded, calculations served), and what we
   cannot measure from our position (applications, approvals, correct benefit amounts).
   An output must never read as an outcome.]
3. **Implementation.** Who adopts it, who delivers it, which incentives matter, and what
   makes it hard? [Hiring dates, agent pass rates against the planning assumption,
   oracle availability by state, state source discovery.]
4. **Demand.** Do the institutions that would use it need it, and do they use it now?
   [Cite current usage with a date. Label pipeline as pipeline.]
5. **Evidence.** What was measured, for whom, over what period, against what baseline,
   and with what limits? [Every validation claim carries scope, date and denominator,
   per `axiom-writing` rule 2.]
6. **Capacity and cost.** Can the team deliver at this scale, and does the amount fit
   the team? [Show which part of the full plan this grant buys, which work depends on
   uncommitted funding, and what moves if that funding does not land.]
7. **Wider value.** Will shared infrastructure, data, evaluation or learning help
   others improve? [Open license, API and MCP access, public benchmarks, government
   pilots.]
8. **Relationship and fit.** Has the conversation covered the substance before the
   money? [Check that the document reflects what the program officer agreed, and dates
   those conversations.]

## Step 3: Report

Open with the verdict: ready to send, or not yet and the reason. Then list:

1. Number mismatches from Step 1, each with both values and the source location.
2. Lens gaps from Step 2, the most decision-relevant first.
3. Decisions only the document's owner can make, such as disclosure, milestone wording
   and new commitments.

Mark each finding as *checked* (verified against a source) or *judgment*.
