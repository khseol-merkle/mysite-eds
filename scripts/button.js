/**
 * Javascript that will handle the render and decoration of the button.
 * Takes code form the script.js and puts it into here.
 */


/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
export function decorateButtons (main) {
	main.querySelectorAll ('p a[href]').forEach ((a)=>{
		a.title = a.title || a.textContent;
		const p = a.closest ('p');
		const text = a.textContent.trim ();
		
		// start of my button changes
		const buttonText = document.createElement ('span');
		buttonText.textContent = text;
		buttonText.className = 'button-text';
		buttonText.setAttribute ('data-animation-text', text);
		// end of the button changes
		
		// quick structural checks
		if (a.querySelector ('img') || p.textContent.trim () !== text) return;
		
		// skip URL display links
		try {
			if (new URL (a.href).href === new URL (text, window.location).href) return;
		} catch { /* continue */
		}
		
		// require authored formatting for buttonization
		const strong = a.closest ('strong');
		const em = a.closest ('em');
		if ( !strong && !em) return;
		
		p.className = 'button-wrapper';
		a.className = 'button';
		if (strong && em) { // high-impact call-to-action
			a.classList.add ('accent');
			const outer = strong.contains (em) ? strong : em;
			outer.replaceWith (a);
		} else if (strong) {
			a.classList.add ('primary');
			strong.replaceWith (a);
		} else {
			a.classList.add ('secondary');
			em.replaceWith (a);
		}
		
		// start of my button change
		a.replaceChildren (buttonText);
		// end of my button change
	});
	
	function doSecondaryAnimation (button) {
	
	}
}


