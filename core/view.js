import { createDom } from "./createDom.js";
import { startObserver } from "./mount.js";

export function h(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export function render(element, continer) {
  startObserver(continer);
  continer.appendChild(createDom(element));
}
