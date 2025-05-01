import { h } from "../../core/view.js";
import { clearCompletedTodo, Link, todos } from "../app.js";
export function Footer() {
  const itemsLeft = todos.value.filter((todo) => todo.isCompleted == false);
  return h(
    "footer",
    {
      class: "footer",
      "data-testid": "footer",
    },
    h(
      "span",
      {
        class: "todo-count",
      },
      itemsLeft.length,
      " item left!"
    ),
    h(
      "ul",
      {
        class: "filters",
        "data-testid": "footer-navigation",
      },
      h(
        "li",
        null,
        h(
          Link,
          {
            to: "/",
          },
          "All"
        )
      ),
      h(
        "li",
        null,
        h(
          "li",
          null,
          h(
            Link,
            {
              to: "/active",
            },
            "Active"
          )
        )
      ),
      h(
        "li",
        null,
        h(
          Link,
          {
            to: "/completed",
          },
          "Completed"
        )
      )
    ),
    h(
      "button",
      {
        class: "clear-completed",
        onClick: () => clearCompletedTodo(),
      },
      "Clear completed"
    )
  );
}
