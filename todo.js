const newTask = document.getElementById('new-task-form');
const newTaskButton = document.getElementById('new-task-button');
const todoBody = document.getElementById('todo-body');
const taskNameInput = document.getElementById('new-task-name');
const taskDoneButton = document.getElementsByClassName('task-button');
const newTaskDate = document.getElementById('new-task-date');
const todaysTasks = document.getElementById('todays-tasks');
const tomorrowsTasks = document.getElementById('tomorrows-tasks');
const todoFullscreenButton = document.getElementById('todo-fullscreen-button');
const todoContainer = document.getElementById('todo-container');
const main = document.getElementById('main');
const todoFullscreenIcon = document.getElementById('todo-fullscreen-icon');
const addTaskButton = document.getElementById('add-task-button');
const newTaskForm = document.getElementById('new-task');
const newTaskHeader = document.getElementById('new-task-header');
const newTaskExitButton = document.getElementById('new-task-exit-button');

const date = new Date();
let isTodoFullscreen = false;
todoFullscreenButton.onclick = todoFullscreen;
addTaskButton.onclick = newTaskDisplay;
newTaskExitButton.onclick = newTaskHide;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

let taskDates = [];

document.addEventListener('DOMContentLoaded', loadTasks);

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

    taskDates.push(newTaskDate.value);

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
            <img src="images/recycle-bin.png" class="task-remove-button" id="task-remove-button-${taskNumber}">
        </div>
    `;
    if(taskDate === `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`){
        todaysTasks.innerHTML += taskHTML;
    } else {
        tomorrowsTasks.innerHTML += taskHTML;
    }

    saveTasks();
    sortTasks();
    renderCalendar(currentDate);
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
    localStorage.setItem('taskDates', JSON.stringify(taskDates));
}

function loadTasks() {
    todaysTasks.innerHTML = '';
    tomorrowsTasks.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    taskDates = JSON.parse(localStorage.getItem('taskDates')) || [];

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
                <img src="images/recycle-bin.png" class="task-remove-button" id="task-remove-button-${index}">
            </div>
        `;
        if(task.date <= `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`){
            todaysTasks.innerHTML += taskHTML;
        } else {
            tomorrowsTasks.innerHTML += taskHTML;
        }
    });
}


todoBody.addEventListener('click', function (event) {
    if (event.target.closest('.task-button')) {
        completeTask(event);
    }
    if (event.target.closest('.task-remove-button')) {
        event.preventDefault();
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
    taskDates.splice(taskDates.indexOf(tasks[taskIndex].date), 1);
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskDates', JSON.stringify(taskDates));
    renderCalendar(currentDate);
    loadTasks();
}

function todoFullscreen() {
    if(isTodoFullscreen === false) {
        todoContainer.style.width = "100vw";
        main.style.flexWrap = "wrap";
        infoContainer.style.width = "100vw";
        calendarContainer.style.height = "90vh";
        todoFullscreenIcon.src = "images/exit-fullscreen.svg";
        isTodoFullscreen = true;
    }
    else {
        infoContainer.attributeStyleMap.clear();
        calendarContainer.attributeStyleMap.clear();
        todoContainer.attributeStyleMap.delete('width');
        main.attributeStyleMap.clear();
        todoFullscreenIcon.src = "images/fullscreen.svg";
        isTodoFullscreen = false;
    }
}

newTaskHeader.addEventListener('mousedown', (event) => {
    isDragging = true;
    offsetX = event.clientX - newTaskForm.offsetLeft;
    offsetY = event.clientY - newTaskForm.offsetTop;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;

      // Set new position
      newTaskForm.style.left = `${x}px`;
      newTaskForm.style.top = `${y}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
    }
});

function newTaskDisplay() { 
    newTaskForm.style.display = "inline-block";
}

function newTaskHide() {
    newTaskForm.attributeStyleMap.clear();
}

loadTasks();