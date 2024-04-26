export class Board {
	constructor(view) {
		this.board = {
			WIDTH : view.WIDTH / 2,
			HEIGHT : view.HEIGHT / 2 + 100
		}
		this.score = {
			ONE : 0,
			TWO : 0,
			WIN : 11
		}
	}

	checkWin() {
		if (this.score.ONE == this.score.WIN)
			return 1;
		if (this.score.TWO == this.score.WIN)
			return 2;
		return 0;
	}

	checkDuce() {
		if (this.score.ONE == this.score.WIN - 1 && this.score.ONE == this.score.TWO) {
			this.score.WIN += 1;
		}
	}

	changeScore(player) {
		if (player == 0)
			this.score.ONE += 1;
		else
			this.score.TWO += 1;
		this.checkDuce();
	}

	update() {
	}

	draw(context) {
		context.font = "300px Arial";
		context.fillStyle = "#00000025";
		context.textAlign = "center";
		context.fillText(this.score.ONE + "  " + this.score.TWO, this.board.WIDTH, this.board.HEIGHT);
		context.fill();
		context.closePath();
	}
}