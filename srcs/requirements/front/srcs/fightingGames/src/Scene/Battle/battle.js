import { Adler } from "./entities/players/adler.js"
import { Badukki } from "./entities/players/badukki.js"
import { Choi } from "./entities/players/choi.js"
import { HunterJ } from "./entities/players/hunterJ.js"
import { Sigrid } from "./entities/players/sigrid.js"
import { Syatrino } from "./entities/players/syatrino.js"
import { Stage } from "./entities/stages/stage.js"
import { StatusBar } from "./entities/overays/statusBar.js"
import { FpsCounter } from "./entities/overays/fpsCounter.js"
import { PlayerInfo } from "../../constants/fighter.js"

export class BattleScene {
	context = this.getContext();
	constructor (ws, yourName) {
		this.ws = ws;
		this.complete = 0;
		this.yourName = yourName;
		this.stages = new Stage();
		this.fighters = new Set();
		this.first = true;
		this.START = true;
		this.STOP = false;
		this.next = "result";
		this.overays = [
			new StatusBar(),
			new FpsCounter(),
		]
	}

	searchFighter(playerName, fighterName, direction) {
		if (fighterName == "adler")
			return new Adler(playerName, direction, this.yourName);
		else if (fighterName == "badukki")
			return new Badukki(playerName, direction, this.yourName);
		else if (fighterName == "choi")
			return new Choi(playerName, direction, this.yourName);
		else if (fighterName == "hunterJ")
			return new HunterJ(playerName, direction, this.yourName);
		else if (fighterName == "sigrid")
			return new Sigrid(playerName, direction, this.yourName);
		else
			return new Syatrino(playerName, direction, this.yourName);
	}

	initInfo() {
		this.stages.setBackground();
		this.fighters = [
			this.searchFighter(PlayerInfo[0].name, PlayerInfo[0].fighter, 1),
			this.searchFighter(PlayerInfo[1].name, PlayerInfo[1].fighter, -1),
		];
		this.fighters[0].opponent = this.fighters[1];
		this.fighters[1].opponent = this.fighters[0];
	}

	getContext() {
		const canvasEl = document.querySelector("canvas");
		const context = canvasEl.getContext("2d");

		return context;
	}

	checkWebsocketMessage() {
		this.ws.onmessage = (msg) => {
			let textData = JSON.parse(msg.data);
			if (textData.data.mode == "update.battle"
				&& this.yourName != textData.data['name']) {
				if (this.yourName != this.fighters[0].player) {
					this.fighters[0].position.x = textData.data['x'];
					this.fighters[0].position.y = textData.data['y'];
					this.fighters[0].changeState(textData.data['state']);
					PlayerInfo[0].health = textData.data['health'];
				}
				else {
					this.fighters[1].position.x = textData.data['x'];
					this.fighters[1].position.y = textData.data['y'];
					this.fighters[1].changeState(textData.data['state']);
					PlayerInfo[1].health = textData.data['health'];			
				}
				this.requestUpdate();
			}
			else if (textData.data.mode == "complete.battle") {
				this.STOP = true;
			}
		}
	}

	requestUpdate() {
		let player, health;
		if (this.yourName == this.fighters[0].player) {
			player = this.fighters[0];
			health = PlayerInfo[0].health;
		}
		else {
			player = this.fighters[1];
			health = PlayerInfo[1].health
		}
		this.ws.send(
			JSON.stringify({
				'type' : 'battle.info',
				'data' : {
					"name": this.yourName,
					"x" : player.position.x,
					"y" : player.position.y,
					"state" : player.currentState,
					"health" : health,
				}
			})
		)
	}

	checkComplete() {
		if (this.fighters[0].dead || this.fighters[1].dead) {
			if (this.fighters[0].dead)
				PlayerInfo[2].winner = PlayerInfo[1].name;
			else
				PlayerInfo[2].winner = PlayerInfo[0].name;
			this.complete = true;
			this.ws.send(
				JSON.stringify({
					'type' : 'battle.complete',
					'data' : {
						"winner" : PlayerInfo[2].winner,
					}
				})
			)
		}
	}

	update(time) {
		if (this.first) {
			this.requestUpdate();
			this.first = false;
		}
		this.checkWebsocketMessage();
		if (this.START && !this.STOP) {
			for (this.fighter of this.fighters) {
				this.fighter.update(time, this.context);
			}
			for (this.overay of this.overays) {
				this.overay.update(time);
			}
			if (!this.complete)
				this.checkComplete();
		}
	}

	draw(time) {
		this.stages.draw(time, this.context);
		for (this.fighter of this.fighters) {
			this.fighter.draw(time, this.context);
		}
		for (this.overay of this.overays) {
			this.overay.draw(time, this.context);
		}
	}

	load(time) {
		this.update(time);
		this.draw(time);
	}

	unload() {
		this.stages.backgroundMusic.pause();
		delete this.fighters[0];
		delete this.fighters[1];
		delete this.overays[0];
		delete this.overays[1];
		delete this.stages;
	}
}