/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Removes non-authorable site chrome (nav, footer, skip link).
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove skip-to-content link (found: <a href="#main-content" class="skip-link">)
    WebImporter.DOMUtils.remove(element, ['.skip-link']);
  }
  if (hookName === H.after) {
    // Remove non-authorable site shell elements (found in captured DOM)
    // .navbar - main navigation bar
    // footer.footer - site footer with logo, social icons, nav columns
    WebImporter.DOMUtils.remove(element, ['.navbar', 'footer.footer', 'footer']);
  }
}
