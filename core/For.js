import { createDom } from "./createDom.js";
import { createEffect, untrack } from "./signal.js";

export function For({ each, component, container }) {
  const containerElement = createDom(container);
  const itemMap = new Map();
  let prevItems = [];
  const children = component;
  createEffect(() => {
    const newItems = each.value || each || [];

    const newKeyMap = new Map();
    newItems.forEach((newItem, index) => {
      const key = getKey(newItem, index);
      newKeyMap.set(key, { newItem, index });
      if (itemMap.has(key)) {
        const entry = itemMap.get(key);
        // Only update if item reference changed
        if (entry.item !== newItem) {
          updateItem(entry, newItem);
        }
      }
    });

    // 2. Remove deleted items
    itemMap.forEach((entry, key) => {
      if (!newKeyMap.has(key)) {
        entry.disposer();
        entry.node.remove();
        itemMap.delete(key);
      }
    });

    // 3. Add new items
    newItems.forEach((newItem, index) => {
      const key = getKey(newItem, index);
      if (!itemMap.has(key)) {
        const entry = createItemEntry(newItem, index);
        itemMap.set(key, entry);
        containerElement.appendChild(entry.node);
      }
    });

    // 4. Maintain DOM order
    newItems.forEach((newItem, index) => {
      const key = getKey(newItem, index);
      const current = containerElement.childNodes[index];
      const target = itemMap.get(key).node;

      if (current !== target) {
        containerElement.insertBefore(target, current);
      }
    });

    prevItems = newItems;
  });

  function getKey(item, index) {
    return item.key ?? item.id ?? index;
  }

  function createItemEntry(item, index) {
    let node = null;
    const vdom = children(item);
    node = createDom(vdom);
    const temp = document.createDocumentFragment();
    temp.appendChild(node);
    containerElement.insertBefore(temp, containerElement.childNodes[index]);

    return {
      node,
      disposer: () => {},
      item,
    };
  }

  function updateItem(entry, newItem) {
    if (entry.item !== newItem) {
      entry.disposer();
      const key = getKey(newItem, entry.index);
      const newEntry = createItemEntry(newItem, key);
      itemMap.set(key, newEntry);
      entry.node.replaceWith(newEntry.node);
    }
  }

  return containerElement;
}
