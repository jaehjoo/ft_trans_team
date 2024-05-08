import { useState } from "../../MyReact.js";

const data = {
  name: "dkham",
  record: {
    OneByOne: {
      win: 2,
      lose: 3,
    },
    Tournament: {
      win: 1,
      lose: 3,
    },
  },
  recent: [
    {
      date: "2021-09-01",
      result: "win",
      partner: "chanwoki",
    },
    {
      date: "2021-09-02",
      result: "lose",
      partner: "chanwoki",
    },
    {
      date: "2021-09-03",
      result: "win",
      partner: "chanwoki",
    },
  ],
};

let myName = "";

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

let flag = false;

const MyPage = () => {
  const [data, setData] = useState(null);
  if (!flag) {
    myPageFetch().then((data) => {
      setData(data);
      flag = true;
    });
  }

  const goHome = () => {
    window.location.pathname = "/main";
  };

  const changeAvatar = () => {
    alert("아바타 변경");
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

  const hair = data ? data.avatar.hair : 0;
  const eye = data ? data.avatar.eye : 0;
  const face = data ? data.avatar.face : 0;
  const body = data ? data.avatar.body : 0;
  const lip = data ? data.avatar.lip : 0;

  return /*html*/ `
  <div class="w-100 p-4 d-flex gap-2">
  <div>
    <h1>${data ? data.user.displayname : ""} 님</h1>
    <div class="d-flex flex-column gap-2 w-100 p-4 rounded" style="background-color: #E6E7E8;">
    <h5>대전 기록</h5>
    <p>[ PingPong ] ${pongTotal} 경기 ${pongWin}승 ${pongLose}패 (${pongPercent}%) Rating : ${pongRating}</p>
    <p>[ Fighting ] ${fightingTotal} 경기 ${fightingWin}승 ${fightingLose}패 
    (${fightingPercent}%) Rating : ${fightingRating}</p>

      

    <button onclick="changeAvatar()" class="btn btn-primary">아바타 변경</button>
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

  <div class="w-50 d-flex flex-column justify-content-center align-items-center position-relative">
    <p>아바타</p>
    <img src=${`../../img/avatar/face/${face}.png`} alt="avatar" class="img-fluid w-25">
    <img class="w-25 img-fluid" src=${`../../img/avatar/body/${body}.png`} alt="avatar" >
    <img class="position-absolute img-fluid" src=${`../../img/avatar/hair/${hair}.png`} alt="avatar" style="top : 10rem; width : 25%;">
    <img class="position-absolute img-fluid" src=${`../../img/avatar/eye/${eye}.png`} alt="avatar" style="top : 12rem; width : 25%;">
    <img class="position-absolute img-fluid" src=${`../../img/avatar/lip/${lip}.png`} alt="avatar" style="top : 13rem;">
  </div>

</div>


  `;
};

export default MyPage;
