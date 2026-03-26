/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site
 * Selector: main > section:nth-of-type(4) .grid-layout.desktop-4-column
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   .grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md
 *     > a.article-card.card-link (x4): each contains:
 *       - .article-card-image > img.cover-image
 *       - .article-card-body > .article-card-meta > span.tag + span.paragraph-sm (date)
 *       - .article-card-body > h3.h4-heading
 *
 * Block library target (cards with images):
 *   Each row: [image | text content]
 *   Image in first cell, text (heading, description, CTA) in second cell.
 */
export default function parse(element, { document }) {
  // Extract all article cards
  const articleCards = element.querySelectorAll('a.article-card, a.card-link');

  const cells = [];

  articleCards.forEach((card) => {
    // Cell 1: Image
    const img = card.querySelector('.article-card-image img.cover-image, .article-card-image img, img');
    const imageCell = img ? [img] : [];

    // Cell 2: Text content (tag, date, heading, link)
    const textCell = [];

    // Category tag
    const tag = card.querySelector('.article-card-meta .tag, span.tag');
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textCell.push(tagP);
    }

    // Date
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date.textContent.trim();
      textCell.push(dateP);
    }

    // Heading
    const heading = card.querySelector('h3.h4-heading, h3, h4');
    if (heading) textCell.push(heading);

    // Preserve the card link
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Read more';
      link.append(a);
      textCell.push(link);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
