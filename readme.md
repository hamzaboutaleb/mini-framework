# MINI FRAMEWORK

Mini-Framework is a minimalist frontend framework built around a signals for state management and updates. Unlike traditional frameworks that rely on virtual DOM diffing, Mini-Framework directly updates the DOM, offering a lightweight and efficient way to build reactive user interfaces.

## Key Features

- Tiny Size: Designed for simplicity and performance, ideal for small projects.

- Reactive Signals: Built-in reactive state management with minimal overhead.

- Component System: Easy-to-use components for organizing UI elements.

- No Virtual DOM: Bypasses the overhead of virtual DOM diffing and reconciliation.

- Direct DOM Updates: Efficient updates to the DOM based on reactive signals.

## Core Concepts

### Signals

At the core of Mini-Framework is signals. A signal is a value that can be read and updated. When the signal’s value changes, the DOM is automatically updated in response

```js
const [count, setCount] = createSignal(0);

// Reading the signal value

useEffect(() => {
  console.log(count());
});

// Updating the signal value
setCount(5); // This will trigger Effect
```

### Functional Components

Mini-Framework uses functional components to build the UI. Components are simple functions that return a virtual DOM description using the h() function

```js
const Button = () => {
  const clicked = createSignal(false);

  return () =>
    h(
      "button",
      { onclick: () => (clicked.value = !clicked.value) },
      clicked.value ? "Clicked!" : "Click Me"
    );
};
```

## Routing

Mini-Framework includes a simple yet powerful routing system for building single-page applications (SPA). You can define routes and map them to components. The router automatically updates the view when the URL changes.

### Defining Routes

To define routes in Mini-Framework, you create an array of route objects, each with a path and the corresponding component.

```js
const routes = [
  { path: "/", component: IndexPage },
  { path: "/about", component: AboutPage },
  { path: "/contact", component: ContactPage },
];
```

Each route has:

`path`: The URL pattern that the route matches.

`component`: The component to render when the route is matched.

Once your routes are defined, you create a router instance using the createRouter function. This instance handles the logic for matching the current URL to the corresponding component.

```js
export const router = createRouter(routes);
```

To display the currently matched route, you use the `<RouterView />` component. This component listens for changes in the URL and re-renders the appropriate route’s component

```js
<RouterView router={router} />
```

## Example

```js
<div id="app"></div>

<script type="module">
  import { createSignal, h, render, createRouter, RouterView } from 'mini-framework'

  const IndexPage = () => {
    return () => h('div', {}, 'Welcome to the Index Page!')
  }

  const AboutPage = () => {
    return () => h('div', {}, 'About Us')
  }

  const ContactPage = () => {
    return () => h('div', {}, 'Contact Information')
  }

  // Define the routes
  const routes = [
    { path: "/", component: IndexPage },
    { path: "/about", component: AboutPage },
    { path: "/contact", component: ContactPage },
  ];

  // Create the router instance
  const router = createRouter(routes);

  // Render the router view
  render(() => h(RouterView, { router }), document.getElementById('app'))
</script>
```

## create Element

```js
h("h1", null, "todos");
```

### Parameters

- type (string | Function)
  The type of the element:

A string like "div" or "h1" creates a native HTML element.

A function creates a custom component.

- props (Object | null)
  An object containing attributes or properties for the element (e.g. id, className, event handlers). Can be null if not needed.

- ...children (any[])
  One or more children (strings, numbers, or other virtual DOM nodes). Nested arrays are also supported.

## Event Handlers

To attach an event listener, prefix the event name with on.
For example:

onClick → handles the "click" event
onChange → handles the "change" event
onInput → handles the "input" event

```js
h("button", { onClick: () => alert("Clicked!") }, "Click me");
```

## nested element

```js
h(
  "div",
  { className: "container" },
  h("h1", null, "My App"),
  h("p", null, "Welcome to my app."),
  h("button", { onClick: () => alert("Clicked!") }, "Click Me")
);
```

## Adding Attributes

You can pass HTML attributes through the props object:

```js
h("input", {
  type: "text",
  id: "username",
  placeholder: "Enter your name",
  value: "John Doe",
});
```
