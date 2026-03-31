/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://wknd-trendsetters.site
 * Selector: main > section:nth-of-type(4) .grid-layout.desktop-4-column
 * Structure: Cards block with 2 columns. Each row: image (cell 1) | text content (cell 2).
 * Each article card has image, category tag, date, and H3 heading. Cards are linked.
 */
export default function parse(element, { document }) {
  // Each article card is an <a> element (found: a.article-card.card-link)
  const cards = element.querySelectorAll('a.article-card, a.card-link');

  const cells = [];

  cards.forEach((card) => {
    // Image (found: .article-card-image img.cover-image)
    const img = card.querySelector('.article-card-image img, img.cover-image');

    // Build text content cell
    const textContent = document.createElement('div');

    // Category tag (found: span.tag)
    const tag = card.querySelector('.tag, .article-card-meta span:first-child');
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textContent.appendChild(tagP);
    }

    // Date (found: .paragraph-sm.utility-text-secondary)
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:last-child');
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      textContent.appendChild(dateP);
    }

    // Heading (found: h3.h4-heading)
    const heading = card.querySelector('h3, [class*="h4-heading"]');
    if (heading) textContent.appendChild(heading);

    // Wrap text in a link to preserve the card's href
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = heading ? heading.textContent : '';
      textContent.appendChild(link);
    }

    cells.push([img || '', textContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
