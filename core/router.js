import { createDom } from "./createDom.js";
import { batch, createEffect, createSignal, untrack } from "./signal.js";
import { h } from "./view.js";

function deleteElementRecursively(element) {
  if (!element) return;

  // Recursively remove all children
  while (element.firstChild) {
    deleteElementRecursively(element.firstChild);
  }

  // Remove the element itself from the DOM
  element.remove();
}

export function createRouter(routes) {
  const current = createSignal(null);
  const params = createSignal({});
  const currentPath = createSignal("");

  function resolvePath(path) {
    return path.replace(/^#/, ""); // Handle hash routing
  }

  function matchRoute() {
    const path = resolvePath(window.location.hash || window.location.pathname);

    for (const route of routes) {
      //post/1 ==> /post/:id/:key

      const keys = []; // [id, key]
      const pattern = route.path
        .replace(/:(\w+)/g, (_, key) => {
          keys.push(key);
          return "([^\\/]+)";
        })
        .replace(/\*/g, ".*");

      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex); // ["/post/10/eza", "10","eza"]
      if (match) {
        const routeParams = keys.reduce((acc, key, index) => {
          acc[key] = match[index + 1];
          return acc;
        }, {});
        batch(() => {
          current.value = route.component;
          params.value = routeParams;
          currentPath.value = route.path;
        });
        return;
      }
    }

    current.value = routes.find((r) => r.path === "*")?.component || null;
  }

  // Hash-based routing
  window.addEventListener("hashchange", matchRoute);
  // Path-based routing
  window.addEventListener("popstate", matchRoute);

  // Initial match
  matchRoute();

  function navigate(path) {
    if (path.startsWith("#")) {
      window.location.hash = path;
    } else {
      window.history.pushState({}, "", path);
    }
    matchRoute();
  }

  function Link(props) {
    return h(
      "a",
      {
        onClick: (e) => {
          e.preventDefault();
          navigate(props.to);
        },
        href: props.to,
        ...props,
      },
      props.children
    );
  }

  return {
    current,
    params,
    path: currentPath,
    Link,
    navigate,
  };
}
// RouterView component
export function RouterView({ router }) {
  const container = document.createElement("div");
  container.className = "router-view";
  let currentDOMComponent = null;
  let currentComponent = null;
  let disposeEffect = null;

  disposeEffect = createEffect(() => {
    // Cleanup previous component
    // if (currentComponent == router.current.value) return;
    while (container.firstChild) {
      deleteElementRecursively(container.firstChild);
    }
    // container.innerHTML = "";
    // if (currentDOMComponent) {
    //   currentDOMComponent.remove();
    // }
    // Get current route component and params
    const Component = router.current.value;
    const params = router.params.value;

    if (Component) {
      // Create new component with reactive params
      currentDOMComponent = untrack(() =>
        createDom(
          {
            type: Component,
            props: { params }, // Pass the signal directly
          },
          container
        )
      );
      container.appendChild(currentDOMComponent);
      currentComponent = Component;
    }
  });

  return container;
}

// Link component
