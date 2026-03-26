/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Reuse existing + new parsers
import heroShowcaseParser from './parsers/hero-showcase.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsTrendParser from './parsers/cards-trend.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-showcase': heroShowcaseParser,
  'cards-gallery': cardsGalleryParser,
  'columns-feature': columnsFeatureParser,
  'cards-trend': cardsTrendParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'fashion-trends',
  description: 'Fashion trends landing page with hero, featured article, trend cards, photo gallery, and CTA',
  urls: [
    'https://wknd-trendsetters.site/fashion-trends-of-the-season',
  ],
  blocks: [
    {
      name: 'hero-showcase',
      instances: ['header.section.secondary-section'],
    },
    {
      name: 'columns-feature',
      instances: ['main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg'],
    },
    {
      name: 'cards-trend',
      instances: ['main > section:nth-of-type(2) .grid-layout.desktop-3-column'],
    },
    {
      name: 'cards-gallery',
      instances: ['main > section:nth-of-type(3) .grid-layout.desktop-3-column'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'header.section.secondary-section',
      style: 'secondary',
      blocks: ['hero-showcase'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: 'main > section:nth-of-type(1)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [
        'main > section:nth-of-type(1) .utility-text-align-center h2',
        'main > section:nth-of-type(1) .utility-text-align-center .paragraph-lg',
      ],
    },
    {
      id: 'section-3',
      name: 'Trend Cards',
      selector: 'main > section:nth-of-type(2)',
      style: 'secondary',
      blocks: ['cards-trend'],
      defaultContent: [
        'main > section:nth-of-type(2) .utility-text-align-center h2',
      ],
    },
    {
      id: 'section-4',
      name: 'Photo Gallery',
      selector: 'main > section:nth-of-type(3)',
      style: null,
      blocks: ['cards-gallery'],
      defaultContent: [
        'main > section:nth-of-type(3) .utility-text-align-center h2',
        'main > section:nth-of-type(3) .utility-text-align-center .paragraph-lg',
      ],
    },
    {
      id: 'section-5',
      name: 'CTA Banner',
      selector: 'main > section:nth-of-type(4)',
      style: 'accent',
      blocks: [],
      defaultContent: [
        'main > section:nth-of-type(4) .utility-text-align-center h2',
        'main > section:nth-of-type(4) .utility-text-align-center .paragraph-lg',
        'main > section:nth-of-type(4) .button-group a.button',
      ],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });

  // Run section transformer in afterTransform only
  if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
    try {
      sectionsTransformer.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Section transformer failed at ${hookName}:`, e);
    }
  }
}

/**
 * Find all blocks on the page based on embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate path under ema-pages folder
    const originalPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const pageName = originalPath.split('/').pop() || 'index';
    const path = `/ema-pages/${pageName}`;

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
