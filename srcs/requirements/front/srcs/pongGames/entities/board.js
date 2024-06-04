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
		this.winner = "";
	}

	init() {
		this.score.ONE = 0;
		this.score.TWO = 0;
		this.score.WIN = 11;
	}

	update(ONE, TWO) {
		this.score.ONE = ONE;
		this.score.TWO = TWO;
	}

	update_local() {
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