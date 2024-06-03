import { Stage } from "./entities/stage.js";
import { Ball } from "./entities/ball.js";
import { Board } from "./entities/board.js";
import { PlayerOne } from "./entities/fighters/playerOne.js";
import { PlayerTwo } from "./entities/fighters/playerTwo.js";
import { Wait } from "./entities/wait.js";
import { Result } from "./entities/res.js";
import { Room } from "./physics/physics.js";

const GameViewport = {
  WIDTH: 1024,
  HEIGHT: 768,
};

export const StartCanvasOne = () => {
  const canvasEl = document.querySelector("canvas");
  const context = canvasEl.getContext("2d");

  canvasEl.width = GameViewport.WIDTH;
  canvasEl.height = GameViewport.HEIGHT;

  const entities = [
    new Stage(GameViewport),
    new Board(GameViewport),
    new Room("one"),
    new Ball(GameViewport),
    new PlayerOne(GameViewport),
    new PlayerTwo(GameViewport),
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

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  window.requestAnimationFrame(start);

  function keyDownHandler(event) {
    if (event.keyCode == 87)
      entities[2].setplayer0barState("up", true);
    if (event.keyCode == 38)
      entities[2].setplayer1barState("up", true);
    if (event.keyCode == 83)
      entities[2].setplayer0barState("down", true);
    if (event.keyCode == 40)
      entities[2].setplayer1barState("down", true);
  }

  function keyUpHandler(event) {
    if (event.keyCode == 87)
      entities[2].setplayer0barState("up", false);
    if (event.keyCode == 38)
      entities[2].setplayer1barState("up", false);
    if (event.keyCode == 83)
      entities[2].setplayer0barState("down", false);
    if (event.keyCode == 40)
      entities[2].setplayer1barState("down", false);
  }
}

export default StartCanvasOne;
