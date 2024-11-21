const newTask = document.getElementById('new-task-form');
const newTaskButton = document.getElementById('new-task-button');
const todoBody = document.getElementById('todo-body');
const taskNameInput = document.getElementById('new-task-name');
const taskDoneButton = document.getElementsByClassName('task-button');
const newTaskDate = document.getElementById('new-task-date');
const todaysTasks = document.getElementById('todays-tasks');
const tomorrowsTasks = document.getElementById('tomorrows-tasks');
const date = new Date();
document.addEventListener('DOMContentLoaded', loadTasks);
//for test commit
newTask.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the page from refreshing
    addTask();
});

function addTask() {
    const taskNameInput = document.getElementById('new-task-name');
    const newTaskDate = document.getElementById('new-task-date');
    const todoBody = document.getElementById('todo-body');
    const taskName = taskNameInput.value.trim();
    const taskDate = newTaskDate.value.trim();

    if (!taskName || !taskDate) {
        alert("Please fill out both the task name and date.");
        return;
    }

    const taskNumber = todoBody.querySelectorAll('div.task').length;

    const taskHTML = `
        <div class="task" id="task-${taskNumber}">
            <input type="checkbox" class="task-button" id="task-button-${taskNumber}">
            <div class="task-body">
                <div class="task-name">
                    ${taskName}
                </div>
                <div class="date">
                    ${taskDate}
                </div>
            </div>
            <input type="checkbox" class="task-remove-button" checked="true" id="task-remove-button-${taskNumber}">
        </div>
    `;
    console.log(taskDate);
    if(taskDate === `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`){
        todaysTasks.innerHTML += taskHTML;
    } else {
        tomorrowsTasks.innerHTML += taskHTML;
    }

    saveTasks();
    sortTasks();
    taskNameInput.value = '';
    newTaskDate.value = '';
}

function sortTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Sort tasks by date
    tasks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // Ascending order
    });

    // Save the sorted tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Reload tasks in the DOM
    loadTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        const taskName = task.querySelector('.task-name').innerText;
        const taskDate = task.querySelector('.date').innerText;
        const isChecked = task.querySelector('.task-button').checked;
        const delButton = task.querySelector('.task-remove-button').style.display;
        tasks.push({ name: taskName, date: taskDate, checked: isChecked, display: delButton});
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    todaysTasks.innerHTML = '';
    tomorrowsTasks.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task, index) => {
        const taskHTML = `
            <div class="task" id="task-${index}">
                <input type="checkbox" class="task-button" id="task-button-${index}" ${task.checked ? 'checked' : ''}>
                <div class="task-body">
                    <div class="task-name">
                        ${task.name}
                    </div>
                    <div class="date">
                        ${task.date}
                    </div>
                </div>
                <input type="checkbox" class="task-remove-button" id="task-remove-button-${index}" checked="true" style="display: ${task.display};">
            </div>
        `;
        if(task.date === `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`){
            todaysTasks.innerHTML += taskHTML;
        } else {
            tomorrowsTasks.innerHTML += taskHTML;
        }
    });
}


todoBody.addEventListener('click', function (event) {
    if (event.target.classList.contains('task-button')) {
        completeTask(event);
    }
    if (event.target.classList.contains('task-remove-button')) {
        removeTask(event);
    }
});

function completeTask(event) {
    //const regex = /task-button/;
    //const taskButtonId = event.target.getAttribute('id');
    saveTasks();
}

function removeTask(event) {
    if (!event.target.classList.contains('task-remove-button')) return;
    const taskIndex = event.target.getAttribute('id').replace('task-remove-button-', '');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}