import { controls, Control } from "../constants/control.js"
import { FighterDirection } from "../constants/fighter.js";

export const heldKeys = new Set();
export const pressedKeys = new Set();

function handleKeyDown(event) {
	event.preventDefault();

	heldKeys.add(event.code);
}

function handleKeyUp(event) {
	event.preventDefault();

	heldKeys.delete(event.code);
	pressedKeys.delete(event.code);
}

export function registerKeyboardEvents() {
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
}

export function removeKeyboardEvents() {
	window.removeEventListener('keydown', handleKeyDown);
	window.removeEventListener('keyup', handleKeyUp);
}

export const isKeyDown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);

export function isKeyPressed(code) {
	if (heldKeys.has(code) && !pressedKeys.has(code)) {
		pressedKeys.add(code);
		return true;
	}
	return false;
}

export const isLeft = () => isKeyDown(controls.keyboard[Control.LEFT]);
export const isRight = () => isKeyDown(controls.keyboard[Control.RIGHT]);
export const isUp = () => isKeyDown(controls.keyboard[Control.UP]);
export const isDown = () => isKeyDown(controls.keyboard[Control.DOWN]);
export const isAttack = () => isKeyPressed(controls.keyboard[Control.ATTACK]);
export const isMiddleAttack = () => isKeyPressed(controls.keyboard[Control.MIDDLEATTACK]);
export const isForward = (direction) => direction === FighterDirection.RIGHT ? isRight() : isLeft();
export const isBackward = (direction) => direction === FighterDirection.LEFT ? isRight() : isLeft();
export const isControlDown = (control) => isKeyDown(controls.keyboard[control]);
export const isControlPressed = (control) => isKeyPressed(controls.keyboard[control]);