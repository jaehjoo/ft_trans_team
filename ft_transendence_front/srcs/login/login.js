import Button from "../../components/ui/Button";
import Modal from "../../components/ui/CreateByModal";

const Login = () => {
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

  const LoginContainer = document.createElement("div");
  LoginContainer.innerHTML = /*html*/ `
  <h1>42 Login</h1>
  <h5>Welcome to 42 Transcendence Ping Pong Game!</h5>
  `;

  LoginContainer.classList.add(
    "d-flex",
    "flex-column",
    "p-4",
    "justify-content-start",
    "align-items-start",
    "w-100",
    "gap-4"
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
    "flex-column"
  );
  page.style.height = "50vh";

  const createBy = document.createElement("div");
  createBy.innerHTML = `${Modal()}`;

  page.appendChild(LoginContainer);
  page.appendChild(createBy);

  return page;
};

export default LoginPage;
