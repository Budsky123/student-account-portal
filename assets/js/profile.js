/* ============================================================
   profile.js — Form Logic and Validation
   University of San Agustin Student Portal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // User Profile Population
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : { name: 'Monkey D. Luffy', initial: 'L' };
  
  document.getElementById('profile-disp-name').textContent = user.name;
  document.getElementById('profile-avatar-initial').textContent = user.initial;

  // Validation Utilities
  const showError = (inputElement, errorId, message) => {
    inputElement.classList.add('has-error');
    inputElement.classList.remove('has-value');
    inputElement.setAttribute('aria-invalid', 'true');
    
    const container = document.getElementById(errorId);
    if(container) {
      container.innerHTML = `
        <div id="${errorId}-msg" class="input-error" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${message}</span>
        </div>
      `;
    }
  };

  const clearError = (inputElement, errorId) => {
    inputElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');
    if (inputElement.value.trim() !== '') {
      inputElement.classList.add('has-value');
    }
    const container = document.getElementById(errorId);
    if(container) container.innerHTML = '';
  };

  // Status Banner
  const banner = document.getElementById('status-banner');
  const showBanner = (type, message) => {
    banner.classList.remove('hidden');
    banner.innerHTML = `
      <div class="banner banner-${type}">
        ${type === 'success' 
          ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        }
        <span class="banner-text">${message}</span>
        <button class="banner-dismiss" onclick="this.parentElement.parentElement.classList.add('hidden')" aria-label="Dismiss message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    `;
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto clear after 5s
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 5000);
  };

  // Profile Form
  const profileForm = document.getElementById('profile-form');
  const emailInput = document.getElementById('email');
  const saveProfileBtn = document.getElementById('save-profile-btn');

  profileForm.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      clearError(e.target, `${e.target.id}-err`);
    }
  });

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    if (!emailInput.value.trim()) {
      showError(emailInput, 'email-err', 'Email is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      showError(emailInput, 'email-err', 'Invalid email format.');
      isValid = false;
    }

    if (!isValid) return;

    saveProfileBtn.disabled = true;
    saveProfileBtn.innerHTML = `
      <div class="spinner" style="width: 1rem; height: 1rem; border-width: 2px; border-color: rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; display: inline-block; margin-right: 0.4rem;"></div> Saving...
    `;

    setTimeout(() => {
      saveProfileBtn.disabled = false;
      saveProfileBtn.innerHTML = 'Save Changes';
      showBanner('success', 'Profile information updated successfully.');
    }, 1000);
  });

  // Password Form
  const passwordForm = document.getElementById('password-form');
  const currPwd = document.getElementById('currentPassword');
  const newPwd = document.getElementById('newPassword');
  const confirmPwd = document.getElementById('confirmNewPassword');
  const savePwdBtn = document.getElementById('save-password-btn');

  // Show/Hide Toggles
  document.querySelectorAll('.toggle-pw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      
      if (!isPwd) {
        btn.setAttribute('aria-label', 'Show password');
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
        `;
      } else {
        btn.setAttribute('aria-label', 'Hide password');
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
        `;
      }
    });
  });

  // Strength Indicator
  const reqLen = document.getElementById('req-len');
  const reqUp = document.getElementById('req-up');
  const reqNum = document.getElementById('req-num');

  newPwd.addEventListener('input', () => {
    const val = newPwd.value;
    
    // Length >= 8
    if (val.length >= 8) { reqLen.classList.add('met'); reqLen.querySelector('.pw-dot').classList.add('met'); }
    else { reqLen.classList.remove('met'); reqLen.querySelector('.pw-dot').classList.remove('met'); }
    
    // Uppercase
    if (/[A-Z]/.test(val)) { reqUp.classList.add('met'); reqUp.querySelector('.pw-dot').classList.add('met'); }
    else { reqUp.classList.remove('met'); reqUp.querySelector('.pw-dot').classList.remove('met'); }

    // Number
    if (/\d/.test(val)) { reqNum.classList.add('met'); reqNum.querySelector('.pw-dot').classList.add('met'); }
    else { reqNum.classList.remove('met'); reqNum.querySelector('.pw-dot').classList.remove('met'); }
  });

  passwordForm.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
      clearError(e.target, `${e.target.id}-err`);
    }
  });

  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!currPwd.value) { showError(currPwd, 'currentPassword-err', 'Enter your current password.'); isValid = false; }
    
    if (!newPwd.value) {
      showError(newPwd, 'newPassword-err', 'Enter a new password.'); isValid = false;
    } else {
      if (newPwd.value.length < 8) { showError(newPwd, 'newPassword-err', 'Must be at least 8 characters.'); isValid = false; }
      else if (!/[A-Z]/.test(newPwd.value)) { showError(newPwd, 'newPassword-err', 'Must contain an uppercase letter.'); isValid = false; }
      else if (!/\d/.test(newPwd.value)) { showError(newPwd, 'newPassword-err', 'Must contain a number.'); isValid = false; }
    }

    if (!confirmPwd.value) {
      showError(confirmPwd, 'confirmNewPassword-err', 'Confirm your new password.'); isValid = false;
    } else if (confirmPwd.value !== newPwd.value) {
      showError(confirmPwd, 'confirmNewPassword-err', 'Passwords do not match.'); isValid = false;
    }

    if (!isValid) return;

    savePwdBtn.disabled = true;
    savePwdBtn.innerHTML = `
      <div class="spinner" style="width: 1rem; height: 1rem; border-width: 2px; border-color: rgba(222,41,90,0.3); border-top-color: currentColor; border-radius: 50%; display: inline-block; margin-right: 0.4rem;"></div> Updating...
    `;

    setTimeout(() => {
      savePwdBtn.disabled = false;
      savePwdBtn.innerHTML = 'Update Password';
      
      // Simulate error if current password is wrong
      if (currPwd.value === 'wrong') {
        showError(currPwd, 'currentPassword-err', 'Incorrect current password.');
      } else {
        showBanner('success', 'Your password has been successfully updated.');
        passwordForm.reset();
        ['req-len', 'req-up', 'req-num'].forEach(id => {
          document.getElementById(id).classList.remove('met');
          document.getElementById(id).querySelector('.pw-dot').classList.remove('met');
        });
        currPwd.classList.remove('has-value');
        newPwd.classList.remove('has-value');
        confirmPwd.classList.remove('has-value');
      }
    }, 1200);
  });

});
