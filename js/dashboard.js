/* ============================================================
   dashboard.js — Dashboard Render Logic
   University of San Agustin Student Portal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Fix column span for courses container
  // A tiny custom js helper to handle the responsive col-span since we might not have a tailwind JIT equivalent for lg:col-span-2 on standard class setup
  const coursesCol = document.getElementById('dash-courses-col');
  const resizeHandler = () => {
    if (window.innerWidth >= 1024) {
      coursesCol.style.gridColumn = 'span 2';
    } else {
      coursesCol.style.gridColumn = 'span 1';
    }
  };
  window.addEventListener('resize', resizeHandler);
  resizeHandler();

  // Set greeting name
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : { name: 'Monkey D. Luffy' };
  const firstName = user.name.split(' ')[0] || user.name;
  document.getElementById('greeting-title').innerHTML = `Good morning, ${firstName}! 👋`;

  // Set today's date
  const todayDateEl = document.getElementById('today-date');
  if (todayDateEl) {
    const today = new Date().toLocaleDateString("en-PH", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    todayDateEl.textContent = today;
  }

  // --- Enrolled Courses Rendering ---
  const coursesList = document.getElementById('dash-courses-list');
  const enrolledCourses = [
    { id: 1, code: "CS 223", name: "Human-Computer Interaction", units: 3, schedule: "MWF 9:00-10:00 AM", room: "Room 302" },
    { id: 2, code: "CS 221", name: "Object Oriented Programming", units: 3, schedule: "TTH 10:30-12:00 PM", room: "Room 210" },
    { id: 3, code: "GE 8", name: "Ethics", units: 2, schedule: "MWF 2:00-4:00 PM", room: "Room 067" }
  ];

  /* 
   * Known Constraint:
   * Course id:2 name is "Object Oriented Programming" on Dashboard/Courses but "Data Structures 2" on Grades — intentional mock data mismatch 
   * Dashboard shows "8 of 21 allowed" units but Courses enforces max 20 — intentional mock mismatch
   */

  if (coursesList) {
    coursesList.innerHTML = enrolledCourses.map(course => `
      <div class="course-card" role="listitem">
        <div class="icon-container lg" style="background: var(--color-pink); color: var(--color-deep-pink);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div class="course-info">
          <div class="course-code-name">${course.code} – ${course.name}</div>
          <div class="course-meta">
            <span class="course-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${course.schedule}
            </span>
            <span class="course-meta-item">
              <span>📍</span>
              ${course.room}
            </span>
          </div>
        </div>
        <div class="badge badge-pink">${course.units} units</div>
      </div>
    `).join('');
  }


  // --- Announcements Rendering ---
  const announcementsList = document.getElementById('dash-announcements-list');
  const announcements = [
    { id: 1, type: "info", title: "Enrollment for 2nd Semester is now open", date: "Mar 10, 2026", body: "Please settle any outstanding balances before proceeding with dropping or adding subjects..." },
    { id: 3, type: "success", title: "Tuition payment received", date: "Mar 5, 2026", body: "Your recent payment of ₱15,500 has been successfully posted to your account." }
  ];

  const renderAnnouncement = (ann) => {
    let icon = '';
    let badge = '';
    
    if (ann.type === 'info') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
      badge = `<span class="badge badge-blue">Info</span>`;
    } else if (ann.type === 'success') {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      badge = `<span class="badge badge-success">Confirmed</span>`;
    } else {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-warn"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
      badge = `<span class="badge badge-warning">Action Needed</span>`;
    }

    return `
      <div class="announcement-card ${ann.type}" role="listitem">
        <div class="announcement-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${icon}
            <span class="announcement-title">${ann.title}</span>
          </div>
          ${badge}
        </div>
        <div class="announcement-date mt-1">${ann.date}</div>
        <div class="announcement-body">${ann.body}</div>
      </div>
    `;
  };

  if (announcementsList) {
    announcementsList.innerHTML = announcements.map(renderAnnouncement).join('');
  }

});
