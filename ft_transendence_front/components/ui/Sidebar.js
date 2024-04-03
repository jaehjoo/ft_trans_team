import { useState } from "../../MyReact";

const Friend = (friend) => {
  return /*html*/ `
  <div class="d-flex justify-content-between p-2">
    <div>${friend}</div>
    <button class="btn btn-primary">Chat</button>
  </div>`;
};

const Sidebar = (text, Friends) => {
  const FriendsButtonHanddler = () => {
    console.log(Friends, "you should remove event listener here");
  };

  window.FriendsButtonHanddler = FriendsButtonHanddler;

  return /*html*/ `
  <button onclick="FriendsButtonHanddler()" style="font-size: 15px; height : 35px; margin-top: 5px;" class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">${text}</button>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasRightLabel">Friends</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <hr></hr>
  <div class="offcanvas-body d-flex flex-column gap-4">
    ${Friends.map(Friend).join("")}
  </div>
</div>`;
};

export default Sidebar;
