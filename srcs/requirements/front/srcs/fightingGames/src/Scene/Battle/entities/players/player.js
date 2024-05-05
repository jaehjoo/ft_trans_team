import { FighterState, FighterDirection, FrameDelay, PUSH_FRICTION, FighterAttackType, FighterAttackStrength, FighterAttackBaseData } from "../../../../constants/fighter.js"
import * as control from "../../../../handlers/keyEventHandler.js"
import { rectsOverlap, getActualBoxDimensions, boxOverlap } from "../../utils/collisions.js"
import { PlayerInfo } from "../../../../constants/fighter.js"
import { playSound, stopSound } from "../../../../handlers/soundHandler.js"

export class Player {
	constructor(playerName, direction, owner) {
		this.player = playerName;
		this.owner = owner;
		this.direction = direction;
		this.opponent;
		this.image = new Image();
		this.position = {x : 0, y : PlayerInfo[2].floor}
		this.velocity = {x : 0, y : PlayerInfo[2].floor};
		this.initialVelocity = {};
		this.gravity = 0;
		this.frames = new Map();
		this.animationFrame = 0;
		this.animationTimer = 0;
		this.animations = {};
		this.imageSize = {};
		this.imageSrc = {};
		this.attackStruck = false;
		this.gap = {};
		this.scale;
		this.framesMax = {};
		this.framesDelay = {};
		this.opponent;
		this.dead = false;
		this.boxes = {
			push : {x: 0, y: 0, width: 0, height: 0},
			hurt : {x: 0, y: 0, width: 0, height: 0},
			hit : {x: 0, y: 0, width: 0, height: 0},
		};
		this.sound = {
			attack: {
				LIGHT: new Audio(),
				MIDDLE: new Audio(),
			},
			hurt: new Audio(),
			run: new Audio(),
		}
		this.states = {
			[FighterState.IDLE]: {
				init: this.handleIdleInit.bind(this),
				update: this.handleIdleState.bind(this),
				validForm: [
					undefined,
					FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS, FighterState.JUMP,
					FighterState.ATTACK1, FighterState.ATTACK2, FighterState.HURT,
				]
			},
			[FighterState.FORWARDS]: {
				init: this.handleMoveInit.bind(this),
				update: this.handleForwardState.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.JUMP
				]
			},
			[FighterState.BACKWARDS]: {
				init: this.handleMoveInit.bind(this),
				update: this.handleBackwardState.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.FORWARDS,
				]
			},
			[FighterState.JUMP]: {
				init: this.handleJumpInit.bind(this),
				update: this.handleJumpState.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS,
				]
			},
			[FighterState.ATTACK1]: {
				attackType: FighterAttackType.LIGHT,
				attackStrength: FighterAttackStrength.LIGHT,
				init: this.handleAttack1Init.bind(this),
				update: this.handleAttack1State.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS,
				]
			},
			[FighterState.ATTACK2]: {
				attackType: FighterAttackType.MIDDLE,
				attackStrength: FighterAttackStrength.MIDDLE,
				init: this.handleAttack2Init.bind(this),
				update: this.handleAttack2State.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS,
				]
			},
			[FighterState.HURT]: {
				init: this.handleHurtInit.bind(this),
				update: this.handleHurtState.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS, FighterState.JUMP,
					FighterState.ATTACK1, FighterState.ATTACK2,
				],
			},
			[FighterState.DEAD]: {
				init: this.handleDeadInit.bind(this),
				update: this.handleDeadState.bind(this),
				validForm: [
					FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS, FighterState.JUMP,
					FighterState.ATTACK1, FighterState.ATTACK2,
				],
			}
		}
		this.changeState(FighterState.IDLE);
	}

	hasCollidedWithOpponent = () => rectsOverlap(
		this.position.x + this.boxes.push.x, this.position.y + this.boxes.push.y,
		this.boxes.push.width, this.boxes.push.height,
		this.opponent.position.x + this.opponent.boxes.push.x,
		this.opponent.position.y + this.opponent.boxes.push.y,
		this.opponent.boxes.push.width, this.opponent.boxes.push.height,
	);

	isAnimationCompleted = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION

	resetVelocities() {
		this.velocity.x = 0;
		this.velocity.y = 0;
	}

	resetFloor() {
		this.position.y = PlayerInfo[2].floor;
	}

	getDirection() {
		if (this.position.x + this.boxes.push.x + this.boxes.push.width
			<= this.opponent.position.x + this.opponent.boxes.push.x) {
				return FighterDirection.RIGHT;
		} else if (this.position.x + this.boxes.push.x
			>= this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width) {
				return FighterDirection.LEFT;
		}

		return this.direction;
	}

	getBoxes(frameKey) {
		const [,
			[pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
			[hurtX = 0, hurtY = 0, hurtWidth = 0, hurtHeight = 0] = [],
			[hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],	
		] = this.frames.get(frameKey);

		return {
			push: {x: pushX, y: pushY, width: pushWidth, height: pushHeight},
			hurt: {x: hurtX, y: hurtY, width: hurtWidth, height: hurtHeight},
			hit: {x: hitX, y: hitY, width: hitWidth, height: hitHeight},
		};
	}

	changeState(newState) {
		if (newState === this.currentState || !this.states[newState].validForm.includes(this.currentState)) {
			return;
		}

		this.currentState = newState;
		this.animationFrame = 0;

		this.image.src = this.imageSrc[this.currentState];
		this.states[this.currentState].init();
	}

	handleDeadInit() {
		this.resetVelocities();
		control.removeKeyboardEvents();
	}

	handleIdleInit() {
		this.resetVelocities();
		this.resetFloor();
		this.attackStruck = false;
	}

	handleMoveInit() {
		this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
		stopSound(this.sound.run);
		playSound(this.sound.run, 0.3);
	}

	handleJumpInit() {
		this.velocity.y = this.initialVelocity.jump;
	}

	handleAttack1Init() {
		this.handleIdleInit();
		playSound(this.sound.attack.LIGHT, 0.3);
	}

	handleAttack2Init() {
		this.handleIdleInit();
		playSound(this.sound.attack.MIDDLE, 0.3);
	}

	handleHurtInit() {
		this.resetVelocities();
		playSound(this.sound.hurt, 0.3);
	}

	handleIdleState() {
		if (this.owner != this.player)
			return ;
		if (control.isUp())
			this.changeState(FighterState.JUMP)
		else if (control.isBackward(this.direction))
			this.changeState(FighterState.BACKWARDS);
		else if (control.isForward(this.direction))
			this.changeState(FighterState.FORWARDS);
		else if (control.isAttack())
			this.changeState(FighterState.ATTACK1);
		else if (control.isMiddleAttack())
			this.changeState(FighterState.ATTACK2);
	}

	handleForwardState() {
		if (this.owner != this.player)
			return ;
		if (!control.isForward(this.direction))
			this.changeState(FighterState.IDLE);
		else if (control.isUp())
			this.changeState(FighterState.JUMP);
		else if (control.isAttack())
			this.changeState(FighterState.ATTACK1);
		else if (control.isMiddleAttack())
			this.changeState(FighterState.ATTACK2);
	}

	handleBackwardState() {
		if (this.owner != this.player)
			return ;
		if (!control.isBackward(this.direction))
			this.changeState(FighterState.IDLE);
		else if (control.isUp())
			this.changeState(FighterState.JUMP);
		else if (control.isAttack())
			this.changeState(FighterState.ATTACK1);
		else if (control.isMiddleAttack())
			this.changeState(FighterState.ATTACK2);
	}

	handleJumpState(time) {
		this.velocity.y += this.gravity * time.secondsPassed;

		if (this.position.y > PlayerInfo[2].floor) {
			this.position.y = PlayerInfo[2].floor;
			this.changeState(FighterState.IDLE);
		}
	}
	
	handleAttack1Reset() {
		this.animationFrame = 0;
		this.handleAttack1Init();
		this.attackStruck = false;
	}

	handleAttack1State() {
		if (this.owner != this.player)
			return ;
		if (!this.isAnimationCompleted())
			return;
		this.attackStruck = false;
		this.changeState(FighterState.IDLE);
	}

	handleAttack2Reset() {
		this.animationFrame = 0;
		this.handleAttack2Init();
		this.attackStruck = false;
	}

	handleAttack2State() {
		if (this.owner != this.player)
			return ;
		if (!this.isAnimationCompleted())
			return;
		this.attackStruck = false;
		this.changeState(FighterState.IDLE);
	}

	handleHurtState() {
		if (!this.isAnimationCompleted())
			return ;
		this.changeState(FighterState.IDLE);
	}

	handleDeadState() {
		if (!this.isAnimationCompleted())
			return ;
		this.dead = true;
	}

	handleAttackHit() {
		this.changeState(FighterState.HURT);
	}

	updateStateContraints(time, context) {
		if (this.position.x > context.canvas.width - this.boxes.push.width) {
			this.position.x = context.canvas.width - this.boxes.push.width;
		}

		if (this.position.x < this.boxes.push.width) {
			this.position.x = this.boxes.push.width;
		}

		if (this.hasCollidedWithOpponent()) {
			if (this.position.x <= this.opponent.position.x) {
				this.position.x = Math.max(
					(this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
					this.boxes.push.width,
				);

				if ([FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS, FighterState.JUMP].includes(this.opponent.currentState)) {
					this.opponent.position.x += PUSH_FRICTION * time.secondsPassed;
				}
			}

			if (this.position.x >= this.opponent.position.x) {
				this.position.x = Math.min(
					(this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width)
					+ (this.boxes.push.width + this.boxes.push.x),
					context.canvas.width - this.boxes.push.width,
				);

				if ([FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS, FighterState.JUMP].includes(this.opponent.currentState)) {
					this.opponent.position.x -= PUSH_FRICTION * time.secondsPassed;
				}
			}
		}
	}

	updateAnimation(time) {
		const animation = this.animations[this.currentState];
		const [, frameDelay] = animation[this.animationFrame];
	
		if (time.previous <= this.animationTimer + frameDelay)
			return ;
		this.animationTimer = time.previous;

		if (frameDelay <= FrameDelay.FREEZE)
			return ;
		this.animationFrame++;

		if (this.animationFrame >= animation.length)
			this.animationFrame = 0;
		this.boxes = this.getBoxes(animation[this.animationFrame][0]);
	}

	updateAttackBoxCollided(time, context) {
		if (!this.states[this.currentState].attackType || this.attackStruck)
			return ;

		const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

		const x = this.opponent.boxes.hurt.x;
		const y = this.opponent.boxes.hurt.y;
		const width = this.opponent.boxes.hurt.width;
		const height = this.opponent.boxes.hurt.height;
		const actualOpponentHurtBox = getActualBoxDimensions(
			this.opponent.position,
			this.opponent.direction,
			{x, y, width, height},
		);

		if (!boxOverlap(actualHitBox, actualOpponentHurtBox))
			return ;

		const strength = this.states[this.currentState].attackStrength;
		
		stopSound(this.sound.attack.LIGHT);
		stopSound(this.sound.attack.MIDDLE);
		if (PlayerInfo[0].name == this.opponent.player)
			PlayerInfo[0].health -= FighterAttackBaseData[strength].damage;
		else
			PlayerInfo[1].health -= FighterAttackBaseData[strength].damage;

		this.opponent.handleAttackHit(strength);
		this.attackStruck = true;
	}

	updateDead() {
		if (this.owner == this.player) {
			if (PlayerInfo[0].name == this.player && PlayerInfo[0].health <= 0)
				this.changeState(FighterState.DEAD);
			else if (PlayerInfo[1].name == this.player && PlayerInfo[1].health <= 0)
				this.changeState(FighterState.DEAD);
		}
	}

	update(time, context) {
		this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
		this.position.y += this.velocity.y * time.secondsPassed;

		if ([FighterState.IDLE, FighterState.FORWARDS, FighterState.BACKWARDS].includes(this.currentState))
			this.direction = this.getDirection();

		this.states[this.currentState].update(time, context);
		this.updateAnimation(time);
		this.updateStateContraints(time, context);
		this.updateAttackBoxCollided(time, context);
		this.updateDead();
	}

	drawDebugBox(context, dimensions, baseColor) {
		if (!Array.isArray(dimensions))
			return ;

		const [x = 0, y = 0, width = 0, height = 0] = dimensions;

		// pushBox
		context.beginPath();
		context.strokeStyle = baseColor + 'AA';
		context.fillStyle = baseColor + '44';
		context.fillRect(
			Math.floor(this.position.x + x * this.direction) + 0.5,
			Math.floor(this.position.y + y) + 0.5,
			width * this.direction,
			height,
		);
		context.rect(
			Math.floor(this.position.x + x * this.direction) + 0.5,
			Math.floor(this.position.y + y) + 0.5,
			width * this.direction,
			height,
		);
		context.stroke();
	}

	drawDebug(context) {
		const [frameKey] = this.animations[this.currentState][this.animationFrame];
		const boxes = this.getBoxes(frameKey);

		context.lineWidth = 5;

		// push
		this.drawDebugBox(context, Object.values(boxes.push), '#55FF55');

		// hurt
		this.drawDebugBox(context, Object.values(boxes.hurt), '#7777FF');

		// hit
		this.drawDebugBox(context, Object.values(boxes.hit), '#FF0000');

		// player image origin location
		context.beginPath();
		context.strokeStyle = "white";
		context.moveTo(this.position.x - 10, this.position.y);
		context.lineTo(this.position.x + 9, this.position.y);
		context.moveTo(this.position.x, this.position.y - 10);
		context.lineTo(this.position.x, this.position.y + 9);
		context.stroke()
	}

	draw(time, context) {
		const [frameKey] = this.animations[this.currentState][this.animationFrame];
		const [[
			[x, y, width, height, scale_width, scale_height],
			[originX, originY],
		]] = this.frames.get(frameKey);

		context.scale(this.direction, 1);
		context.drawImage(
			this.image,
			x, y,
			width, height,
			Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY,
			scale_width, scale_height
		);
		context.setTransform(1, 0, 0, 1, 0, 0);

		// this.drawDebug(context);
	}
}