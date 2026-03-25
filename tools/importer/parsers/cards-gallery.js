/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site
 * Selector: main > section:nth-of-type(2) .grid-layout.desktop-4-column
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   .grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm
 *     > div.utility-aspect-1x1 (x8): each contains img.cover-image
 *
 * Block library target (cards with images):
 *   Each row: [image | text content]
 *   Image in first cell, text in second cell.
 *   For image-only gallery, second cell contains alt text as description.
 */
export default function parse(element, { document }) {
  // Extract all gallery image containers
  const imageContainers = element.querySelectorAll(':scope > div.utility-aspect-1x1, :scope > div');

  const cells = [];

  imageContainers.forEach((container) => {
    const img = container.querySelector('img.cover-image, img');
    if (!img) return;

    // Cell 1: Image
    const imageCell = [img];

    // Cell 2: Alt text as description (cards require a text cell)
    const textCell = [];
    const altText = img.getAttribute('alt');
    if (altText) {
      const p = document.createElement('p');
      p.textContent = altText;
      textCell.push(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
