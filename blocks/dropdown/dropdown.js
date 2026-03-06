//this is the start of the combobox block

export default function decorate (block) {
	// starters
	const KEY_CODES = {
		ENTER: 13,
		ARROW_UP: 38,
		ARROW_DOWN: 40,
		TAB: 9,
		ESCAPE: 27,
	}
	const uuid = crypto.randomUUID ();
	const DROPDOWN_MAP = new Map ();
	
	let dropdown_options = [];
	
	// iterate each row and build the map
	[...block.children].forEach ((row)=>{
		let mapKey = row.children[0].textContent;
		let mapValue = row.children[1].textContent;
		
		/**
		 * First check to skip blank rows
		 * Second check to see if the key is empty, assume the value is an option
		 * Third check to see if the key is not empty and is called selected, push the value as an option
		 */
		if (mapKey === '' && mapValue === '') {
			return;
		} else if (mapKey === '') {
			
			dropdown_options.push (row.children[1].textContent);
			mapKey = 'option';
			mapValue = dropdown_options;
		} else if (mapKey === 'selected') {
			dropdown_options.push (row.children[1].textContent);
		}
		
		DROPDOWN_MAP.set (mapKey, mapValue);
	});
	
	// build the dropdown
	const dropdown = buildDropdown (DROPDOWN_MAP);
	
	// the end game is to replace the block children with my javscript markup or set the innerhtml
	block.replaceChildren (dropdown);
	
	/**
	 * build the dropdown html
	 * @param DROPDOWN_MAP
	 */
	function buildDropdown (DROPDOWN_MAP) {
		// the encompassing container
		const dropdown = document.createElement ('div');
		dropdown.setAttribute ('class', 'dropdown-block-container');
		
		const dropdown_label = document.createElement ('div');
		dropdown_label.setAttribute ('id', `dropdown-${uuid}`);
		dropdown_label.setAttribute ('class', 'dropdown-label');
		dropdown_label.textContent = DROPDOWN_MAP.get ('name');
		
		const dropdown_combobox = document.createElement ('div');
		dropdown_combobox.setAttribute ('class', 'dropdown-combobox');
		dropdown_combobox.setAttribute ('role', 'combobox');
		dropdown_combobox.setAttribute ('aria-expanded', 'false');
		dropdown_combobox.setAttribute ("aria-labelledby", `${dropdown_label.id}`);
		dropdown_combobox.textContent = DROPDOWN_MAP.get ('label');
		
		const dropdown_options_list = document.createElement ('div');
		dropdown_options_list.setAttribute ("class", "dropdown-options-list");
		dropdown_options_list.setAttribute ("role", "listbox");
		dropdown_options_list.setAttribute ("aria-labelledby", `${dropdown_label.id}`);
		dropdown_options_list.setAttribute ("id", `dropdown-options-list-${uuid}`);
		dropdown_options_list.setAttribute ("tabindex", "-1");
		
		//set the aria-controls
		dropdown_combobox.setAttribute ('aria-controls', `${dropdown_options_list.id}`);
		
		// if the user is setting a default selected item
		let selectedOption = "";
		if (DROPDOWN_MAP.get ('selected')) {
			selectedOption = DROPDOWN_MAP.get ('selected');
		}
		
		//create the options
		DROPDOWN_MAP.get ('option').forEach ((option)=>{
			const isSelected = selectedOption === option ? "true" : "false";
			
			let option_element = document.createElement ('div');
			option_element.setAttribute ('class', 'dropdown-option');
			option_element.setAttribute ('role', 'option');
			option_element.setAttribute ('id', `${uuid}-${option}`);
			option_element.setAttribute ('aria-selected', isSelected);
			option_element.textContent = option;
			dropdown_options_list.append (option_element);
		});
		
		// put the child elements inside the container in the correct order
		dropdown.append (dropdown_label, dropdown_combobox, dropdown_options_list);
		
		// set up the events and controls
		setControls (dropdown_combobox, dropdown_options_list);
		
		return dropdown;
	}
	
	/**
	 * Very Simple Event Handling. ONLY handles click events.
	 * Key events are not supported yet
	 *
	 * @param dropdown_combobox
	 * @param dropdown_options_list
	 */
	function setControls (dropdown_combobox, dropdown_options_list) {
		dropdown_combobox.addEventListener ('click', ()=>{
			dropdown_options_list.classList.toggle ("open");
			dropdown_combobox.setAttribute ('aria-expanded', dropdown_options_list.classList.contains ("open") ? "true" : "false");
		});
		
		const options = dropdown_options_list.querySelectorAll ('.dropdown-option');
		options.forEach ((option)=>{
			option.addEventListener ('click', ()=>{
				dropdown_combobox.textContent = option.textContent;
				dropdown_options_list.classList.remove ("open");
				dropdown_combobox.setAttribute ('aria-expanded', "false");
				const selectedOption = dropdown_options_list.querySelector ('[aria-selected="true"]');
				if (selectedOption) {
					selectedOption.ariaSelected = "false";
				}
				option.ariaSelected = "true";
				console.log ("option selected");
			});
		})
	}
}
