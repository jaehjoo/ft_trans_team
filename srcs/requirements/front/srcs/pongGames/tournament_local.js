import { Stage } from "./entities/stage.js";
import { Ball } from "./entities/ball.js";
import { Board } from "./entities/board.js";
import { PlayerOne } from "./entities/fighters/playerOne.js";
import { PlayerTwo } from "./entities/fighters/playerTwo.js";
import { Wait } from "./entities/wait.js";
import { TournamentResult } from "./entities/tournamentRes.js";

const GameViewport = {
  WIDTH: 1024,
  HEIGHT: 768,
};

export const StartCanvasTournamentLocal = () => {
  const canvasEl = document.querySelector("canvas");
  const context = canvasEl.getContext("2d");

  canvasEl.width = GameViewport.WIDTH;
  canvasEl.height = GameViewport.HEIGHT;

  const entities = [
    new Stage(GameViewport),
    new Board(GameViewport),
    new Ball(GameViewport),
    new PlayerOne(GameViewport),
    new PlayerTwo(GameViewport),
  ];

  const scene = [new Wait(GameViewport), new TournamentResult(GameViewport)];

  let flag = {
    START: false,
    STOP: false,
  };

  let previousTime = 0;
  let secondsPassed = 0;
  let status = 0;

  function setPlayer() {
    if (status === 0) {
        entities[3].name = "player1";
        entities[4].name = "player2";
    } else if (status === 1) {
        entities[3].name = "player3";
        entities[4].name = "player4";
    } else if (status === 2) {
        entities[3].name = scene[1].match1Winner;
        entities[4].name = scene[1].match2Winner;
    }
  }

  function sceneDraw() {
    context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
    if (flag.START == false) {
      setPlayer();
      scene[1].draw(context);
      setTimeout(function() {flag.START = true}, 3000);
    } else if (flag.STOP == true) {
      scene[1].draw(context);
      if (status === 3) {
        document.removeEventListener("keydown", keyDownHandler, false);
        document.removeEventListener("keyup", keyUpHandler, false);
        setTimeout(function() { window.location.href = "/main" }, 1500);
        status++;
      } else {
        flag.STOP = false;
        flag.START = false;
      }
    }
  }

  function playingDraw() {
    context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
    for (const entity of entities) {
      entity.draw(context);
    }
  }

  function checkWallCollision() {
    if ((entities[2].ball.Y + entities[2].velocity.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[2].ball.RADIUS) || (entities[2].ball.Y + entities[2].velocity.Y < entities[0].borderLine.WIDTH + entities[2].ball.RADIUS))
        entities[2].velocity.Y *= -1.2;
    if (entities[3].bar.Y < entities[0].borderLine.WIDTH)
        entities[3].bar.Y = entities[0].borderLine.WIDTH;
    if (entities[3].bar.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[3].bar.HEIGHT)
        entities[3].bar.Y = entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[3].bar.HEIGHT;
    if (entities[4].bar.Y < entities[0].borderLine.WIDTH)
        entities[4].bar.Y = entities[0].borderLine.WIDTH;
    if (entities[4].bar.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[4].bar.HEIGHT)
        entities[4].bar.Y = entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[4].bar.HEIGHT;
  }

  function getHitFactor(barMiddlePoint, barHarfHeight) {
    return ((barMiddlePoint - entities[2].ball.Y) / barHarfHeight) * 1.2;
  }

  function checkBarCollision() {
    let dir;

    if (entities[2].ball.X - entities[2].ball.RADIUS < entities[3].bar.X + 10 && entities[2].ball.Y + entities[2].velocity.Y >= entities[3].bar.Y && entities[2].ball.Y + entities[2].velocity.Y <= entities[3].bar.Y + entities[3].bar.HEIGHT) {
      dir = getHitFactor(entities[3].bar.Y + entities[3].bar.HEIGHT / 2, entities[3].bar.HEIGHT / 2)
      entities[2].velocity.X *= -1.2;
      entities[2].velocity.Y *= dir;
    }
    if (entities[2].ball.X + entities[2].ball.RADIUS > entities[4].bar.X + entities[4].bar.WIDTH - 10 && entities[2].ball.Y + entities[2].velocity.Y >= entities[4].bar.Y && entities[2].ball.Y + entities[2].velocity.Y <= entities[4].bar.Y + entities[4].bar.HEIGHT) {
      dir = getHitFactor(entities[4].bar.Y + entities[4].bar.HEIGHT / 2, entities[4].bar.HEIGHT / 2)
      entities[2].velocity.X *= -1.2;
      entities[2].velocity.Y *= dir;
    }
    if (!entities[2].velocity.Y)
        entities[2].velocity.Y = 3;
  }

  function checkBoundary() {
    if (entities[2].ball.X < entities[3].bar.X) {
      entities[2].serve += 1
      entities[2].init()
      entities[1].score.TWO += 1
    }
    else if (entities[2].ball.X > entities[4].bar.X + entities[4].bar.WIDTH) {
      entities[2].serve += 1
      entities[2].init()
      entities[1].score.ONE += 1
   }
  }

  function update_physics() {
    checkWallCollision();
    checkBarCollision();
    checkBoundary();
  }

  function checkScore() {
    if (entities[1].score.ONE == entities[1].score.TWO && entities[1].score.ONE > 9) {
        entities[1].score.WIN = entities[1].ONE + 2
    }
    if (entities[1].score.ONE > entities[1].score.TWO && entities[1].score.ONE == entities[1].score.WIN) {
        if (status === 0)
            scene[1].match1Winner = entities[3].name;
        else if (status === 1)
            scene[1].match2Winner = entities[3].name;
        else
            scene[1].match3Winner = entities[3].name;
        status++;
        flag.STOP = true;
        entities[1].init();
    } else if (entities[1].score.ONE < entities[1].score.TWO && entities[1].score.TWO == entities[1].score.WIN) {
        if (status === 0)
            scene[1].match1Winner = entities[4].name;
        else if (status === 1)
            scene[1].match2Winner = entities[4].name;
        else
            scene[1].match3Winner = entities[4].name;
        status++;
        flag.STOP = true;
        entities[1].init();
    }
  }

  function update() {
    for (const entitiy of entities) {
      entitiy.update_local();
    }
    update_physics();
    checkScore();
  }

  function start(time) {
    window.requestAnimationFrame(start);
    secondsPassed = (time - previousTime) / 1000;
    previousTime = time;
    if (flag.START == false || flag.STOP == true) {
      sceneDraw();
    } else {
      update();
      playingDraw();
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  scene[1].setPlayerInfo(["player1", "player2", "player3", "player4"]);
  window.requestAnimationFrame(start);

  function keyDownHandler(event) {
    if (event.keyCode == 87)
      entities[3].upPressed = true;
    if (event.keyCode == 38)
      entities[4].upPressed = true;
    if (event.keyCode == 83)
      entities[3].downPressed = true;
    if (event.keyCode == 40)
      entities[4].downPressed = true;
  }

  function keyUpHandler(event) {
    if (event.keyCode == 87)
      entities[3].upPressed = false;
    if (event.keyCode == 38)
      entities[4].upPressed = false;
    if (event.keyCode == 83)
      entities[3].downPressed = false;
    if (event.keyCode == 40)
      entities[4].downPressed = false;
  }
}

export default StartCanvasTournamentLocal;
