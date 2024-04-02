import Button from "../../components/ui/Button";
import Modal from "../../components/ui/CreateByModal";
import parser from "../../utils/parser";

const Login = () => {
  const ButtonTextStr = /*html*/ `
    <div class="d-flex justify-content-center align-items-center gap-2">
      <img src="../../public/img/42.png" alt="42 logo" style="width: 25px;">
      <span>Sign in with 42 intra</span>
    </div>
    `;
  const ButtonText = parser(ButtonTextStr, "div");

  const loginButtonClickHandler = () => {
    console.log("login");

    loginButton.disabled = true;
    loginButton.removeEventListener("click", loginButtonClickHandler);
    window.location.href = "/2fa";
  };

  const loginButton = Button(
    "light",
    false,
    loginButtonClickHandler,
    ButtonText
  );

  loginButton.style.border = "1px solid gray";

  const loginButtonWrap = document.createElement("div");
  loginButtonWrap.classList.add("d-flex", "justify-content-center", "w-100");
  loginButtonWrap.appendChild(loginButton);

  const LoginContainerStr = /*html*/ `
    <div class="d-flex flex-column p-4 justify-content-start align-items-start w-100 gap-4">
      <h1>42 Login</h1>
      <h5>Welcome to 42 Transcendence Ping Pong Game!</h5>
    </div>
  `;
  const LoginContainer = parser(LoginContainerStr, "div");

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

  const createBy = document.createElement("div");
  createBy.innerHTML = `${Modal()}`;

  const page = /*html*/ `
    <div class="d-flex justify-content-between align-items-center flex-column" style="height: 50vh;">
    </div>
  `;

  const pageElement = parser(page, "div");

  pageElement.appendChild(LoginContainer);
  pageElement.appendChild(createBy);
  return pageElement;
};

export default LoginPage;
