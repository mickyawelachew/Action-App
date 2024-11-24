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
const newTaskDiscription = document.getElementById('new-task-description');

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
    const taskName = taskNameInput.value.trim();
    const taskDate = newTaskDate.value.trim();
    const taskDescription = newTaskDiscription.value.trim();

    taskDates.push(newTaskDate.value);

    if (!taskName || !taskDate) {
        alert("Please fill out both the task name and date.");
        return;
    }

    const taskNumber = todoBody.querySelectorAll('div.task').length;

    const taskHTML = `
        <div class="task" id="task-${taskNumber}">
            <input type="checkbox" class="task-button" id="task-button-${taskNumber}">
            <div class="task-body" id="task-body-${taskNumber}">
                <div class="task-name">
                    ${taskName}
                </div>
                <div class="date">
                    ${taskDate}
                </div>
            </div>
            <img src="images/recycle-bin.png" class="task-remove-button" id="task-remove-button-${taskNumber}">
            <div></div>
            <div class="task-description" id="task-description-${taskNumber}">
                ${taskDescription}
            </div>
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
    newTaskDiscription.value = '';
    newTaskForm.style.display = "none";
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
        const taskDescription = task.querySelector('.task-description').innerText;
        tasks.push({ name: taskName, date: taskDate, checked: isChecked, description: taskDescription});
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
                <div class="task-body" id="task-body-${index}">
                    <div class="task-name">
                        ${task.name}
                    </div>
                    <div class="date">
                        ${task.date}
                    </div>
                </div>
                <img src="images/recycle-bin.png" class="task-remove-button" id="task-remove-button-${index}">
                <div></div>
                <div class="task-description" id="task-description-${index}">
                    ${task.description}
                </div>
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
    if (event.target.closest('.task-body')){
        displayDiscription(event);
    }
});

function displayDiscription(event) {
    const taskIndex = event.target.getAttribute('id').replace('task-body-', '');
    const tempTaskDescription = document.getElementById(`task-description-${taskIndex}`);
    if(tempTaskDescription.style.display == "block") {
        tempTaskDescription.attributeStyleMap.clear();
        event.target.attributeStyleMap.clear();
    } else {
        event.target.style.borderBottomRightRadius = "0px";
        event.target.style.borderBottomLeftRadius = "0px";
        tempTaskDescription.style.display = "block";
    }
    
    
    
}

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
    newTaskDate.value = formattedDate;
    newTaskForm.style.display = "inline-block";
}

function newTaskDisplayFromCalendar(event) {
    console.log(currentDate.getMonth()+1);
    const tempDate = String(currentDate.getMonth()+1).padStart(2, '0');
    newTaskDate.value = `${currentDate.getFullYear()}-${tempDate}-${event.target.innerHTML.padStart(2, '0').substring(0, 2)}`;
    newTaskForm.style.display = "inline-block";
    newTaskForm.style.top = `${event.clientY+40}px`;
    newTaskForm.style.left = `${event.clientX-250}px`;
}

function newTaskHide() {
    newTaskForm.attributeStyleMap.clear();
}

loadTasks();