/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site
 * Selector: main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   .grid-layout.tablet-1-column.grid-gap-lg
 *     > div (left): img.cover-image.utility-aspect-3x2
 *     > div (right): .breadcrumbs, h2.h2-heading, author/date metadata
 *
 * Block library target (columns):
 *   Row: [Column 1 content | Column 2 content]
 *   Each cell can contain text, images, or other inline elements.
 */
export default function parse(element, { document }) {
  // Column 1: Image
  const image = element.querySelector(':scope > div:first-child img.cover-image, :scope > div:first-child img');

  // Column 2: Text content
  const heading = element.querySelector('h2.h2-heading, h2');

  // Extract breadcrumbs links
  const breadcrumbLinks = Array.from(element.querySelectorAll('.breadcrumbs a.text-link, .breadcrumbs a'));

  // Extract author info
  const authorName = element.querySelector('.utility-text-black, .flex-horizontal .paragraph-sm:not(.utility-text-secondary)');

  // Extract date info
  const dateSpan = element.querySelector('.utility-margin-top-0-5rem .paragraph-sm.utility-text-secondary');

  // Build column 2 content
  const col2 = [];

  // Add breadcrumbs as plain text links
  if (breadcrumbLinks.length > 0) {
    const breadcrumbContainer = document.createElement('p');
    breadcrumbLinks.forEach((link, i) => {
      if (i > 0) breadcrumbContainer.append(document.createTextNode(' > '));
      breadcrumbContainer.append(link);
    });
    col2.push(breadcrumbContainer);
  }

  if (heading) col2.push(heading);

  // Add author and date as paragraphs
  if (authorName) {
    const authorP = document.createElement('p');
    authorP.textContent = `By ${authorName.textContent.trim()}`;
    col2.push(authorP);
  }

  if (dateSpan) {
    const dateP = document.createElement('p');
    dateP.textContent = dateSpan.textContent.trim();
    col2.push(dateP);
  }

  // Build cells matching columns block library structure
  const cells = [];

  // Single row with 2 columns
  const col1 = image ? [image] : [];
  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
