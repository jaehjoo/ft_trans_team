import { SelectScene } from "./Scene/Select/select.js"
import { BattleScene } from "./Scene/Battle/battle.js"
import { ResultScene } from "./Scene/Result/result.js"
import { SceneManager } from "./SceneManager.js"
import { websocketTerminate } from "./handlers/websocketHandler.js"
import { registerKeyboardEvents } from "./handlers/keyEventHandler.js"
import { PlayerInfo } from "./constants/fighter.js"

export class TimeFighter {
	constructor(ws) {
		this.yourName = "";
		this.displayNmae = "";
		this.ws = ws;
		this.frameTime = {
			previous: 0,
			secondsPassed: 0,
		}
		this.flag = {
			connected: false,
			set: false,
		}
		this.sceneManager = new SceneManager()
	}

	registerScenes() {
		this.sceneManager.addScene("select", new SelectScene(this.ws, this.yourName))
		this.sceneManager.addScene("battle", new BattleScene(this.ws, this.yourName))
		this.sceneManager.addScene("result", new ResultScene(this.ws, this.yourName))
	}

	connectWebsocket() {
		this.ws.onmessage = (msg) => {
			let textData = JSON.parse(msg.data);
			console.log(textData.data.mode);
			if (textData.data.mode == "connect") {
				this.yourName = textData.data['name'];
				this.displayName = textData.data['displayName'];
			}
			else if (textData.data.mode == "set.game") {
				PlayerInfo[0].name = textData.data['player0'];
				PlayerInfo[0].display = textData.data['player0display'];
				PlayerInfo[1].name = textData.data['player1'];
				PlayerInfo[1].display = textData.data['player1display'];
				this.ws.send(
					JSON.stringify({
						type: 'set.game',
						data: {
							player0: PlayerInfo[0].name,
							player1: PlayerInfo[1].name,
						}
					})
				)
			}
			else if (textData.data.mode == "game.start") {
				this.flag.connected = true;
				registerKeyboardEvents();
			}
		}
	}

	loop(time) {
		if (this.sceneManager.FINAL == true) {
			window.cancelAnimationFrame(this.start.bind(this));
		}
		this.frameTime = {
			secondsPassed: (time - this.frameTime.previous) / 1000,
			previous: time,
		}
		this.sceneManager.checkScene(this.frameTime);
	}

	start(time) {
		websocketTerminate(this.ws);
		if (!this.flag.connected)
			this.connectWebsocket();
		if (this.flag.connected && !this.flag.set) {
			this.registerScenes();
			this.sceneManager.setCurrentScene("select");
			this.flag.set = true;
		}
		if (this.flag.connected && this.flag.set) {
			this.loop(time)
		}
		window.requestAnimationFrame(this.start.bind(this));
	}
}