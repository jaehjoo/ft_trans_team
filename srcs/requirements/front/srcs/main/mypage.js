import { useState } from "../../MyReact.js";

const myPageFetch = async () => {
  const access = localStorage.getItem("access_token") || "null";
  const response = await fetch(`/api/info?access=${access}`, {
    method: "GET",
    "Content-Type": "application/json",
  });
  const data = await response.json();
  console.log(data);
  return data;
};

const avatarChange = async (data) => {
  try {
    const response = await fetch(`/api/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": localStorage.getItem("csrf_token"),
      },
      body: JSON.stringify(data),
    });

    window.location.pathname = "/mypage";
  } catch (e) {
    console.log(e);
    localStorage.clear();
    window.location.pathname = "/login";
  }
};

let flag = false;

const MyPage = () => {
  const [data, setData] = useState(null);

  const [hair, setHair] = useState(0);
  const [eye, setEye] = useState(0);
  const [face, setFace] = useState(0);
  const [body, setBody] = useState(0);
  const [lip, setLip] = useState(0);

  const [form, setForm] = useState(false);

  if (!flag) {
    myPageFetch().then((data) => {
      setData(data);
      setHair(data.avatar.hair);
      setEye(data.avatar.eye);
      setFace(data.avatar.face);
      setBody(data.avatar.body);
      setLip(data.avatar.lip);
      flag = true;
    });
  }

  const goHome = () => {
    window.location.pathname = "/main";
  };

  const changeAvatar = (event) => {
    event.preventDefault();
    setForm(!form);

    if (form) {
      const data = {
        access: localStorage.getItem("access_token"),
        avatar: {
          hair: event.target.hair.value,
          eye: event.target.eye.value,
          face: event.target.face.value,
          body: event.target.body.value,
          lip: event.target.lip.value,
        },
      };
      avatarChange(data);
    }
  };

  const changeComponent = (component, value) => {
    switch (component) {
      case "hair":
        setHair(value);
        break;
      case "eye":
        setEye(value);
        break;
      case "face":
        setFace(value);
        break;
      case "body":
        setBody(value);
        break;
      case "lip":
        setLip(value);
        break;
      default:
        break;
    }
  };

  const deleteAccount = async () => {
    const data = {
      access: localStorage.getItem("access_token"),
    };
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": localStorage.getItem("csrf_token"),
      },
      body: JSON.stringify(data),
    });
    localStorage.clear();
    window.location.href = "/login";
  };

  window.goHome = goHome;
  window.changeAvatar = changeAvatar;
  window.deleteAccount = deleteAccount;
  window.changeComponent = changeComponent;

  const pongWin = data ? data.ponggame_record.win : 0;
  const pongLose = data ? data.ponggame_record.lose : 0;
  const pongTotal = pongWin + pongLose;
  const pongRating = data ? data.ponggame_record.rating : 0;
  const pongPercent =
    pongTotal === 0 ? 0 : Math.floor((pongWin / pongTotal) * 100);

  const fightingWin = data ? data.fightinggame_record.win : 0;
  const fightingLose = data ? data.fightinggame_record.lose : 0;
  const fightingTotal = fightingWin + fightingLose;
  const fightingRating = data ? data.fightinggame_record.rating : 0;
  const fightingPercent =
    fightingTotal === 0 ? 0 : Math.floor((fightingWin / fightingTotal) * 100);

  return /*html*/ `
  <div class="w-100 p-4 d-flex gap-2 justify-content-center">
  <div class="w-50">
    <h1>${data ? data.user.displayname : ""} 님</h1>
    <div class="d-flex flex-column gap-2 w-100 p-4 rounded" style="background-color: #E6E7E8;">
    <h5>대전 기록</h5>
    <p>[ PingPong ] ${pongTotal} 경기 ${pongWin}승 ${pongLose}패 (${pongPercent}%) Rating : ${pongRating}</p>
    <p>[ Fighting ] ${fightingTotal} 경기 ${fightingWin}승 ${fightingLose}패 
    (${fightingPercent}%) Rating : ${fightingRating}</p>

      
    ${
      form
        ? /*html*/ `
    <form class="d-flex flex-column gap-2 justify-content-center align-items-center mt-2 mb-2" onsubmit="changeAvatar(event)">

    <p>hair</p>
    <div class="d-flex gap-2">
      <input onclick="changeComponent('${`hair`}', 0)" type="radio" name="hair" value="0" ${
            hair === 0 ? "checked" : ""
          }>0</input>
      <input onclick="changeComponent('${`hair`}', 1)" type="radio" name="hair" value="1" ${
            hair === 1 ? "checked" : ""
          }>1</input>
      <input onclick="changeComponent('${`hair`}', 2)" type="radio" name="hair" value="2" ${
            hair === 2 ? "checked" : ""
          }>2</input>
      <input onclick="changeComponent('${`hair`}', 3)" type="radio" name="hair" value="3" ${
            hair === 3 ? "checked" : ""
          }>3</input>
    </div>

    <p>eye</p>
    <div class="d-flex gap-2">
      <input onclick="changeComponent('${`eye`}', 0)" type="radio" name="eye" value="0" ${
            eye === 0 ? "checked" : ""
          }>0</input>
      <input onclick="changeComponent('${`eye`}', 1)" type="radio" name="eye" value="1" ${
            eye === 1 ? "checked" : ""
          }>1</input>
      <input onclick="changeComponent('${`eye`}', 2)" type="radio" name="eye" value="2" ${
            eye === 2 ? "checked" : ""
          }>2</input>
      <input onclick="changeComponent('${`eye`}', 3)" type="radio" name="eye" value="3" ${
            eye === 3 ? "checked" : ""
          }>3</input>
    </div>

    <p>lip</p>
    <div class="d-flex gap-2">
      <input onclick="changeComponent('${`lip`}', 0)" type="radio" name="lip" value="0" ${
            lip === 0 ? "checked" : ""
          }>0</input>
      <input onclick="changeComponent('${`lip`}', 1)" type="radio" name="lip" value="1" ${
            lip === 1 ? "checked" : ""
          }>1</input>
      <input onclick="changeComponent('${`lip`}', 2)" type="radio" name="lip" value="2" ${
            lip === 2 ? "checked" : ""
          }>2</input>
      <input onclick="changeComponent('${`lip`}', 3)" type="radio" name="lip" value="3" ${
            lip === 3 ? "checked" : ""
          }>3</input>
    </div>

    <p>face</p>
    <div class="d-flex gap-2">
      <input onclick="changeComponent('${`face`}', 0)" type="radio" name="face" value="0" ${
            face === 0 ? "checked" : ""
          }>0</input>
      <input onclick="changeComponent('${`face`}', 1)" type="radio" name="face" value="1" ${
            face === 1 ? "checked" : ""
          }>1</input>
      <input onclick="changeComponent('${`face`}', 2)" type="radio" name="face" value="2" ${
            face === 2 ? "checked" : ""
          }>2</input>
    </div>

    <p>body</p>
    <div class="d-flex gap-2">
      <input onclick="changeComponent('${`body`}', 0)" type="radio" name="body" value="0" ${
            body === 0 ? "checked" : ""
          }>0</input>
      <input onclick="changeComponent('${`body`}', 1)" type="radio" name="body" value="1" ${
            body === 1 ? "checked" : ""
          }>1</input>
      <input onclick="changeComponent('${`body`}', 2)" type="radio" name="body" value="2" ${
            body === 2 ? "checked" : ""
          }>2</input>
    </div>

    <div>
      <button type="submit" class="btn btn-primary">change !!</button>
    </div>
  </form>
    `
        : ""
    }


    <button onclick="changeAvatar(event)" class="btn btn-primary">아바타 변경</button>
    <button onclick="goHome()" class="btn btn-secondary">Go Home</button>
    

    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      Delete Account
    </button>


    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Are you Sure ?</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete your account?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" onclick="deleteAccount()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  </div>

  <div class="w-50 d-flex flex-column justify-content-center align-items-center">
    <p>아바타</p>
    <div class="position-relative d-flex flex-column align-items-center">
    <img src=${`../../img/avatar/face/${face}.png`} alt="avatar" class="img-fluid w-25">
    <img class="w-25 img-fluid" src=${`../../img/avatar/body/${body}.png`} alt="avatar" >
    <img class="position-absolute img-fluid" src=${`../../img/avatar/hair/${hair}.png`} alt="avatar" style="top : -0.3rem; width : 25%;">
    <img class="position-absolute img-fluid" src=${`../../img/avatar/eye/${eye}.png`} alt="avatar" style="top : 2rem; width : 25%;">
    <img class="position-absolute img-fluid" src=${`../../img/avatar/lip/${lip}.png`} alt="avatar" style="top : 4rem; width : 7%;">
    </div>
  </div>

</div>


  `;
};

export default MyPage;
