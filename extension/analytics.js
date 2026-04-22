document.addEventListener('DOMContentLoaded', () => {
  // Apply theme and wallpaper
  chrome.storage.local.get(['theme', 'wallpapers', 'wallpaperData', 'rotationMode'], (res) => {
    if (res.theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    }
    
    let wallpapers = res.wallpapers || [];
    if (wallpapers.length === 0 && res.wallpaperData) wallpapers = [res.wallpaperData];
    
    if (wallpapers.length > 0) {
      let index = parseInt(sessionStorage.getItem('lastWallpaperIdx') || '0');
      if (index >= wallpapers.length) index = 0;
      document.body.style.backgroundImage = `url(${wallpapers[index]})`;
    }
  });

  document.getElementById('back-to-board').addEventListener('click', () => {
    window.location.href = 'newtab.html';
  });

  // Generate Data for Charts
  chrome.storage.local.get(['eventLogs', 'focusTime'], (res) => {
    const logs = res.eventLogs || [];
    const focusTime = res.focusTime || {};

    renderTasksChart(logs);
    renderFocusChart(focusTime);
    renderTimeline(logs);
  });
});

function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString('en-CA'));
  }
  return dates;
}

function renderTasksChart(logs) {
  const ctx = document.getElementById('tasksChart').getContext('2d');
  const days = getLast7Days();
  const data = new Array(7).fill(0);

  logs.forEach(log => {
    if (log.type === 'task_completed') {
      const logDate = new Date(log.timestamp).toLocaleDateString('en-CA');
      const idx = days.indexOf(logDate);
      if (idx !== -1) data[idx]++;
    }
  });

  const isLight = document.body.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#222' : '#fff';
  const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days.map(d => d.slice(5)), // MM-DD
      datasets: [{
        label: 'Tasks Completed',
        data: data,
        backgroundColor: 'rgba(0, 163, 255, 0.7)',
        borderColor: '#00a3ff',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor, stepSize: 1 } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderFocusChart(focusTime) {
  const ctx = document.getElementById('focusChart').getContext('2d');
  const days = getLast7Days();
  const data = days.map(d => {
    const secs = focusTime[d] || 0;
    return (secs / 60).toFixed(1); // minutes
  });

  const isLight = document.body.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#222' : '#fff';
  const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days.map(d => d.slice(5)),
      datasets: [{
        label: 'Focus Minutes',
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderTimeline(logs) {
  const container = document.getElementById('events-timeline');
  container.innerHTML = '';
  
  if (logs.length === 0) {
    container.innerHTML = '<div style="opacity: 0.5;">No events recorded yet.</div>';
    return;
  }

  // Show last 50 events reversed
  const recentLogs = [...logs].reverse().slice(0, 50);

  recentLogs.forEach(log => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    const timeStr = new Date(log.timestamp).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    const timeEl = document.createElement('div');
    timeEl.className = 'timeline-time';
    timeEl.textContent = timeStr;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'timeline-content';
    
    let text = '';
    switch(log.type) {
      case 'task_completed':
        text = `Completed task: "${log.metadata.taskText}"`;
        item.style.borderLeftColor = '#4CAF50';
        break;
      case 'focus_set':
        text = `Set daily focus: "${log.metadata.text}"`;
        item.style.borderLeftColor = '#FFC107';
        break;
      case 'focus_mode_toggled':
        text = `Focus mode toggled ${log.metadata.enabled ? 'ON' : 'OFF'}`;
        item.style.borderLeftColor = log.metadata.enabled ? '#00a3ff' : '#9E9E9E';
        break;
      case 'blocked_site_attempt':
        text = `Blocked attempt to access: ${log.metadata.url}`;
        item.style.borderLeftColor = '#F44336';
        break;
      default:
        text = `Event: ${log.type}`;
    }
    contentEl.textContent = text;
    
    item.appendChild(timeEl);
    item.appendChild(contentEl);
    container.appendChild(item);
  });
}
