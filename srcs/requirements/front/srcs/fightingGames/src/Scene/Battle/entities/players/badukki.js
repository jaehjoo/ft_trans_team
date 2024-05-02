import { Player } from "./player.js"
import { fighterBadukki } from "../../../../constants/image.js"
import { FighterState, FrameDelay } from "../../../../constants/fighter.js"
import * as audio from "../../../../constants/audio.js";

export class Badukki extends Player {
	constructor(playerName, direction, owner) {
		super(playerName, direction, owner);

		if (direction == 1) {
			this.position.x = 300;
		} else {
			this.position.x = 750;
		}
		this.sound.attack.LIGHT.src = audio.attackMusic[2];
		this.sound.attack.MIDDLE.src = audio.attackMusic[2];
		this.sound.hurt.src = audio.hurtMusic[1];
		this.sound.run.src = audio.runMusic[1];
		this.image.src = fighterBadukki[FighterState.IDLE];
		this.imageScale = 5;
		this.imageSrc = fighterBadukki;
		this.framesMax = {
			[FighterState.IDLE]: 9,
			[FighterState.FORWARDS]: 9,
			[FighterState.BACKWARDS]: 9,
			[FighterState.JUMP]: 4,
			[FighterState.ATTACK1]: 16,
			[FighterState.ATTACK2]: 16,
			[FighterState.HURT]: 3,
			[FighterState.DEAD]: 8,
		}
		this.framesOriginLocation = {
			[FighterState.IDLE]: [300, 300],
			[FighterState.FORWARDS]: [300, 300],
			[FighterState.BACKWARDS]: [300, 300],
			[FighterState.JUMP]: [300, 300],
			[FighterState.ATTACK1]: [300, 300],
			[FighterState.ATTACK2]: [300, 300],
			[FighterState.HURT]: [300, 300],
			[FighterState.DEAD]: [300, 300],
		}
		this.animationImage = {
			[FighterState.IDLE]: [810, 90],
			[FighterState.FORWARDS]: [810, 90],
			[FighterState.BACKWARDS]: [810, 90],
			[FighterState.JUMP]: [810, 90],
			[FighterState.ATTACK1]: [1440, 90],
			[FighterState.ATTACK2]: [1440, 90],
			[FighterState.HURT]: [270, 90],
			[FighterState.DEAD]: [720, 90],
		}
		this.PushBox = {
			IDLE: [-30, -160, 60, 150],
			JUMP: [-30, -160, 60, 150],
		}
		this.HurtBox = {
			IDLE: [-30, -160, 60, 150],
			JUMP: [-30, -160, 60, 150],
		}
		this.HitBox = {
			ATTACK1: [100, -200, 100, 100],
			ATTACK2: [100, -200, 100, 100],
		}
		this.frames = new Map([
			// idle
			['idle-1', [[[0, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-2', [[[this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],	
			['idle-3', [[[2 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-4', [[[3 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-5', [[[4 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-6', [[[5 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-7', [[[6 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-8', [[[7 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['idle-9', [[[8 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],

			// forwards
			['forwards-1', [[[0, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-2', [[[this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-3', [[[2 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-4', [[[3 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-5', [[[4 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-6', [[[5 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-7', [[[6 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-8', [[[7 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['forwards-9', [[[8 * this.animationImage.forwards[0] / this.framesMax.forwards, 0, this.animationImage.forwards[0] / this.framesMax.forwards, this.animationImage.forwards[1], this.animationImage.forwards[0] / this.framesMax.forwards * this.imageScale, this.animationImage.forwards[1] * this.imageScale], this.framesOriginLocation.forwards], this.PushBox.IDLE, this.HurtBox.IDLE]],

			// backwards
			['backwards-1', [[[0, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-2', [[[this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-3', [[[2 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-4', [[[3 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-5', [[[4 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-6', [[[5 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-7', [[[6 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-8', [[[7 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['backwards-9', [[[8 * this.animationImage.backwards[0] / this.framesMax.backwards, 0, this.animationImage.backwards[0] / this.framesMax.backwards, this.animationImage.backwards[1], this.animationImage.backwards[0] / this.framesMax.backwards * this.imageScale, this.animationImage.backwards[1] * this.imageScale], this.framesOriginLocation.backwards], this.PushBox.IDLE, this.HurtBox.IDLE]],

			// jump
			['jump-1', [[[0, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['jump-2', [[[this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],	
			['jump-3', [[[2 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['jump-4', [[[3 * this.animationImage.idle[0] / this.framesMax.idle, 0, this.animationImage.idle[0] / this.framesMax.idle, this.animationImage.idle[1], this.animationImage.idle[0] / this.framesMax.idle * this.imageScale, this.animationImage.idle[1] * this.imageScale], this.framesOriginLocation.idle], this.PushBox.IDLE, this.HurtBox.IDLE]],

			// attack1
			['attack1-1', [[[9 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack1-2', [[[10 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack1-3', [[[11 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack1-4', [[[12 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE, this.HitBox.ATTACK1]],
			['attack1-5', [[[13 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack1-6', [[[14 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack1-7', [[[15 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],

			// attack2
			['attack2-1', [[[9 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack2-2', [[[10 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack2-3', [[[11 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack2-4', [[[12 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE, this.HitBox.ATTACK1]],
			['attack2-5', [[[13 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack2-6', [[[14 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],
			['attack2-7', [[[15 * this.animationImage.attack1[0] / this.framesMax.attack1, 0, this.animationImage.attack1[0] / this.framesMax.attack1, this.animationImage.attack1[1], this.animationImage.attack1[0] / this.framesMax.attack1 * this.imageScale, this.animationImage.attack1[1] * this.imageScale], this.framesOriginLocation.attack1], this.PushBox.IDLE, this.HurtBox.IDLE]],

			// hurt
			['hurt-1', [[[0, 0, this.animationImage.hurt[0] / this.framesMax.hurt, this.animationImage.hurt[1], this.animationImage.hurt[0] / this.framesMax.hurt * this.imageScale, this.animationImage.hurt[1] * this.imageScale], this.framesOriginLocation.hurt], this.PushBox.IDLE]],
			['hurt-2', [[[this.animationImage.hurt[0] / this.framesMax.hurt, 0, this.animationImage.hurt[0] / this.framesMax.hurt, this.animationImage.hurt[1], this.animationImage.hurt[0] / this.framesMax.hurt * this.imageScale, this.animationImage.hurt[1] * this.imageScale], this.framesOriginLocation.hurt], this.PushBox.IDLE]],	
			['hurt-3', [[[2 * this.animationImage.hurt[0] / this.framesMax.hurt, 0, this.animationImage.hurt[0] / this.framesMax.hurt, this.animationImage.hurt[1], this.animationImage.hurt[0] / this.framesMax.hurt * this.imageScale, this.animationImage.hurt[1] * this.imageScale], this.framesOriginLocation.hurt], this.PushBox.IDLE]],

			// dead
			['dead-1', [[[0, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
			['dead-2', [[[this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],	
			['dead-3', [[[2 * this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
			['dead-4', [[[3 * this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
			['dead-5', [[[4 * this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
			['dead-6', [[[5 * this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
			['dead-7', [[[6 * this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
			['dead-8', [[[7 * this.animationImage.dead[0] / this.framesMax.dead, 0, this.animationImage.dead[0] / this.framesMax.dead, this.animationImage.dead[1], this.animationImage.dead[0] / this.framesMax.dead * this.imageScale, this.animationImage.dead[1] * this.imageScale], this.framesOriginLocation.dead]]],
		]);
		this.animations = {
			[FighterState.IDLE]: [
				['idle-1', 68], ['idle-2', 68], ['idle-3', 68], ['idle-4', 68], ['idle-5', 68],
				['idle-6', 68], ['idle-7', 68], ['idle-8', 68], ['idle-9', 68],
			],
			[FighterState.FORWARDS]: [
				['forwards-1', 65], ['forwards-2', 65], ['forwards-3', 65],
				['forwards-4', 65], ['forwards-5', 65], ['forwards-6', 65],
				['forwards-7', 65], ['forwards-8', 65], ['forwards-9', 180],
			],
			[FighterState.BACKWARDS]: [
				['backwards-1', 65], ['backwards-2', 65], ['backwards-3', 65],
				['backwards-4', 65], ['backwards-5', 65], ['backwards-6', 65],
				['backwards-7', 65], ['backwards-8', 65], ['backwards-9', 180],
			],
			[FighterState.JUMP]: [
				['jump-1', 100], ['jump-2', 100], ['jump-3', 100], ['jump-4', FrameDelay.TRANSITION]
			],
			[FighterState.ATTACK1]: [
				['attack1-1', 33], ['attack1-2', 68], ['attack1-3', 68], ['attack1-4', 68],
				['attack1-5', 33], ['attack1-6', 68], ['attack1-7', FrameDelay.TRANSITION],
			],
			[FighterState.ATTACK2]: [
				['attack2-1', 33], ['attack2-2', 68], ['attack2-3', 68], ['attack2-4', 68],
				['attack2-5', 33], ['attack2-6', 68], ['attack2-7', FrameDelay.TRANSITION],
			],
			[FighterState.HURT]: [
				['hurt-1', 130], ['hurt-2', 56], ['hurt-3', FrameDelay.TRANSITION],
			],
			[FighterState.DEAD]: [
				['dead-1', 68], ['dead-2', 68], ['dead-3', 68], ['dead-4', 68], ['dead-5', 68],
				['dead-6', 68], ['dead-7', 68], ['dead-8', FrameDelay.TRANSITION],
			]
		};

		this.initialVelocity = {
			x: {
				[FighterState.FORWARDS]: 300,
				[FighterState.BACKWARDS]: -200,
			},
			jump: -700,
		}

		this.gravity = 1000;
	}
}