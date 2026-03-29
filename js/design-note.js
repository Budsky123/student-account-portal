/* ============================================================
   design-note.js — Inline Design Annotations
   University of San Agustin Student Portal
   ============================================================ */

/**
 * Helper to generate a DesignNote badge HTML string
 * @param {string} label - The text label (e.g. "H1: System Status")
 * @param {'heuristic'|'wcag'|'consistency'} type - The type of note
 * @returns {string} HTML string for the design note element
 */
function createDesignNote(label, type = 'heuristic') {
  if (type === 'heuristic') {
    return '';
  }

  // Map type to classes
  const typeClass = `design-note-${type}`;
  
  // Map type to emoji
  let emoji = '📌';
  if (type === 'wcag') emoji = '♿';
  else if (type === 'consistency') emoji = '🎨';

  return `
    <span class="design-note ${typeClass}">
      <span aria-hidden="true">${emoji}</span> ${label}
    </span>
  `;
}

/**
 * Used to automatically render tags from elements with a specific class or data attribute
 * e.g. <div data-design-note label="H1: System Status" type="heuristic"></div>
 */
document.addEventListener('DOMContentLoaded', () => {
  const noteElements = document.querySelectorAll('[data-design-note]');
  
  noteElements.forEach(el => {
    const label = el.getAttribute('label');
    const type = el.getAttribute('type') || 'heuristic';

    if (type === 'heuristic') {
      el.remove();
      return;
    }
    
    if (label) {
      el.innerHTML = createDesignNote(label, type);
      // Remove wrapper styles to just act as a container
      el.style.display = 'inline-block';
    }
  });
});

// Export globally if needed
window.createDesignNote = createDesignNote;
