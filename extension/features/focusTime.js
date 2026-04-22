function initFocusTime() {
  const display = document.getElementById('focus-time-display');
  if (!display) return;
  
  function renderTime() {
    const today = new Date().toLocaleDateString('en-CA');
    chrome.storage.local.get(['focusTime', 'focusSessionStart'], (res) => {
      let totalSecs = 0;
      if (res.focusTime && res.focusTime[today]) {
        totalSecs += res.focusTime[today];
      }
      
      if (res.focusSessionStart) {
        totalSecs += Math.max(0, Math.floor((Date.now() - res.focusSessionStart) / 1000));
      }
      
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      
      if (hours > 0) {
        display.textContent = `Focused today: ${hours}h ${minutes}m`;
      } else {
        display.textContent = `Focused today: ${minutes}m`;
      }
    });
  }
  
  renderTime();
  setInterval(renderTime, 60000);
}
