const calendar = document.querySelector('.calendar-container');
const monthYear = document.getElementById('month-year');
const daysContainer = document.querySelector('.days');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
    if(i === date.getDate() && month === actualDate.getMonth() && year === actualDate.getFullYear()){
      if (taskDates.indexOf(`${year}-${month+1}-${i}`) !== -1) {
        days += `<div class="current-day day-has-task">${i}</div>`;
      } else {
        days += `<div class="current-day">${i}</div>`; 
      }
    } 
    else if(taskDates.indexOf(`${year}-${month+1}-${i}`) != -1) {
      days += `<div class="day-has-task">${i}</div>`;
    } else {
        days += `<div>${i}</div>`;
    }
  }

  // Next month's days to fill
  const nextDays = 42 - days.split('</div>').length + 1;
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



// Initial Render
renderCalendar(currentDate);
