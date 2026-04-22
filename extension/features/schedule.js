function initSchedule() {
  const scheduleEnabled = document.getElementById('schedule-enabled');
  const scheduleTimes = document.getElementById('schedule-times');
  const scheduleStart = document.getElementById('schedule-start');
  const scheduleEnd = document.getElementById('schedule-end');

  if (!scheduleEnabled) return;

  chrome.storage.local.get(['focusSchedule'], (res) => {
    const schedule = res.focusSchedule || { enabled: false, start: '09:00', end: '17:00' };
    
    scheduleEnabled.checked = schedule.enabled;
    scheduleStart.value = schedule.start;
    scheduleEnd.value = schedule.end;
    
    if (schedule.enabled) {
      scheduleTimes.style.display = 'flex';
    }
  });

  function saveSchedule() {
    const payload = {
      enabled: scheduleEnabled.checked,
      start: scheduleStart.value,
      end: scheduleEnd.value
    };
    chrome.storage.local.set({ focusSchedule: payload });
  }

  scheduleEnabled.addEventListener('change', (e) => {
    scheduleTimes.style.display = e.target.checked ? 'flex' : 'none';
    saveSchedule();
  });

  scheduleStart.addEventListener('change', saveSchedule);
  scheduleEnd.addEventListener('change', saveSchedule);
}
