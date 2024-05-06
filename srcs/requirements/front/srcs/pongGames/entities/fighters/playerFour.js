import { Fighter } from "./fighter.js"

export class PlayerFour extends Fighter {
	constructor(view) {
		super(view);

		this.bar.X = view.WIDTH / 50;
		this.bar.Y = view.HEIGHT / 2 - this.bar.HEIGHT / 2;
		this.bar.COLOR = "#DC492A";
	}
}