import { Fighter } from "./fighter.js"

export class PlayerThree extends Fighter {
	constructor(view) {
		super(view);

		this.bar.X = view.WIDTH / 50;
		this.bar.Y = view.HEIGHT / 2 - this.bar.HEIGHT / 2;
		this.bar.COLOR = "#0FF4E6";
	}
}