import { useState } from "../../MyReact";

const CreatePage = () => {
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "") {
      return;
    }

    if (e.target[0].value === "") {
      return;
    }

    console.log("submit", e.target[0].value);
    if (isPrivate === true) {
      console.log("submit", e.target[1].value, isPrivate);
    }
    console.log("you should remove event listener here");
  };

  const clickRoomType = (type) => {
    setType(type);
    console.log("you should remove event listener here");
  };

  const switchHanddle = () => {
    setIsPrivate(!isPrivate);
    console.log("you should remove event listener here");
  };

  window.handleSubmitRoom = handleSubmit;
  window.clickRoomType = clickRoomType;
  window.switchHanddle = switchHanddle;

  return /*html*/ `
    <div class="d-flex justify-content-between align-items-center p-4" style="height : 40vh;">
    <div class="w-100 justify-content-center align-items-center d-flex flex-column">
  
    <h1 style=${type === "one" ? "color:red;" : ""}> 1 VS 1 ${
    type === "one" ? "✅" : ""
  }</h1>
    
    
    <img onclick="clickRoomType('one')" class="rounded" src="../../public/img/oneByone.jpeg" alt="oneByone" style="width : 45%;">
    </div>
    <div class="w-100 justify-content-center align-items-center d-flex flex-column">
    <h1 style=${type === "two" ? "color:red;" : ""}> Tournament ${
    type === "two" ? "✅" : ""
  }</h1>
    
    <img onclick="clickRoomType('two')" class="rounded" src="../../public/img/tournament.jpeg" alt="tournament" style="width : 40%;" >
    </div>
    </div>
    <div>

    <div class="form-check form-switch d-flex justify-content-center align-items-center gap-2" onchange="switchHanddle()">
    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck" ${
      isPrivate === true ? "checked" : ""
    }>
    <div class="form-check-label">Private Room</div>
    </div>

    <form onsubmit="handleSubmitRoom(event)" id="2faForm" class="d-flex flex-column gap-4 p-4 justify-content-center align-items-center" style="height : 25vh;">
        <div class="form-group w-50">
          <label htmlfor="room-name">Room Name</label>
          <input id="room-name" type="text" class="form-control" id="2fa" placeholder="Room name">
        </div>

        ${
          isPrivate === true
            ? /* html */
              `<div class="form-group w-50">
        <label htmlfor="room-password">Room Password</label>
        <input id="room-password" type="text" class="form-control" id="2fa" placeholder="Room password">
        </div>`
            : ""
        }
        
        
        <button type="submit" class="btn btn-primary w-50">Submit</button>
    </div>
    </form>
    
    
    
  `;
};

export default CreatePage;
