# FocusBoard v2 - Atomic Task Breakdown

This document provides a detailed, phase-based breakdown of the development tasks for FocusBoard v2 based on the Product Requirements Document (PRD). Dependencies are indicated where applicable.

## Phase 1: Core Foundation (Base Extension)
*Status: Completed*
- [x] **Task 1.1: Setup Manifest and Basic Structure**
  - Create `manifest.json` (Manifest V3).
  - Setup folder structure (HTML, CSS, JS files, `features/` directory).
- [x] **Task 1.2: New Tab UI Layout**
  - Implement basic `newtab.html` and `newtab.css`.
  - Add default wallpaper styling.
- [x] **Task 1.3: Clock & Greeting Component**
  - Create JS logic to fetch current time and display it.
  - Implement dynamic greeting based on time of day.
- [x] **Task 1.4: Main Focus Input**
  - Add input field for the user's daily focus.
  - Persist daily focus object `{ text, date }` to `chrome.storage.local`.

## Phase 2: Core Productivity
*Status: Completed*
- [x] **Task 2.1: Task List Component**
  - Implement task creation, toggle (done/undone), and deletion in `features/tasks.js`.
  - Persist tasks array to `chrome.storage.local`.
- [x] **Task 2.2: Focus Mode Blocker Logic**
  - Implement background script blocking or declarativeNetRequest rules in `background.js`.
  - Create `blocked.html`, `blocked.css`, and `blocked.js` for intercepting blocked pages.

## Phase 3: Easy Assignments
*Status: Completed*
- [x] **Task 3.1: Daily Motivational Quote (Assignment 1)**
  - Define an array of quotes in `features/quotes.js`.
  - Calculate `index = day_of_year % quotes.length`.
  - Display quote below the focus message and ensure it only changes on the next day.
- [x] **Task 3.2: Focus Streak Counter (Assignment 2)**
  - Implement tracking logic in `features/streak.js`.
  - Read `focusStreak` from storage. Check previous day's focus completion; increment or reset streak.
  - Render streak UI (e.g., `🔥 X Day Streak`).
- [x] **Task 3.3: Dark / Light Mode Toggle (Assignment 3)**
  - Add CSS variables for light and dark themes in `newtab.css`.
  - Implement toggle logic in `features/theme.js` to change themes instantly without reloading.
  - Persist `theme` preference in storage.

## Phase 4: Medium Features
*Dependencies: Phase 3*
- [x] **Task 4.1: Pomodoro Timer Widget (Assignment 4)**
  - Build timer UI (Start/Pause/Reset) in `newtab.html`.
  - Implement timer logic in `features/pomodoro.js` using timestamps (`lastUpdated`) for accuracy across reloads.
  - Add chrome notifications on timer completion (25/5 cycle auto-switch).
- [x] **Task 4.2: Task Categories (Assignment 6)**
  - Extend `features/tasks.js` to include `category` tags on tasks.
  - Add default ("Work") and custom category management in `features/categories.js`.
  - Implement UI filter chips for active categories.
- [x] **Task 4.3: Wallpaper Rotation System (Assignment 5)**
  - Implement base64 image fetching and storage array for `wallpapers`.
  - Create settings UI for `rotationMode` (Daily, Every tab, Random).
  - Apply logic in `features/wallpaper.js`.

## Phase 5: Automation
*Status: Completed*
- [x] **Task 5.1: Focus Mode Schedule (Assignment 7)**
  - Build UI for setting `focusSchedule` (Start/End times).
  - Implement `chrome.alarms` in `background.js` to trigger focus mode automatically.
  - Add logic in `features/schedule.js` to handle manual overrides properly.

## Phase 6: Hard Features
*Status: Completed*
- [x] **Task 6.1: Event Tracking Foundation (Assignment 9 - Part 1)**
  - Implement central event logging system for analytics.
  - Log events: Task completed, Focus set, Focus mode toggled, Blocked site attempt.
  - Store event logs array locally.
- [x] **Task 6.2: Daily Focus Time KPI (Assignment 8)**
  - Track total focus time across sessions securely in `background.js`.
  - Accumulate `totalSeconds` and store in `focusTime` daily.
  - Display KPI metric (e.g., `Focused today: 2h 45m`) using `features/focusTime.js`.

## Phase 7: Analytics
*Status: Completed*
- [x] **Task 7.1: Analytics Dashboard Layout (Assignment 9 - Part 2)**
  - Create `analytics.html` and link it from the new tab page.
  - Implement the basic layout, UI, and routing.
- [x] **Task 7.2: Data Visualization Integration (Assignment 9 - Part 3)**
  - Add `Chart.js` library to the project.
  - Create charts for weekly tasks, focus time, and streak history using data compiled by `features/analytics.js`.

## Phase 8: Polish & Testing
*Status: Completed*
- [x] **Task 8.1: Animations & UI Polish**
  - Add micro-interactions, hover effects, and smooth transitions for newly added widgets (Pomodoro, Quotes, Analytics).
- [x] **Task 8.2: Accessibility Improvements**
  - Ensure correct contrast ratios, add aria-labels for inputs and buttons, support keyboard navigation.
- [x] **Task 8.3: End-to-End Edge Case Testing**
  - Verify daily resets across midnight (streaks, quotes, focus time).
  - Verify Pomodoro timer persistence and background sync across tab reloads.
  - Confirm background focus schedule accurately triggers alarms.
