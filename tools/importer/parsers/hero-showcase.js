/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-showcase. Base: hero.
 * Source: https://wknd-trendsetters.site
 * Selector: header.section.secondary-section
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   header.section.secondary-section > .container > .grid-layout.tablet-1-column.grid-gap-xxl
 *     > div (content): h1.h1-heading, p.subheading, .button-group > a.button(s)
 *     > div.grid-layout (images): img.cover-image (x3)
 *
 * Block library target (hero):
 *   Row 1: [background image(s)]
 *   Row 2: [heading, subheading, CTAs]
 */
export default function parse(element, { document }) {
  // Extract images from the image grid
  const images = element.querySelectorAll('.grid-layout.grid-gap-xs img.cover-image, .grid-layout.tablet-1-column > div:last-child img.cover-image');

  // Extract heading
  const heading = element.querySelector('h1.h1-heading, h1, h2');

  // Extract subheading
  const subheading = element.querySelector('p.subheading, .subheading');

  // Extract CTA buttons
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, .button-group a'));

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Images (hero background)
  if (images.length > 0) {
    cells.push([...images]);
  }

  // Row 2: Content (heading + subheading + CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-showcase', cells });
  element.replaceWith(block);
}
