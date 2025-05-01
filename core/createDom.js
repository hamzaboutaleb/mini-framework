import { Fragment } from "./Fragment.js";
import { onMount, onUnmount } from "./mount.js";
import { createEffect, Signal, untrack } from "./signal.js";

export function createDom(element, parent = null) {
  if (element === null || element === undefined || element === false) {
    return document.createTextNode(""); // Render an empty text node
  }
  if (typeof element === "string" || typeof element === "number") {
    return document.createTextNode(element);
  }

  if (element.type === Fragment) {
    const fragment = document.createDocumentFragment();
    element.children.forEach((child) => {
      const childNode = createDom(child, parent);
      if (childNode) {
        fragment.appendChild(childNode);
      }
    });
    return fragment;
  }

  if (element instanceof DocumentFragment) {
    return element;
  }

  if (element instanceof Element) {
    return element;
  }

  if (typeof element === "function") {
    const fragment = document.createDocumentFragment();
    let addedElement = null;
    const position = parent.children.length;
    createEffect(() => {
      console.log("added element", addedElement);
      if (addedElement && addedElement.remove) addedElement.remove();
      const newElement = element();
      addedElement = createDom(newElement, parent);
      const children = Array.from(parent.children);
      const referenceNode = children[position] || null;
      parent.insertBefore(addedElement, referenceNode);
    });
    return fragment;
  }

  if (element instanceof Signal) {
    const node = document.createTextNode(element.value);
    createEffect(() => {
      node.nodeValue = element.value;
    });
    return node;
  }
  if (typeof element.type === "function") {
    const componentVNode = element.type({
      ...element.props,
      children: element.children,
    });
    const result = createDom(componentVNode, parent);
    return result;
  }
  const node = document.createElement(element.type);
  if (element.props) {
    for (let [key, value] of Object.entries(element.props)) {
      if (key === "onMount" || key == "onUnmount" || key == "children")
        continue;
      if (key.startsWith("on")) {
        addEventListener(node, key.slice(2).toLowerCase(), value);
      } else if (value instanceof Signal) {
        setSignalAttribute(node, key, value);
      } else {
        setAttribute(node, key, value);
      }
    }
  }
  if (element.props?.onMount) {
    onMount(node, element.props.onMount);
  }
  if (element.props?.onUnmount) {
    onUnmount(node, element.props.onUnmount);
  }

  if (Array.isArray(element.children)) {
    element.children.forEach((child) => {
      const result = createDom(child, node);
      node.appendChild(result);
    });
  }

  return node;
}

function setSignalAttribute(node, key, value) {
  createEffect(() => {
    node[key] = value.value;
  });
}

function isBooleanAttribute(key) {
  return ["disabled", "checked", "readonly", "multiple", "selected"].includes(
    key
  );
}

function setAttribute(node, key, value) {
  if (key === "style") {
    Object.assign(node.style, value);
  } else if (typeof value === "boolean" && isBooleanAttribute(key)) {
    if (value) {
      node.setAttribute(key, "");
    } else {
      node.removeAttribute(key);
    }
  } else if (typeof value === "function") {
    if (typeof value == "function") {
      createEffect(() => {
        if (key === "class") {
          node.className = value();
          return;
        }
        node[key] = value();
      });
    } else {
      node.className = value;
    }
  } else {
    node.setAttribute(key, value);
  }
}

function addEventListener(element, eventName, callback) {
  element["on" + eventName] = callback;
}
