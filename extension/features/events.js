function logEvent(type, metadata = {}) {
  chrome.storage.local.get(['eventLogs'], (res) => {
    const logs = res.eventLogs || [];
    logs.push({
      type,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the last 1000 events to prevent storage limits
    if (logs.length > 1000) {
      logs.shift();
    }
    
    chrome.storage.local.set({ eventLogs: logs });
  });
}

// Attach to window object to ensure it's globally available for inline event calls if necessary
window.logEvent = logEvent;
