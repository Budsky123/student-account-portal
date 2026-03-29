/* ============================================================
   courses.js — Add/Drop Logic and Units Tracking
   University of San Agustin Student Portal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let enrolled = [
    { id: 1, code: "CS 223", name: "Human-Computer Interaction", units: 3, schedule: "MWF 9:00-10:00 AM", room: "Room 302", enrolled: 25, capacity: 30 },
    { id: 2, code: "CS 221", name: "Object Oriented Programming", units: 3, schedule: "TTH 10:30-12:00 PM", room: "Room 210", enrolled: 28, capacity: 30 },
    { id: 3, code: "GE 8", name: "Ethics", units: 2, schedule: "MWF 2:00-4:00 PM", room: "Room 067", enrolled: 22, capacity: 35 }
  ];

  let available = [
    { id: 10, code: "CS 677", name: "Operating Systems", units: 3, schedule: "MWF 8:00-9:00 AM", room: "Room 301", enrolled: 28, capacity: 35 },
    { id: 11, code: "CS 225", name: "Database Management", units: 3, schedule: "TTH 1:00-2:30 PM", room: "Room 202", enrolled: 30, capacity: 35 },
    { id: 12, code: "CS 251", name: "Software Engineering", units: 3, schedule: "MWF 2:00-3:00 PM", room: "Room 410", enrolled: 20, capacity: 30 },
    { id: 14, code: "CS 213", name: "Discrete Mathematics", units: 3, schedule: "MWF 11:00 AM-12:00 PM", room: "Room 205", enrolled: 30, capacity: 30 } // Maxed out capacity example
  ];

  let pendingDrop = null;
  let pendingAdd = null;
  let recentlyDropped = null;
  let undoTimeout = null;
  const MAX_UNITS = 20;

  // DOM Elements
  const unitsHeaderBadge = document.getElementById('units-header-badge');
  const unitsText = document.getElementById('units-text');
  const unitsFill = document.getElementById('units-fill');
  const unitsContainer = document.getElementById('units-progress-container');
  const unitsWarningMsg = document.getElementById('units-warning-msg');
  
  const enrolledList = document.getElementById('enrolled-list');
  const availableList = document.getElementById('available-list');
  const emptyState = document.getElementById('empty-enrolled-state');

  const dropModal = document.getElementById('drop-modal');
  const dropCourseName = document.getElementById('drop-course-name');
  const dropCancelBtn = document.getElementById('drop-cancel-btn');
  const dropConfirmBtn = document.getElementById('drop-confirm-btn');

  const addModal = document.getElementById('add-modal');
  const addCourseName = document.getElementById('add-course-name');
  const addNewUnits = document.getElementById('add-new-units');
  const addCancelBtn = document.getElementById('add-cancel-btn');
  const addConfirmBtn = document.getElementById('add-confirm-btn');

  const toastContainer = document.getElementById('toast-container');

  // --- Core Functions ---
  
  const getTotalUnits = () => enrolled.reduce((sum, course) => sum + course.units, 0);

  const updateUnitsUI = () => {
    const total = Math.min(getTotalUnits(), MAX_UNITS); // Clip for UI safety, though logic prevents >20
    unitsHeaderBadge.textContent = `${total} / ${MAX_UNITS} units enrolled`;
    unitsText.textContent = `${total} / ${MAX_UNITS}`;
    unitsContainer.setAttribute('aria-valuenow', total);
    
    const pct = (total / MAX_UNITS) * 100;
    unitsFill.style.width = `${pct}%`;
    
    if (total > 18) {
      unitsFill.classList.add('warning');
    } else {
      unitsFill.classList.remove('warning');
    }

    if (total === MAX_UNITS) {
      unitsWarningMsg.classList.remove('hidden');
    } else {
      unitsWarningMsg.classList.add('hidden');
    }
  };

  const renderLists = () => {
    // 1. Enrolled List
    if (enrolled.length === 0) {
      enrolledList.classList.add('hidden');
      emptyState.classList.remove('hidden');
    } else {
      enrolledList.classList.remove('hidden');
      emptyState.classList.add('hidden');
      
      enrolledList.innerHTML = enrolled.map(c => `
        <div class="course-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div class="icon-container md" style="background: var(--color-pink); color: var(--color-deep-pink);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div class="course-info">
                <div class="course-code-name" style="font-size: 1.1rem;">${c.code} – ${c.name}</div>
                <div class="badge badge-pink mt-2">${c.units} units</div>
              </div>
            </div>
          </div>
          
          <div class="divider" style="margin: 0;"></div>
          
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; width: 100%;">
            <div class="course-meta" style="margin: 0;">
              <span class="course-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${c.schedule}
              </span>
              <span class="course-meta-item"><span>📍</span> ${c.room}</span>
            </div>
            
            <button class="btn btn-secondary sm-text-left" style="width: 100%; max-width: 120px;" onclick="window.triggerDrop(${c.id})">
              Drop
            </button>
          </div>
        </div>
      `).join('');
    }

    // 2. Available List (filter out enrolled)
    const currentUnits = getTotalUnits();
    const enrolledIds = enrolled.map(e => e.id);
    const toRender = available.filter(a => !enrolledIds.includes(a.id));

    availableList.innerHTML = toRender.map(c => {
      const isFull = c.enrolled >= c.capacity;
      const wouldExceed = (currentUnits + c.units) > MAX_UNITS;
      const isDisabled = isFull || wouldExceed;
      
      let badgeLabel = 'Available';
      let badgeClass = 'badge-success';
      if (isFull) { badgeLabel = 'Full'; badgeClass = 'badge-error'; }
      
      return `
        <div class="course-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div class="icon-container md" style="background: var(--color-info-bg); color: var(--color-primary);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div class="course-info">
                <div class="course-code-name" style="font-size: 1.1rem;">${c.code} – ${c.name}</div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.4rem;">
                  <div class="badge badge-blue">${c.units} units</div>
                  <div class="badge ${badgeClass}">${badgeLabel}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="divider" style="margin: 0;"></div>
          
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; width: 100%;">
            <div class="course-meta" style="margin: 0;">
              <span class="course-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${c.schedule}
              </span>
              <span class="course-meta-item"><span>📍</span> ${c.room}</span>
            </div>
            
            <button class="btn btn-primary pointer" style="width: 100%; max-width: 120px;" ${isDisabled ? 'disabled' : ''} onclick="window.triggerAdd(${c.id})">
              Add
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    updateUnitsUI();
  };

  // --- Modals ---
  
  const openModal = (modalEl, autoFocusEl) => {
    modalEl.classList.remove('hidden');
    // Basic a11y focus trick
    setTimeout(() => { if (autoFocusEl) autoFocusEl.focus(); }, 50);
  };
  
  const closeModal = (modalEl) => {
    modalEl.classList.add('hidden');
  };

  // Setup Global Triggers for inline onClick handlers
  window.triggerDrop = (id) => {
    pendingDrop = enrolled.find(c => c.id === id);
    if (!pendingDrop) return;
    
    dropCourseName.textContent = `${pendingDrop.code} – ${pendingDrop.name}`;
    openModal(dropModal, dropCancelBtn);
  };

  window.triggerAdd = (id) => {
    pendingAdd = available.find(c => c.id === id);
    if (!pendingAdd) return;
    
    addCourseName.textContent = `${pendingAdd.code} – ${pendingAdd.name}`;
    addNewUnits.textContent = getTotalUnits() + pendingAdd.units;
    openModal(addModal, addCancelBtn);
  };

  // --- Actions ---

  const showToast = (message, type, withUndo = false) => {
    // Clear existing
    toastContainer.innerHTML = '';
    
    let icon = '';
    if (type === 'success') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }

    const undoHtml = withUndo ? `<button class="toast-undo-btn" onclick="window.undoDrop()">Undo</button>` : '';

    toastContainer.innerHTML = `
      <div class="toast toast-${type}">
        ${icon}
        <span>${message}</span>
        ${undoHtml}
      </div>
    `;

    // Handle Toast Lifetime
    if (undoTimeout) clearTimeout(undoTimeout);
    
    // Auto dismiss after 4s unless it has undo. If undo, we keep it up to 8s, or just 4s standard
    // Design doc: Toast auto dismiss 4s, Undo button appears inside toast for 8s window
    // This implies toast stays for 8s if it has undo.
    const duration = withUndo ? 8000 : 4000;
    undoTimeout = setTimeout(() => {
      toastContainer.innerHTML = '';
      recentlyDropped = null; // Clean up undo state
    }, duration);
  };

  dropConfirmBtn.addEventListener('click', () => {
    if (!pendingDrop) return;
    
    // Move to recently dropped
    recentlyDropped = pendingDrop;
    enrolled = enrolled.filter(c => c.id !== pendingDrop.id);
    pendingDrop = null;
    
    closeModal(dropModal);
    renderLists();
    showToast(`Dropped ${recentlyDropped.code}`, 'success', true);
  });

  addConfirmBtn.addEventListener('click', () => {
    if (!pendingAdd) return;
    
    enrolled.push(pendingAdd);
    const addedCode = pendingAdd.code;
    pendingAdd = null;
    
    closeModal(addModal);
    renderLists();
    showToast(`Successfully enrolled in ${addedCode}`, 'success');
  });

  // Modal Cancels
  dropCancelBtn.addEventListener('click', () => { pendingDrop = null; closeModal(dropModal); });
  addCancelBtn.addEventListener('click', () => { pendingAdd = null; closeModal(addModal); });
  
  // Close on overlay click
  [dropModal, addModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Global Undo Action
  window.undoDrop = () => {
    if (!recentlyDropped) return;
    enrolled.push(recentlyDropped);
    const code = recentlyDropped.code;
    recentlyDropped = null;
    toastContainer.innerHTML = ''; // Hide toast immediately
    renderLists();
    showToast(`Restored ${code}`, 'success');
  };

  // Init
  renderLists();
});
