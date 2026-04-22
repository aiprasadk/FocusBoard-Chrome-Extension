const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Health'];

function initCategories() {
  const filterContainer = document.getElementById('category-filters');
  const categorySelect = document.getElementById('task-category');
  if (!filterContainer || !categorySelect) return;

  chrome.storage.local.get(['categories'], (res) => {
    const cats = res.categories || DEFAULT_CATEGORIES;
    renderChips(cats, filterContainer);
    renderSelect(cats, categorySelect);
  });
}

function renderChips(cats, container) {
  container.innerHTML = '';
  
  const allChip = document.createElement('span');
  allChip.className = 'category-chip active';
  allChip.textContent = 'All';
  allChip.dataset.cat = 'All';
  allChip.addEventListener('click', () => selectChip(allChip));
  container.appendChild(allChip);

  cats.forEach(cat => {
    const chip = document.createElement('span');
    chip.className = 'category-chip';
    chip.textContent = cat;
    chip.dataset.cat = cat;
    chip.addEventListener('click', () => selectChip(chip));
    container.appendChild(chip);
  });
}

function renderSelect(cats, selectEl) {
  selectEl.innerHTML = '';
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selectEl.appendChild(opt);
  });
}

function selectChip(selectedChip) {
  document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
  selectedChip.classList.add('active');
  const event = new CustomEvent('categoryChanged', { detail: selectedChip.dataset.cat });
  document.dispatchEvent(event);
}
