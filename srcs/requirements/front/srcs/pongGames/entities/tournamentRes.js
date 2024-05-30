export class TournamentResult {
	constructor(view) {
	  this.screen = {
		WIDTH: view.WIDTH,
		HEIGHT: view.HEIGHT,
		RESULT: new Image(),
	  };
	  this.screen.RESULT.src = "../../img/games/tournament.png"
	  this.playerInfo = [];
	  this.match1Winner = "";
	  this.match2Winner = "";
	  this.match3Winner = "";
	}

	setPlayerInfo(info) {
		this.playerInfo[0] = info[0];
		this.playerInfo[1] = info[1];
		this.playerInfo[2] = info[2];
		this.playerInfo[3] = info[3];
 	}

	drawPlayerText(context) {
		context.fillStyle = "black";
		context.fillText(this.playerInfo[0], this.screen.WIDTH / 8 - 8 * this.playerInfo[0].length, 680);
		context.fillText(this.playerInfo[1], this.screen.WIDTH / 8 * 3 - 8 * this.playerInfo[1].length, 680);
		context.fillText(this.playerInfo[2], this.screen.WIDTH / 8 * 5 - 8 * this.playerInfo[2].length, 680);
		context.fillText(this.playerInfo[3], this.screen.WIDTH / 8 * 7 - 8 * this.playerInfo[3].length, 680);
		if (this.match1Winner != "") {
			if (this.match1Winner == this.playerInfo[0]) {
				context.fillText(this.playerInfo[0], this.screen.WIDTH / 4 - 8 * this.playerInfo[0].length, 330);
			} else {
				context.fillText(this.playerInfo[1], this.screen.WIDTH / 4 - 8 * this.playerInfo[1].length, 330);
			}
		}
		if (this.match2Winner != "") {
			if (this.match2Winner == this.playerInfo[2]) {
				context.fillText(this.playerInfo[2], this.screen.WIDTH / 4 * 3 - 8 * this.playerInfo[2].length, 330);
			} else {
				context.fillText(this.playerInfo[3], this.screen.WIDTH / 4 * 3 - 8 * this.playerInfo[3].length, 330);
			}
		}
		if (this.match3Winner != "") {
			if (this.match3Winner == this.match1Winner) {
				context.fillText(this.match1Winner, this.screen.WIDTH / 2 - 8 * this.match1Winner.length, 100);
			} else {
				context.fillText(this.match2Winner, this.screen.WIDTH / 2 - 8 * this.match2Winner.length, 100);
			}
		}
	}

	drawResultLine(context) {
		context.strokeStyle = "red";
		context.lineWidth = 10;
		context.beginPath();

		if (this.match1Winner != "") {
			if (this.match1Winner == this.playerInfo[0]) {
				context.moveTo(this.screen.WIDTH / 8, 640);
				context.lineTo(this.screen.WIDTH / 8, 510);
				context.lineTo(this.screen.WIDTH / 4, 510);
				context.lineTo(this.screen.WIDTH / 4, 380);
			} else {
				context.moveTo(this.screen.WIDTH / 8 * 3, 640);
				context.lineTo(this.screen.WIDTH / 8 * 3, 510);
				context.lineTo(this.screen.WIDTH / 4, 510);
				context.lineTo(this.screen.WIDTH / 4, 380);
			}
		}
		if (this.match2Winner != "") {
			if (this.match2Winner == this.playerInfo[2]) {
				context.moveTo(this.screen.WIDTH / 8 * 5, 640);
				context.lineTo(this.screen.WIDTH / 8 * 5, 510);
				context.lineTo(this.screen.WIDTH / 4 * 3, 510);
				context.lineTo(this.screen.WIDTH / 4 * 3, 380);
			} else {
				context.moveTo(this.screen.WIDTH / 8 * 7, 640);
				context.lineTo(this.screen.WIDTH / 8 * 7, 510);
				context.lineTo(this.screen.WIDTH / 4 * 3, 510);
				context.lineTo(this.screen.WIDTH / 4 * 3, 380);
			}
		}
		if (this.match3Winner != "") {
			if (this.match1Winner == this.match3Winner) {
				context.moveTo(this.screen.WIDTH / 4, 255);
				context.lineTo(this.screen.WIDTH / 2, 255);
				context.lineTo(this.screen.WIDTH / 2, 125);
			} else {
				context.moveTo(this.screen.WIDTH / 4 * 3, 255);
				context.lineTo(this.screen.WIDTH / 2, 255);
				context.lineTo(this.screen.WIDTH / 2, 125);
			}
		}

		context.stroke()
	}
  
	draw(context) {
		context.font = "30px serif";
		context.drawImage(this.screen.RESULT, 0, 0);
		this.drawPlayerText(context);
		this.drawResultLine(context);
	}
}