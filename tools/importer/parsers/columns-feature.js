/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature. Base: columns.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Selector: main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg
 *
 * Source DOM structure:
 *   .grid-layout.tablet-1-column.grid-gap-lg
 *     > div: contains img.cover-image
 *     > div: contains h3 + p + .button-group > a.button
 *
 * Block library target (columns):
 *   Single row: [Image cell | Content cell]
 *   Image: the cover image
 *   Content: heading + paragraph + CTA link
 */
export default function parse(element, { document }) {
  // Image column
  const img = element.querySelector('img.cover-image, img');

  // Content column
  const heading = element.querySelector('h3, h2');
  const paragraph = element.querySelector('p.paragraph-lg, p');
  const ctaLink = element.querySelector('.button-group a.button, a.button');

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (paragraph) contentCell.push(paragraph);
  if (ctaLink) contentCell.push(ctaLink);

  const cells = [];
  cells.push([img ? [img] : [], contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
