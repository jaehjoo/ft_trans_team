const data = {
  score: [14, 2],
  winner: "player1",
};

const GameResult = () => {
  return /*html*/ `
  <div class="d-flex w-100 flex-column gap-2 p-4" style="height: 70vh;">
    <h1>Game Result</h1>
    <div class="d-flex flex-column w-100 justify-content-between align-items-center" style="height : 80%;">

    <h2>Winner : Player 1</h2>

      <div class="card" style="width: 18rem;">
        <img src="http://via.placeholder.com/640x480" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${data.winner}</h5>
        <p class="card-text">Score : ${data.score[0]} - ${data.score[1]}</p>
        </div>
      </div>

      
      <a href="/main"><button class="btn btn-primary">Main Menu</button></a>
    </div>
  `;
};

export default GameResult;
