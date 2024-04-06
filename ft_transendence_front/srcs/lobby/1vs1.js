const Players = [
  {
    name: "Player 1",
    score: 0,
  },
  {
    name: "Player 2",
    score: 0,
  },
];

const OneVersusOne = () => {
  const StartButton = () => {
    console.log("Start", "you should remove event listener");
  };

  const LeaveButton = () => {
    console.log("Leave", "you should remove event listener");
    window.location.href = "/join";
  };

  window.StartGame = StartButton;
  window.LeaveGame = LeaveButton;

  return /*html*/ `
  <div style="height : 70vh;" class="d-flex justify-content-center align-items-center gap-4">


  <div class="d-flex gap-4">
    <div class="card" style="width: 18rem;">
      <img src="http://via.placeholder.com/640x480" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">Player 1</h5>
        <p class="card-text">최근 전적 어쩌구</p>
      </div>
    </div>

    <h1 class="d-flex justify-content-center align-items-center">VS</h1>

    <div class="card" style="width: 18rem;">
      <img src="http://via.placeholder.com/640x480 " class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">Player 2</h5>
        <p class="card-text">최근 전적 어쩌구</p>
      </div>
    </div>
  </div>

    

    <div style="position: fixed; bottom : 250px;" class="w-100 d-flex justify-content-between p-4">
      <button class="btn btn-danger" style="width: 100px;" onclick="LeaveGame()">Leave</button>
      <button class="btn btn-primary" style="width: 100px;" onclick="StartGame()">Start</button>
    </div>

  </div>
  `;
};

export default OneVersusOne;
