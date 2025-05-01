import { h } from "../../core/view.js";
import { AddTodo } from "./addTodo.js";
export function Header() {
  return h(
    "header",
    {
      class: "header",
    },
    h("h1", null, "todos"),
    h(
      "div",
      {
        class: "input-container",
      },
      h(AddTodo, null)
    )
  );
}
