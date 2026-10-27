# Portfolio design guidance

For all design, copy, motion, and UI work on this portfolio, read and apply:

- https://github.com/elayadesign/ai-design-skills/blob/main/skills/landing-page-design/SKILL.md
- For existing-site changes, also read https://github.com/elayadesign/redesign-skill/blob/main/skills/redesign-existing-projects/SKILL.md

Use the existing static HTML, CSS, and JavaScript stack. Keep changes focused and preserve project links, the case-study reading column, and the fixed definitions rail. Apply the skills' type and spacing scales, shared easing, keyboard states, and reduced-motion handling. Specific user design requests take precedence over general skill defaults.

Current direction: a centered editorial homepage; opening Projects lifts the introduction on the vertical axis with transform animation, with the three lead projects below it. Pursuit Intelligence, Wedding Website, and Saint City Chapel lead; earlier concepts remain lower on the same page. The footer headline is not a link. Its chosen interaction is a pointer-following reveal lens containing project imagery; this explicit choice permits mask animation. Keep contact and resume links compact beneath it.

Use verified experience and actual project assets. Label explanatory illustrations as illustrations. Do not invent usability testing, metrics, endorsements, or rollout outcomes. Preserve the distinction between the local Pursuit Intelligence proof of concept and the national version still in development. Keep volunteer work identified as volunteer experience.

Footer imagery is fitted to individual word boxes. Each word gets a distinct montage of varied project photos and design work with uneven panel widths. Never tile photographs or alternate just two repeated images; keep every frame unique across the footer, with no imagery wasted behind blank headline space. Saint City’s featured preview uses the Salt Company worship-leading photo, not the production-booth image.

Scroll reveals must use opacity and transform only. Do not reintroduce CSS blur filters on reveal wrappers, metadata strips, or photo panels: a persistent purple edge artifact was reported during the blurred initial state, even after completed-state cleanup. Keep unrevealed content faintly visible.

Footer image sources are restricted to photographs from the Saint City Chapel and wedding website stories. Do not use phone or computer mockups, Apple Music, Instagram, Nike, Disney, or other concept imagery. The wedding source must use its photographic area without website UI. Regenerate the four collages with `python scripts/build-footer-collages.py`; originals remain unchanged.

Inside the footer reveal lens, mask out the solid text under the photo lettering using the same geometry. Do not stack the light solid glyphs directly beneath photo glyphs; their antialiasing creates a faint outline. Keep keyboard focus indicators on contact links intact.

Homepage project thumbnails preserve their intrinsic image ratios at every breakpoint; never impose a square or 4:3 crop on mobile. Use a single photo column on narrow phones and test all nine current pages at phone, tablet, and desktop widths when changing shared layout.
