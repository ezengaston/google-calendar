import { parse, format, parseISO } from "date-fns";
import { updateEvent, removeEvent } from "./events";
import { openEditEventModal } from "./modal";
import renderMonth from "./renderMonth";

export default function createEventElement(event) {
  const element = event.isAllDay
    ? createAllDayEventElement(event)
    : createTimedEventElement(event);

  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    openEditEventModal(
      event,
      (updatedEvent) => {
        updateEvent(updatedEvent);
        renderMonth(updatedEvent.date);
      },
      (deletedEvent) => {
        removeEvent(deletedEvent);
        renderMonth(deletedEvent.date);
      }
    );
  });

  return element;
}

const allDayEventTemplate = document.getElementById("all-day-event-template");
function createAllDayEventElement(event) {
  const element = allDayEventTemplate.content
    .cloneNode(true)
    .querySelector("[data-event]");

  element.classList.add(event.color);
  element.querySelector("[data-name]").textContent = event.name;
  element.dataset.id = event.id;

  return element;
}

const timedEventTemplate = document.getElementById("timed-event-template");
function createTimedEventElement(event) {
  const element = timedEventTemplate.content
    .cloneNode(true)
    .querySelector("[data-event]");

  element.querySelector("[data-name]").textContent = event.name;
  element.querySelector("[data-color]").classList.add(event.color);

  let elementDate;
  if (parseISO(event.date) != "Invalid Date") {
    elementDate = parseISO(event.date);
  } else {
    elementDate = event.date;
  }
  element.querySelector("[data-time]").textContent = format(
    parse(event.startTime, "HH:mm", elementDate),
    "h:mmaaa"
  );
  element.dataset.id = event.id;

  return element;
}
