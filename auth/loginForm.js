import { mainContainer } from "../mainElements.js";
import { auth } from "../store/database.js";
import { createButton, createInputNode, createTextNode } from "../utils.js";

function createLoginForm() {
  const values = {
    email: '',
    password: '',
  }

  const formNode = document.createElement('form');
  formNode.className = 'add-form';

  const titleNode = createTextNode('h3', 'section-title', 'Login');
  const emailTitleNode = createTextNode('p', 'item-title', 'Email:');
  const passwordTitleNode = createTextNode('p', 'item-title', 'Password:');

  const emailInputNode = createInputNode({ name: 'email', isRequired: true, values, type: 'email' });
  const passwordInputNode = createInputNode({ name: 'password', isRequired: true, values, type: 'password' });

  const buttonNode = createButton({ text: 'Login', type: 'submit' });

  formNode.appendChild(titleNode);
  formNode.appendChild(emailTitleNode);
  formNode.appendChild(emailInputNode);
  formNode.appendChild(passwordTitleNode);
  formNode.appendChild(passwordInputNode);
  formNode.appendChild(buttonNode);

  formNode.addEventListener('submit',async (e) => {
    e.preventDefault();

    const { email, password } = values;

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch ({ message }) {
      console.error(message)
    } 
  })

  return formNode;
}

export function createLoginPage() {
  mainContainer.innerHTML = '';

  const form = createLoginForm();
  mainContainer.appendChild(form);
}
