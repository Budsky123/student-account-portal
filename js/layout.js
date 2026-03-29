/* ============================================================
   layout.js — Shared Header & Navigation Injection
   University of San Agustin Student Portal
   ============================================================ */

const Layout = {
  init() {
    // The layout container should be present in the HTML: <div id="layout-header"></div>
    const layoutContainer = document.getElementById('layout-header');
    if (!layoutContainer) return;

    this.renderHeader(layoutContainer);
    this.setupEventListeners();
  },

  renderHeader(container) {
    // Current route logic for active state
    // In local file system or standard web server, check pathname
    const path = window.location.pathname;
    
    const isCourses = path.includes('courses.html');
    const isGrades = path.includes('grades.html');
    const isProfile = path.includes('profile.html');
    const isDashboard = path.includes('/portal/index.html') || (!isCourses && !isGrades && !isProfile);

    // Get user info
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : { name: 'Monkey D. Luffy', initial: 'L' };

    // SVGs for icons
    const svgMenu = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    const svgX = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    const svgBell = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
    const svgDashboard = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`;
    const svgBook = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
    const svgGradCap = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a2 2 0 0 1-.019 1.838L12.83 21.45a2 2 0 0 1-3.66 0l-8.571-8.69a2 2 0 0 1-.019-1.838l8.572-8.69a2 2 0 0 1 3.658 0z"/><path d="M14 11.1v4.8"/><path d="M7.7 15.2 6 12l1.7-3.2"/></svg>`;
    const svgUser = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const svgLogOut = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`;
    const svgChevron = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

    const notificationCount = 2;

    const html = `
      <!-- Skip Link -->
      <a class="skip-link" href="#main-content">Skip to main content</a>
      
      <!-- Sticky Header -->
      <header class="site-header" role="banner">
        <div class="header-inner">
          
          <!-- Hamburger -->
          <button id="mobile-menu-btn" class="hamburger" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation menu">
            ${svgMenu}
          </button>
          
          <!-- Branding -->
          <div class="header-brand">
            <span class="header-brand-title">University of San Agustin</span>
            <span class="header-brand-sub sm-block hidden">Student Portal</span>
          </div>
          
          <!-- Desktop Nav -->
          <nav class="nav-desktop" role="navigation" aria-label="Main navigation">
            <a href="index.html" class="nav-link ${isDashboard ? 'active' : ''}">
              ${svgDashboard} Dashboard
            </a>
            <a href="courses.html" class="nav-link ${isCourses ? 'active' : ''}">
              ${svgBook} My Courses
            </a>
            <a href="grades.html" class="nav-link ${isGrades ? 'active' : ''}">
              ${svgGradCap} Grades
            </a>
            <a href="profile.html" class="nav-link ${isProfile ? 'active' : ''}">
              ${svgUser} My Profile
            </a>
          </nav>
          
          <!-- Right Actions -->
          <div class="header-right">
            <button class="icon-btn" aria-label="Notifications - ${notificationCount} unread">
              ${svgBell}
              <span class="notif-badge">${notificationCount}</span>
            </button>
            
            <div class="header-avatar">
              <div class="avatar-circle">${user.initial}</div>
              <span class="avatar-name">${user.name}</span>
            </div>
            
            <button id="logout-btn" class="btn-logout" aria-label="Log out of student portal">
              ${svgLogOut}
              <span class="btn-logout-text">Log Out</span>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Mobile Drawer Overlay -->
      <div id="mobile-overlay" class="mobile-overlay hidden"></div>
      
      <!-- Mobile Drawer -->
      <div id="mobile-nav" class="mobile-drawer hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div class="mobile-drawer-header">
          <span class="mobile-drawer-title">USA Portal</span>
          <button id="mobile-close-btn" class="mobile-close-btn" aria-label="Close navigation menu">
            ${svgX}
          </button>
        </div>
        
        <nav class="mobile-nav-links">
          <a href="index.html" class="mobile-nav-link ${isDashboard ? 'active' : ''}">
            ${svgDashboard} Dashboard <span class="mobile-nav-chevron">${svgChevron}</span>
          </a>
          <a href="courses.html" class="mobile-nav-link ${isCourses ? 'active' : ''}">
            ${svgBook} My Courses <span class="mobile-nav-chevron">${svgChevron}</span>
          </a>
          <a href="grades.html" class="mobile-nav-link ${isGrades ? 'active' : ''}">
            ${svgGradCap} Grades <span class="mobile-nav-chevron">${svgChevron}</span>
          </a>
          <a href="profile.html" class="mobile-nav-link ${isProfile ? 'active' : ''}">
            ${svgUser} My Profile <span class="mobile-nav-chevron">${svgChevron}</span>
          </a>
        </nav>
      </div>
    `;

    container.innerHTML = html;
  },

  setupEventListeners() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-close-btn');
    const overlay = document.getElementById('mobile-overlay');
    const drawer = document.getElementById('mobile-nav');
    const logoutBtn = document.getElementById('logout-btn');

    const openMenu = () => {
      drawer.classList.remove('hidden');
      overlay.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      drawer.classList.add('hidden');
      overlay.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', openMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) {
        closeMenu();
      }
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (typeof Auth !== 'undefined') Auth.logout();
      });
    }
  }
};

// Auto-init if the script is loaded at the end of body or use DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  Layout.init();
});
