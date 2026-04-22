function initStreak() {
  renderStreak();
}

function updateStreak() {
  const today = new Date().toLocaleDateString('en-CA');
  
  chrome.storage.local.get(['focusStreak'], (res) => {
    let streak = res.focusStreak || { current: 0, longest: 0, lastDate: null };
    
    if (streak.lastDate === today) {
      // Already updated today
      return;
    }
    
    // Check if lastDate was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');
    
    if (streak.lastDate === yesterdayStr) {
      // Increment
      streak.current += 1;
    } else {
      // Reset
      streak.current = 1;
    }
    
    if (streak.current > streak.longest) {
      streak.longest = streak.current;
    }
    
    streak.lastDate = today;
    
    chrome.storage.local.set({ focusStreak: streak }, () => {
      renderStreak();
    });
  });
}

function renderStreak() {
  const streakEl = document.getElementById('streak-display');
  if (!streakEl) return;
  
  chrome.storage.local.get(['focusStreak'], (res) => {
    const streak = res.focusStreak || { current: 0, longest: 0, lastDate: null };
    const today = new Date().toLocaleDateString('en-CA');
    
    // If last set date is older than yesterday, current streak is actually 0 for display purposes
    let displayCurrent = streak.current;
    if (streak.lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA');
      
      if (streak.lastDate !== today && streak.lastDate !== yesterdayStr) {
        displayCurrent = 0;
      }
    } else {
      displayCurrent = 0;
    }

    streakEl.textContent = `🔥 ${displayCurrent} Day Streak`;
  });
}
