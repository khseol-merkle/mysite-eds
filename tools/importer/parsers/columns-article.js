/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-article
 * Base block: columns
 * Source: https://wknd-trendsetters.site
 * Selector: main > section:nth-of-type(1) .grid-layout
 * Structure: Columns block with 2 columns per row. Col 1: image. Col 2: breadcrumbs + heading + author info.
 */
export default function parse(element, { document }) {
  // The grid-layout has two direct child divs: image column and text column
  const columns = element.querySelectorAll(':scope > div');

  const cells = [];

  if (columns.length >= 2) {
    // Column 1: Image (found: img.cover-image.utility-aspect-3x2)
    const imageCol = columns[0];
    const image = imageCol.querySelector('img.cover-image, img');

    // Column 2: Text content (breadcrumbs, heading, author info)
    const textCol = columns[1];

    // Extract breadcrumbs (found: .breadcrumbs)
    const breadcrumbs = textCol.querySelector('.breadcrumbs');

    // Extract heading (found: h2.h2-heading)
    const heading = textCol.querySelector('h2, h1, [class*="h2-heading"]');

    // Extract author/meta info
    const metaContainer = textCol.querySelectorAll('.flex-horizontal');

    // Build column 2 content
    const textContent = document.createElement('div');
    if (breadcrumbs) textContent.appendChild(breadcrumbs);
    if (heading) textContent.appendChild(heading);
    metaContainer.forEach((meta) => textContent.appendChild(meta));

    cells.push([image || imageCol, textContent]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
