/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site
 * Selector: .tabs-wrapper
 * Generated: 2026-03-25
 *
 * Source DOM structure (from captured HTML):
 *   .tabs-wrapper
 *     > .tabs-content
 *       > .tab-pane#tabpanel-{n} (x4): each contains .grid-layout with:
 *         - div > img.cover-image (person photo)
 *         - div > .paragraph-xl strong (name), div (title), p.paragraph-xl (quote)
 *     > .tab-menu (grid with 4 tab-menu-link buttons)
 *       > button.tab-menu-link#tab-{n}: .avatar img, strong (name), div (title)
 *
 * Block library target (tabs):
 *   Each row: [Tab Label | Tab Content]
 *   Tab Label: person name
 *   Tab Content: image, name, title, quote
 */
export default function parse(element, { document }) {
  // Extract tab panes (content panels)
  const tabPanes = element.querySelectorAll('.tab-pane');
  // Extract tab buttons (labels)
  const tabButtons = element.querySelectorAll('button.tab-menu-link');

  const cells = [];

  tabPanes.forEach((pane, index) => {
    // Tab label from the button
    const button = tabButtons[index];
    const labelName = button ? button.querySelector('strong') : null;
    const label = labelName ? labelName.textContent.trim() : `Tab ${index + 1}`;

    // Tab content: image + name + title + quote
    const contentCell = [];

    // Person photo (large image in the panel)
    const photo = pane.querySelector('.grid-layout > div:first-child img.cover-image, .grid-layout img');
    if (photo) contentCell.push(photo);

    // Person name
    const name = pane.querySelector('.paragraph-xl strong, .paragraph-xl.utility-margin-bottom-0 strong');
    if (name) {
      const nameEl = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = name.textContent.trim();
      nameEl.append(strong);
      contentCell.push(nameEl);
    }

    // Person title/role
    const nameContainer = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    const titleEl = nameContainer ? nameContainer.parentElement.querySelector(':scope > div:not(.paragraph-xl)') : null;
    if (titleEl) {
      const titleP = document.createElement('p');
      titleP.textContent = titleEl.textContent.trim();
      contentCell.push(titleP);
    }

    // Quote
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) contentCell.push(quote);

    cells.push([[label], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
