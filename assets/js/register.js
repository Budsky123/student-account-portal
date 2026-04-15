/* ============================================================
   register.js — Wizard Logic
   University of San Agustin Student Portal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const panels = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
  ];
  const progressFill = document.getElementById('step-fill');
  const progressBar = document.getElementById('step-progress');
  const circles = [
    document.getElementById('circle-1'),
    document.getElementById('circle-2'),
    document.getElementById('circle-3')
  ];
  
  let currentStep = 1;

  // Toggle Password
  const pwInput = document.getElementById('reg-password');
  const pwToggleBtn = document.getElementById('toggle-reg-password');

  pwToggleBtn.addEventListener('click', () => {
    const type = pwInput.getAttribute('type') === 'password' ? 'text' : 'password';
    pwInput.setAttribute('type', type);
    
    if (type === 'text') {
      pwToggleBtn.setAttribute('aria-label', 'Hide password');
      pwToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
          <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
      `;
    } else {
      pwToggleBtn.setAttribute('aria-label', 'Show password');
      pwToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      `;
    }
  });

  // Password Strength live validation
  const reqLen = document.getElementById('req-len');
  const reqUp = document.getElementById('req-up');
  const reqNum = document.getElementById('req-num');

  pwInput.addEventListener('input', () => {
    const val = pwInput.value;
    
    // Length >= 8
    if (val.length >= 8) {
      reqLen.classList.add('met');
      reqLen.querySelector('.pw-dot').classList.add('met');
    } else {
      reqLen.classList.remove('met');
      reqLen.querySelector('.pw-dot').classList.remove('met');
    }
    
    // Uppercase
    if (/[A-Z]/.test(val)) {
      reqUp.classList.add('met');
      reqUp.querySelector('.pw-dot').classList.add('met');
    } else {
      reqUp.classList.remove('met');
      reqUp.querySelector('.pw-dot').classList.remove('met');
    }

    // Number
    if (/\d/.test(val)) {
      reqNum.classList.add('met');
      reqNum.querySelector('.pw-dot').classList.add('met');
    } else {
      reqNum.classList.remove('met');
      reqNum.querySelector('.pw-dot').classList.remove('met');
    }
  });


  // Validation Utilities
  const showError = (inputElement, errorId, message) => {
    inputElement.classList.add('has-error');
    inputElement.classList.remove('has-value');
    inputElement.setAttribute('aria-invalid', 'true');
    
    const container = document.getElementById(errorId);
    container.innerHTML = `
      <div id="${errorId}-msg" class="input-error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${message}</span>
      </div>
    `;
    
    const currentDescribedBy = inputElement.getAttribute('aria-describedby') || '';
    if (!currentDescribedBy.includes(`${errorId}-msg`)) {
      inputElement.setAttribute('aria-describedby', `${currentDescribedBy} ${errorId}-msg`.trim());
    }
  };

  const clearError = (inputElement, errorId) => {
    inputElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');
    if (inputElement.type !== 'checkbox' && inputElement.value.trim() !== '') {
      inputElement.classList.add('has-value');
    }
    document.getElementById(errorId).innerHTML = '';
  };

  // Attach clear on input
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      clearError(input, `${input.id}-err`);
    });
    input.addEventListener('change', () => {
      clearError(input, `${input.id}-err`);
    });
  });

  const validateStep = (step) => {
    let isValid = true;
    
    if (step === 1) {
      const fName = document.getElementById('firstName');
      const lName = document.getElementById('lastName');
      const email = document.getElementById('email');
      const studentId = document.getElementById('studentId');
      
      if (!fName.value.trim()) { showError(fName, 'firstName-err', 'Please enter your first name.'); isValid = false; }
      if (!lName.value.trim()) { showError(lName, 'lastName-err', 'Please enter your last name.'); isValid = false; }
      if (!email.value.trim()) { 
        showError(email, 'email-err', 'Please enter your email address.'); isValid = false; 
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'email-err', 'Enter a valid email (e.g. juan@usa.edu.ph).'); isValid = false;
      }
      if (!studentId.value.trim()) {
        showError(studentId, 'studentId-err', 'Please enter your Student ID.'); isValid = false;
      } else if (!/^\d{8,10}$/.test(studentId.value)) {
        showError(studentId, 'studentId-err', 'Student ID should be 8-10 digits.'); isValid = false;
      }
    } 
    else if (step === 2) {
      const prog = document.getElementById('program');
      const yr = document.getElementById('yearLevel');
      if (!prog.value) { showError(prog, 'program-err', 'Please select your program.'); isValid = false; }
      if (!yr.value) { showError(yr, 'yearLevel-err', 'Please select your year level.'); isValid = false; }
    }
    else if (step === 3) {
      const pw = document.getElementById('reg-password');
      const confirm = document.getElementById('confirmPassword');
      const terms = document.getElementById('agreeTerms');
      
      if (!pw.value) { 
        showError(pw, 'reg-password-err', 'Please create a password.'); isValid = false; 
      } else {
        if (pw.value.length < 8) { showError(pw, 'reg-password-err', 'Password must be at least 8 characters long.'); isValid = false; }
        else if (!/[A-Z]/.test(pw.value)) { showError(pw, 'reg-password-err', 'Include at least one uppercase letter (e.g. A, B, C).'); isValid = false; }
        else if (!/\d/.test(pw.value)) { showError(pw, 'reg-password-err', 'Include at least one number.'); isValid = false; }
      }
      
      if (!confirm.value) {
        showError(confirm, 'confirmPassword-err', 'Please confirm your password.'); isValid = false; 
      } else if (confirm.value !== pw.value) {
        showError(confirm, 'confirmPassword-err', 'Passwords do not match. Please re-enter.'); isValid = false; 
      }
      
      if (!terms.checked) {
        showError(terms, 'agreeTerms-err', 'You must agree to the terms to continue.'); isValid = false;
      }
    }
    
    return isValid;
  };

  const updateUI = () => {
    // Labels
    const stepsLabels = ['Personal Info', 'Academic Info', 'Create Password'];
    progressBar.setAttribute('aria-valuenow', currentStep);
    progressBar.setAttribute('aria-label', `Step ${currentStep} of 3: ${stepsLabels[currentStep-1]}`);
    
    // Width = ((step - 1) / 2) * 100 + 50%
    // In design doc: 1=50%, 2=100%, 3=... actually 1->0%, 2->50%, 3->100% works visually depending on layout.
    // Doc says: width = ((step - 1) / 2) * 100 + 50 percent? 
    // Wait, step1 = 50%, step2 = 100%, step3 = 150? No:
    // If circles are distributed, track filling to circle index.
    // Let's use 0%, 50%, 100%.
    const w = ((currentStep - 1) / 2) * 100;
    progressFill.style.width = `${w}%`;
    
    circles.forEach((c, idx) => {
      const stepNum = idx + 1;
      const label = c.nextElementSibling;
      c.className = 'step-circle';
      label.className = 'step-label';
      c.innerHTML = stepNum;
      
      if (stepNum < currentStep) {
        c.classList.add('done');
        c.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else if (stepNum === currentStep) {
        c.classList.add('active');
        label.classList.add('active');
      }
    });
    
    panels.forEach((p, idx) => {
      if (idx + 1 === currentStep) {
        p.classList.remove('hidden');
        p.classList.add('animate-fade-in');
      } else {
        p.classList.add('hidden');
        p.classList.remove('animate-fade-in');
      }
    });

    // Reset outline on step change focus
    document.getElementById('main-content').focus();
  };

  // Next Buttons
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        updateUI();
      }
    });
  });

  // Prev Buttons
  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep--;
      updateUI();
    });
  });

  // Submit Final
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const btn = document.getElementById('create-btn');
    btn.disabled = true;
    btn.innerHTML = `
      <div class="spinner" style="width: 1rem; height: 1rem; border-width: 2px; border-color: rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite; margin-right: 0.5rem;"></div>
      Creating account...
    `;

    // Simulate API Response
    setTimeout(() => {
      const fName = document.getElementById('firstName').value.trim();
      const email = document.getElementById('email').value.trim();
      
      form.classList.add('hidden');
      progressBar.classList.add('hidden');
      document.getElementById('signin-link-container').classList.add('hidden');
      
      const successData = document.getElementById('success-screen');
      document.getElementById('success-welcome').textContent = `Welcome, ${fName}!`;
      document.getElementById('success-email').textContent = email;
      
      successData.classList.remove('hidden');
      successData.classList.add('animate-scale-in');
      document.getElementById('main-content').focus();
    }, 1500);
  });
});
