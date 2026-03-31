/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-testimonial
 * Base block: tabs
 * Source: https://wknd-trendsetters.site
 * Selector: .tabs-wrapper
 * Structure: Tabs block with 2 columns. Each row: tab label (cell 1) | tab content (cell 2).
 * Tab labels from .tab-menu-link buttons, tab content from .tab-pane panels.
 */
export default function parse(element, { document }) {
  // Extract tab panes (found: .tab-pane inside .tabs-content)
  const panes = element.querySelectorAll('.tab-pane, .tabs-content > div');

  // Extract tab buttons for labels (found: .tab-menu-link buttons)
  const tabButtons = element.querySelectorAll('.tab-menu-link, .tab-menu button');

  const cells = [];

  panes.forEach((pane, i) => {
    // Tab label: person name from the tab button
    let label = '';
    if (tabButtons[i]) {
      const nameEl = tabButtons[i].querySelector('strong, .paragraph-sm strong');
      label = nameEl ? nameEl.textContent.trim() : tabButtons[i].textContent.trim();
    }

    // Tab content: image + name + title + quote from the pane
    const contentContainer = document.createElement('div');

    // Image (found: .grid-layout > div:first-child img.cover-image)
    const img = pane.querySelector('.grid-layout > div:first-child img, img.cover-image');
    if (img) contentContainer.appendChild(img);

    // Person name (found: .paragraph-xl strong)
    const name = pane.querySelector('.paragraph-xl strong, .paragraph-xl.utility-margin-bottom-0 strong');
    if (name) {
      const nameP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = name.textContent;
      nameP.appendChild(strong);
      contentContainer.appendChild(nameP);
    }

    // Title/role (found: div after the name div, plain text)
    const nameContainer = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameContainer) {
      const titleEl = nameContainer.parentElement ? nameContainer.parentElement.querySelector(':scope > div:not(.paragraph-xl)') : null;
      if (titleEl) {
        const titleP = document.createElement('p');
        titleP.textContent = titleEl.textContent.trim();
        contentContainer.appendChild(titleP);
      }
    }

    // Quote (found: p.paragraph-xl - the testimonial text)
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) contentContainer.appendChild(quote);

    cells.push([label, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
