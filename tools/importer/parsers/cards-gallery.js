/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-gallery
 * Base block: cards
 * Source: https://wknd-trendsetters.site
 * Selector: main > section:nth-of-type(2) .grid-layout.desktop-4-column
 * Structure: Cards block with image-only cards. Each row: 1 cell with image.
 */
export default function parse(element, { document }) {
  // Each grid item is a div.utility-aspect-1x1 containing an img.cover-image
  const items = element.querySelectorAll(':scope > div');

  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img.cover-image, img');
    if (img) {
      // Cards with images: image in cell 1, empty cell 2 (image-only gallery)
      cells.push([img, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
