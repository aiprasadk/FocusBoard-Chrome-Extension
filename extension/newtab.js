document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initGreeting();
  initFocus();
  initTasks();
  initFocusModeToggle();
  initWallpaperRotation();
  listenForSettings();
  initQuotes();
  initStreak();
  initTheme();
  initPomodoro();
  initCategories();
  initSchedule();
  initFocusTime();
  
  const analyticsBtn = document.getElementById('analytics-toggle');
  if (analyticsBtn) {
    analyticsBtn.addEventListener('click', () => {
      window.location.href = 'analytics.html';
    });
  }
});

function getCurrentDate() {
  return new Date().toLocaleDateString('en-CA');
}

function initClock() {
  const clockEl = document.getElementById('clock');
  
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    chrome.storage.local.get(['clockFormat'], (res) => {
      const format = res.clockFormat || '12h';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      if (format === '12h') {
        let displayHours = hours % 12;
        displayHours = displayHours ? displayHours : 12;
        clockEl.textContent = `${displayHours}:${minutes} ${ampm}`;
      } else {
        const displayHours = hours < 10 ? '0' + hours : hours;
        clockEl.textContent = `${displayHours}:${minutes}`;
      }
    });
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

function initGreeting() {
  const greetingEl = document.getElementById('greeting');
  
  chrome.storage.local.get(['userName'], (result) => {
    const name = result.userName || 'Prasad';
    const now = new Date();
    const hours = now.getHours();
    let timeOfDay = 'evening';
    
    if (hours >= 5 && hours < 12) {
      timeOfDay = 'morning';
    } else if (hours >= 12 && hours < 17) {
      timeOfDay = 'afternoon';
    } else {
      timeOfDay = 'evening';
    }
    
    greetingEl.textContent = `Good ${timeOfDay}, ${name}`;
  });
}





function listenForSettings() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      if (changes.userName) {
        initGreeting();
      }
    }
  });
}

function initFocusModeToggle() {
  const toggle = document.getElementById('focus-mode-toggle');
  const label = document.getElementById('focus-mode-label');
  const pulse = document.getElementById('focus-pulse');
  const borderIndicator = document.getElementById('focus-indicator');

  chrome.storage.local.get(['focusModeEnabled'], (r) => {
    if(r.focusModeEnabled) {
      toggle.checked = true;
      label.textContent = "Focus Mode: ON";
      label.style.color = "#00a3ff";
      borderIndicator.classList.add('active');
    }
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;

    if (isEnabled) {
      // Show locked in and shockwave
      label.textContent = "Locked In 🔒";
      label.style.color = "#00a3ff";
      
      pulse.classList.remove('active');
      void pulse.offsetWidth; // trigger reflow to reset
      pulse.classList.add('active');
      borderIndicator.classList.add('active');
      
      setTimeout(() => {
        if (toggle.checked) label.textContent = "Focus Mode: ON";
      }, 1500);

    } else {
      label.textContent = "Focus Mode: OFF";
      label.style.color = "#ffffff";
      borderIndicator.classList.remove('active');
      pulse.classList.remove('active');
    }

    chrome.storage.local.set({ focusModeEnabled: isEnabled }, () => {
      if (typeof logEvent === 'function') {
        logEvent('focus_mode_toggled', { enabled: isEnabled, source: 'ui' });
      }
    });
  });
}
