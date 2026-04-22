function initFocus() {
  const focusInput = document.getElementById('focus-input');
  const focusDisplay = document.getElementById('focus-display');
  const focusText = document.getElementById('focus-text');
  const focusEdit = document.getElementById('focus-edit');
  
  chrome.storage.local.get(['dailyFocus'], (result) => {
    const dailyFocus = result.dailyFocus;
    const today = getCurrentDate();
    
    if (dailyFocus && dailyFocus.date === today && dailyFocus.text) {
      showFocus(dailyFocus.text);
    } else {
      showInput();
    }
  });
  
  focusInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = focusInput.value.trim();
      if (text) {
        const payload = { text: text, date: getCurrentDate() };
        chrome.storage.local.set({ dailyFocus: payload }, () => {
          showFocus(text);
          if (typeof updateStreak === 'function') updateStreak();
          if (typeof logEvent === 'function') logEvent('focus_set', { text });
        });
      }
    }
  });
  
  focusEdit.addEventListener('click', () => {
    showInput();
  });
  
  function showFocus(text) {
    focusText.textContent = text;
    focusInput.classList.add('hidden');
    focusDisplay.classList.remove('hidden');
  }
  
  function showInput() {
    focusInput.value = focusText.textContent || '';
    focusInput.classList.remove('hidden');
    focusDisplay.classList.add('hidden');
    focusInput.focus();
  }
}
