/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

function moveInstrumentation(from, to) {
	const attributes = [...from.attributes].filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'));
	attributes.forEach((attr) => {
		to.setAttribute(attr.name, attr.value);
		from.removeAttribute(attr.name);
	});
}

function setupObservers() {
	const defined = new Set();

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			// Handle cards: div-to-list conversions
			if (mutation.target.closest('.cards, .cards-gallery, .cards-article')) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType !== Node.ELEMENT_NODE) return;
					// card image replacement
					if (node.nodeName === 'PICTURE') {
						const prev = mutation.previousSibling;
						if (prev && prev.nodeName === 'PICTURE') {
							moveInstrumentation(prev, node);
						}
					}
					// card div-to-li replacement
					if (node.nodeName === 'LI') {
						const divs = mutation.target.querySelectorAll(':scope > div');
						divs.forEach((div) => {
							if (div.dataset.aueResource) {
								moveInstrumentation(div, node);
							}
						});
					}
				});
			}

			// Handle accordion: details element restructuring
			if (mutation.target.closest('.accordion-faq')) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType !== Node.ELEMENT_NODE) return;
					if (node.nodeName === 'DETAILS') {
						const div = [...mutation.target.children].find(
							(el) => el.nodeName === 'DIV' && el.dataset.aueResource,
						);
						if (div) moveInstrumentation(div, node);
					}
				});
			}

			// Handle tabs: panel restructuring
			if (mutation.target.closest('.tabs-testimonial')) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType !== Node.ELEMENT_NODE) return;
					const div = [...mutation.target.children].find(
						(el) => el.nodeName === 'DIV' && el.dataset.aueResource && !defined.has(el),
					);
					if (div) {
						moveInstrumentation(div, node);
						defined.add(node);
					}
				});
			}
		});
	});

	observer.observe(document.querySelector('main'), {
		childList: true,
		subtree: true,
	});
}

function setupUEEventHandlers() {
	// Clear image sources on media content patch
	document.addEventListener('aue:content-patch', (event) => {
		const { detail } = event;
		if (!detail || !detail.name || !detail.name.includes('media_')) return;
		const img = document.querySelector(`[data-aue-prop="${detail.name}"]`);
		if (img) {
			const picture = img.closest('picture');
			if (picture) {
				picture.querySelectorAll('source').forEach((source) => source.remove());
				img.removeAttribute('srcset');
			}
		}
	});

	// Handle UI select for interactive components
	document.addEventListener('aue:ui-select', (event) => {
		const { detail } = event;
		if (!detail || !detail.resource) return;

		const selected = document.querySelector(`[data-aue-resource="${detail.resource}"]`);
		if (!selected) return;

		// Accordion: open selected panel
		const accordion = selected.closest('.accordion-faq');
		if (accordion) {
			accordion.querySelectorAll('details').forEach((d) => {
				d.removeAttribute('open');
			});
			const details = selected.closest('details') || selected.querySelector('details');
			if (details) details.setAttribute('open', '');
		}

		// Tabs: show selected panel
		const tabs = selected.closest('.tabs-testimonial');
		if (tabs) {
			const tabButtons = tabs.querySelectorAll('[role="tab"]');
			const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');
			const index = [...tabPanels].findIndex(
				(panel) => panel.contains(selected) || panel === selected,
			);
			if (index >= 0) {
				tabButtons.forEach((btn, i) => {
					btn.setAttribute('aria-selected', i === index ? 'true' : 'false');
				});
				tabPanels.forEach((panel, i) => {
					panel.setAttribute('aria-hidden', i === index ? 'false' : 'true');
				});
			}
		}
	});
}

export default function init() {
	setupObservers();
	setupUEEventHandlers();
}
