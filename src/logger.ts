const conout = document.querySelector("#console");
import { date_format } from "./utils";

const log = (msg: string, color: string) => {
  const elm = document.createElement("p");
  elm.textContent = `[${date_format("dd-mm-yyyy s:m:H")}] ${msg}`;
  elm.style.color = color;
  elm.classList.add("console-text");

  conout?.appendChild(elm);
  conout?.classList.remove("hide");
  setTimeout(() => { conout?.classList.add("hide") }, 1000 * 10);
}

export const log_error = (msg: string) => {
  log(`[ ERROR ] ${msg}`, "red");
}

export const log_warning = (msg: string) => {
  log(`[WARNING] ${msg}`, "#ded11b");
}

export const log_info = (msg: string) => {
  log(`[ INFO ⠀] ${msg}`, "white");
}

export const log_debug = (msg: string) => {
  log(`[ DEBUG ] ${msg}`, "#366fff");
}
