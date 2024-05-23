import GameModal from "./GameModal.js";

const ButtonGroup = () => {
  const myPageButton = () => {
    window.location.pathname = "/mypage";
  };

  const signOutButton = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": localStorage.getItem("csrf_token"),
      },
      body: JSON.stringify({
        access: localStorage.getItem("access_token"),
      }),
    });
    const data = await res.json();

    localStorage.clear();
    window.location.pathname = "/login";
  };

  window.myPageButton = myPageButton;
  window.signOutButton = signOutButton;

  return /*html*/ `
  <div class="d-flex flex-column w-100 justify-content-between align-items-center gap-4">
  ${GameModal()}
  <button onclick="myPageButton()" class="btn btn-primary w-75">My Page</button>
  <button onclick="signOutButton()" class="btn btn-light w-75" style="border : 0.5px solid gray;">Sign out</button>
</div>
  `;
};

export default ButtonGroup;
