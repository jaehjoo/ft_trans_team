export const PUSH_FRICTION = 66;

export const MAX_HITPOINT = 447;

export const fighterName = {
	ADLER: "adler",
	BADUKKI: "badukki",
	CHOI: "choi",
	HUNTERJ: "hunterJ",
	REMPIRA: "rempira",
	SIGRID: "sigrid",
	SYATRINO: "syatrino",
}

export const FighterAttackStrength = {
	LIGHT: 'light',
	MIDDLE: 'middle',
}

export const FighterAttackBaseData = {
	[FighterAttackStrength.LIGHT] : {
		damage: 20,
	},
	[FighterAttackStrength.MIDDLE] : {
		damage: 35,
	},
}

export const FighterState = {
	IDLE: "idle",
	FORWARDS: "forwards",
	BACKWARDS: "backwards",
	JUMP: "jump",
	ATTACK1: "attack1",
	ATTACK2: "attack2",
	HURT: "hurt",
	DEAD: "dead",
}

export const FighterDirection = {
	RIGHT: 1,
	LEFT: -1,
}

export const FighterAttackType = {
	LIGHT: "light",
	MIDDLE: "middle",
}

export const FrameDelay = {
	FREEZE: 0,
	TRANSITION: -1,
}

export const PlayerInfo = [
	{
		name: "",
		display: "",
		health: MAX_HITPOINT,
		fighter: "",
	},
	{
		name: "",
		display: "",
		health: MAX_HITPOINT,
		fighter: "",
	},
	{
		floor: 0,
		winner: "",
	}
]
