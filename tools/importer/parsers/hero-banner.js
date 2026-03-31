/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Base block: hero
 * Source: https://wknd-trendsetters.site
 * Selector: main > section.inverse-section
 * Structure: Hero block with 1 column. Row 1: background image. Row 2: heading + subheading + CTA.
 */
export default function parse(element, { document }) {
  // Background image (found: img.cover-image.utility-overlay)
  const bgImage = element.querySelector('img.cover-image.utility-overlay, img.cover-image');

  // Content area (found: .card-body.utility-text-on-overlay)
  const contentArea = element.querySelector('.card-body, .utility-text-on-overlay');

  // Heading (found: h2.h1-heading)
  const heading = contentArea ? contentArea.querySelector('h2, h1, [class*="heading"]') : element.querySelector('h2, h1');

  // Description (found: p.subheading)
  const description = contentArea ? contentArea.querySelector('p.subheading, p') : element.querySelector('p.subheading, p');

  // CTA buttons (found: .button-group a.button)
  const ctas = contentArea
    ? Array.from(contentArea.querySelectorAll('.button-group a, a.button, a.inverse-button'))
    : Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading, description, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctas);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
