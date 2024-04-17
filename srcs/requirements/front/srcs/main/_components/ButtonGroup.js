import GameModal from "./GameModal.js";

const ButtonGroup = () => {
  const playButton = () => {
    console.log(
      "Play button clicked!",
      "you should remove event listener here"
    );
  };

  const myPageButton = () => {
    console.log(
      "myPage button clicked!",
      "you should remove event listener here"
    );

    window.location.pathname = "/mypage";
  };

  const signOutButton = () => {
    localStorage.removeItem("token"); // temp
    console.log(
      "Sign out button clicked!",
      "you should remove event listener here"
    );
    window.location.pathname = "/login";
  };

  window.playButton = playButton;
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
