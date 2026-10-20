# Contributing to the US health insurance guide

Corrections, clearer explanations, accessibility improvements and sourced additions are welcome. Standard Applied Intelligence Labs maintains the guide and reviews changes before release.

## A factual correction

Open an issue or a pull request with:

- The page, term or relationship that needs changing.
- The proposed wording and why the existing wording is inaccurate or incomplete.
- A primary source, with a section or page number when available.
- The effective date or filing date, the date checked, and any known geographic or product limits.

For organization maps, distinguish ownership, trademark licensing, business or brand portfolios, and service contracts. A logo, shared brand or vendor relationship does not prove ownership. Do not replace a dated filing snapshot with an undated assertion.

Use public information and synthetic examples. Organization examples come only from public filings, annual reports and company websites; do not add an example, relationship or detail that depends on client work, private engagements or non-public knowledge, even when the underlying facts could be found publicly. Do not submit member records, claims, insurance-card images, credentials or private customer material.

## Editorial review

Keep titles descriptive. Use the simplest explanation that preserves the material distinction. State exceptions beside the claim they affect; avoid turning an introductory page into a catalogue of edge cases. State things directly: let the specific detail carry the contrast rather than a “not X, but Y” construction.

Changes to payment rules, regulatory statements or corporate relationships receive domain review as well as editorial review. Reviewers identify relevant affiliations. The maintainer records the source, reviewer and effective date in the release notes. A source citation is not a claim that an independent specialist has reviewed the guide.

## Product and code changes

The guide is a static HTML document built by `bun run build` from `source/`. Desktop reading uses page controls; smaller screens use normal scrolling. Preserve keyboard navigation, readable text, reduced motion and source links. Every page follows one pattern: a chapter stamp, a headline that states a claim, one instrument, a line for builders and an evidence drawer. Keep it.

Run `bun run build` and `bun run check`. Verify the affected page at desktop, laptop and phone sizes. Financial examples must come from `source/model.mjs`, conserve the allowed amount and state their assumptions; do not hard-code a dollar figure in prose that the model can compute. Do not put proprietary transaction specifications or copyrighted source documents into the repository.

Propose large scope additions before implementation. A complete state-by-state payer directory, insurance shopping and personalized benefit advice are outside the introductory guide’s scope.

## Releases

Maintainers tag releases (`v1.0.0`, …). The release workflow builds and checks the guide and attaches `index.html` and `share-image.png` to the GitHub release; the Standard Applied website deploy picks up the latest release at `/guides/us-health-insurance/`.
