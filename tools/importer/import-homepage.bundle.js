var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-showcase.js
  function parse(element, { document }) {
    const images = element.querySelectorAll(".grid-layout.grid-gap-xs img.cover-image, .grid-layout.tablet-1-column > div:last-child img.cover-image");
    const heading = element.querySelector("h1.h1-heading, h1, h2");
    const subheading = element.querySelector("p.subheading, .subheading");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, .button-group a"));
    const cells = [];
    if (images.length > 0) {
      cells.push([...images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const image = element.querySelector(":scope > div:first-child img.cover-image, :scope > div:first-child img");
    const heading = element.querySelector("h2.h2-heading, h2");
    const breadcrumbLinks = Array.from(element.querySelectorAll(".breadcrumbs a.text-link, .breadcrumbs a"));
    const authorName = element.querySelector(".utility-text-black, .flex-horizontal .paragraph-sm:not(.utility-text-secondary)");
    const dateSpan = element.querySelector(".utility-margin-top-0-5rem .paragraph-sm.utility-text-secondary");
    const col2 = [];
    if (breadcrumbLinks.length > 0) {
      const breadcrumbContainer = document.createElement("p");
      breadcrumbLinks.forEach((link, i) => {
        if (i > 0) breadcrumbContainer.append(document.createTextNode(" > "));
        breadcrumbContainer.append(link);
      });
      col2.push(breadcrumbContainer);
    }
    if (heading) col2.push(heading);
    if (authorName) {
      const authorP = document.createElement("p");
      authorP.textContent = `By ${authorName.textContent.trim()}`;
      col2.push(authorP);
    }
    if (dateSpan) {
      const dateP = document.createElement("p");
      dateP.textContent = dateSpan.textContent.trim();
      col2.push(dateP);
    }
    const cells = [];
    const col1 = image ? [image] : [];
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const imageContainers = element.querySelectorAll(":scope > div.utility-aspect-1x1, :scope > div");
    const cells = [];
    imageContainers.forEach((container) => {
      const img = container.querySelector("img.cover-image, img");
      if (!img) return;
      const imageCell = [img];
      const textCell = [];
      const altText = img.getAttribute("alt");
      if (altText) {
        const p = document.createElement("p");
        p.textContent = altText;
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = element.querySelectorAll(".tab-pane");
    const tabButtons = element.querySelectorAll("button.tab-menu-link");
    const cells = [];
    tabPanes.forEach((pane, index) => {
      const button = tabButtons[index];
      const labelName = button ? button.querySelector("strong") : null;
      const label = labelName ? labelName.textContent.trim() : `Tab ${index + 1}`;
      const contentCell = [];
      const photo = pane.querySelector(".grid-layout > div:first-child img.cover-image, .grid-layout img");
      if (photo) contentCell.push(photo);
      const name = pane.querySelector(".paragraph-xl strong, .paragraph-xl.utility-margin-bottom-0 strong");
      if (name) {
        const nameEl = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = name.textContent.trim();
        nameEl.append(strong);
        contentCell.push(nameEl);
      }
      const nameContainer = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      const titleEl = nameContainer ? nameContainer.parentElement.querySelector(":scope > div:not(.paragraph-xl)") : null;
      if (titleEl) {
        const titleP = document.createElement("p");
        titleP.textContent = titleEl.textContent.trim();
        contentCell.push(titleP);
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) contentCell.push(quote);
      cells.push([[label], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const articleCards = element.querySelectorAll("a.article-card, a.card-link");
    const cells = [];
    articleCards.forEach((card) => {
      const img = card.querySelector(".article-card-image img.cover-image, .article-card-image img, img");
      const imageCell = img ? [img] : [];
      const textCell = [];
      const tag = card.querySelector(".article-card-meta .tag, span.tag");
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textCell.push(tagP);
      }
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)");
      if (date) {
        const dateP = document.createElement("p");
        dateP.textContent = date.textContent.trim();
        textCell.push(dateP);
      }
      const heading = card.querySelector("h3.h4-heading, h3, h4");
      if (heading) textCell.push(heading);
      const href = card.getAttribute("href");
      if (href) {
        const link = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = "Read more";
        link.append(a);
        textCell.push(link);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = element.querySelectorAll("details.faq-item, details");
    const cells = [];
    faqItems.forEach((item) => {
      const questionSpan = item.querySelector("summary.faq-question > span:first-child, summary > span:first-child");
      const summaryEl = item.querySelector("summary");
      const questionText = questionSpan ? questionSpan.textContent.trim() : summaryEl ? summaryEl.textContent.trim() : "";
      const answerDiv = item.querySelector(".faq-answer, summary + div");
      const answerParagraphs = answerDiv ? Array.from(answerDiv.querySelectorAll("p")) : [];
      const contentCell = answerParagraphs.length > 0 ? [...answerParagraphs] : [];
      const titleEl = document.createElement("p");
      titleEl.textContent = questionText;
      cells.push([[titleEl], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector("img.cover-image, img.utility-overlay, img");
    const heading = element.querySelector("h2.h1-heading, h2, h1");
    const subheading = element.querySelector("p.subheading, .subheading");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, .button-group a"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "footer.inverse-footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        let sectionEl = element.querySelector(section.selector);
        if (!sectionEl && section.blocks && section.blocks.length > 0) {
          const tables = element.querySelectorAll("table");
          for (const table of tables) {
            const headerCell = table.querySelector("tr:first-child th") || table.querySelector("tr:first-child td");
            if (headerCell) {
              const headerText = headerCell.textContent.trim().toLowerCase();
              const headerNormalized = headerText.replace(/\s+/g, "-");
              for (const blockName of section.blocks) {
                if (headerNormalized === blockName || headerText === blockName) {
                  sectionEl = table;
                  break;
                }
              }
            }
            if (sectionEl) break;
          }
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        const isFirst = sections.indexOf(section) === 0;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-showcase": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template for WKND Trendsetters site",
    urls: [
      "https://wknd-trendsetters.site"
    ],
    blocks: [
      {
        name: "hero-showcase",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["main > section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: ["main > section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["main > section:nth-of-type(4) .grid-layout.desktop-4-column"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.inverse-section .grid-layout.desktop-1-column"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-showcase"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Photo Gallery",
        selector: "main > section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: [
          "main > section:nth-of-type(2) .utility-text-align-center h2",
          "main > section:nth-of-type(2) .utility-text-align-center .paragraph-lg"
        ]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "main > section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: "main > section:nth-of-type(4)",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: [
          "main > section:nth-of-type(4) .utility-text-align-center h2",
          "main > section:nth-of-type(4) .utility-text-align-center .paragraph-lg"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "main > section:nth-of-type(5) .grid-layout > div:first-child h2",
          "main > section:nth-of-type(5) .grid-layout > div:first-child .subheading"
        ]
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "main > section:nth-of-type(6)",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
    if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
      try {
        transform2.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Section transformer failed at ${hookName}:`, e);
      }
    }
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
