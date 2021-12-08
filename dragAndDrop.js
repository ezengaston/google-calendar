import { addEvent, removeEvent, events } from "./events";
import { formatISO } from "date-fns";
import renderMonth from "./renderMonth";

export function dragAndDrop() {
  document.addEventListener("mousedown", (e) => {
    if (e.buttons !== 1) return;
    if (!e.target.matches("[data-draggable]")) return;
    const selectedItem = e.target;
    const itemClone = selectedItem.cloneNode(true);
    const ghost = selectedItem.cloneNode();
    const offset = setupDragItems(selectedItem, itemClone, e, ghost);

    setupDragEvents(selectedItem, offset, itemClone, ghost);
    findEventAndDelete(e.target);
  });
}

function setupDragItems(selectedItem, itemClone, e, ghost) {
  const originalRect = selectedItem.getBoundingClientRect();
  const offset = {
    x: e.clientX - originalRect.left,
    y: e.clientY - originalRect.top,
  };
  selectedItem.classList.add("hide");

  itemClone.style.width = `${originalRect.width}px`;
  itemClone.classList.add("dragging");
  positionClone(itemClone, e, offset);
  document.body.append(itemClone);

  ghost.style.height = `${originalRect.height}px`;
  ghost.classList.add("ghost");
  ghost.innerHTML = "";
  selectedItem.parentElement.insertBefore(ghost, selectedItem);

  return offset;
}

function setupDragEvents(selectedItem, offset, itemClone, ghost, target) {
  const mouseMove = (e) => {
    const dropZone = getDropZone(e.target);
    positionClone(itemClone, e, offset);
    if (dropZone == null) return;
    const closestChild = Array.from(dropZone.children).find((child) => {
      if (
        child.matches("[data-date-container]") ||
        child.matches("[data-event-container]")
      )
        return;
      if (child.matches("[data-view-more-btn]")) return true;
      const rect = child.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });
    if (closestChild != null) {
      dropZone.insertBefore(ghost, closestChild);
    } else {
      dropZone.append(ghost);
    }
  };

  document.addEventListener("mousemove", mouseMove);
  document.addEventListener(
    "mouseup",
    (e) => {
      document.removeEventListener("mousemove", mouseMove);
      const dropZone = getDropZone(ghost);
      if (dropZone) {
        dropZone.insertBefore(selectedItem, ghost);
      }

      stopDrag(selectedItem, ghost, itemClone);
      saveNewLocation(dropZone);
      const selectedMonth =
        dropZone.parentElement.querySelector("[data-day-number]").dataset.date;
      renderMonth(selectedMonth);
    },
    { once: true }
  );
}

function positionClone(itemClone, mousePosition, offset) {
  itemClone.style.top = `${mousePosition.clientY - offset.y}px`;
  itemClone.style.left = `${mousePosition.clientX - offset.x}px`;
}

function getDropZone(element) {
  if (element.matches("[data-drop-zone]")) {
    return element;
  } else {
    return element.closest("[data-drop-zone]");
  }
}

function stopDrag(selectedItem, ghost, itemClone) {
  selectedItem.classList.remove("hide");
  ghost.remove();
  itemClone.remove();
}

let result;
function findEventAndDelete(target) {
  result = events.filter((element) => element.id === target.dataset.id);
  removeEvent(result[0]);
}

function saveNewLocation(container) {
  result[0].date = formatISO(
    Date.parse(
      container.parentElement.querySelector("[data-day-number]").dataset.date
    )
  );

  addEvent(result[0]);
}
