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

const MyPage = () => {
  const oneTotal = data.record.OneByOne.win + data.record.OneByOne.lose;
  const TournamentTotal =
    data.record.Tournament.win + data.record.Tournament.lose;

  const goHome = () => {
    window.location.pathname = "/main";
  };

  const changeAvatar = () => {
    alert("아바타 변경");
  };

  const deleteAccount = () => {
    alert("계정 삭제");
  };

  window.goHome = goHome;
  window.changeAvatar = changeAvatar;
  window.deleteAccount = deleteAccount;

  return /*html*/ `
  <div class="w-100 p-4 d-flex flex-column gap-2">
    <h1>${data.name} 님</h1>
    <div class="d-flex flex-column gap-2 w-100 p-4 rounded" style="background-color: #E6E7E8;">
    <h5>대전 기록</h5>
    <p>[ 1 vs 1 ] ${oneTotal} 경기 ${data.record.OneByOne.win}승 ${
    data.record.OneByOne.lose
  }패 (${Math.floor((data.record.OneByOne.win / oneTotal) * 100)}%)</p>
    <p>[ Tournament ] ${TournamentTotal} 경기 ${data.record.Tournament.win}승 ${
    data.record.Tournament.lose
  }패 
    (${Math.floor((data.record.Tournament.win / TournamentTotal) * 100)}%)</p>

      <div>
        <h5>최근 3 경기</h5>
        ${data.recent
          .map((e, idx) => {
            return /*html*/ `
          <div key=${idx} class="d-flex flex-column">
          <p style="margin-bottom : 0;">${e.date}</p>
            <div class="d-flex gap-1">
              <p>vs ${e.partner}</p>
              <p style="${e.result === "win" ? "color: blue;" : "color: red;"}">
              ${e.result === "win" ? "Win" : "Lose"}</p>
            </div>
          </div>
          `;
          })
          .join("")}
      </div>
    </div>

    <button onclick="changeAvatar()" class="btn btn-primary">아바타 변경</button>
    <button onclick="goHome()" class="btn btn-secondary">Go Home</button>
    

    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      Delete Account
    </button>

<!-- Modal -->
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
  `;
};

export default MyPage;
