import * as isrc from "../../../constants/image.js"

export class Stage {
	constructor() {
		this.window = {
			WIDTH: 1024,
			HEIGHT: 768,
		}
		this.background = new Image();
		this.background.src = isrc.selectBackgroundImageSrc;
	}

	update(time, context) {
	}

	draw(context) {
		context.drawImage(this.background, 0, 0);
		context.drawImage(this.background, 0, 0, 1024, 768, 0, 0, 1024, 768);
	}
}