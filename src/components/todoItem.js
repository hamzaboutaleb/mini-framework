import { h } from "../../core/view.js";
import { removeTodo, updateTodo } from "../app.js";

export function TodoItem({ todo }) {
  const HandleOnClick = () => {
    removeTodo(todo.id);
  };
  return (
    <li
      class={`${todo.isCompleted ? "completed" : ""}`}
      data-testid="todo-item"
    >
      <div class="view">
        <input
          class="toggle"
          name="toggle-er"
          type="checkbox"
          onChange={(e) => {
            console.log(e.target.value);
            updateTodo(todo.id, { isCompleted: !todo.isCompleted });
          }}
          checked={todo.isCompleted}
          id={`input-${todo.id}`}
        />
        <label for={`input-${todo.id}`}>{todo.value}</label>
        <button
          class="destroy"
          onClick={HandleOnClick}
          data-testid="todo-item-button"
        ></button>
      </div>
    </li>
  );
}
