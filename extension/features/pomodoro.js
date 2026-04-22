const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let pomoInterval;

function initPomodoro() {
  const timeDisplay = document.getElementById('pomo-time');
  const modeDisplay = document.getElementById('pomo-mode');
  const startBtn = document.getElementById('pomo-start');
  const pauseBtn = document.getElementById('pomo-pause');
  const resetBtn = document.getElementById('pomo-reset');
  
  if (!timeDisplay) return;

  function loadState(cb) {
    chrome.storage.local.get(['pomodoro'], (res) => {
      let state = res.pomodoro || { state: 'idle', remaining: WORK_TIME, mode: 'work', lastUpdated: Date.now() };
      
      if (state.state === 'running') {
        const now = Date.now();
        const elapsed = Math.floor((now - state.lastUpdated) / 1000);
        state.remaining -= elapsed;
        
        if (state.remaining <= 0) {
          handleCompletion(state);
        } else {
          state.lastUpdated = now;
        }
      }
      cb(state);
    });
  }

  function saveState(state, cb) {
    state.lastUpdated = Date.now();
    chrome.storage.local.set({ pomodoro: state }, () => {
      updateUI(state);
      if (cb) cb();
    });
  }

  function handleCompletion(state) {
    state.state = 'idle';
    if (state.mode === 'work') {
      state.mode = 'break';
      state.remaining = BREAK_TIME;
      notify("Work session complete! Time for a break.");
    } else {
      state.mode = 'work';
      state.remaining = WORK_TIME;
      notify("Break is over! Let's get back to work.");
    }
  }

  function notify(msg) {
    // Only attempt if permissions are granted
    if (chrome.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'FocusBoard Pomodoro',
        message: msg
      });
    }
  }

  function updateUI(state) {
    const m = Math.floor(state.remaining / 60).toString().padStart(2, '0');
    const s = (state.remaining % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${m}:${s}`;
    modeDisplay.textContent = state.mode === 'work' ? 'Focus Session' : 'Break Time';
    
    startBtn.style.display = state.state === 'running' ? 'none' : 'inline-block';
    pauseBtn.style.display = state.state === 'running' ? 'inline-block' : 'none';
  }

  function tick() {
    loadState((state) => {
      if (state.state !== 'running') {
        clearInterval(pomoInterval);
        return;
      }
      state.remaining -= 1;
      if (state.remaining <= 0) {
        handleCompletion(state);
        clearInterval(pomoInterval);
      }
      saveState(state);
    });
  }

  startBtn.addEventListener('click', () => {
    loadState((state) => {
      state.state = 'running';
      saveState(state, () => {
        clearInterval(pomoInterval);
        pomoInterval = setInterval(tick, 1000);
      });
    });
  });

  pauseBtn.addEventListener('click', () => {
    loadState((state) => {
      state.state = 'paused';
      saveState(state);
      clearInterval(pomoInterval);
    });
  });

  resetBtn.addEventListener('click', () => {
    loadState((state) => {
      state.state = 'idle';
      state.remaining = state.mode === 'work' ? WORK_TIME : BREAK_TIME;
      saveState(state);
      clearInterval(pomoInterval);
    });
  });

  // Initial load
  loadState((state) => {
    updateUI(state);
    if (state.state === 'running') {
      pomoInterval = setInterval(tick, 1000);
    }
  });
}
