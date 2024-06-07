import { battleStatusBarImageSrc } from "../../../../constants/image.js"
import { MAX_HITPOINT } from "../../../../constants/fighter.js";
import { PlayerInfo } from "../../../../constants/fighter.js"

export class StatusBar {
	constructor() {
		this.frame = new Image();
		this.bar = new Image();
		this.vs = new Image();

		this.frame.src = battleStatusBarImageSrc[0];
		this.bar.src = battleStatusBarImageSrc[1];
		this.vs.src = battleStatusBarImageSrc[2];

		this.imageSrc = {
			frame : battleStatusBarImageSrc[0],
			bar : battleStatusBarImageSrc[1],
			vs : battleStatusBarImageSrc[2],
		}

		this.healthBars = [{
			hitPoints: MAX_HITPOINT,
		}, {
			hitPoints: MAX_HITPOINT,
		}]

		this.frames = new Map([
			['health-frame', [0, 0, 463, 41]],
			['health-bar', [0, 0, 447, 25]],
			['vs', [0, 0, 113, 100]],
		])

		this.winner = "";
	}

	updateHealthBars(time) {
		for (const index in this.healthBars) {
			if (this.healthBars[index].hitPoints <= PlayerInfo[index].health)
				continue;
			this.healthBars[index].hitPoints = Math.max(0, this.healthBars[index].hitPoints - (time.secondsPassed * 60))
		}
	}

	update(time) {
		this.updateHealthBars(time);
	}

	drawFrame(context, frameKey, x, y, direction, image) {
		const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey);
		
		let barStart = x;
		let barLength = sourceWidth;
		if (frameKey == "health-bar" && direction == 1) {
			barStart = x + MAX_HITPOINT - this.healthBars[0].hitPoints;
			barLength = sourceWidth - MAX_HITPOINT + this.healthBars[0].hitPoints;
		}
		else if (frameKey == "health-bar") {
			barStart = x - MAX_HITPOINT + this.healthBars[1].hitPoints;
			barLength = sourceWidth - MAX_HITPOINT + this.healthBars[1].hitPoints;
		}
		context.scale(direction, 1);
		context.drawImage(
			image,
			sourceX, sourceY, sourceWidth, sourceHeight,
			barStart * direction, y, barLength, sourceHeight,
		);
		context.setTransform(1, 0, 0, 1, 0, 0);
	}

	drawText(context, x, y, string) {
		context.font = "20px serif";
		context.fillStyle = "#FFFFFF";
		context.fillText(string, x, y);
	}

	drawHealthBar(context) {
		this.drawFrame(context, 'health-frame', 20, 57, 1, this.frame);
		this.drawFrame(context, 'health-bar', 24, 60, 1, this.bar);
		this.drawFrame(context, 'health-frame', 1004, 57, -1, this.frame);
		this.drawFrame(context, 'health-bar', 1000, 60, -1, this.bar);
	}

	drawPlayerName(context) {
		if (PlayerInfo[0].name.length > 10)
			this.drawText(context, 70, 50, PlayerInfo[0].display);
		else
			this.drawText(context, 70, 50, PlayerInfo[0].display.toLowerCase());
			if (PlayerInfo[1].name.length > 10)
			this.drawText(context, 900, 50, PlayerInfo[1].display);
		else
			this.drawText(context, 900, 50, PlayerInfo[1].display.toLowerCase());
	}

	draw(time, context) {
		this.drawFrame(context, 'vs', 455, 25, 1, this.vs);
		this.drawHealthBar(context);
		this.drawPlayerName(context);
	}
}