import { Stage } from "./entities/stage.js";
import { Ball } from "./entities/ball.js";
import { Board } from "./entities/board.js";
import { PlayerOne } from "./entities/fighters/playerOne.js";
import { PlayerTwo } from "./entities/fighters/playerTwo.js";
import { PlayerThree } from "./entities/fighters/playerThree.js";
import { PlayerFour } from "./entities/fighters/playerFour.js";
import { Wait } from "./entities/wait.js";
import { Result } from "./entities/res.js";

const GameViewport = {
  WIDTH: 1024,
  HEIGHT: 768,
};

export const StartCanvasTeamLocal = () => {
  const canvasEl = document.querySelector("canvas");
  const context = canvasEl.getContext("2d");

  canvasEl.WIDTH = GameViewport.WIDTH;
  canvasEl.HEIGHT = GameViewport.HEIGHT;

  const entities = [
    new Stage(GameViewport),
    new Board(GameViewport),
    new Ball(GameViewport),
    new PlayerOne(GameViewport),
    new PlayerTwo(GameViewport),
    new PlayerThree(GameViewport),
    new PlayerFour(GameViewport),
  ];

  const scene = [new Wait(GameViewport), new Result(GameViewport)];

  let flag = {
    START: false,
    STOP: false,
  };

  let previousTime = 0;
  let secondsPassed = 0;

  function sceneDraw() {
    context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
    if (flag.START == false) {
      scene[0].draw(context);
      flag.START = true;
      setTimeout(function() {}, 1000);
    } else if (flag.STOP == true) {
      scene[1].draw(context);
      document.removeEventListener("keydown", keyDownHandler, false);
      document.removeEventListener("keyup", keyUpHandler, false);
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
    if (entities[3].bar.Y > entities[0].background.HEIGHT / 2 - entities[3].bar.HEIGHT)
        entities[3].bar.Y = entities[0].background.HEIGHT / 2 - entities[3].bar.HEIGHT;
    if (entities[4].bar.Y < entities[0].background.HEIGHT / 2)
        entities[4].bar.Y = entities[0].background.HEIGHT / 2;
    if (entities[4].bar.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[4].bar.HEIGHT)
        entities[4].bar.Y = entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[4].bar.HEIGHT;
    if (entities[5].bar.Y < entities[0].borderLine.WIDTH)
        entities[5].bar.Y = entities[0].borderLine.WIDTH;
    if (entities[5].bar.Y > entities[0].background.HEIGHT / 2 - entities[5].bar.HEIGHT)
        entities[5].bar.Y = entities[0].background.HEIGHT / 2 - entities[5].bar.HEIGHT
    if (entities[6].bar.Y < entities[0].background.HEIGHT / 2)
        entities[6].bar.Y = entities[0].background.HEIGHT / 2
    if (entities[6].bar.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[6].bar.HEIGHT)
        entities[6].bar.Y = entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[6].bar.HEIGHT;
  }

  function getHitFactor(barMiddlePoint, barHarfHEIGHT) {
    return ((barMiddlePoint - entities[2].ball.Y) / barHarfHEIGHT) * 1.2;
  }

  function checkBarCollision() {
    let dir;

    if (entities[2].ball.X - entities[2].ball.RADIUS < entities[3].bar.X + 10 && entities[2].ball.Y + entities[2].velocity.Y >= entities[3].bar.Y && entities[2].ball.Y + entities[2].velocity.Y <= entities[3].bar.Y + entities[3].bar.HEIGHT) {
        dir = getHitFactor(entities[3].bar.Y + entities[3].bar.HEIGHT / 2, entities[3].bar.HEIGHT / 2);
        entities[2].velocity.X *= -1.2;
        entities[2].velocity.Y *= dir;
    }
    if (entities[2].ball.X - entities[2].ball.RADIUS < entities[4].bar.X + 10 && entities[2].ball.Y + entities[2].velocity.Y >= entities[4].bar.Y && entities[2].ball.Y + entities[2].velocity.Y <= entities[4].bar.Y + entities[4].bar.HEIGHT) {
        dir = getHitFactor(entities[4].bar.Y + entities[4].bar.HEIGHT / 2, entities[4].bar.HEIGHT / 2);
        entities[2].velocity.X *= -1.2;
        entities[2].velocity.Y *= dir;
    }
    if (entities[2].ball.X + entities[2].ball.RADIUS > entities[5].bar.X + entities[5].bar.WIDTH - 10 && entities[2].ball.Y + entities[2].velocity.Y >= entities[5].bar.Y && entities[2].ball.Y + entities[2].velocity.Y <= entities[5].bar.Y + entities[5].bar.HEIGHT) {
        dir = getHitFactor(entities[5].bar.Y + entities[5].bar.HEIGHT / 2, entities[5].bar.HEIGHT / 2);
        entities[2].velocity.X *= -1.2;
        entities[2].velocity.Y *= dir;
    }
    if (entities[2].ball.X + entities[2].ball.RADIUS > entities[6].bar.X + entities[6].bar.WIDTH - 10 && entities[2].ball.Y + entities[2].velocity.Y >= entities[6].bar.Y && entities[2].ball.Y + entities[2].velocity.Y <= entities[6].bar.Y + entities[6].bar.HEIGHT) {
        dir = getHitFactor(entities[6].bar.Y + entities[6].bar.HEIGHT / 2, entities[6].bar.HEIGHT / 2)
        entities[2].velocity.X *= -1.2;
        entities[2].velocity.Y *= dir;
    }
    if (!entities[2].velocity.Y)
        entities[2].velocity.Y = 3;
  }

  function checkBoundary() {
    if (entities[2].ball.X < entities[3].bar.X) {
        entities[2].serve += 1;
        entities[2].init();
        entities[1].score.TWO += 1;
    }
    else if (entities[2].ball.X > entities[5].bar.X + entities[5].bar.WIDTH) {
        entities[2].serve += 1;
        entities[2].init();
        entities[1].score.ONE += 1;
    }
  }

  function update_physics() {
    checkWallCollision();
    checkBarCollision();
    checkBoundary();
  }

  function checkScore() {
    if (entities[1].score.ONE > entities[1].score.TWO && entities[1].score.ONE == entities[1].score.WIN) {
        entities[2].winner = entities[3].name;
        entities[2].winner2 = entities[4].name;
        flag.STOP = true;
        window.addEventListener("click", function () {
          window.location.href = "/main";
        }, {once : true});
    }
    else if (entities[1].score.TWO > entities[1].score.TWO && entities[1].score.TWO == entities[1].score.WIN) {
        entities[2].winner = entities[5].name;
        entities[2].winner2 = entities[6].name;
        flag.STOP = true;
        window.addEventListener("click", function () {
          window.location.href = "/main";
        }, {once : true});
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
    update();
    if (flag.START == false || flag.STOP == true) {
      sceneDraw();
    } else {
      playingDraw();
    }
  }

  function init() {
    entities[3].name = "player1";
    entities[4].name = "player2";
    entities[5].name = "player3";
    entities[6].name = "player4";
    entities[3].init(entities[0].background.WIDTH / 50, entities[0].background.HEIGHT / 4 - entities[0].background.HEIGHT / 14)
    entities[4].init(entities[0].background.WIDTH / 50, entities[0].background.HEIGHT / 4 * 3 - entities[0].background.HEIGHT / 14)
    entities[5].init(entities[0].background.WIDTH / 50 * 48 + 3, entities[0].background.HEIGHT / 4 - entities[0].background.HEIGHT / 14)
    entities[6].init(entities[0].background.WIDTH / 50 * 48 + 3, entities[0].background.HEIGHT / 4 * 3 - entities[0].background.HEIGHT / 14)
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  init();
  window.requestAnimationFrame(start);

  function keyDownHandler(event) {
    if (event.keyCode == 87)
      entities[3].upPressed = true;
    if (event.keyCode == 89)
      entities[4].upPressed = true;
    if (event.keyCode == 79)
      entities[5].upPressed = true;
    if (event.keyCode == 38)
      entities[6].upPressed = true;
    if (event.keyCode == 83)
      entities[3].downPressed = true;
    if (event.keyCode == 72)
      entities[4].downPressed = true;
    if (event.keyCode == 76)
      entities[5].downPressed = true;
    if (event.keyCode == 40)
      entities[6].downPressed = true;
  }

  function keyUpHandler(event) {
    if (event.keyCode == 87)
      entities[3].upPressed = false;
    if (event.keyCode == 89)
      entities[4].upPressed = false;
    if (event.keyCode == 79)
      entities[5].upPressed = false;
    if (event.keyCode == 38)
      entities[6].upPressed = false;
    if (event.keyCode == 83)
      entities[3].downPressed = false;
    if (event.keyCode == 72)
      entities[4].downPressed = false;
    if (event.keyCode == 76)
      entities[5].downPressed = false;
    if (event.keyCode == 40)
      entities[6].downPressed = false;
  }
}

export default StartCanvasTeamLocal;
