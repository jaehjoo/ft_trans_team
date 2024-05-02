import { fighterName } from "../../../constants/fighter.js"
import * as control from "../../../handlers/keyEventHandler.js"
import * as isrc from "../../../constants/image.js"

export class Player {
	constructor(owner, pName, direction) {
		this.complete = false;
		this.sendComplete = false;
		this.name = pName;
		this.owner = owner;
		this.direction = direction;
		this.select = {
			fighter: 0,
			circleX: 25,
			circleY: 542,
			pictureX: 0,
			pictureY: 0,
		}
		this.lotate = [fighterName.ADLER, fighterName.BADUKKI, fighterName.CHOI, fighterName.HUNTERJ, fighterName.SIGRID, fighterName.SYATRINO];
		if (this.direction == 1) {
			this.select.pictureX = 262;
			this.select.pictureY = 188;
		}
		else {
			this.select.pictureX = 609;
			this.select.pictureY = 188;
		}
		this.standingImage = new Image();
		this.circleImage = new Image();
		this.imageSrc = {
			[fighterName.ADLER]: [isrc.selectStandingImageSrc[0]],
			[fighterName.BADUKKI]: [isrc.selectStandingImageSrc[1]],
			[fighterName.CHOI]: [isrc.selectStandingImageSrc[2]],
			[fighterName.HUNTERJ]: [isrc.selectStandingImageSrc[3]],
			[fighterName.SIGRID]: [isrc.selectStandingImageSrc[4]],
			[fighterName.SYATRINO]: [isrc.selectStandingImageSrc[5]],
		}
		this.imageSize = {
			[fighterName.ADLER]: [1350, 135],
			[fighterName.BADUKKI]: [810, 90],
			[fighterName.CHOI]: [1386, 190],
			[fighterName.HUNTERJ]: [1600, 200],
			[fighterName.SIGRID]: [1980, 180],
			[fighterName.SYATRINO]: [1200, 150],
		}
		if (this.direction == 1) {
			this.circleImage.src = isrc.selectCircleImageSrc[0];
			this.gap = {
				[fighterName.ADLER]: [-320, -50],
				[fighterName.BADUKKI]: [-160, 125],
				[fighterName.CHOI]: [-180, 100],
				[fighterName.HUNTERJ]: [-370, -80],
				[fighterName.SIGRID]: [-370, -60],
				[fighterName.SYATRINO]: [-350, -100],
			}
			this.circle = {
				[fighterName.ADLER]: [15, 515],
				[fighterName.BADUKKI]: [180, 515],
				[fighterName.CHOI]: [345, 515],
				[fighterName.HUNTERJ]: [510, 515],
				[fighterName.SIGRID]: [675, 515],
				[fighterName.SYATRINO]: [840, 515],
			}
		}
		else if (this.direction == -1) {
			this.circleImage.src = isrc.selectCircleImageSrc[1];
			this.gap = {
				[fighterName.ADLER]: [-470, -50],
				[fighterName.BADUKKI]: [-310, 125],
				[fighterName.CHOI]: [-330, 100],
				[fighterName.HUNTERJ]: [-520, -80],
				[fighterName.SIGRID]: [-520, -60],
				[fighterName.SYATRINO]: [-500, -100],
			}
			this.circle = {
				[fighterName.ADLER]: [185, 515],
				[fighterName.BADUKKI]: [350, 515],
				[fighterName.CHOI]: [515, 515],
				[fighterName.HUNTERJ]: [680, 515],
				[fighterName.SIGRID]: [845, 515],
				[fighterName.SYATRINO]: [1010, 515],
			}
		}
		this.framesMax = {
			[fighterName.ADLER]: 10,
			[fighterName.BADUKKI]: 9,
			[fighterName.CHOI]: 6,
			[fighterName.HUNTERJ]: 8,
			[fighterName.SIGRID]: 11,
			[fighterName.SYATRINO]: 8,
		}
		this.scale = {
			[fighterName.ADLER] : 6,
			[fighterName.BADUKKI] : 5,
			[fighterName.CHOI] : 3,
			[fighterName.HUNTERJ] : 5,
			[fighterName.SIGRID] : 5,
			[fighterName.SYATRINO] : 6,
		};
		this.frames = {
			[fighterName.ADLER]: [[0, 0, this.imageSize['adler'][0] / this.framesMax['adler'], this.imageSize['adler'][1]], [this.imageSize['adler'][0] / (2 * this.framesMax['adler']) - this.gap['adler'][0], this.imageSize['adler'][1] - this.gap['adler'][1]]],
			[fighterName.BADUKKI]: [[0, 0, this.imageSize['badukki'][0] / this.framesMax['badukki'], this.imageSize['badukki'][1]], [this.imageSize['badukki'][0] / (2 * this.framesMax['badukki']) - this.gap['badukki'][0], this.imageSize['badukki'][1] - this.gap['badukki'][1]]],
			[fighterName.CHOI]: [[0, 0, this.imageSize['choi'][0] / this.framesMax['choi'], this.imageSize['choi'][1]], [this.imageSize['choi'][0] / (2 * this.framesMax['choi']) - this.gap['choi'][0], this.imageSize['choi'][1] - this.gap['choi'][1]]],
			[fighterName.HUNTERJ]: [[0, 0, this.imageSize['hunterJ'][0] / this.framesMax['hunterJ'], this.imageSize['hunterJ'][1]], [this.imageSize['hunterJ'][0] / (2 * this.framesMax['hunterJ']) - this.gap['hunterJ'][0], this.imageSize['hunterJ'][1] - this.gap['hunterJ'][1]]],
			[fighterName.SIGRID]: [[0, 0, this.imageSize['sigrid'][0] / this.framesMax['sigrid'], this.imageSize['sigrid'][1]], [this.imageSize['sigrid'][0] / (2 * this.framesMax['sigrid']) - this.gap['sigrid'][0], this.imageSize['sigrid'][1] - this.gap['sigrid'][1]]],
			[fighterName.SYATRINO]: [[0, 0, this.imageSize['syatrino'][0] / this.framesMax['syatrino'], this.imageSize['syatrino'][1]], [this.imageSize['syatrino'][0] / (2 * this.framesMax['syatrino']) - this.gap['syatrino'][0], this.imageSize['syatrino'][1] - this.gap['syatrino'][1]]],
		}
	}

	updateSelect() {
		let prev = this.select.fighter;
		if (this.name == this.owner) {
			if (control.isLeft()) {
				this.select.fighter -= 1;
				control.heldKeys.delete("ArrowLeft");
			}
			else if (control.isRight()) {
				this.select.fighter += 1;
				control.heldKeys.delete("ArrowRight");
			}
			else if (control.isAttack()) {
				this.complete = true;
				control.heldKeys.delete("KeyZ");
			}
		}
		if (this.select.fighter < 0 || this.select.fighter > 5)
			this.select.fighter = prev;
		this.standingImage.src = this.imageSrc[this.lotate[this.select.fighter]];
		this.select.circleX = this.circle[this.lotate[this.select.fighter]][0];
		this.select.circleY = this.circle[this.lotate[this.select.fighter]][1];
	}

	update(time, context) {
		if (this.complete)
			return ;
		this.updateSelect();
	}

	draw(context) {
		const frameKey = this.frames[this.lotate[this.select.fighter]];
		const [
			[x, y, width, height],
			[originX, originY],
		] = frameKey;
		context.scale(this.direction, 1);
		context.drawImage(this.standingImage,
			x, y, width, height,
			this.select.pictureX * this.direction - originX, this.select.pictureY - originY,
			width * this.scale[this.lotate[this.select.fighter]], height * this.scale[this.lotate[this.select.fighter]]
		)
		context.drawImage(this.circleImage, 0, 0, 130, 183, this.select.circleX * this.direction, this.select.circleY, 170, 245);
		context.setTransform(1, 0, 0, 1, 0, 0);
	}
}