document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('settings-modal');
  const toggleBtn = document.getElementById('settings-toggle');
  const closeBtn = document.getElementById('settings-close');
  
  const nameInput = document.getElementById('setting-name');
  const formatRadios = document.getElementsByName('clock-format');
  const wallpaperInput = document.getElementById('setting-wallpaper');
  const wallpaperReset = document.getElementById('wallpaper-reset');
  
  const addSiteInput = document.getElementById('add-site-input');
  const addSiteBtn = document.getElementById('add-site-btn');
  const blockedSitesList = document.getElementById('blocked-sites-list');

  const DEFAULT_BLOCKED_SITES = [
    "instagram.com", "facebook.com", "youtube.com", "linkedin.com", "twitter.com", "reddit.com"
  ];

  // Open/Close
  toggleBtn.addEventListener('click', () => {
    loadSettings();
    modal.showModal();
  });
  
  closeBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  // Load Initial settings
  function loadSettings() {
    chrome.storage.local.get(['userName', 'clockFormat', 'blockedSites'], (res) => {
      nameInput.value = res.userName || '';
      const format = res.clockFormat || '12h';
      for (const radio of formatRadios) {
        if (radio.value === format) radio.checked = true;
      }
      
      const sites = res.blockedSites || DEFAULT_BLOCKED_SITES;
      renderSites(sites);
    });
  }

  // Save properties dynamically on change
  nameInput.addEventListener('input', (e) => {
    chrome.storage.local.set({ userName: e.target.value.trim() });
  });

  for (const radio of formatRadios) {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) chrome.storage.local.set({ clockFormat: e.target.value });
    });
  }

  // Blocked Sites handling
  function renderSites(sites) {
    blockedSitesList.innerHTML = '';
    sites.forEach(site => {
      const div = document.createElement('div');
      div.className = 'site-item';
      div.textContent = site;
      
      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn';
      delBtn.textContent = '×';
      delBtn.setAttribute('aria-label', `Remove ${site}`);
      delBtn.addEventListener('click', () => removeSite(site));
      
      div.appendChild(delBtn);
      blockedSitesList.appendChild(div);
    });
  }
  
  function getSites(callback) {
    chrome.storage.local.get(['blockedSites'], (res) => {
      callback(res.blockedSites || DEFAULT_BLOCKED_SITES);
    });
  }

  function removeSite(domain) {
    getSites((sites) => {
      const updated = sites.filter(s => s !== domain);
      chrome.storage.local.set({ blockedSites: updated }, () => renderSites(updated));
    });
  }

  addSiteBtn.addEventListener('click', addSite);
  addSiteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSite();
  });

  function addSite() {
    const raw = addSiteInput.value.trim().toLowerCase();
    if (!raw) return;
    
    let domain = raw.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    if (!domain) return;
    
    getSites((sites) => {
      if (sites.includes(domain)) {
        alert("This site is already in your list");
        return;
      }

      // Automatically requests runtime permission securely before saving
      chrome.permissions.request({
        origins: [`*://*.${domain}/*`]
      }, (granted) => {
        if (granted) {
          sites.push(domain);
          chrome.storage.local.set({ blockedSites: sites }, () => {
            renderSites(sites);
            addSiteInput.value = '';
          });
        }
      });
    });
  }
});
