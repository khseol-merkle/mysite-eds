/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://wknd-trendsetters.site
 * Selector: section.inverse-section .grid-layout.desktop-1-column
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   .grid-layout.desktop-1-column
 *     > div.utility-position-relative.utility-radius-card.utility-overflow-clip
 *       - img.cover-image.utility-overlay (background image)
 *       - div.overlay.utility-z-index-1 (dark overlay)
 *       - div.card-body.utility-max-width-lg.utility-text-on-overlay
 *         > h2.h1-heading (heading)
 *         > p.subheading (description)
 *         > .button-group > a.button.inverse-button (CTA)
 *
 * Block library target (hero):
 *   Row 1: [background image]
 *   Row 2: [heading, subheading, CTAs]
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('img.cover-image, img.utility-overlay, img');

  // Extract heading
  const heading = element.querySelector('h2.h1-heading, h2, h1');

  // Extract subheading/description
  const subheading = element.querySelector('p.subheading, .subheading');

  // Extract CTA buttons
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, .button-group a'));

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + subheading + CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
