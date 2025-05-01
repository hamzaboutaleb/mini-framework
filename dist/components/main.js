import { For } from "../../core/For.js";
import { Fragment } from "../../core/Fragment.js";
import { h } from "../../core/view.js";
import { todos } from "../app.js";
import { Footer } from "./footer.js";
import { TodoItem } from "./todoItem.js";
import { Toggler } from "./toggle.js";
export function Main() {
  return h("div", null, h("main", {
    class: "main",
    "data-testid": "main"
  }, h(Toggler, null), h(For, {
    each: todos,
    component: todo => h(TodoItem, {
      todo: todo
    }),
    container: h("ul", {
      class: "todo-list",
      "data-testid": "todo-list"
    })
  })), h(Footer, null));
}