function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  chrome.storage.local.get(['theme'], (res) => {
    const currentTheme = res.theme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.value = currentTheme;
  });

  themeToggle.addEventListener('change', (e) => {
    const newTheme = e.target.value;
    document.documentElement.setAttribute('data-theme', newTheme);
    chrome.storage.local.set({ theme: newTheme });
  });

  // Listen for changes from other tabs
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.theme) {
      document.documentElement.setAttribute('data-theme', changes.theme.newValue);
      themeToggle.value = changes.theme.newValue;
    }
  });
}
