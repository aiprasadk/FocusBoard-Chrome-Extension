function initWallpaperRotation() {
  const rotationSelect = document.getElementById('rotation-mode');
  const wallpaperInput = document.getElementById('setting-wallpaper');
  const gallery = document.getElementById('wallpaper-gallery');
  const resetBtn = document.getElementById('wallpaper-reset');

  if (rotationSelect) {
    chrome.storage.local.get(['rotationMode'], (res) => {
      rotationSelect.value = res.rotationMode || 'tab';
    });
    rotationSelect.addEventListener('change', (e) => {
      chrome.storage.local.set({ rotationMode: e.target.value });
    });
  }

  function renderGallery(wallpapers) {
    if (!gallery) return;
    gallery.innerHTML = '';
    wallpapers.forEach((wp, index) => {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'gallery-item';
      imgWrap.style.backgroundImage = `url(${wp})`;
      
      const delBtn = document.createElement('button');
      delBtn.className = 'gallery-delete';
      delBtn.textContent = '×';
      delBtn.onclick = () => {
        wallpapers.splice(index, 1);
        chrome.storage.local.set({ wallpapers }, () => {
          renderGallery(wallpapers);
          applyWallpaper();
        });
      };
      
      imgWrap.appendChild(delBtn);
      gallery.appendChild(imgWrap);
    });
  }

  if (wallpaperInput) {
    wallpaperInput.addEventListener('change', (e) => {
      chrome.storage.local.get(['wallpapers'], (res) => {
        const wallpapers = res.wallpapers || [];
        if (wallpapers.length >= 10) {
          alert('Maximum 10 wallpapers allowed.');
          return;
        }
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          wallpapers.push(event.target.result);
          chrome.storage.local.set({ wallpapers }, () => {
            renderGallery(wallpapers);
            applyWallpaper();
            wallpaperInput.value = '';
          });
        };
        reader.readAsDataURL(file);
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chrome.storage.local.remove(['wallpapers', 'wallpaperData'], () => {
        if(gallery) gallery.innerHTML = '';
        applyWallpaper();
      });
    });
  }

  chrome.storage.local.get(['wallpapers', 'wallpaperData'], (res) => {
    // Migration: if single wallpaperData exists, add it to wallpapers
    let wps = res.wallpapers || [];
    if (res.wallpaperData && wps.length === 0) {
      wps.push(res.wallpaperData);
      chrome.storage.local.set({ wallpapers: wps });
    }
    renderGallery(wps);
  });
}

function applyWallpaper() {
  chrome.storage.local.get(['wallpapers', 'wallpaperData', 'rotationMode'], (res) => {
    let wallpapers = res.wallpapers || [];
    // Fallback for legacy
    if (wallpapers.length === 0 && res.wallpaperData) {
      wallpapers = [res.wallpaperData];
    }
    
    const mode = res.rotationMode || 'tab';
    
    if (wallpapers.length > 0) {
      let index = 0;
      if (mode === 'daily') {
        const diff = new Date() - new Date(new Date().getFullYear(), 0, 0);
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        index = dayOfYear % wallpapers.length;
      } else if (mode === 'random') {
        index = Math.floor(Math.random() * wallpapers.length);
      } else {
        // tab mode
        let lastIdx = parseInt(sessionStorage.getItem('lastWallpaperIdx') || '-1');
        index = (lastIdx + 1) % wallpapers.length;
        sessionStorage.setItem('lastWallpaperIdx', index.toString());
      }
      document.body.style.backgroundImage = `url(${wallpapers[index]})`;
    } else {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.body.style.backgroundImage = isDark ? `url('assets/dark-wallpaper.jpg')` : `url('assets/light-wallpaper.jpg')`;
    }
  });
}
