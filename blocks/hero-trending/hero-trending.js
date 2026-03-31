export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Decorate CTA links as buttons in a button group
  const textContent = block.querySelector(':scope > div:last-child');
  if (textContent) {
    const ctaDivs = [...textContent.children].filter((child) => {
      const link = child.querySelector('a');
      return link && child.textContent.trim() === link.textContent.trim();
    });

    if (ctaDivs.length > 0) {
      const group = document.createElement('div');
      group.className = 'hero-trending-buttons';
      ctaDivs.forEach((div, i) => {
        const link = div.querySelector('a');
        link.classList.add('button');
        if (i > 0) link.classList.add('secondary');
        group.append(link);
        div.remove();
      });
      textContent.append(group);
    }
  }
}
