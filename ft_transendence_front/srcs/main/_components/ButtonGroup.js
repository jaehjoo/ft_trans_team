import GameModal from "./GameModal";

const ButtonGroup = () => {
  const playButton = () => {
    console.log(
      "Play button clicked!",
      "you should remove event listener here"
    );
  };

  const vsComButton = () => {
    console.log(
      "VS COM button clicked!",
      "you should remove event listener here"
    );
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
  window.vsComButton = vsComButton;
  window.signOutButton = signOutButton;

  return /*html*/ `
  <div class="d-flex flex-column w-100 justify-content-between align-items-center gap-4">
  ${GameModal()}
  <button onclick="vsComButton()" class="btn btn-primary w-75">VS COM</button>
  <button onclick="signOutButton()" class="btn btn-light w-75" style="border : 0.5px solid gray;">Sign out</button>
</div>
  `;
};

export default ButtonGroup;
