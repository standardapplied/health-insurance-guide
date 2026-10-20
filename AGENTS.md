# Working on this repository with a coding agent

This file is for coding agents (and the people directing them). It carries the editorial and engineering rules that `CONTRIBUTING.md` explains in full.

## What this is

A single-file interactive guide to US health insurance, built from `source/` by `build.mjs` into `index.html`. The guide teaches by following one fictional member through a plan year. Readers are product teams, engineers and founders in healthcare software.

## Rules that are not negotiable

1. **Primary sources only, dated.** Every factual statement cites a source id from `source/data.mjs`. Prefer a government page, a statute or regulation, an SEC filing or a company’s own website. Record the date the fact applies to. A working URL does not prove a fact is still true.
2. **Public information only.** Organization examples come from public filings, annual reports and company websites. Do not add an example, relationship or detail that depends on client work, private engagements or non-public knowledge, even when the underlying facts could be found publicly.
3. **One model.** Every dollar figure comes from `source/model.mjs`. Never hard-code a number in prose that the model can compute. The checks verify that every split conserves the allowed amount.
4. **Say it directly.** State the thing; let the specific detail carry the contrast. Avoid “not X, but Y”, corrective negation and rhetorical setups. No em dashes. Keep the register of an engineer explaining to a peer.
5. **Labels, not arrows.** Trademark licensing, ownership, business portfolio and service agreements are different relationships and are labeled differently. Business segments are labeled as segments, not legal entities.
6. **Do not edit `index.html` by hand.** It is build output and CI rejects a commit where it differs from the build.
7. **Synthetic examples only.** Maya and her plan are fictional. Never add member records, claims, card images, credentials or private material.

## How to work

- `bun install`, then `bun run build` and `bun run check` before proposing a change. Both must pass. The build runs the Anatomy geometry audit for the figures; the check runs the model, interactions and layout in headless Chromium at desktop and phone widths.
- Content lives in `source/guide.mjs` (persona, seats, system, seams, buyers, privacy) and `source/data.mjs` (coverage routes, organization maps, glossary, sources). The page template is `source/page.html`; data-driven sections are rendered by `source/render.mjs`.
- Figures live in `source/machines.mjs` (register, claim line, cistern) and `source/mechanisms.mjs` (allocation tray). They use the vendored Anatomy kit under `vendor/anatomy/`; read its `kit/` and keep the audit at zero problems. A figure is a real object whose working is the concept, with many small purposeful parts. Flat slabs standing for ideas are the failure mode.
- Organization maps are plain SVG from `source/mapsvg.mjs`; boxes size themselves to wrapped text and edges route as org charts. Keep it that way.
- Every page follows one pattern: a part label, a headline that states the page’s claim, one instrument or figure, a “For builders” line directly under the heading, and an evidence drawer with sources. Keep it.
- Colors are Sail design tokens: paper, ink, graphite, pencil for small labels, the flare for the title accent and one signal per page. Do not introduce other colors.

## What to propose rather than do

Large scope additions (a state-by-state directory, plan shopping, personalized advice), changes to payment rules or regulatory statements, and changes to organization relationships. Open an issue with the sentence, the evidence and the proposed change; a maintainer reviews before anything merges.
