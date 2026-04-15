/* ============================================================
   login.js — Login Form Logic
   University of San Agustin Student Portal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const studentIdInput = document.getElementById('studentId');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const submitBtn = document.getElementById('submit-btn');
  const statusContainer = document.getElementById('status-container');
  
  // Create error utility
  const showError = (inputElement, containerId, message) => {
    const container = document.getElementById(containerId);
    inputElement.classList.add('has-error');
    inputElement.classList.remove('has-value');
    inputElement.setAttribute('aria-invalid', 'true');
    
    const errorId = `${inputElement.id}-error`;
    container.innerHTML = `
      <div id="${errorId}" class="input-error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${message}</span>
      </div>
    `;
    
    // Update aria-describedby
    const currentDescribedBy = inputElement.getAttribute('aria-describedby') || '';
    if (!currentDescribedBy.includes(errorId)) {
      inputElement.setAttribute('aria-describedby', `${currentDescribedBy} ${errorId}`.trim());
    }
  };

  const clearError = (inputElement, containerId) => {
    const container = document.getElementById(containerId);
    inputElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');
    if (inputElement.value.trim() !== '') {
      inputElement.classList.add('has-value');
    } else {
      inputElement.classList.remove('has-value');
    }
    container.innerHTML = '';
    
    // Clean up aria-describedby
    const errorId = `${inputElement.id}-error`;
    let currentDescribedBy = inputElement.getAttribute('aria-describedby') || '';
    currentDescribedBy = currentDescribedBy.replace(errorId, '').trim();
    if (currentDescribedBy) {
      inputElement.setAttribute('aria-describedby', currentDescribedBy);
    } else {
      inputElement.removeAttribute('aria-describedby');
    }
  };

  // Toggle Password
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'text') {
      togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      togglePasswordBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
          <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
      `;
    } else {
      togglePasswordBtn.setAttribute('aria-label', 'Show password');
      togglePasswordBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      `;
    }
  });

  // Clear errors on input
  studentIdInput.addEventListener('input', () => {
    clearError(studentIdInput, 'studentId-error-container');
    // For aria-describedby to keep hint
    studentIdInput.setAttribute('aria-describedby', 'studentId-hint');
  });

  passwordInput.addEventListener('input', () => {
    clearError(passwordInput, 'password-error-container');
  });

  const showStatus = (type, message) => {
    statusContainer.classList.remove('hidden');
    if (type === 'loading') {
      statusContainer.innerHTML = `
        <div class="status-loading" role="status">
          <div class="spinner"></div>
          <span>${message}</span>
        </div>
      `;
    } else if (type === 'success') {
      statusContainer.innerHTML = `
        <div class="banner banner-success" role="status">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span class="banner-text">${message}</span>
        </div>
      `;
    } else if (type === 'error') {
      statusContainer.innerHTML = `
        <div class="banner banner-error" role="status">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="banner-text">${message}</span>
        </div>
      `;
    }
  };

  const hideStatus = () => {
    statusContainer.classList.add('hidden');
    statusContainer.innerHTML = '';
  };

  const setFormLoading = (isLoading) => {
    studentIdInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.classList.add('btn-loading');
    } else {
      submitBtn.classList.remove('btn-loading');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError(studentIdInput, 'studentId-error-container');
    clearError(passwordInput, 'password-error-container');
    hideStatus();
    
    let hasError = false;
    const studentId = studentIdInput.value.trim();
    const password = passwordInput.value;

    // Validate Student ID
    if (!studentId) {
      showError(studentIdInput, 'studentId-error-container', 'Please enter your Student ID number.');
      hasError = true;
    } else if (!/^\d{8,10}$/.test(studentId)) {
      showError(studentIdInput, 'studentId-error-container', 'Student ID should be 8-10 digits (e.g., 20210001).');
      hasError = true;
    }

    // Validate Password
    if (!password) {
      showError(passwordInput, 'password-error-container', 'Please enter your password.');
      hasError = true;
    } else if (password.length < 6) {
      showError(passwordInput, 'password-error-container', 'Password must be at least 6 characters.');
      hasError = true;
    }

    if (hasError) return;

    // Simulate API Call
    setFormLoading(true);
    showStatus('loading', 'Signing you in, please wait...');

    setTimeout(() => {
      // Error condition based on design doc
      if (studentId === '00000000' && password === 'wrong') {
        setFormLoading(false);
        showStatus('error', 'Invalid Student ID or password.');
      } else {
        // Success
        showStatus('success', 'Login successful! Redirecting...');
        if (typeof Auth !== 'undefined') {
          Auth.login(studentId, password);
        }
        
        setTimeout(() => {
          window.location.href = 'portal/index.html';
        }, 800);
      }
    }, 1200);
  });
});
