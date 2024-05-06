import GameModal from "./GameModal.js";

// ccess : access_token, user : { 변경하고 싶은 값을 GET과 동일한 key값으로 value만 변경해서 넣어주세요 }, avatar : { 변경하고 싶은 값을 GET과 동일한 key값으로 value만 변경해서 넣어주세요 }

const ButtonGroup = () => {
  // const data = {
  //   access: localStorage.getItem("access_token"),
  //   avatar: {
  //     hair: 1,
  //   },
  // };

  // user: {
  //   displayname: "kcw",
  // },

  // avatar : {
  //   hair : 1
  // }

  // const data = {
  //   friend_name: "jjh",
  //   mode: "add",
  //   access: localStorage.getItem("access_token"),
  // };

  // const playButton = async () => {
  //   const res = await fetch(`/api/friends`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "X-CSRFToken": localStorage.getItem("csrf_token"),
  //     },
  //     body: JSON.stringify(data),
  //   });
  // };

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
