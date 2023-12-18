function saveTask() {
    const taskId = document.getElementById('taskIdDropdown').value;
    const headline = document.getElementById('headline').value;
    const dueDate = document.getElementById('dueDate').value;
    const progress = document.getElementById('progress').value;
    const description = document.getElementById('description').value;
    const order = document.getElementById('order').value;

    if (taskId) {
      // If taskId is present, update existing task
      fetch(`/updateTask/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, headline, dueDate, progress, description, order }),
      })
      .then(response => response.text())
      .then(message => {
        alert(message);
        loadTasksDropdown();
      })
      .catch(error => console.error('Error:', error));
    } else {
      // If taskId is not present, save a new task
      fetch('/saveTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline, dueDate, progress, description, order}),
      })
      .then(response => response.text())
      .then(message => {
        alert(message);
        document.getElementById('taskForm').reset();
        loadTasksDropdown();
      })
      .catch(error => console.error('Error:', error));
    }
  }

  function loadTasksDropdown() {
    const taskIdDropdown = document.getElementById('taskIdDropdown');
    taskIdDropdown.innerHTML = '<option value="">Select a task to load</option>';

    fetch('/loadTasks')
      .then(response => response.json())
      .then(tasks => {
        tasks.forEach(task => {
          const option = document.createElement('option');
          option.value = task.taskId;
          option.innerText = task.headline;
          taskIdDropdown.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  function loadTask() {
    const selectedTaskId = document.getElementById('taskIdDropdown').value;

    if (selectedTaskId) {
      fetch(`/tasks/${selectedTaskId}.json`)
        .then(response => response.json())
        .then(task => {
          document.getElementById('headline').value = task.headline;
          document.getElementById('dueDate').value = task.dueDate;
          document.getElementById('progress').value = task.progress;
          document.getElementById('progress-number').innerText = `${task.progress}%`;
          document.getElementById('description').value = task.description;
          document.getElementById('order').value = task.order;
        })
        .catch(error => console.error('Error:', error));
    }
  }

  var progress = document.getElementById('progress')
  progress.addEventListener("input", function() {
    document.getElementById('progress-number').innerText = `${progress.value}%`;
  });

  document.addEventListener("DOMContentLoaded", function() {
    loadTasksDropdown(); // Initial loading of tasks in the dropdown
  });