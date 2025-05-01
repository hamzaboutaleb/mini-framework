import { For } from "../../core/For.js";
import { Fragment } from "../../core/Fragment.js";
import { h } from "../../core/view.js";
import { todos } from "../app.js";
import { Footer } from "./footer.js";
import { TodoItem } from "./todoItem.js";
import { Toggler } from "./toggle.js";

export function Main() {
  return (
    <div>
      <main class="main" data-testid="main">
        <Toggler />
        <For
          each={todos}
          component={(todo) => <TodoItem todo={todo} />}
          container={<ul class="todo-list" data-testid="todo-list"></ul>}
        ></For>
      </main>
      <Footer />
    </div>
  );
}
