# US health insurance: a field guide for people building healthcare software

An interactive, open-source guide to how US health insurance works, written for product teams, engineers and founders who need to understand a partner, a workflow or an integration. It follows one fictional member, Maya, through a plan year, sits in each seat at the table (the member and the employer behind her, a physician practice, a hospital, a therapist on a video call, the payer), explains the money loop and how organizations connect, and maps the nine seams where software attaches. Every page links its sources.

**Read it:** https://standardapplied.com/guides/us-health-insurance/

**Or open it locally:** download `index.html` and open it in a browser. The file is self-contained: fonts, figures, data and scripts are embedded; only the source links need a connection.

## What is in the guide

- **One visit.** The insurance card field by field; the words on the card (premium, allowed amount, deductible, coinsurance, copay, out-of-pocket maximum, administrator versus funder) with a one-claim slider; Maya’s plan year, reflowing as you move the deductible or the MRI; one claim path through six stations for three encounters; and the bill as a waterfall from charge to write-off.
- **Who is at the table.** Three seats, five chapters, each answering the same six questions (what they want, where the money goes, what hurts, documents and systems, words that shift, where software helps), then a page on why each party behaves as its contract pays it to.
- **The shape of the system.** Who covers whom, the layers of law still in force, and the money loop.
- **One name, several jobs.** BCBSA and HCSC, UnitedHealth Group and Optum, Elevance and Carelon, with reference cards for CVS Health, Centene and Kaiser Permanente, all from public filings and company websites.
- **Where software attaches.** Nine seams with a buyer, a measure, a standard and a rule; who buys and when; data and privacy roles; four questions to settle before an integration.
- **Reference.** A glossary that cross-links its own terms, and the source library.

Three of the figures are machines built with the [Anatomy](https://github.com/wheresryan22/anatomy) kit and checked by its geometry audit: a claims register (a claim in, a receipt and a drawer out), a six-station assembly line for the claim path, and a cistern for the money loop.

## Design decisions

- **One model.** Every dollar figure on every page comes from `source/model.mjs`. The amounts are synthetic teaching values, stated as such, and the checks verify that every split conserves the allowed amount.
- **Definitions in context.** The first use of a glossary term on each page opens its definition in place; the glossary is the single source.
- **A short route.** Six pages, about ten minutes, for a reader who wants the gist; the full guide is 23 pages.
- **Public sources only.** Organization examples come from annual reports, SEC filings and company websites. Nothing in the guide depends on private engagements or non-public knowledge.
- **No dependencies at read time.** The build embeds everything so the result is one file.

## Building

Requires [Bun](https://bun.com).

```sh
bun install
bun run build     # writes index.html, diagrams/*.svg and share-image.html; runs the geometry audit
bun run check     # opens the build in headless Chromium and checks the model, interactions and layout
```

`bun run check` needs a Chromium: `bunx playwright install --with-deps chromium` once, or set `CHROME_PATH` to an existing binary. It writes screenshots to `qa/shots/` and `share-image.png`, the social image.

The committed `index.html` is the built output. Continuous integration rebuilds on every push and fails if the committed file differs from the build, so change `source/` and rebuild rather than editing `index.html`. `share-image.png` is committed too; regenerate it with `bun run check` when the cover changes.

standardapplied.com deploys `index.html` and `share-image.png` from the `main` branch of this repository at `/guides/us-health-insurance/` on each site deploy. Tags of the form `v*` mark editions and attach the same two files to a GitHub release.

## Contributing

Corrections with a primary source, clearer explanations and accessibility improvements are welcome. Read `CONTRIBUTING.md` first: it explains what a factual correction needs (the sentence, the evidence, the effective date), how organization relationships are labeled, and what stays out of scope. `AGENTS.md` carries the same rules for coding agents.

## Scope and status

This is a first edition. It explains common arrangements and selected organizations; it is not legal, benefits or coverage advice, and for any individual claim the plan documents and the member card’s instructions govern. Outside its scope: state-by-state rules, plan selection, complete subsidiary trees, detailed risk adjustment, dental and vision, workers’ compensation and the full appeals lifecycle. Practitioner reviews (payer operations, revenue cycle, behavioral health billing) are pending; each reviewer will be credited on the sources page once complete.

## License

Code is MIT (`LICENSE`). Text, figures and the worked example are CC BY 4.0 (`LICENSE-CONTENT.md`). The Anatomy kit and the fonts carry their own licenses in their directories.
