/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site
 * Selector: .faq-list
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   .faq-list
 *     > details.faq-item (x4): each contains:
 *       - summary.faq-question > span (question text) + img (icon)
 *       - .faq-answer > p (answer text)
 *
 * Block library target (accordion):
 *   Each row: [Title cell | Content cell]
 *   Title: question text
 *   Content: answer text/paragraphs
 */
export default function parse(element, { document }) {
  // Extract all FAQ items
  const faqItems = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  faqItems.forEach((item) => {
    // Title cell: extract question text from summary span or summary directly
    const questionSpan = item.querySelector('summary.faq-question > span:first-child, summary > span:first-child');
    const summaryEl = item.querySelector('summary');
    const questionText = questionSpan
      ? questionSpan.textContent.trim()
      : (summaryEl ? summaryEl.textContent.trim() : '');

    // Content cell: answer paragraphs
    const answerDiv = item.querySelector('.faq-answer, summary + div');
    const answerParagraphs = answerDiv ? Array.from(answerDiv.querySelectorAll('p')) : [];

    const contentCell = answerParagraphs.length > 0 ? [...answerParagraphs] : [];

    // Use a fresh <p> element with the question text to ensure it survives DOM serialization
    const titleEl = document.createElement('p');
    titleEl.textContent = questionText;

    cells.push([[titleEl], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
