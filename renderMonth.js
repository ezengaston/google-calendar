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
  let month;
  if (!isNaN(Date.parse(monthDate))) {
    month = Date.parse(monthDate);
  } else {
    month = monthDate;
  }

  document.querySelector("[data-month-title]").textContent = format(
    month,
    "MMMM yyyy"
  );

  const dayElements = getCalendarDates(month).map((date, index) => {
    return createDayElement(date, {
      isCurrentMonth: isSameMonth(month, date),
      isCurrentDay: isSameDay(Date.now(), date),
      showWeekName: index < 7,
    });
  });
  daysContainer.innerHTML = "";
  dayElements.forEach((element) => daysContainer.append(element));
  dayElements.forEach((element) => {
    return fixEventOverflow(element);
  });
}

function getCalendarDates(date) {
  let element;
  if (!isNaN(Date.parse(date))) {
    element = Date.parse(date);
  } else {
    element = date;
  }

  const firstWeekStart = startOfWeek(startOfMonth(element), {
    weekStartsOn: 1,
  });
  const lastWeekStart = endOfWeek(endOfMonth(element), { weekStartsOn: 1 });
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
