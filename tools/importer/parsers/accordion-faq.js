/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-faq
 * Base block: accordion
 * Source: https://wknd-trendsetters.site
 * Selector: .faq-list
 * Structure: Accordion block with 2 columns. Each row: question (cell 1) | answer (cell 2).
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details> element (found: details.faq-item)
  const items = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  items.forEach((item) => {
    // Question: text from summary (found: summary.faq-question > span)
    const summarySpan = item.querySelector('summary span, summary.faq-question span');
    const summaryText = item.querySelector('summary, summary.faq-question');
    const question = summarySpan ? summarySpan.textContent.trim() : (summaryText ? summaryText.textContent.trim() : '');

    // Answer: content from .faq-answer (found: .faq-answer p)
    const answerEl = item.querySelector('.faq-answer, div:last-child');
    const answer = answerEl || '';

    cells.push([question, answer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
