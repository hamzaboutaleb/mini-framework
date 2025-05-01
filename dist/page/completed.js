import { For } from "../../core/For.js";
import { h } from "../../core/view.js";
import { todos } from "../app.js";
import { Footer } from "../components/footer.js";
import { TodoItem } from "../components/todoItem.js";
import { Toggler } from "../components/toggle.js";
export function CompletedPage() {
  const itemsLeft = todos.value.filter(todo => todo.isCompleted == true);
  return h("div", null, h("main", {
    class: "main",
    "data-testid": "main"
  }, itemsLeft.length > 0 ? h(Toggler, null) : null, h(For, {
    each: itemsLeft,
    component: todo => h(TodoItem, {
      todo: todo
    }),
    container: h("ul", {
      class: "todo-list",
      "data-testid": "todo-list"
    })
  })), h(Footer, null));
}