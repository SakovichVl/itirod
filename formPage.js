import { createAddItemForm } from "./addItemForm.js";
import { mainContainer } from "./mainElements.js";

export function createFormPage() {
  mainContainer.innerHTML = '';

  const form = createAddItemForm();
  mainContainer.appendChild(form);
}
