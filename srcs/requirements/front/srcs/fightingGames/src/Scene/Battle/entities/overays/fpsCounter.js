export class FpsCounter {
	constructor() {
		this.fps = 0;
	}

	update(time) {
		this.fps = Math.trunc(1 / time.secondsPassed);
	}

	draw(time, context) {
		context.font = "bold 16px Arial";
		context.fillStyle = "white";
		context.textAlign = "right";
		context.fillText(`FPS: ${this.fps}`, context.canvas.width - 2, context.canvas.height - 2);
	}
}