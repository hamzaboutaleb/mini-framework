import { h } from "../../core/view.js";
import { clearCompletedTodo, Link, todos } from "../app.js";

export function Footer() {
  const itemsLeft = todos.value.filter((todo) => todo.isCompleted == false);

  return (
    <footer class="footer" data-testid="footer">
      <span class="todo-count">{itemsLeft.length} item left!</span>
      <ul class="filters" data-testid="footer-navigation">
        <li>
          <Link to="/">All</Link>
        </li>
        <li>
          <li>
            <Link to="/active">Active</Link>
          </li>
        </li>
        <li>
          <Link to="/completed">Completed</Link>
        </li>
      </ul>
      <button class="clear-completed" onClick={() => clearCompletedTodo()}>
        Clear completed
      </button>
    </footer>
  );
}
