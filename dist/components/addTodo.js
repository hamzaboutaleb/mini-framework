import { Fragment } from "../../core/Fragment.js";
import { createSignal } from "../../core/signal.js";
import { h } from "../../core/view.js";
import { addTodo } from "../app.js";
export function AddTodo() {
  const todo = createSignal("");
  const onSubmit = e => {
    e.preventDefault();
    addTodo(todo.value);
    todo.value = "";
  };
  return h(Fragment, null, h("form", {
    onSubmit: onSubmit
  }, h("input", {
    class: "new-todo",
    id: "todo-input",
    type: "text",
    "data-testid": "text-input",
    placeholder: "What needs to be done?",
    value: todo,
    name: "new-todo",
    onChange: e => todo.value = e.target.value
  }), h("label", {
    class: "visually-hidden",
    for: "todo-input"
  }, "New Todo Input")));
}