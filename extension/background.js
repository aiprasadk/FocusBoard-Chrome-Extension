// Core Background Service Worker logic to handle Focus Mode site interceptor.
const DEFAULT_BLOCKED_SITES = [
  "instagram.com", "facebook.com", "youtube.com", "linkedin.com", "twitter.com", "reddit.com"
];

function updateFocusModeRules(enabled) {
  if (!enabled) {
    // Mode OFF: clear all custom dynamic rules
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      const existingRuleIds = rules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: []
      });
    });
    return;
  }

  // Mode ON: Generate and apply rules
  chrome.storage.local.get(['blockedSites'], (res) => {
    const sites = res.blockedSites || DEFAULT_BLOCKED_SITES;
    
    // Clear old rules then add the fresh batch
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingRuleIds = existingRules.map(rule => rule.id);
      
      const newRules = sites.map((domain, index) => ({
        id: index + 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          urlFilter: `*://*.${domain}/*`,
          resourceTypes: ['main_frame']
        }
      }));

      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: newRules
      });
    });
  });
}

// Listen to storage changes for "focusModeEnabled" or modifications to the BlockList while mode is on
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.focusModeEnabled !== undefined) {
      const isEnabled = changes.focusModeEnabled.newValue;
      updateFocusModeRules(isEnabled);
      
      if (isEnabled) {
        chrome.storage.local.set({ focusSessionStart: Date.now() });
      } else {
        chrome.storage.local.get(['focusSessionStart', 'focusTime'], (res) => {
          if (res.focusSessionStart) {
            const elapsedSecs = Math.floor((Date.now() - res.focusSessionStart) / 1000);
            const today = new Date().toLocaleDateString('en-CA');
            const focusTime = res.focusTime || {};
            focusTime[today] = (focusTime[today] || 0) + Math.max(0, elapsedSecs);
            chrome.storage.local.set({ focusTime: focusTime, focusSessionStart: null });
          }
        });
      }
    }
    
    // If the mode is already ON, immediately update the rules.
    if (changes.blockedSites !== undefined) {
      chrome.storage.local.get(['focusModeEnabled'], (r) => {
        if (r.focusModeEnabled) {
          updateFocusModeRules(true);
        }
      });
    }
    
    // Listen for schedule updates to re-trigger check immediately
    if (changes.focusSchedule !== undefined) {
      checkFocusSchedule();
    }
  }
});

// Setup alarm for scheduling
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkSchedule', { periodInMinutes: 1 });
  checkFocusSchedule(); // Check immediately on install
});

chrome.runtime.onStartup.addListener(() => {
  checkFocusSchedule();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkSchedule') {
    checkFocusSchedule();
  }
});

function checkFocusSchedule() {
  chrome.storage.local.get(['focusSchedule', 'lastScheduledState'], (res) => {
    if (!res.focusSchedule || !res.focusSchedule.enabled) return;

    const { start, end } = res.focusSchedule;
    if (!start || !end) return;

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    let shouldBeOn = false;
    if (startMins <= endMins) {
      shouldBeOn = currentMins >= startMins && currentMins < endMins;
    } else {
      // Overnight schedule
      shouldBeOn = currentMins >= startMins || currentMins < endMins;
    }

    const lastState = res.lastScheduledState;
    if (shouldBeOn !== lastState) {
      // Boundary crossed! Trigger the mode
      chrome.storage.local.set({
        focusModeEnabled: shouldBeOn,
        lastScheduledState: shouldBeOn
      });
      
      // Optional notification for automation
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'FocusBoard Schedule',
        message: shouldBeOn ? 'Scheduled Focus Mode turned ON.' : 'Scheduled Focus Mode turned OFF.'
      });
    }
  });
}
