const calendar = document.getElementById('.calendar-container');
const monthYear = document.getElementById('month-year');
const daysContainer = document.querySelector('.days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const calendarFullscreenButton = document.getElementById('calendar-fullscreen-button');
const infoContainer = document.getElementById('info-container');
const calendarContainer = document.getElementById('calendar');
const calendarFullscreenIcon = document.getElementById('calendar-fullscreen-icon');

calendarFullscreenButton.onclick = calendarFullscreen;

let isCalendarFullscreen = false;
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formattedDate = `${yyyy}-${mm}-${dd}`;

let currentDate = new Date();
const actualDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  monthYear.textContent = `${months[month]} ${year}`;
  // Get first and last day of the month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  let days = "";

  // Previous month's days
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="inactive">${prevLastDate - x + 1}</div>`;
  } 

  // Current month's days
  for (let i = 1; i <= lastDate; i++) {

    //sets the current day to a diffrent color
    const targetDate = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    if(i === actualDate.getDate() && month === actualDate.getMonth() && year === actualDate.getFullYear()){
      if (taskDates.indexOf(targetDate) !== -1) {
        const count = taskDates.filter(item => item === targetDate).length;
        days += `
        <div class="current-day day-has-task active">
          <div class="date-display">${i}</div>
          <div class="num-of-tasks">${count}</div>
        </div>
        `;
      } else {
        days += `<div class="current-day active">${i}</div>`; 
      }
    } 
    else if(taskDates.indexOf(targetDate) !== -1) {
      const count = taskDates.filter(item => item === targetDate).length;
      days += `
        <div class="day-has-task active">
          <div class="date-display">${i}</div>
          <div class="num-of-tasks">${count}</div>
        </div>
        `;
    } else {
        days += `<div class="active">${i}</div>`;
    }
  }

  // Next month's days to fill
  const nextDays = 42 - days.split('active').length + 1;
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="inactive">${j}</div>`;
  }

  daysContainer.innerHTML = days;
}

function navigateCalendar(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar(currentDate);
}

// Event Listeners
prevButton.addEventListener('click', () => navigateCalendar(-1));
nextButton.addEventListener('click', () => navigateCalendar(1));

function calendarFullscreen() {
  if(isCalendarFullscreen === false) {
    infoContainer.style.width = "100vw";
    todoContainer.style.display = "none";
    calendarContainer.style.height = "90vh";
    calendarFullscreenIcon.src = "images/exit-fullscreen.svg";
    isCalendarFullscreen = true;
  } else {
    infoContainer.attributeStyleMap.clear();
    todoContainer.attributeStyleMap.clear();
    calendarContainer.attributeStyleMap.clear();
    calendarFullscreenIcon.src = "images/fullscreen.svg";
    isCalendarFullscreen = false;
  }
}

daysContainer.addEventListener('click', function (event){
    console.log(event.target.innerHTML.substring(0, 2));
    newTaskDisplayFromCalendar(event);
    
});

// Initial Render
renderCalendar(currentDate);
