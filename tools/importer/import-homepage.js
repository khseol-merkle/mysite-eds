/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for homepage template
import heroShowcaseParser from './parsers/hero-showcase.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-showcase': heroShowcaseParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template for WKND Trendsetters site',
  urls: [
    'https://wknd-trendsetters.site',
  ],
  blocks: [
    {
      name: 'hero-showcase',
      instances: ['header.section.secondary-section'],
    },
    {
      name: 'columns-article',
      instances: ['main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg'],
    },
    {
      name: 'cards-gallery',
      instances: ['main > section:nth-of-type(2) .grid-layout.desktop-4-column'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['main > section:nth-of-type(4) .grid-layout.desktop-4-column'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'hero-banner',
      instances: ['section.inverse-section .grid-layout.desktop-1-column'],
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
      blocks: ['columns-article'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Photo Gallery',
      selector: 'main > section:nth-of-type(2)',
      style: 'secondary',
      blocks: ['cards-gallery'],
      defaultContent: [
        'main > section:nth-of-type(2) .utility-text-align-center h2',
        'main > section:nth-of-type(2) .utility-text-align-center .paragraph-lg',
      ],
    },
    {
      id: 'section-4',
      name: 'Testimonials',
      selector: 'main > section:nth-of-type(3)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Latest Articles',
      selector: 'main > section:nth-of-type(4)',
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: [
        'main > section:nth-of-type(4) .utility-text-align-center h2',
        'main > section:nth-of-type(4) .utility-text-align-center .paragraph-lg',
      ],
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: 'main > section:nth-of-type(5)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'main > section:nth-of-type(5) .grid-layout > div:first-child h2',
        'main > section:nth-of-type(5) .grid-layout > div:first-child .subheading',
      ],
    },
    {
      id: 'section-7',
      name: 'CTA Banner',
      selector: 'main > section:nth-of-type(6)',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
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

  // Run section transformer in afterTransform only (needs template data for sections)
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
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

    // 1. Execute beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

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
