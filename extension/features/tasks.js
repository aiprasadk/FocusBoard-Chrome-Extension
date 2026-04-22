function initTasks() {
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const taskCount = document.getElementById('task-count');
  const taskCategory = document.getElementById('task-category');
  
  let tasks = [];
  let activeCategory = 'All';

  chrome.storage.local.get(['tasks'], (result) => {
    tasks = result.tasks || [];
    renderTasks();
  });
  
  document.addEventListener('categoryChanged', (e) => {
    activeCategory = e.detail;
    renderTasks();
  });
  
  function saveTasks() {
    chrome.storage.local.set({ tasks: tasks }, () => {
      renderTasks();
    });
  }
  
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = taskInput.value.trim();
      const cat = taskCategory ? taskCategory.value : 'Work';
      if (text) {
        const newTask = {
          id: Date.now().toString(),
          text: text,
          done: false,
          category: cat,
          createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        taskInput.value = '';
        saveTasks();
      }
    }
  });
  
  function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (activeCategory !== 'All') {
      filteredTasks = tasks.filter(t => t.category === activeCategory);
    }
    
    if (filteredTasks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'task-empty';
      emptyState.textContent = 'No tasks found.';
      taskList.appendChild(emptyState);
      updateCount();
      return;
    }
    
    // Sort tasks: unfinished tasks top, finished tasks bottom
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (a.done === b.done) return 0; // preserve original order amongst same state
      return a.done ? 1 : -1;
    });
    
    sortedTasks.forEach(task => {
      const item = document.createElement('div');
      item.className = `task-item ${task.done ? 'done' : ''}`;
      
      const content = document.createElement('div');
      content.className = 'task-content';
      content.addEventListener('click', () => {
        task.done = !task.done;
        saveTasks();
      });
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('click', (e) => e.stopPropagation());
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        saveTasks();
        if (task.done && typeof logEvent === 'function') {
          logEvent('task_completed', { taskText: task.text, category: task.category });
        }
      });
      
      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;
      
      const catBadge = document.createElement('span');
      catBadge.className = 'task-badge';
      catBadge.textContent = task.category || 'Work';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'task-delete';
      deleteBtn.textContent = '×';
      deleteBtn.setAttribute('aria-label', 'Delete Task');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
      });
      
      content.appendChild(checkbox);
      content.appendChild(textSpan);
      content.appendChild(catBadge);
      item.appendChild(content);
      item.appendChild(deleteBtn);
      taskList.appendChild(item);
    });
    
    updateCount();
  }
  
  function updateCount() {
    const doneCount = tasks.filter(t => t.done).length;
    taskCount.textContent = `${doneCount}/${tasks.length} done`;
  }
}

