import { Fighter } from "./fighter.js"

export class PlayerTwo extends Fighter {
	constructor(view) {
		super(view);

		this.bar.X = view.WIDTH / 50 * 48 + 3;
		this.bar.Y = view.HEIGHT / 2 - this.bar.HEIGHT / 2;
		this.bar.COLOR = "#F2F279";
	}
}