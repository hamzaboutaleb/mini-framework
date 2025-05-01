import { createRouter, RouterView } from "../core/router.js";
import { createSignal } from "../core/signal.js";
import { h, render } from "../core/view.js";
import { Footer } from "./components/footer.js";
import { Header } from "./components/header.js";
import { Main } from "./components/main.js";
import { ActivePage } from "./page/active.js";
import { PageAll } from "./page/all.js";
import { CompletedPage } from "./page/completed.js";
let id = 0;
export const todos = createSignal([]);
export function addTodo(todo) {
  if (todo.trim() == "") return;
  const newTodo = {
    id: id++,
    value: todo,
    isCompleted: false
  };
  todos.value = [...todos.value, newTodo];
}
export function removeTodo(id) {
  const filtred = todos.value.filter(todo => todo.id != id);
  todos.value = filtred;
}
export function updateTodo(id, newValue) {
  const newTodos = todos.value.map(todo => {
    if (todo.id != id) return todo;
    return {
      ...todo,
      ...newValue
    };
  });
  todos.value = newTodos;
}
export function unSelectall() {
  todos.value = todos.value.map(el => {
    el.isCompleted = false;
    return el;
  });
}
export function selectAll() {
  todos.value = todos.value.map(el => {
    el.isCompleted = true;
    return el;
  });
}
export function handleSelectionALl() {
  const hasUncompleted = todos.value.some(el => el.isCompleted == false);
  console.log(hasUncompleted);
  if (hasUncompleted) selectAll();else unSelectall();
}
export function clearCompletedTodo() {
  const newTodos = todos.value.filter(todo => todo.isCompleted == false);
  console.log("test", newTodos, todos.value);
  todos.value = newTodos;
}
const routes = [{
  path: "/",
  component: PageAll
}, {
  path: "/active",
  component: ActivePage
}, {
  path: "/completed",
  component: CompletedPage
}];
export const {
  Link,
  ...router
} = createRouter(routes);
const main = h(RouterView, {
  router: router
});
function App() {
  router.navigate("/");
  return h("section", {
    class: "todoapp"
  }, h(Header, null), () => main);
}
render(App(), document.getElementById("root"));