import { Fighter } from "./fighter.js"

export class PlayerOne extends Fighter {
	constructor(view) {
		super(view);

		this.bar.X = view.WIDTH / 50;
		this.bar.Y = view.HEIGHT / 2 - this.bar.HEIGHT / 2;
		this.bar.COLOR = "#DB4455";
	}
}

// this.bar.Y = view.HEIGHT / 4 - this.bar.HEIGHT / 2;
// this.bar.Y = view.HEIGHT / 4 * 3 - this.bar.HEIGHT / 2;