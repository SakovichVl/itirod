import { createSearchPage } from "./searchPage.js";
import { createMainPage } from "./mainPage.js";
import { createFormPage } from "./formPage.js";
import { addTeaButton, loginButton, logoutButton, mainPageButton, searchPageButton, signupButton } from "./mainElements.js";
import { createStore } from "./store/store.js";
import { initialState, reducer } from "./store/reducer.js";
import { getCommentAction, getTeaAction, loginAction, logoutAction } from "./store/actions.js";
import { createLoginPage } from "./auth/loginForm.js";
import { createSignUpPage } from "./auth/signUpForm.js";
import { logout } from "./auth/logout.js";
import { auth } from "./store/database.js";

export const store = createStore(reducer, initialState);

mainPageButton.addEventListener('click', () => createMainPage());
addTeaButton.addEventListener('click', () => createFormPage());
searchPageButton.addEventListener('click', () => createSearchPage());
loginButton.addEventListener('click', () => createLoginPage());
signupButton.addEventListener('click', () => createSignUpPage());

logoutButton.addEventListener('click', () => logout());

auth.onAuthStateChanged(user => {
  if(!user) {
    logoutAction();
    createMainPage();
    return;
  }

  loginAction(user);
  createMainPage();
});

Promise.allSettled([getTeaAction(), getCommentAction()]).then(() => createMainPage());