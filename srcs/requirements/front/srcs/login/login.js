import Modal from "../../components/ui/CreateByModal.js";

const Login = () => {
  const loginButtonClickHandler = () => {
    console.log("login 후에 API 연결 후 이벤트 리스너 제거");

    window.location.href = "/2fa";
  };

  window.loginButtonClickHandler = loginButtonClickHandler;

  return /*html*/ `
    <div class="d-flex flex-column p-4 justify-content-start align-items-start w-100 gap-4">
      <h1>42 Login</h1>
      <h5>Welcome to 42 Transcendence Ping Pong Game!</h5>
      <div class="d-flex w-100 justify-content-center align-items-center mt-5">
      <button class="btn btn-light d-flex gap-2" onclick="loginButtonClickHandler()" style="border : 0.5px solid gray">
        <img src="../../img/42.png" alt="42 logo" style="width: 25px;">
        <span>Sign in with 42 intra</span>
      </button>
      </div>
    </div>
  `;
};

const LoginPage = () => {
  return /*html*/ `
    <div class="d-flex justify-content-between align-items-center flex-column" style="height: 50vh;">
    ${Login()}
    <div>${Modal()}</div>
    </div>
    `;
};

export default LoginPage;