/* ============================================================
   grades.js — Accordion Logic and GPA Calculation
   University of San Agustin Student Portal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const openSemesters = new Set([0]);

  // Dashboard hardcodes GPA "1.50" but Grades computes dynamically — intentional mock mismatch.
  const semesters = [
    {
      name: "1st Semester, AY 2025-2026",
      courses: [
        { subject: "CS 223 Human-Computer Interaction", units: 3, prelim: 1.50, midterm: 1.50, finals: null, finalGrade: null },
        { subject: "CS 221 Data Structures 2", units: 3, prelim: 1.75, midterm: 1.50, finals: null, finalGrade: null },
        { subject: "CS 210 Algorithms", units: 3, prelim: 1.75, midterm: 1.75, finals: null, finalGrade: null },
        { subject: "GE 8 Ethics", units: 2, prelim: 1.25, midterm: 1.50, finals: null, finalGrade: null }
      ]
    },
    {
      name: "2nd Semester, AY 2024-2025",
      courses: [
        { subject: "CS 200 Computer Organization", units: 3, prelim: 1.50, midterm: 1.50, finals: 1.50, finalGrade: 1.50 },
        { subject: "CS 201 Operating Systems", units: 3, prelim: 1.75, midterm: 1.75, finals: 1.75, finalGrade: 1.75 },
        { subject: "Math 101 College Algebra", units: 3, prelim: 1.50, midterm: 1.75, finals: 1.75, finalGrade: 1.75 },
        { subject: "GE 101 Purposive Communication", units: 3, prelim: 1.25, midterm: 1.50, finals: 1.50, finalGrade: 1.50 },
        { subject: "PE 102 Physical Fitness", units: 2, prelim: 1.00, midterm: 1.00, finals: 1.00, finalGrade: 1.00 }
      ]
    },
    {
      name: "1st Semester, AY 2024-2025",
      courses: [
        { subject: "CS 100 Introduction to Computing", units: 3, prelim: 1.25, midterm: 1.25, finals: 1.25, finalGrade: 1.25 },
        { subject: "CS 101 Computer Programming 1", units: 3, prelim: 1.50, midterm: 1.50, finals: 1.50, finalGrade: 1.50 },
        { subject: "Math 100 Basic Mathematics", units: 3, prelim: 2.00, midterm: 2.00, finals: 2.00, finalGrade: 2.00 },
        { subject: "GE 100 Understanding the Self", units: 3, prelim: 1.75, midterm: 1.75, finals: 1.75, finalGrade: 1.75 }
      ]
    }
  ];

  const gradeToColor = (grade) => {
    if (grade === null) return 'badge-gray';
    if (grade <= 1.25) return 'badge-success';
    if (grade <= 1.75) return 'badge-blue';
    if (grade <= 2.25) return 'badge-warning';
    if (grade <= 3.0) return 'badge-error';
    return 'badge-gray';
  };

  const gradeToLabel = (grade) => {
    if (grade === null) return 'Not yet posted';
    if (grade === 1.0) return 'Excellent';
    if (grade <= 1.25) return 'Very Good';
    if (grade <= 1.5) return 'Good';
    if (grade <= 1.75) return 'Above Average';
    if (grade <= 2.0) return 'Average';
    if (grade <= 2.25) return 'Below Average';
    if (grade <= 2.5) return 'Fair';
    if (grade <= 3.0) return 'Passing';
    return 'Failed';
  };

  const formatGrade = (grade) => {
    if (grade === null) return '&mdash;';
    return Number(grade).toFixed(2);
  };

  const computeSemesterGwa = (semester) => {
    const finals = semester.courses.filter((course) => course.finalGrade !== null);
    if (finals.length === 0) {
      return null;
    }

    const points = finals.reduce((sum, course) => sum + (course.units * course.finalGrade), 0);
    const units = finals.reduce((sum, course) => sum + course.units, 0);
    return units === 0 ? null : points / units;
  };

  const accordionContainer = document.getElementById('grades-accordion');

  const render = () => {
    const completedCourses = semesters
      .flatMap((semester) => semester.courses)
      .filter((course) => course.finalGrade !== null);

    const cumulativeUnits = completedCourses.reduce((sum, course) => sum + course.units, 0);
    const cumulativePoints = completedCourses.reduce((sum, course) => sum + (course.units * course.finalGrade), 0);
    const cumulativeGwa = cumulativeUnits > 0 ? (cumulativePoints / cumulativeUnits) : null;

    const currentMidterms = semesters[0].courses
      .filter((course) => course.midterm !== null)
      .map((course) => course.midterm);

    const currentMidtermAvg = currentMidterms.length > 0
      ? currentMidterms.reduce((sum, grade) => sum + grade, 0) / currentMidterms.length
      : null;

    document.getElementById('cumulative-gpa').textContent = cumulativeGwa === null ? '--' : cumulativeGwa.toFixed(2);
    document.getElementById('current-midterm').textContent = currentMidtermAvg === null ? '--' : currentMidtermAvg.toFixed(2);
    document.getElementById('total-credits').textContent = String(cumulativeUnits);

    accordionContainer.innerHTML = semesters.map((semester, index) => {
      const panelId = `grades-panel-${index}`;
      const btnId = `grades-toggle-${index}`;
      const semesterUnits = semester.courses.reduce((sum, course) => sum + course.units, 0);
      const semesterGwa = computeSemesterGwa(semester);
      const subjectCount = semester.courses.length;
      const isOpen = openSemesters.has(index);

      const rowsHtml = semester.courses.map((course) => {
        const remarksClass = gradeToColor(course.finalGrade);
        const remarksLabel = gradeToLabel(course.finalGrade);

        return `
      <tr>
        <td class="font-semibold" style="min-width: 220px;">${course.subject}</td>
        <td>${course.units}</td>
        <td>${formatGrade(course.prelim)}</td>
        <td>${formatGrade(course.midterm)}</td>
        <td>${formatGrade(course.finals)}</td>
        <td>${formatGrade(course.finalGrade)}</td>
        <td>
          <span class="grade-pill ${remarksClass}">${remarksLabel}</span>
        </td>
      </tr>
    `;
      }).join('');

      return `
      <div class="accordion-item">
        <button id="${btnId}" class="accordion-btn" aria-expanded="${isOpen}" aria-controls="${panelId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-accent); flex-shrink: 0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          <div style="flex: 1; text-align: left;">
            <div class="text-nav font-bold" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span>${semester.name}</span>
              ${index === 0 ? '<span class="badge badge-blue">Current</span>' : ''}
            </div>
            <div class="text-xs text-muted mt-1">${subjectCount} subjects • ${semesterUnits} units</div>
          </div>
          <span class="badge ${semesterGwa === null ? 'badge-gray' : gradeToColor(semesterGwa)}" style="margin-right: 0.5rem;">
            ${semesterGwa === null ? 'GWA N/A' : `GWA ${semesterGwa.toFixed(2)}`}
          </span>
          <svg class="accordion-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div id="${panelId}" class="accordion-panel ${isOpen ? 'open' : ''}" role="region" aria-labelledby="${btnId}">
          <div style="padding: 0; overflow-x: auto;">
            <table class="grades-table">
              <thead>
                <tr>
                  <th scope="col">Subject</th>
                  <th scope="col">Units</th>
                  <th scope="col">Prelim</th>
                  <th scope="col">Midterm</th>
                  <th scope="col">Finals</th>
                  <th scope="col">Final Grade</th>
                  <th scope="col">Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    }).join('');

    accordionContainer.querySelectorAll('.accordion-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (openSemesters.has(idx)) {
          openSemesters.delete(idx);
        } else {
          openSemesters.add(idx);
        }
        render();
      });
    });
  };

  render();
});
