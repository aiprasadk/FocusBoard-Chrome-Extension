# FocusBoard v2 – Complete Product Requirements Document

### Chrome Extension (Manifest V3)

---

# 1. Product Overview

FocusBoard is a Chrome extension that replaces the new tab with a productivity dashboard.
This version extends the base product with **Assignments 1–9**, transforming it into a:

👉 Habit-forming
👉 Data-driven
👉 Fully automated productivity system

Base features (from original PRD):

* Wallpaper + clock + greeting
* Daily focus prompt
* Task list
* Focus mode blocker

Extended features (Assignments 1–9):


1. Daily Motivational Quote
2. Focus Streak Counter
3. Dark/Light Mode
4. Pomodoro Timer
5. Wallpaper Rotation
6. Task Categories
7. Focus Mode Schedule
8. Focus Time KPI
9. Analytics Dashboard

---

# 2. Architecture Overview

## 2.1 Folder Structure

```
focusboard/
├── manifest.json
├── newtab.html
├── analytics.html
├── background.js
├── storage.js
├── features/
│   ├── focus.js
│   ├── tasks.js
│   ├── quotes.js
│   ├── streak.js
│   ├── theme.js
│   ├── pomodoro.js
│   ├── wallpaper.js
│   ├── categories.js
│   ├── schedule.js
│   ├── focusTime.js
│   └── analytics.js
```

---

# 3. Data Schema (Unified)

```json
{
  "userName": "string",
  "dailyFocus": { "text": "string", "date": "YYYY-MM-DD" },

  "tasks": [
    { "id": "string", "text": "string", "done": false, "category": "string" }
  ],

  "categories": [
    { "name": "Work", "color": "#FF5733" }
  ],

  "quotes": ["string"],

  "focusStreak": {
    "current": 0,
    "longest": 0,
    "lastDate": "YYYY-MM-DD"
  },

  "theme": "dark",
  
  "pomodoro": {
    "state": "idle",
    "remaining": 1500,
    "lastUpdated": 0
  },

  "wallpapers": ["base64"],
  "rotationMode": "daily",

  "focusModeEnabled": false,

  "focusSchedule": [
    { "start": "09:00", "end": "12:00" }
  ],

  "focusTime": {
    "date": "YYYY-MM-DD",
    "totalSeconds": 0,
    "lastStart": null
  },

  "events": []
}
```

---

# 4. FEATURE SPECIFICATIONS (ASSIGNMENTS 1–9)

---

## 4.1 Assignment 1: Daily Motivational Quote

### Goal

Display one quote per day below the focus message.

### Logic

* Same quote for full day
* Changes next day

```
index = day_of_year % quotes.length
```

### UI

* Positioned below focus text
* Smaller italic text

### Success Criteria

* Quote visible
* Changes daily
* Layout remains clean

---

## 4.2 Assignment 2: Focus Streak Counter

### Goal

Track consecutive days user sets focus

### Logic

* If yesterday had focus → increment
* Else → reset

### UI

`🔥 5 Day Streak`

### Edge Case

* Missing a day resets streak

---

## 4.3 Assignment 3: Dark / Light Mode

### Goal

Toggle theme instantly

### Implementation

* CSS variables
* Stored in `theme`

### UI

* Toggle in settings

### Success

* No reload required
* Persists across sessions

---

## 4.4 Assignment 4: Pomodoro Timer

### Goal

25/5 focus timer

### Features

* Start / Pause / Reset
* Auto switch
* Notification on completion

### Logic

* Use timestamps (NOT just setInterval)
* Recalculate on reload

### UI

* Separate widget (right or bottom panel)

---

## 4.5 Assignment 5: Wallpaper Rotation

### Goal

Multiple wallpapers

### Modes

* Daily
* Every tab
* Random

### Constraints

* Max 5–10 images

### UI

* Gallery in settings

---

## 4.6 Assignment 6: Task Categories

### Goal

Add categories + filters

### Features

* Default categories
* Custom categories
* Filter chips

### UI

* Colored tags on tasks

---

## 4.7 Assignment 7: Focus Mode Schedule

### Goal

Auto-enable focus mode

### Implementation

* `chrome.alarms`

### Logic

* Enable at start time
* Disable at end time

### Edge Case

* Manual override behavior

---

## 4.8 Assignment 8: Daily Focus Time KPI

### Goal

Track total focus time

### Display

`Focused today: 2h 45m`

### Logic

* Accumulate across sessions
* Reset daily

### Key Challenge

* Accurate tracking in background

---

## 4.9 Assignment 9: Analytics Dashboard

### Goal

Visualize usage

### Events

* Task completed
* Focus set
* Focus mode toggle
* Blocked site attempt

### UI

* Charts (Chart.js)
* Separate page

### Metrics

* Weekly tasks
* Focus time
* Streak history

---

# 5. PHASED BUILD PLAN (CRITICAL)

---

## Phase 1 – Core Foundation

* New tab UI
* Clock + greeting
* Focus input

---

## Phase 2 – Core Productivity

* Task list
* Focus mode blocking

---

## Phase 3 – Easy Assignments

* Quotes
* Streak
* Theme

---

## Phase 4 – Medium Features

* Pomodoro
* Wallpaper rotation
* Categories

---

## Phase 5 – Automation

* Focus schedule

---

## Phase 6 – Hard Features

* Focus KPI
* Event tracking

---

## Phase 7 – Analytics

* Charts
* Dashboard view

---

## Phase 8 – Polish

* Animations
* Accessibility
* Performance

---

# 6. Testing Checklist

* Daily reset works
* Streak logic correct
* Timer persists
* Focus mode blocks correctly
* Analytics accurate

---

# 7. Final Outcome

FocusBoard evolves into:

👉 Habit System
👉 Time Tracker
👉 Focus Enforcer
👉 Personal Analytics Tool

---

# END OF PRD
