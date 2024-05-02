import { Player } from "./entities/player.js"
import { Stage } from "./entities/stage.js"
import { PlayerInfo } from "../../constants/fighter.js";

export class SelectScene {
	context = this.getContext();
	constructor (ws, yourName) {
		this.ws = ws;
		this.yourName = yourName;
		this.first = true;
		this.START = true;
		this.STOP = false;
		this.next = "battle";
		this.entities = [
			new Stage(),
			new Player(yourName, PlayerInfo[0].name, 1),
			new Player(yourName, PlayerInfo[1].name, -1),
		]
	}

	getContext() {
		const canvasEl = document.querySelector("canvas");
		const context = canvasEl.getContext("2d");

		return context;
	}

	checkWebsocketMessage() {
		this.ws.onmessage = (msg) => {
			let textData = JSON.parse(msg.data);
			if (textData.data.mode == "update.select"
				&& this.yourName != textData.data['name']) {
				if (textData.data['name'] == this.entities[1].name)
					this.entities[1].select.fighter = textData.data['fighter'];
				else
					this.entities[2].select.fighter = textData.data['fighter'];
				this.requestUpdate();
			}
			if (textData.data.mode == "complete.select") {
				this.STOP = true;
			}
		}
	}

	checkComplete() {
		let player;
		if (this.yourName == this.entities[1].name)
			player = this.entities[1];
		else
			player = this.entities[2];
		if (player.complete && !player.sendComplete) {
			player.sendComplete = true
			this.ws.send(
				JSON.stringify(
					{
						'type' : 'set.select',
						'data' : {
							name : this.yourName,
						}
					}
				)
			)
		}
	}

	requestUpdate() {
		const fighter = {
			"player0" : this.entities[1].select.fighter,
			"player1" : this.entities[2].select.fighter,
		}
		this.ws.send(
			JSON.stringify({
				'type' : 'select.info',
				'data' : {
					"name": this.yourName,
					"select": {"player0" : fighter['player0'], "player1" : fighter['player1']},
				}
			})
		)
	}

	update(time) {
		if (this.first) {
			this.requestUpdate();
			this.first = false;
		}
		this.checkWebsocketMessage();
		if (this.START && !this.STOP) {
			for (this.entity of this.entities) {
				this.entity.update(time, this.context);
			}
			this.checkComplete();
		}
	}

	draw(time) {
		for (this.entitiy of this.entities) {
			this.entitiy.draw(this.context);
		}
	}

	load(time) {
		this.update(time);
		this.draw(time);
	}

	unload() {
		PlayerInfo[0].fighter = this.entities[1].lotate[this.entities[1].select.fighter];
		PlayerInfo[1].fighter = this.entities[2].lotate[this.entities[2].select.fighter];
		for (this.entitiy of this.entities) {
			delete this.entitiy;
		}
	}
}