const Players = [
  {
    name: "Player 1",
    score: 0,
  },
  {
    name: "Player 2",
    score: 0,
  },
  {
    name: "Player 3",
    score: 0,
  },
  {
    name: "Player 4",
    score: 0,
  },
];

const OneVersusOne = () => {
  const StartButton = () => {
    console.log("Start", "you should remove event listener");
  };

  window.StartOneGame = StartButton;

  return /*html*/ `
  <div style="height : 70vh;" class="d-flex justify-content-center align-items-center gap-4">

    <div class="d-flex justify-content align-items-center gap-4 flex-column">

      ${Players.map((player, index) => {
        return /*html*/ `
        <div class="card" style="width: 12rem;">
          <div class="card-body">
            <h5 class="card-title">${player.name}</h5>
            <p class="card-text">${player.score}</p>
          </div>
        </div>
        ${index % 2 === 0 ? "<div>VS</div>" : "<hr></hr>"}

        `;
      }).join("")}
    </div>

  <div></div>
  <div></div>

    <div class="d-flex justify-content align-items-center gap-4 flex-column">

      <div class="card" style="width: 12rem;">
        <div class="card-body">
          <h5 class="card-title">Winner 1</h5>
          <p class="card-text">Winner score</p>
        </div>
      </div>
      <div>VS</div>
      <div class="card" style="width: 12rem;">
        <div class="card-body">
        <h5 class="card-title">Winner 2</h5>
        <p class="card-text">Winner score</p>
      </div>
    </div>

  </div>

  <div></div>
  <div></div>

  <div class="d-flex justify-content align-items-center gap-4 flex-column">

      <div class="card" style="width: 12rem;">
        <div class="card-body">
          <h5 class="card-title">Winner 1</h5>
          <p class="card-text">Winner score</p>
        </div>
      </div>
  </div>

    <div style="position: fixed; bottom : 250px;" class="w-100 d-flex justify-content-between p-4">
    <a href="/join"><button class="btn btn-danger" style="width: 100px;">Leave</button></a>
    <button class="btn btn-primary" style="width: 100px;" onclick="StartOneGame()">Start</button>
    </div>
  </div>
  `;
};

export default OneVersusOne;
