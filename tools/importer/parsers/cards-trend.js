/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-trend. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Selector: main > section:nth-of-type(2) .grid-layout.desktop-3-column
 *
 * Source DOM structure:
 *   .grid-layout.desktop-3-column
 *     > div (x3): each contains:
 *       - img.cover-image (trend image)
 *       - h3 (trend name)
 *       - p (trend description)
 *
 * Block library target (cards):
 *   Each row: [Image cell | Content cell]
 *   Image: trend image
 *   Content: heading + description paragraph
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope > div');
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img.cover-image, img');
    const heading = card.querySelector('h3, h4');
    const paragraph = card.querySelector('p');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (paragraph) contentCell.push(paragraph);

    cells.push([img ? [img] : [], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-trend', cells });
  element.replaceWith(block);
}
