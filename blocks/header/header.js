import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { fetchData, filterData } from '../search/search.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
	if (e.code === 'Escape') {
		const nav = document.getElementById('nav');
		const navSections = nav.querySelector('.nav-sections');
		if (!navSections) return;
		const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
		if (navSectionExpanded && isDesktop.matches) {
			// eslint-disable-next-line no-use-before-define
			toggleAllNavSections(navSections);
			navSectionExpanded.focus();
		} else if (!isDesktop.matches) {
			// eslint-disable-next-line no-use-before-define
			toggleMenu(nav, navSections);
			nav.querySelector('button').focus();
		}
	}
}

function closeOnFocusLost(e) {
	const nav = e.currentTarget;
	if (!nav.contains(e.relatedTarget)) {
		const navSections = nav.querySelector('.nav-sections');
		if (!navSections) return;
		const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
		if (navSectionExpanded && isDesktop.matches) {
			// eslint-disable-next-line no-use-before-define
			toggleAllNavSections(navSections, false);
		} else if (!isDesktop.matches) {
			// eslint-disable-next-line no-use-before-define
			toggleMenu(nav, navSections, false);
		}
	}
}

function openOnKeydown(e) {
	const focused = document.activeElement;
	const isNavDrop = focused.className === 'nav-drop';
	if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
		const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
		// eslint-disable-next-line no-use-before-define
		toggleAllNavSections(focused.closest('.nav-sections'));
		focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
	}
}

function focusNavSection() {
	document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
	if (!sections) return;
	sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
		section.setAttribute('aria-expanded', expanded);
	});
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
	const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
	const button = nav.querySelector('.nav-hamburger button');
	document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
	nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
	toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
	button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
	// enable nav dropdown keyboard accessibility
	if (navSections) {
		const navDrops = navSections.querySelectorAll('.nav-drop');
		if (isDesktop.matches) {
			navDrops.forEach((drop) => {
				if (!drop.hasAttribute('tabindex')) {
					drop.setAttribute('tabindex', 0);
					drop.addEventListener('focus', focusNavSection);
				}
			});
		} else {
			navDrops.forEach((drop) => {
				drop.removeAttribute('tabindex');
				drop.removeEventListener('focus', focusNavSection);
			});
		}
	}

	// enable menu collapse on escape keypress
	if (!expanded || isDesktop.matches) {
		// collapse menu on escape press
		window.addEventListener('keydown', closeOnEscape);
		// collapse menu on focus lost
		nav.addEventListener('focusout', closeOnFocusLost);
	} else {
		window.removeEventListener('keydown', closeOnEscape);
		nav.removeEventListener('focusout', closeOnFocusLost);
	}
}

function createSearchOverlay(navWrapper) {
	const overlay = document.createElement('div');
	overlay.className = 'nav-search-overlay';
	overlay.setAttribute('aria-hidden', 'true');

	const container = document.createElement('div');
	container.className = 'nav-search-container';

	const input = document.createElement('input');
	input.type = 'search';
	input.className = 'nav-search-input';
	input.placeholder = 'Search...';
	input.setAttribute('aria-label', 'Search');

	const results = document.createElement('ul');
	results.className = 'nav-search-results';

	container.append(input, results);
	overlay.append(container);
	navWrapper.append(overlay);

	let debounceTimer;
	input.addEventListener('input', () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			const value = input.value.trim();
			results.innerHTML = '';
			if (value.length < 3) return;

			const terms = value.toLowerCase().split(/\s+/).filter((t) => !!t);
			const data = await fetchData('/query-index.json');
			if (!data) return;

			const filtered = filterData(terms, data, '/');
			if (filtered.length) {
				filtered.slice(0, 8).forEach((item) => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.href = item.path;
					a.textContent = item.title || item.path;
					li.append(a);
					results.append(li);
				});
			} else {
				const li = document.createElement('li');
				li.className = 'no-results';
				li.textContent = 'No results found.';
				results.append(li);
			}
		}, 200);
	});

	input.addEventListener('keyup', (e) => {
		if (e.code === 'Escape') {
			// eslint-disable-next-line no-use-before-define
			closeSearchOverlay(overlay);
		}
	});

	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) {
			// eslint-disable-next-line no-use-before-define
			closeSearchOverlay(overlay);
		}
	});

	return overlay;
}

function openSearchOverlay(overlay) {
	overlay.setAttribute('aria-hidden', 'false');
	const input = overlay.querySelector('.nav-search-input');
	setTimeout(() => input.focus(), 100);
}

function closeSearchOverlay(overlay) {
	overlay.setAttribute('aria-hidden', 'true');
	const input = overlay.querySelector('.nav-search-input');
	input.value = '';
	overlay.querySelector('.nav-search-results').innerHTML = '';
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
	// load nav as fragment
	const navMeta = getMetadata('nav');
	let navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
	// resolve nav relative to content root when served from /content/
	if (!navMeta && window.location.pathname.startsWith('/content/')) {
		navPath = '/content/nav';
	}
	const fragment = await loadFragment(navPath);

	// decorate nav DOM
	block.textContent = '';
	const nav = document.createElement('nav');
	nav.id = 'nav';
	while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

	const classes = ['brand', 'sections', 'tools'];
	classes.forEach((c, i) => {
		const section = nav.children[i];
		if (section) section.classList.add(`nav-${c}`);
	});

	const navBrand = nav.querySelector('.nav-brand');
	const brandLink = navBrand.querySelector('.button');
	if (brandLink) {
		brandLink.className = '';
		brandLink.closest('.button-container').className = '';
	}

	// add logo icon to brand
	if (navBrand) {
		const brandAnchor = navBrand.querySelector('a');
		if (brandAnchor) {
			const logoIcon = document.createElement('span');
			logoIcon.className = 'nav-logo-icon';
			brandAnchor.prepend(logoIcon);
		}
	}

	const navSections = nav.querySelector('.nav-sections');
	if (navSections) {
		navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
			if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
			navSection.addEventListener('click', () => {
				if (isDesktop.matches) {
					const expanded = navSection.getAttribute('aria-expanded') === 'true';
					toggleAllNavSections(navSections);
					navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
				}
			});
		});
	}

	// hamburger for mobile
	const hamburger = document.createElement('div');
	hamburger.classList.add('nav-hamburger');
	hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
	hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
	nav.prepend(hamburger);
	nav.setAttribute('aria-expanded', 'false');
	// prevent mobile nav behavior on window resize
	toggleMenu(nav, navSections, isDesktop.matches);
	isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

	// add search button to nav-tools
	const navTools = nav.querySelector('.nav-tools');
	if (navTools) {
		const searchBtn = document.createElement('button');
		searchBtn.className = 'nav-search-toggle';
		searchBtn.setAttribute('aria-label', 'Search');
		searchBtn.innerHTML = '<span class="icon icon-search"></span>';
		navTools.prepend(searchBtn);
		decorateIcons(navTools);
	}

	const navWrapper = document.createElement('div');
	navWrapper.className = 'nav-wrapper';
	navWrapper.append(nav);

	// create search overlay
	const searchOverlay = createSearchOverlay(navWrapper);
	if (navTools) {
		const searchBtn = navTools.querySelector('.nav-search-toggle');
		searchBtn.addEventListener('click', () => {
			const isOpen = searchOverlay.getAttribute('aria-hidden') === 'false';
			if (isOpen) closeSearchOverlay(searchOverlay);
			else openSearchOverlay(searchOverlay);
		});
	}

	block.append(navWrapper);
}
