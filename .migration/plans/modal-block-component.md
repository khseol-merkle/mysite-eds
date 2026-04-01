# Modal Block Development Plan

## Overview

Create a new **modal** block for AEM Edge Delivery Services that supports link/button-triggered opening, with rich content and video/media playback.

## Design Decisions

- **Trigger**: Link or button click opens the modal (no auto-open)
- **Content**: Supports both rich content (headings, text, images, buttons) and embedded video (YouTube/Vimeo)
- **Pattern**: Self-contained block following existing project conventions (vanilla JS, CSS custom properties, mobile-first responsive)

## Content Model

The modal block table will have:
- **Row 1+**: Rich content (headings, text, images, buttons) — OR — a video link (YouTube/Vimeo URL)
- A link elsewhere on the page with `#modal` hash triggers the modal open

```
+--------+
| Modal  |
+========+
| [content: heading, text, image, video link, buttons] |
+--------+
```

**Trigger mechanism**: Any link on the page whose `href` ends with `#modal-{id}` will open the corresponding modal. The block generates a unique ID from its position.

## Implementation Details

### Files to Create

| File | Purpose |
|------|---------|
| `blocks/modal/modal.js` | Block decoration, open/close logic, video embed handling, focus trap |
| `blocks/modal/modal.css` | Overlay styling, responsive layout, animation, close button |

### JavaScript (`modal.js`)

1. **`decorate(block)`** — default export
   - Hide the block visually (it becomes the modal content)
   - Generate a unique modal ID based on block index
   - Create overlay + dialog wrapper with close button
   - Detect video links (YouTube/Vimeo) and convert to lazy-loaded `<iframe>` on open
   - Register click handler on trigger links (`a[href*="#modal"]`)
   - Implement open/close with body scroll lock
   - Add keyboard support (Escape to close)
   - Trap focus within modal when open
   - Clean up iframe src on close (stop video playback)

2. **Accessibility**
   - `role="dialog"`, `aria-modal="true"`, `aria-label`
   - Focus returns to trigger element on close
   - Focus trap cycles within modal

### CSS (`modal.css`)

1. **Overlay**: Fixed position, semi-transparent background, z-index above page content
2. **Dialog**: Centered, max-width constrained, responsive padding
3. **Close button**: Positioned top-right, accessible hit target
4. **Video container**: 16:9 aspect ratio wrapper for iframes
5. **Animations**: Fade-in overlay, scale-up dialog
6. **Mobile-first**: Full-width on small screens, constrained on desktop (`min-width: 900px`)

### Video Embed Logic

- Detect YouTube URLs (`youtube.com/watch`, `youtu.be`) and Vimeo URLs (`vimeo.com`)
- Convert to embed URLs on modal open
- Remove iframe `src` on close to stop playback
- Responsive 16:9 aspect ratio container

## Checklist

- [ ] Create `blocks/modal/modal.css` with overlay, dialog, close button, video container, and responsive styles
- [ ] Create `blocks/modal/modal.js` with decorate function, open/close logic, video embed support, keyboard/focus trap, and accessibility attributes
- [ ] Create test content HTML file to demonstrate the modal block with both rich content and video variants
- [ ] Verify rendering in local preview (structure, open/close behavior)
- [ ] Run linting (`npm run lint`) and fix any issues

## Example Authored Content

```html
<!-- Trigger link somewhere on the page -->
<p><strong><a href="#modal">Open Modal</a></strong></p>

<!-- Modal block (hidden until triggered) -->
<div class="modal">
  <div>
    <div>
      <h2>Welcome</h2>
      <p>This is modal content with rich text and images.</p>
      <p><strong><a href="/learn-more">Learn More</a></strong></p>
    </div>
  </div>
</div>
```

**Video variant:**
```html
<div class="modal">
  <div>
    <div>
      <a href="https://www.youtube.com/watch?v=example">Watch Video</a>
    </div>
  </div>
</div>
```

## Execution

This plan requires exiting plan mode to implement. The `excat:excat-eds-developer` skill will be used to build the block following AEM Edge Delivery best practices.
