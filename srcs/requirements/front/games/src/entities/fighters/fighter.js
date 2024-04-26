export class Fighter {
	constructor(view) {
		this.bar = {
			X : 0,
			Y : 0,
			WIDTH : view.WIDTH / 60,
			HEIGHT : view.HEIGHT / 7,
			COLOR : "#FFFFFF",
		}
		this.upPressed = false;
		this.downPressed = false;
		this.name = "";
	}

	update() {
		if (this.upPressed == true)
			this.bar.Y -= 7
		else if (this.downPressed == true)
			this.bar.Y += 7
	}

	draw(context) {
		context.beginPath();
		context.rect(this.bar.X, this.bar.Y, this.bar.WIDTH, this.bar.HEIGHT);
		context.fillStyle = this.bar.COLOR;
		context.fill();
		context.closePath();
	}
}