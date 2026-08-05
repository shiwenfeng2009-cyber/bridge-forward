**Source visual truth**

- `C:/Users/shiwe/AppData/Local/Temp/codex-clipboard-811185ef-50ea-4e0f-b49a-0fd7526bb452.png`
- Source pixels: 2048 × 3072.

**Implementation evidence**

- `C:/Users/shiwe/OneDrive/文档/bridge forward/resource-page-desktop-qa.png`
- Comparison board: `C:/Users/shiwe/OneDrive/文档/bridge forward/resource-page-comparison.png`
- Browser-rendered route: `http://localhost:3000/resources`
- Capture pixels: 1521 × 2788; CSS viewport 1536 × 1000; density 1.
- State: desktop, Chinese secondary language, signed out.

**Full-view comparison**

- The same visual sequence is present: campus-coast hero, reassurance strip, four contact cards, academic tools, learning platforms, daily-life resources, helpful links, and coast footer.
- The rebuilt watercolor hero preserves the source subject, warm palette, rainbow, campus, coastline, and two students while removing embedded UI text.
- The active site header intentionally replaces the navigation embedded in the reference.
- Browser full-page stitching repeats the fixed site header in the raw capture; this is capture behavior, not repeated page content.

**Focused-region comparison**

- Hero: first implementation pass was visibly taller than the source. It was reduced to a 20–24rem responsive height while preserving the image focal point.
- Cards: first implementation pass was too vertically loose. Resource cards were reduced to a 7.2rem minimum height to better match the source density.
- Typography and content were checked at the hero, contact grid, academic grid, and language-switched reassurance strip.

**Findings**

- Fonts and typography: site-wide font family and weights are consistent; English and the selected secondary language retain clear hierarchy.
- Spacing and layout rhythm: section order, grid density, radii, and vertical spacing now align with the reference. Mobile grids collapse without horizontal overflow.
- Colors and visual tokens: cream, blush, sage, blue, and lilac are restrained and consistent with the reference.
- Image quality and asset fidelity: the hero is a high-resolution standalone raster illustration, not a blurred screenshot. Site logos and external product favicons remain real image assets.
- Copy and content: all reference categories and named resources are represented; contact information and descriptions remain bilingual and translatable.
- Interaction: language switching was tested from Chinese to Japanese; the document language and visible secondary copy updated in-place. Resource cards are real external links with hover/focus elevation.
- Console: no blocking runtime error was observed during the resource-page and language-switch checks.

**Comparison history**

1. P2 — hero height and resource-card density were looser than the reference.
2. Fix — reduced the hero to a controlled responsive height and tightened card minimum height.
3. Post-fix evidence — implementation retains the reference hierarchy while fitting more of the directory into the first scroll.

**Primary interactions tested**

- Open `/resources`.
- Switch secondary language from Chinese to Japanese without navigating away.
- Confirm English remains unchanged and Chinese copy is replaced in-place.
- Confirm all resource categories render as links.

**Follow-up polish**

- P3: official product favicons may vary slightly by provider over time, but this does not affect layout or usability.

final result: passed
