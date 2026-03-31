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

  // tools/importer/parsers/hero-trending.js
  function parse(element, { document }) {
    const images = Array.from(element.querySelectorAll(".grid-layout .grid-layout img.cover-image, .grid-layout > div:last-child img"));
    const heading = element.querySelector('h1, h2, [class*="h1-heading"]');
    const description = element.querySelector("p.subheading, p");
    const ctas = Array.from(element.querySelectorAll(".button-group a.button, .button-group a"));
    const cells = [];
    if (images.length > 0) {
      const imageContainer = document.createElement("div");
      images.forEach((img) => imageContainer.appendChild(img));
      cells.push([imageContainer]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-trending", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const cells = [];
    if (columns.length >= 2) {
      const imageCol = columns[0];
      const image = imageCol.querySelector("img.cover-image, img");
      const textCol = columns[1];
      const breadcrumbs = textCol.querySelector(".breadcrumbs");
      const heading = textCol.querySelector('h2, h1, [class*="h2-heading"]');
      const metaContainer = textCol.querySelectorAll(".flex-horizontal");
      const textContent = document.createElement("div");
      if (breadcrumbs) textContent.appendChild(breadcrumbs);
      if (heading) textContent.appendChild(heading);
      metaContainer.forEach((meta) => textContent.appendChild(meta));
      cells.push([image || imageCol, textContent]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(":scope > div");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img.cover-image, img");
      if (img) {
        cells.push([img, ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const panes = element.querySelectorAll(".tab-pane, .tabs-content > div");
    const tabButtons = element.querySelectorAll(".tab-menu-link, .tab-menu button");
    const cells = [];
    panes.forEach((pane, i) => {
      let label = "";
      if (tabButtons[i]) {
        const nameEl = tabButtons[i].querySelector("strong, .paragraph-sm strong");
        label = nameEl ? nameEl.textContent.trim() : tabButtons[i].textContent.trim();
      }
      const contentContainer = document.createElement("div");
      const img = pane.querySelector(".grid-layout > div:first-child img, img.cover-image");
      if (img) contentContainer.appendChild(img);
      const name = pane.querySelector(".paragraph-xl strong, .paragraph-xl.utility-margin-bottom-0 strong");
      if (name) {
        const nameP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = name.textContent;
        nameP.appendChild(strong);
        contentContainer.appendChild(nameP);
      }
      const nameContainer = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameContainer) {
        const titleEl = nameContainer.parentElement ? nameContainer.parentElement.querySelector(":scope > div:not(.paragraph-xl)") : null;
        if (titleEl) {
          const titleP = document.createElement("p");
          titleP.textContent = titleEl.textContent.trim();
          contentContainer.appendChild(titleP);
        }
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) contentContainer.appendChild(quote);
      cells.push([label, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll("a.article-card, a.card-link");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img.cover-image");
      const textContent = document.createElement("div");
      const tag = card.querySelector(".tag, .article-card-meta span:first-child");
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textContent.appendChild(tagP);
      }
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:last-child");
      if (date) {
        const dateP = document.createElement("p");
        dateP.textContent = date.textContent.trim();
        textContent.appendChild(dateP);
      }
      const heading = card.querySelector('h3, [class*="h4-heading"]');
      if (heading) textContent.appendChild(heading);
      const href = card.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = heading ? heading.textContent : "";
        textContent.appendChild(link);
      }
      cells.push([img || "", textContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const items = element.querySelectorAll("details.faq-item, details");
    const cells = [];
    items.forEach((item) => {
      const summarySpan = item.querySelector("summary span, summary.faq-question span");
      const summaryText = item.querySelector("summary, summary.faq-question");
      const question = summarySpan ? summarySpan.textContent.trim() : summaryText ? summaryText.textContent.trim() : "";
      const answerEl = item.querySelector(".faq-answer, div:last-child");
      const answer = answerEl || "";
      cells.push([question, answer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector("img.cover-image.utility-overlay, img.cover-image");
    const contentArea = element.querySelector(".card-body, .utility-text-on-overlay");
    const heading = contentArea ? contentArea.querySelector('h2, h1, [class*="heading"]') : element.querySelector("h2, h1");
    const description = contentArea ? contentArea.querySelector("p.subheading, p") : element.querySelector("p.subheading, p");
    const ctas = contentArea ? Array.from(contentArea.querySelectorAll(".button-group a, a.button, a.inverse-button")) : Array.from(element.querySelectorAll(".button-group a, a.button"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [".navbar", "footer.footer", "footer"]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const template = payload.template || {};
      const sections = template.sections || [];
      if (sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(metaBlock);
          }
        }
        if (section.id !== "section-1") {
          if (sectionEl.previousElementSibling) {
            const hr = document.createElement("hr");
            sectionEl.parentNode.insertBefore(hr, sectionEl);
          }
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-trending": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template with hero and featured content sections",
    urls: [
      "https://wknd-trendsetters.site"
    ],
    blocks: [
      {
        name: "hero-trending",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-article",
        instances: ["main > section:nth-of-type(1) .grid-layout"]
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
        instances: ["main > section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-trending"],
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
        name: "Image Gallery",
        selector: "main > section:nth-of-type(2)",
        style: "secondary",
        blocks: ["cards-gallery"],
        defaultContent: [".utility-text-align-center h2.h2-heading", ".utility-text-align-center p.paragraph-lg"]
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
        defaultContent: [".utility-text-align-center h2.h2-heading", ".utility-text-align-center p.paragraph-lg"]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["h2.h2-heading", "p.subheading"]
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
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
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
