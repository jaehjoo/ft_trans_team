import Button from "../../components/ui/Button";
import Modal from "../../components/ui/CreateByModal";

const Login = () => {
  const loginButtonClickHandler = () => {
    console.log("login");
  };
  const ButtonText = document.createElement("div");
  ButtonText.classList.add(
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "gap-2"
  );

  const loginLogo = document.createElement("img");
  loginLogo.src = "../../public/img/42.png";
  loginLogo.alt = "42 logo";
  loginLogo.style.width = "25px";

  ButtonText.appendChild(loginLogo);
  ButtonText.appendChild(document.createTextNode("Sign in with 42 intra"));

  const loginButton = Button(
    "light",
    false,
    loginButtonClickHandler,
    ButtonText
  );

  const loginButtonWrap = document.createElement("div");
  loginButtonWrap.classList.add("d-flex", "justify-content-center", "w-100");
  loginButtonWrap.appendChild(loginButton);

  const LoginContainer = document.createElement("div");
  LoginContainer.innerHTML = /*html*/ `
  <h1>42 Login</h1>
  <h4>Welcome to 42 Transcendence Ping Pong Game!</h4>
  `;

  LoginContainer.classList.add(
    "d-flex",
    "flex-column",
    "p-2",
    "bg-secondary",
    "justify-content-start",
    "align-items-start",
    "w-100",
    "gap-4",

    "bg-success"
  );

  LoginContainer.appendChild(loginButtonWrap);

  const removeLoginButtonClickHandler = () => {
    loginButton.removeEventListener("click", loginButtonClickHandler);
    window.removeEventListener("beforeunload", removeLoginButtonClickHandler);
  };

  window.addEventListener("beforeunload", removeLoginButtonClickHandler);

  return LoginContainer;
};

const LoginPage = () => {
  const LoginContainer = Login();

  const page = document.createElement("div");
  page.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "flex-column",
    "bg-primary"
  );
  page.style.height = "50vh";

  // const createBy = document.createElement("h6");
  // createBy.textContent = "Created by 42 SEOUL Cadets";

  const createBy = document.createElement("div");
  createBy.innerHTML = /*html*/ `${Modal()}`;

  page.appendChild(LoginContainer);
  page.appendChild(createBy);

  return page;
};

export default LoginPage;
