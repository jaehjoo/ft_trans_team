import { Stage } from "./entities/stage.js";
import { Ball } from "./entities/ball.js";
import { Board } from "./entities/board.js";
import { PlayerOne } from "./entities/fighters/playerOne.js";
import { PlayerTwo } from "./entities/fighters/playerTwo.js";
import { Wait } from "./entities/wait.js";
import { Result } from "./entities/res.js";

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
    new Ball(GameViewport),
    new PlayerOne(GameViewport),
    new PlayerTwo(GameViewport),
  ];

  const scene = [new Wait(GameViewport), new Result(GameViewport)];

  let flag = {
    START: false,
    STOP: false,
  };

  const access_token = localStorage.getItem('access_token')
  const ws = new WebSocket(
    "wss://" + window.location.host + "/ws/game/pongonebyone?access=" + access_token
  );

  let yourName = "";

  let previousTime = 0;
  let secondsPassed = 0;

  function sceneDraw() {
    context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
    if (flag.START == false) {
      scene[0].draw(context);
    } else if (flag.STOP == true)
    {
      scene[1].draw(context);
      ws.close();
      window.addEventListener("click", function() {
        window.location.href = "/login";
      }, {once : true})
    }
  }

  function playingDraw() {
    context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
    for (const entity of entities) {
      entity.draw(context);
    }
  }

  function checkWebSocketMessage() {
    ws.onmessage = (msg) => {
      let textData = JSON.parse(msg.data);
      if (textData.data.mode == "connect") {
        yourName = textData.data.name;
      } else if (textData.data.mode == "set.game") {
        entities[3].name = textData.data.player0;
        entities[4].name = textData.data.player1;
        ws.send(
          JSON.stringify({
            type: "set.game",
            data: {
              player0: entities[3].name,
              player1: entities[4].name,
            },
          })
        );
      } else if (textData.data.mode == "game.start") {
        flag.START = true;
        entities[2].update(textData.data['ball']['x'], textData.data['ball']['y'])
        entities[3].update(textData.data['player0']['x'], textData.data['player0']['y'])
        entities[4].update(textData.data['player1']['x'], textData.data['player1']['y'])
      } else if (textData.data.mode == "info.update") {
        entities[2].update(textData.data['ball']['x'], textData.data['ball']['y'])
        entities[3].update(textData.data['player0']['x'], textData.data['player0']['y'])
        entities[4].update(textData.data['player1']['x'], textData.data['player1']['y'])
        entities[1].update(textData.data['score']['ONE'], textData.data['score']['TWO'])

      } else if (textData.data.mode == "game.complete") {
        flag.STOP = true;
        if (textData.data['winner'] == yourName)
          scene[1].win = 1;
        else
          scene[1].win = 2;
      } else if (textData.data.mode == "abnormal.termination") {
        ws.send(
          JSON.stringify({
            type: "game.clear",
            data: {
              name: yourName,
            },
          })
        );
        ws.close();
        window.location.href = "/login";
      }
    };
  }

  function start(time) {
    window.requestAnimationFrame(start);
    secondsPassed = (time - previousTime) / 1000;
    previousTime = time;
    checkWebSocketMessage(secondsPassed);
    if (flag.START == false || flag.STOP == true) {
      sceneDraw();
    } else {
      playingDraw();
    }
  }

  window.requestAnimationFrame(start);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(event) {
    let player;
    if (yourName == entities[3].name) player = entities[3];
    else player = entities[4];
    if (event.keyCode == 87)
      player.upPressed = true;
    else if (event.keyCode == 38)
      player.upPressed = true;
    else if (event.keyCode == 83)
      player.downPressed = true;
    else if (event.keyCode == 40)
      player.downPressed = true;
      ws.send(
        JSON.stringify({
          'type' : 'bar.info',
          'data' : {
            'name' : yourName,
            'up' : player.upPressed,
            'down' : player.downPressed,
          }
        })
      )
    }

  function keyUpHandler(event) {
    let player;
    if (yourName == entities[3].name) player = entities[3];
    else player = entities[4];
    if (event.keyCode == 87) 
      player.upPressed = false;
    else if (event.keyCode == 38)
      player.upPressed = false;
    else if (event.keyCode == 83)
      player.downPressed = false;
    else if (event.keyCode == 40)
      player.downPressed = false;
    ws.send(
      JSON.stringify({
        'type' : 'bar.info',
        'data' : {
          'name' : yourName,
          'up' : player.upPressed,
          'down' : player.downPressed,
        }
      })
    )
  }
}
export default StartCanvasOne;
