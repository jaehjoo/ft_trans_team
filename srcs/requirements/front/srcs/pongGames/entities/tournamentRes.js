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
		this.playerInfo[0] = info.player0;
		this.playerInfo[1] = info.player1;
		this.playerInfo[2] = info.player2;
		this.playerInfo[3] = info.player3;
 	}

	drawPlayerText(context) {
		// tournament 본선
		// tournament 결승
		// tournament 우승
	}

	drawResultLine(context) {
		// tournament 결승
		// tournament 우승
	}
  
	draw(context) {
		context.drawImage(this.screen.RESULT, 0, 0);
		this.drawPlayerText(context);
		this.drawResultLine(context);
	}
}