/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Removes non-authorable content from the page DOM.
 * Selectors from captured DOM of https://wknd-trendsetters.site
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content (selectors from captured DOM)
    // - a.skip-link: "Skip to main content" accessibility link
    // - .navbar: Main site navigation bar
    // - footer.inverse-footer: Site footer with social links and nav columns
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      'footer.inverse-footer',
    ]);
  }
}
