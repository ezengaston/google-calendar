import {
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import createDayElement from "./createDayElement";

const daysContainer = document.querySelector("[data-calender-days]");

export default function renderMonth(monthDate) {
  document.querySelector("[data-month-title]").textContent = format(
    monthDate,
    "MMMM yyyy"
  );

  const dayElements = getCalendarDates(monthDate).map((date, index) =>
    createDayElement(date, {
      isCurrentMonth: isSameMonth(monthDate, date),
      isCurrentDay: isSameDay(Date.now(), date),
      showWeekName: index < 7,
    })
  );
  daysContainer.innerHTML = "";
  dayElements.forEach((element) => daysContainer.append(element));
  dayElements.forEach(fixEventOverflow);
}

function getCalendarDates(date) {
  const firstWeekStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const lastWeekStart = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const month = eachDayOfInterval({
    start: firstWeekStart,
    end: lastWeekStart,
  });

  return month;
}

export function fixEventOverflow(dateContainer) {
  const eventContainer = dateContainer.querySelector("[data-event-container]");
  const viewMoreButton = dateContainer.querySelector("[data-view-more-btn]");
  const events = eventContainer.querySelectorAll("[data-event]");
  viewMoreButton.classList.add("hide");
  events.forEach((event) => event.classList.remove("hide"));
  for (let i = events.length - 1; i >= 0; i--) {
    if (dateContainer.scrollHeight <= dateContainer.clientHeight) break;
    events[i].classList.add("hide");
    viewMoreButton.classList.remove("hide");
    viewMoreButton.textContent = `+ ${events.length - i} More`;
  }
}
