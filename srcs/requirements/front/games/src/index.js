import { Stage } from "./entities/stage.js"
import { Ball } from "./entities/ball.js"
import { Board } from "./entities/board.js"
import { PlayerOne } from "./entities/fighters/playerOne.js"
import { PlayerTwo } from "./entities/fighters/playerTwo.js"
import { Wait } from "./entities/wait.js"
import { Result } from "./entities/res.js"

const GameViewport = {
	WIDTH : 1024,
	HEIGHT : 768,
}

window.addEventListener('load', function() {
	const canvasEl = document.querySelector('canvas');
	const context = canvasEl.getContext('2d');

	canvasEl.width = GameViewport.WIDTH;
	canvasEl.height = GameViewport.HEIGHT;

	const entities = [
		new Stage(GameViewport),
		new Board(GameViewport),
		new Ball(GameViewport),
		new PlayerOne(GameViewport),
		new PlayerTwo(GameViewport),
	]

	const scene = [
		new Wait(GameViewport),
		new Result(GameViewport),
	]

	let flag = {
		START : false,
		STOP : false,
	}

	const ws = new WebSocket("wss://" + window.location.host + "/ws/game/practice");

	let yourName = "";

	let previousTime = 0
	let secondsPassed = 0

	function sceneDraw() {
		context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
		if (flag.START == false) {
			scene[0].draw(context);
		}
		else if (flag.STOP == true) {
			scene[1].draw(context);
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
			}
			else if (textData.data.mode == "set.game") {
				entities[3].name = textData.data.player0;
				entities[4].name = textData.data.player1;
				ws.send(
					JSON.stringify({
						type: 'set.game',
						data: {
							player0: entities[3].name,
							player1: entities[4].name,
						}
					})
				)
			}
			else if (textData.data.mode == "game.start") {
				flag.START = true;
			}
			else if (textData.data.mode == "abnormal.termination") {
				ws.send(
					JSON.stringify({
						type: 'game.clear',
						data: {
							"name" : yourName,
						}
					})
				)
				ws.onclose()
			}
		}
	}

	function updateBar() {
		ws.onmessage = (msg) => {
			let textData = JSON.parse(msg.data);
			if (textData.data.mode == "update.bar"
				&& textData.data['name'] != yourName) {
				if (yourName != entities[3].name) {
					entities[3].bar.X = textData.data['bar']['x']
					entities[3].bar.Y = textData.data['bar']['y']
				}
				else {
					entities[4].bar.X = textData.data['bar']['x']
					entities[4].bar.Y = textData.data['bar']['y']
				}
			}
		}
	}

	function checkWallCollision() {
		if (entities[2].ball.Y + entities[2].velocity.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[2].ball.RADIUS
			|| entities[2].ball.Y + entities[2].velocity.Y < entities[0].borderLine.WIDTH + entities[2].ball.RADIUS)
			entities[2].velocity.Y *= -1
		if (entities[3].bar.Y < entities[0].borderLine.WIDTH)
			entities[3].bar.Y = entities[0].borderLine.WIDTH
		if (entities[3].bar.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[3].bar.HEIGHT)
			entities[3].bar.Y = entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[3].bar.HEIGHT
		if (entities[4].bar.Y < entities[0].borderLine.WIDTH)
			entities[4].bar.Y = entities[0].borderLine.WIDTH
		if (entities[4].bar.Y > entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[4].bar.HEIGHT)
			entities[4].bar.Y = entities[0].background.HEIGHT - entities[0].borderLine.WIDTH - entities[4].bar.HEIGHT
	}

	function checkBarCollision() {
		if (entities[2].ball.X - entities[2].ball.RADIUS < entities[3].bar.X + 10
			&& entities[2].ball.Y + entities[2].velocity.Y >= entities[3].bar.Y
			&& entities[2].ball.Y + entities[2].velocity.Y <= entities[3].bar.Y + entities[3].bar.HEIGHT)
			entities[2].velocity.X *= -1.1;
		if (entities[2].ball.X + entities[2].ball.RADIUS > entities[4].bar.X + entities[4].bar.WIDTH - 10
			&& entities[2].ball.Y + entities[2].velocity.Y >= entities[4].bar.Y
			&& entities[2].ball.Y + entities[2].velocity.Y <= entities[4].bar.Y + entities[4].bar.HEIGHT)
			entities[2].velocity.X *= -1.1;
	}

	function checkBoundary() {
		let win;
		if (entities[2].ball.X < entities[3].bar.X) {
			entities[2].serve += 1
			entities[2].init()
			entities[1].changeScore(1)
		}
		if (entities[2].ball.X > entities[4].bar.X + entities[4].bar.WIDTH) {
			entities[2].serve += 1
			entities[2].init()
			entities[1].changeScore(0)
		}
		entities[1].checkDuce()
		win = entities[1].checkWin()
		if (win) {
			let player;
			if (win == 1)
				player = entities[3].name;
			else
				player = entities[4].name;
			if (player == yourName)
				scene[1].win = 1;
			else
				scene[1].win = 2;
			flag.STOP = true
			ws.send(
				JSON.stringify({
					'type' : 'game.clear',
					'data' : {
						'winner' : player,
					}
				})
			)
		}
	}

	function update() {
		updateBar()
		for (const entity of entities) {
			entity.update()
		}
		checkWallCollision()
		checkBarCollision()
		checkBoundary()
	}

	function sendBarInfo() {
		let bar;
		if (yourName == entities[3].name) {
			bar = {"x" : entities[3].bar.X, "y" : entities[3].bar.Y}
		} else {
			bar = {"x" : entities[4].bar.X, "y" : entities[4].bar.Y}
		}
		ws.send(
			JSON.stringify({
				'type' : 'bar.info',
				'data' : {
					'bar' : {'x' : bar['x'], 'y' : bar['y']}
				}
			})
		)
	}

	function start(time) {
		window.requestAnimationFrame(start);
		secondsPassed = (time - previousTime) / 1000;
		previousTime = time;
		checkWebSocketMessage();
		if (flag.START == false || flag.STOP == true) {
			sceneDraw();
		} else {
			update();
			playingDraw();
			sendBarInfo();
		}
	}

	window.requestAnimationFrame(start)
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(event) {
		let player;
		if (yourName == entities[3].name)
			player = entities[3]
		else
			player = entities[4]
		if (event.keyCode == 87)
			player.upPressed = true
		else if (event.keyCode == 38)
			player.upPressed = true
		else if (event.keyCode == 83)
			player.downPressed = true
		else if (event.keyCode == 40)
			player.downPressed = true
	}
	
	function keyUpHandler(event) {
		let player;
		if (yourName == entities[3].name)
			player = entities[3]
		else
			player = entities[4]
		if (event.keyCode == 87)
			player.upPressed = false
		else if (event.keyCode == 38)
			player.upPressed = false
		else if (event.keyCode == 83)
			player.downPressed = false
		else if ( event.keyCode == 40)
			player.downPressed = false
	}
})