/* ============================================================
   course-store.js — Shared Course State (LocalStorage)
   University of San Agustin Student Portal
   ============================================================ */

(() => {
  const STORAGE_KEY = "usa_portal_courses_v1";

  const defaults = {
    maxUnits: 20,
    enrolled: [
      {
        id: 1,
        code: "CS 223",
        name: "Human-Computer Interaction",
        units: 3,
        schedule: "MWF 9:00-10:00 AM",
        room: "Room 302",
        enrolled: 25,
        capacity: 30,
      },
      {
        id: 2,
        code: "CS 221",
        name: "Object Oriented Programming",
        units: 3,
        schedule: "TTH 10:30-12:00 PM",
        room: "Room 210",
        enrolled: 28,
        capacity: 30,
      },
      {
        id: 3,
        code: "GE 8",
        name: "Ethics",
        units: 2,
        schedule: "MWF 2:00-4:00 PM",
        room: "Room 067",
        enrolled: 22,
        capacity: 35,
      },
    ],
    available: [
      {
        id: 10,
        code: "CS 677",
        name: "Operating Systems",
        units: 3,
        schedule: "MWF 8:00-9:00 AM",
        room: "Room 301",
        enrolled: 28,
        capacity: 35,
      },
      {
        id: 11,
        code: "CS 225",
        name: "Database Management",
        units: 3,
        schedule: "TTH 1:00-2:30 PM",
        room: "Room 202",
        enrolled: 30,
        capacity: 35,
      },
      {
        id: 12,
        code: "CS 251",
        name: "Software Engineering",
        units: 3,
        schedule: "MWF 2:00-3:00 PM",
        room: "Room 410",
        enrolled: 20,
        capacity: 30,
      },
      {
        id: 14,
        code: "CS 213",
        name: "Discrete Mathematics",
        units: 3,
        schedule: "MWF 11:00 AM-12:00 PM",
        room: "Room 205",
        enrolled: 30,
        capacity: 30,
      },
    ],
  };

  const normalizeState = (raw) => {
    const safe = raw && typeof raw === "object" ? raw : {};
    const enrolled = Array.isArray(safe.enrolled)
      ? safe.enrolled
      : defaults.enrolled;
    const available = Array.isArray(safe.available)
      ? safe.available
      : defaults.available;
    const maxUnits = Number.isFinite(safe.maxUnits)
      ? safe.maxUnits
      : defaults.maxUnits;

    return { maxUnits, enrolled, available };
  };

  const loadState = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return normalizeState(raw);
    } catch (error) {
      return { ...defaults };
    }
  };

  const saveState = (nextState) => {
    const normalized = normalizeState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const setEnrolled = (enrolled) => saveState({ ...loadState(), enrolled });
  const setAvailable = (available) => saveState({ ...loadState(), available });

  const getState = () => loadState();
  const getMaxUnits = () => loadState().maxUnits;

  const resetDefaults = () => saveState({ ...defaults });

  window.CourseStore = {
    getState,
    saveState,
    setEnrolled,
    setAvailable,
    getMaxUnits,
    resetDefaults,
  };
})();
