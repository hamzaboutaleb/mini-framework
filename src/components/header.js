import { h } from "../../core/view.js";
import { AddTodo } from "./addTodo.js";

export function Header() {
  return (
    <header class="header">
      <h1>todos</h1>
      <div class="input-container">
        <AddTodo />
      </div>
    </header>
  );
}
