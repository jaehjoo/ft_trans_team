import { PlayerInfo, fighterName } from "../../../../constants/fighter.js";
import { stageBackground } from "../../../../constants/image.js";
import { stageMusic } from "../../../../constants/audio.js";
import { stageFloor, backgroundSize} from "../../../../constants/window.js";
import { playSound } from "../../../../handlers/soundHandler.js"

export class Stage {
	constructor() {
		this.backgroundImage = new Image();
		this.backgroundMusic = new Audio();
		this.lotate = {
			[fighterName.ADLER] : 0,
			[fighterName.BADUKKI] : 1,
			[fighterName.CHOI] : 2,
			[fighterName.HUNTERJ] : 3,
			[fighterName.SIGRID] : 4,
			[fighterName.SYATRINO] : 5,
		}
		this.imageSize = [
			0, 0
		]
	}

	setBackground() {
		this.backgroundImage.src = stageBackground[this.lotate[PlayerInfo[0].fighter]];
		this.backgroundMusic.src = stageMusic[this.lotate[PlayerInfo[0].fighter]];
		PlayerInfo[2].floor = stageFloor[this.lotate[PlayerInfo[0].fighter]];
		const [width, height] = backgroundSize[this.lotate[PlayerInfo[0].fighter]];
		this.imageSize[0] = width;
		this.imageSize[1] = height;
		this.backgroundMusic.loop = true;
		playSound(this.backgroundMusic, 0.3)
	}

	update(time) {

	}

	draw(time, context) {
		const [width, height] = this.imageSize;
		context.drawImage(this.backgroundImage, 0, 0, width, height, 0, 0, 1024, 768);
	}
}