import { GameViewport } from "../../constants/window.js";
import { PlayerInfo } from "../../constants/fighter.js";
import { result } from "../../constants/image.js";
import { removeKeyboardEvents } from "../../handlers/keyEventHandler.js";

export class ResultScene {
	context = this.getContext();
	constructor(ws, yourName) {
		this.ws = ws;
		this.win = new Image();
		this.lose = new Image();
		this.owner = yourName
		this.complete = false;
		this.START = true;
		this.STOP = false;
		this.FINAL = false;
		this.win.src = result["win"];
		this.lose.src = result["lose"];
	}

	getContext() {
		const canvasEl = document.querySelector("canvas");
		const context = canvasEl.getContext("2d");

		return context;
	}

	checkWebsocketMessage() {
		this.ws.onmessage = (msg) => {
			let textData = JSON.parse(msg.data);

			if (textData.data.mode == "complete.result") {
				this.unload();
			}
		}
	}

	initInfo() {
	}

	unload() {
		this.ws.close(1000, "Complete Game");
		this.FINAL = true;
	}

	load(time) {
		this.checkWebsocketMessage();
		if (PlayerInfo[2].winner == this.owner)
			this.context.drawImage(this.win, 0, 0, 1024, 768, 0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
		else
			this.context.drawImage(this.lose, 0, 0, 1024, 768, 0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
		if (!this.complete) {
			this.ws.send(
				JSON.stringify({
					'type' : 'result.complete',
					'data' : {
						'name' : this.yourName,
					}
				})
			)
			removeKeyboardEvents();
			this.complete = true;
		}
	}
}