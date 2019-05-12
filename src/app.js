import finder from "@medv/finder";
import debounce from "lodash/debounce";
import { initMessage, showMessage, hideMessage } from "./info";
import { copyToClipboard } from "./clipboard";
import { highlight, unHighlight } from "./highlight";

const clearEl = el => el && unHighlight(el);

let elementStack = [];

const clearElStack = () => {
  elementStack = [];
};

export const toggle = global => {
  const state = !global.state;
  global.state = state;
  const action = state ? "addEventListener" : "removeEventListener";
  document[action]("mouseover", global.selectElement);
  document[action]("keydown", global.changeElement);
  document[action]("mouseout", global.clearElDebounce);

  if (!state) {
    clearEl(global.selectedEl);
    global.copiedEl && global.copiedEl.classList.remove("gs_copied");
    hideMessage(global);
  }
};

export const init = global => {
  global.isInit = true;
  global.selectedEl = null;

  global.clearElDebounce = debounce(
    () => {
      clearEl(global.selectedEl);
      if (elementStack.length) clearElStack();
      hideMessage(global);
    },
    200
  );

  global.selectElement = debounce(e => {
    if (global.selectedEl !== e.target) {
      clearEl(global.selectedEl);
    }
    global.selectedEl = e.target;
    const selectedEl = global.selectedEl;

    highlight(selectedEl);

    const name = selectedEl.nodeName.toLowerCase();
    const id = selectedEl.id ? "#" + selectedEl.id : "";
    const className = selectedEl.className.replace
      ? selectedEl.className
          .trim()
          .replace(/ /gi, ".")
      : "";
    const message = name + id + (className.length > 0 ? "." + className : "");
    showMessage(global, message);
  }, 200);

  global.changeElement = debounce(e => {
    const { selectedEl } = global;
    let newEl;
    if (e.key == "Control" && selectedEl.parentElement) {
      elementStack.push(selectedEl);
      newEl = selectedEl.parentElement;
    } else if (e.key == "Shift" && elementStack.length) {
      newEl = elementStack.pop();
    } else {
      return;
    }
    e.preventDefault();
    clearEl(selectedEl);
    highlight(newEl);

    const name = newEl.nodeName.toLowerCase();
    const id = newEl.id ? "#" + newEl.id : "";
    const className = newEl.className.replace
      ? newEl.className
          .trim()
          .replace(/ /gi, ".")
      : "";
    const message = name + id + (className.length > 0 ? "." + className : "");
    showMessage(global, message);
    global.selectedEl = newEl;
  }, 200);

  global.copyToClipboard = (currentUrl) => {
    const { selectedEl } = global;
    if (!selectedEl) {
      return;
    }
    clearEl(selectedEl);
    const selector = finder(selectedEl);
    console.log("[GetSelector]: Copied to Clipboard: " + selectedEl);

    copyToClipboard(btoa(JSON.stringify({ url: currentUrl, selector: selector })));

    global.copiedEl = selectedEl;
  };

  initMessage(global); 
};
