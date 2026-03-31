/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-trending
 * Base block: hero
 * Source: https://wknd-trendsetters.site
 * Selector: header.section.secondary-section
 * Structure: Hero block with 1 column. Row 1: images. Row 2: heading + subheading + CTAs.
 */
export default function parse(element, { document }) {
  // Extract images from the right-side grid (found: .grid-layout .grid-layout img.cover-image)
  const images = Array.from(element.querySelectorAll('.grid-layout .grid-layout img.cover-image, .grid-layout > div:last-child img'));

  // Extract heading (found: h1.h1-heading)
  const heading = element.querySelector('h1, h2, [class*="h1-heading"]');

  // Extract subheading paragraph (found: p.subheading)
  const description = element.querySelector('p.subheading, p');

  // Extract CTA buttons (found: .button-group a.button)
  const ctas = Array.from(element.querySelectorAll('.button-group a.button, .button-group a'));

  const cells = [];

  // Row 1: Images (optional background row per hero spec)
  if (images.length > 0) {
    const imageContainer = document.createElement('div');
    images.forEach((img) => imageContainer.appendChild(img));
    cells.push([imageContainer]);
  }

  // Row 2: Content (heading, subheading, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctas);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-trending', cells });
  element.replaceWith(block);
}
