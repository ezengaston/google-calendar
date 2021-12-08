import renderMonth, { fixEventOverflow } from "./renderMonth";
import { addMonths, subMonths } from "date-fns";
import { dragAndDrop } from "./dragAndDrop";

let selectedMonth = Date.now();

document
  .querySelector("[data-next-month-btn]")
  .addEventListener("click", () => {
    selectedMonth = addMonths(selectedMonth, 1);
    renderMonth(selectedMonth);
  });

document
  .querySelector("[data-prev-month-btn]")
  .addEventListener("click", () => {
    selectedMonth = subMonths(selectedMonth, 1);
    renderMonth(selectedMonth);
  });

document.querySelector("[data-today-btn]").addEventListener("click", () => {
  selectedMonth = Date.now();
  renderMonth(selectedMonth);
});

let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    document.querySelectorAll("[data-date-wrapper]").forEach(fixEventOverflow);
  }, 100);
});

dragAndDrop();
renderMonth(Date.now());
