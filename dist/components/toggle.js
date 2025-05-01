import { h } from "../../core/view.js";
import { handleSelectionALl, router, selectAll, unSelectall } from "../app.js";
export function Toggler() {
  function toggle(e) {
    console.log("yes", router);
    if (router.path.value == "/") {
      handleSelectionALl();
    } else if (router.path.value == "/active") {
      selectAll();
    } else if (router.path.value == "/completed") {
      console.log("completed");
      unSelectall();
    }
  }
  return h("div", {
    class: "toggle-all-container"
  }, h("input", {
    class: "toggle-all",
    type: "checkbox",
    id: "toggle-all",
    onChange: e => toggle()
  }), h("label", {
    class: "toggle-all-label",
    for: "toggle-all"
  }, "Toggle All Input"));
}