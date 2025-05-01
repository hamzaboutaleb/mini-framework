let contextStack = [];
let scheduledSignals = new Set();
let isUpdateScheduled = false;

let isBatching = false;
let batchedEffects = new Set();

export function batch(callback) {
  if (isBatching) {
    // If already batching, just run the callback
    callback();
    return;
  }

  // Start batching
  isBatching = true;
  batchedEffects.clear();

  try {
    // Run the callback
    callback();
  } finally {
    // End batching and process effects
    isBatching = false;
    batchedEffects.forEach((effect) => {
      effect.execute();
    });
    batchedEffects.clear();
  }
}

export class Signal {
  #value;
  #listeners;
  constructor(initialValue) {
    this.#value = initialValue;
    this.#listeners = new Set();
  }

  get realValue() {
    return this.#value;
  }
  get value() {
    const effect = contextStack[contextStack.length - 1];
    if (effect) {
      this.#listeners.add(effect);
      effect.deps.add(this);
    }
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    if (isBatching) {
      this.#listeners.forEach((effect) => batchedEffects.add(effect));
    } else {
      this.notifySubscribers();
    }
  }

  deleteListener(listener) {
    this.#listeners.delete(listener);
  }

  clearListeners() {
    this.#listeners.clear();
  }
  get listeners() {
    return this.#listeners;
  }

  notifySubscribers() {
    [...this.#listeners].forEach((sub) => {
      sub.execute();
    });
  }
}

class Effect {
  constructor(fn) {
    this.fn = fn;
    this.deps = new Set();
    this.cleanup = null;
    this.disposed = false;
  }

  execute() {
    if (this.disposed) return;
    this.deps.forEach((signal) => signal.deleteListener(this));
    this.deps.clear();
    if (this.cleanup) this.cleanup();
    contextStack.push(this);
    try {
      this.cleanup = this.fn();
    } finally {
      contextStack.pop();
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.deps.forEach((signal) => signal.deleteListener(this));
    this.deps.clear();
    if (this.cleanup) this.cleanup();
  }
}

function scheduleUpdate(signal) {
  signal.notifySubscribers();
  // scheduledSignals.add(signal);
  // if (!isUpdateScheduled) {
  //   isUpdateScheduled = true;
  //   queueMicrotask(() => {
  //     const effetcsRun = new Set();
  //     scheduledSignals.forEach((signal) => {
  //       effetcsRun.add(...signal.listeners);
  //     });
  //     scheduledSignals.clear();
  //     isUpdateScheduled = false;
  //     effetcsRun.forEach((signal) => signal.execute());
  //   });
  // }
}

export function untrack(fn) {
  const prevEffect = contextStack.pop();
  try {
    return fn();
  } finally {
    contextStack.push(prevEffect); // Restore tracking
  }
}

export function createSignal(value) {
  const signal = new Signal(value);
  return signal;
}

export function createEffect(fn) {
  const effect = new Effect(fn);
  effect.execute();
  return () => effect.dispose();
}
