import { For } from "../../core/For.js";
import { h } from "../../core/view.js";
import { todos } from "../app.js";
import { Footer } from "../components/footer.js";
import { TodoItem } from "../components/todoItem.js";
import { Toggler } from "../components/toggle.js";

export function ActivePage() {
  const itemsLeft = todos.value.filter((todo) => todo.isCompleted == false);

  return (
    <div>
      <main class="main" data-testid="main">
        {itemsLeft.length > 0 ? <Toggler /> : null}
        <For
          each={itemsLeft}
          component={(todo) => <TodoItem todo={todo} />}
          container={<ul class="todo-list" data-testid="todo-list"></ul>}
        ></For>
      </main>
      <Footer />
    </div>
  );
}
