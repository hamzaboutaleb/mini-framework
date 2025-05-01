import { h } from "../../core/view.js";
import { removeTodo, updateTodo } from "../app.js";
export function TodoItem({
  todo
}) {
  const HandleOnClick = () => {
    removeTodo(todo.id);
  };
  return h("li", {
    class: `${todo.isCompleted ? "completed" : ""}`,
    "data-testid": "todo-item"
  }, h("div", {
    class: "view"
  }, h("input", {
    class: "toggle",
    name: "toggle-er",
    type: "checkbox",
    onChange: e => {
      console.log(e.target.value);
      updateTodo(todo.id, {
        isCompleted: !todo.isCompleted
      });
    },
    checked: todo.isCompleted,
    id: `input-${todo.id}`
  }), h("label", {
    for: `input-${todo.id}`
  }, todo.value), h("button", {
    class: "destroy",
    onClick: HandleOnClick,
    "data-testid": "todo-item-button"
  })));
}