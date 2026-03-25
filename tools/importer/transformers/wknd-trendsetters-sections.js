/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer: WKND Trendsetters.
 * Adds section breaks (<hr>) and section-metadata blocks from template sections.
 * Runs in afterTransform only, uses payload.template.sections.
 * Selectors from captured DOM of https://wknd-trendsetters.site
 *
 * 7 sections total:
 *   section-1 (Hero): header.section.secondary-section — style="secondary"
 *   section-2 (Featured Article): main > section:nth-of-type(1) — no style
 *   section-3 (Photo Gallery): main > section:nth-of-type(2) — style="secondary"
 *   section-4 (Testimonials): main > section:nth-of-type(3) — no style
 *   section-5 (Latest Articles): main > section:nth-of-type(4) — style="secondary"
 *   section-6 (FAQ): main > section:nth-of-type(5) — no style
 *   section-7 (CTA Banner): main > section:nth-of-type(6) — no style
 *
 * Expected: 6 <hr> (before sections 2-7), 3 Section Metadata blocks (sections 1,3,5)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      let sectionEl = element.querySelector(section.selector);

      // Fallback: if selector no longer matches (e.g. parser replaced the element
      // with a block table), find the block table by its header text.
      // Note: createBlock converts hyphens to spaces (e.g. "hero-showcase" → "hero showcase")
      if (!sectionEl && section.blocks && section.blocks.length > 0) {
        const tables = element.querySelectorAll('table');
        for (const table of tables) {
          const headerCell = table.querySelector('tr:first-child th') || table.querySelector('tr:first-child td');
          if (headerCell) {
            const headerText = headerCell.textContent.trim().toLowerCase();
            // Normalize: compare with both hyphens and spaces
            const headerNormalized = headerText.replace(/\s+/g, '-');
            for (const blockName of section.blocks) {
              if (headerNormalized === blockName || headerText === blockName) {
                sectionEl = table;
                break;
              }
            }
          }
          if (sectionEl) break;
        }
      }
      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Add <hr> before this section (except the first section)
      const isFirst = sections.indexOf(section) === 0;
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
