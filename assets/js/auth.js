/* ============================================================
   auth.js — Authentication simulation
   University of San Agustin Student Portal
   ============================================================ */

const Auth = {
  login(studentId, password) {
    // Simulated login logic
    sessionStorage.setItem('logged_in', 'true');
    sessionStorage.setItem('student_name', 'Monkey D. Luffy');
    sessionStorage.setItem('student_initial', 'L');
  },

  logout() {
    sessionStorage.removeItem('logged_in');
    sessionStorage.removeItem('student_name');
    sessionStorage.removeItem('student_initial');
    
    // Determine path based on current location
    const isPortal = window.location.pathname.includes('/portal/');
    window.location.href = isPortal ? '../index.html' : 'index.html';
  },

  isAuthenticated() {
    return sessionStorage.getItem('logged_in') === 'true';
  },

  requireAuth() {
    if (!this.isAuthenticated()) {
      const isPortal = window.location.pathname.includes('/portal/');
      window.location.href = isPortal ? '../index.html' : 'index.html';
    }
  },

  getUser() {
    return {
      name: sessionStorage.getItem('student_name') || 'Monkey D. Luffy',
      initial: sessionStorage.getItem('student_initial') || 'L'
    };
  }
};

// Make it globally available
window.Auth = Auth;
