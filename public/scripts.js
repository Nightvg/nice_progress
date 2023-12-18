function loadTasksProgress() {
    const progressBarHeight = 300; // Height of each progress bar
    const emptyTaskInfo = document.createElement('div');
    emptyTaskInfo.classList.add('task-info');
    var taskProgressContainer = document.getElementById('taskProgressContainer');
    var leftTaskColumn = document.getElementById('leftTaskColumn');
    var progressBarContainer = taskProgressContainer.parentElement;
    var rightTaskColumn = document.getElementById('rightTaskColumn');
    taskProgressContainer.innerHTML = ''; // Clear previous content
    leftTaskColumn.innerHTML = ''; // Clear previous content
    rightTaskColumn.innerHTML = ''; // Clear previous content

    fetch('/loadTasks')
    .then(response => response.json())
    .then(tasks => {
        const totalTasks = tasks.length;

        taskProgressContainer.style.height = `${progressBarHeight*totalTasks}px`; // Set height of progress bar container
        progressBarContainer.style.height = `${progressBarHeight*totalTasks}px`; // Set height of progress bar container
        // Sort tasks by due date and if empty by order
        tasks.sort((a, b) => {
            if (a.dueDate == '' && b.dueDate == '') {
                return a.order - b.order;
            } else if (a.dueDate == '') {
                return 1;
            } else if (b.dueDate == '') {
                return -1;
            } else {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
        });

        tasks.forEach((task, index) => {
        const taskBarContainer = document.createElement('div');
        taskBarContainer.classList.add('task-bar-container', 'd-flex', 'align-items-center');

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress.vertical');
        progressBar.style.width = '50px'; // Maximum width
        progressBar.style.height = '100%';

        const progressBarInner = document.createElement('div');
        progressBarInner.classList.add('progress-bar');
        progressBarInner.style.height = `${task.progress}%`; // Filling the progress bar
        progressBarInner.setAttribute('role', 'progressbar');
        progressBarInner.setAttribute('aria-valuenow', task.progress);
        progressBarInner.setAttribute('aria-valuemin', '0');
        progressBarInner.setAttribute('aria-valuemax', '100');

        // Color the progress bar based on average completion status
        if (task.progress == 100) {
            progressBarInner.classList.add('custom-success');
            // add green checkmark behind task.headline as unicode
            task.headline = task.headline + ' &#9989;';
            console.log('success');
        } else {
            progressBarInner.classList.add('custom-gradient-progress');
        }

        progressBar.appendChild(progressBarInner);
        taskBarContainer.appendChild(progressBar);

        // Check if task is overdue
        if (task.dueDate != '' && new Date(task.dueDate) < new Date()) {
            // add red exclamation mark behind task.headline as unicode
            task.headline = task.headline + ' &#10071;';
            console.log('overdue');
        }

        const taskInfo = document.createElement('div');
        const hr = document.createElement('hr');
        const taskName = document.createElement('div');
        taskName.classList.add('task-name');
        taskName.innerHTML = task.headline;
        taskName.onmouseover = function() {
            // tooltip in bootstrap style if overdue
            if (task.dueDate != '' && new Date(task.dueDate) < new Date()) {
                taskName.setAttribute('data-toggle', 'tooltip');
                taskName.setAttribute('data-placement', 'top');
                taskName.setAttribute('title', 'Overdue!');
            }
        }
        const dueDate = document.createElement('div');
        dueDate.innerHTML = task.dueDate;
        const description = document.createElement('div');
        description.innerHTML = task.description;
        taskInfo.classList.add('task-info');
        
        taskInfo.appendChild(hr);
        taskInfo.appendChild(taskName);
        taskInfo.appendChild(dueDate);
        taskInfo.appendChild(description);

        // Alternate between left and right columns
        if (index % 2 == 0) {
            leftTaskColumn.appendChild(taskInfo);
            rightTaskColumn.appendChild(emptyTaskInfo.cloneNode(true));
        } else {
            taskInfo.style.textAlign = 'right';
            rightTaskColumn.appendChild(taskInfo);
            leftTaskColumn.appendChild(emptyTaskInfo.cloneNode(true));
        }

        taskProgressContainer.appendChild(taskBarContainer);
        });
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    loadTasksProgress(); // Initial loading of task progress bars
});