export class Stage {
	constructor(view) {
		this.background = {
			WIDTH : view.WIDTH,
			HEIGHT : view.HEIGHT,
			COLOR : "#005656",
		}
		this.borderLine = {
			WIDTH : this.background.WIDTH / 50,
			COLOR : "#964B00",
		}
		this.middleLine = {
			WIDTH : this.background.WIDTH / 80,
			HEIGHT : this.background.HEIGHT,
			COLOR : "#FFFFFF",
		}
	}

	middleLineDraw(context) {
		context.fillStyle = this.middleLine.COLOR;
		context.fillRect(this.background.WIDTH / 2 - this.middleLine.WIDTH / 2, 0, this.middleLine.WIDTH, this.middleLine.HEIGHT);
	}

	borderLineDraw(context) {
		context.fillStyle = this.borderLine.COLOR;
		context.fillRect(0, 0, this.background.WIDTH, this.borderLine.WIDTH);
		context.fillRect(0, 0, this.borderLine.WIDTH, this.background.HEIGHT);
		context.fillRect(0, this.background.HEIGHT - this.borderLine.WIDTH, this.background.WIDTH, this.borderLine.WIDTH);
		context.fillRect(this.background.WIDTH - this.borderLine.WIDTH, 0, this.borderLine.WIDTH, this.background.HEIGHT);
	}

	backgroundDraw(context) {
		context.fillStyle = this.background.COLOR;
		context.fillRect(0, 0, this.background.WIDTH, this.background.HEIGHT);
	}

	update_local() {}

	draw(context) {
		this.backgroundDraw(context);
		this.middleLineDraw(context);
		this.borderLineDraw(context);
	}
}