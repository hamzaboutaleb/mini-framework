import { untrack } from "./signal.js";

const mountCallbacks = new Map();
const unmountCallbacks = new WeakMap();

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      runUnmountCallbacks(node); // Trigger onUnmount
    });
  });
});

export function startObserver(container) {
  // Start observing the container
  mutationObserver.observe(container, {
    childList: true, // Observe direct children
    subtree: true, // Observe all descendants
  });
}

export function onMount(node, callback) {
  if (node) {
    mountCallbacks.set(node, callback);
    scheduleMount();
  }
}

function scheduleMount() {
  // Use microtask or requestAnimationFrame to run after DOM updates
  Promise.resolve().then(() => {
    mountCallbacks.forEach((callback, node) => {
      if (document.contains(node)) {
        callback(node);
        mountCallbacks.delete(node);
      }
    });
  });
}

export function onUnmount(node, callback) {
  if (node) {
    unmountCallbacks.set(node, callback);
  }
}

function runUnmountCallbacks(node) {
  if (unmountCallbacks.has(node)) {
    unmountCallbacks.get(node)(node);
    unmountCallbacks.delete(node);
  }
}
