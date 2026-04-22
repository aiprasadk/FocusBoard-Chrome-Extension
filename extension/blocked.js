document.addEventListener('DOMContentLoaded', () => {
  const focusEl = document.getElementById('blocked-focus');
  const btn = document.getElementById('go-back-btn');
  const today = new Date().toLocaleDateString('en-CA');

  // Load wallpaper from storage
  chrome.storage.local.get(['wallpaperData', 'dailyFocus'], (res) => {
    if (res.wallpaperData) {
      document.body.style.backgroundImage = `url(${res.wallpaperData})`;
    } else {
      document.body.style.backgroundImage = `url('assets/default-wallpaper.jpg')`;
    }

    if (res.dailyFocus && res.dailyFocus.date === today && res.dailyFocus.text) {
      focusEl.textContent = res.dailyFocus.text;
    } else {
      focusEl.textContent = "Stay focused. You turned on Focus Mode for a reason.";
    }
  });

  chrome.storage.local.get(['eventLogs'], (res) => {
    const logs = res.eventLogs || [];
    logs.push({
      type: 'blocked_site_attempt',
      metadata: { url: window.location.href, time: new Date().toLocaleTimeString() },
      timestamp: new Date().toISOString()
    });
    if (logs.length > 1000) logs.shift();
    chrome.storage.local.set({ eventLogs: logs });
  });

  document.getElementById('go-back-btn').addEventListener('click', () => {
    chrome.tabs.update({ url: 'chrome://newtab/' });
  });
});
