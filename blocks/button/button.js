function buildButton(buttonMap) {
	if (buttonMap.size === 0) return '';
	return `<button class="button" ${formatHtmlAttributes(buttonMap.get('attributes'))}>
				${buttonMap.get('content')}
			</button>`;
}

function formatHtmlAttributes(attributes) {
	let htmlAttributes = '';
	attributes.forEach((value, key) => {
		htmlAttributes += `${key}="${value}" `;
	});
	return htmlAttributes;
}

/**
 * checks if the content is bold for secondary style; or bold & italicized for tertiary style.
 * otherwise, it is considered a primary style button
 * @param buttonContent
 * @returns {buttonStyle: string}
 */
function getButtonStyle(buttonContent) {
	let buttonStyle = 'primary';
	const bold = buttonContent.includes('<strong>');
	const italic = buttonContent.includes('<em>');
	const boldItalic = bold && italic;
	buttonStyle = boldItalic ? 'accent' : bold ? 'secondary' : 'primary';
	return buttonStyle;
}

/**
 * Dedicated Button Block for EDS
 * Row 1 of the block contains the button content
 * Row 2 and so forth contains the button attributes.
 * @param block
 */
export default function decorate(block) {
	const domParser = new DOMParser();
	let buttonMap = new Map();
	let buttonAttributes = new Map();

	[...block.children].forEach((row) => {
		// check if it is the first row, and if so, extract the button content
		if (row.children.length === 1 && row.querySelector('p')) {
			const content = row.querySelector('p') ? row.querySelector('p').innerHTML : '';
			const buttonStyle = getButtonStyle(content);
			buttonMap.set('content', content);
			buttonMap.set('style', buttonStyle);
		}
		// if not first row, extract button attributes and the associated value from the next child
		else if (row.children.length === 2) {
			const buttonAttribute = row.children[0].textContent.trim().toLowerCase();
			const buttonAttributeValue = row.children[1].textContent.trim();
			buttonAttributes.set(buttonAttribute, buttonAttributeValue);
			buttonMap.set('attributes', buttonAttributes);
		}
	});

	// parse text to html for button
	const buttonEle = domParser.parseFromString(buildButton(buttonMap), 'text/html').body.firstChild;
	buttonEle.classList.add(`${buttonMap.get('style')}`);
	block.replaceChildren(buttonEle);
}
