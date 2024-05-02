import { FighterState } from "./fighter.js"

const ImageRoot = "../../img/fightingGames/"

export const startBackground = ImageRoot + "start/start.png";

export const stageBackground = [
	ImageRoot + "stage/peace.png",
	ImageRoot + "stage/garage.png",
	ImageRoot + "stage/mountain.png",
	ImageRoot + "stage/dawn.png",
	ImageRoot + "stage/city.png",
	ImageRoot + "stage/moon.png",
]

export const selectCircleImageSrc = [
	ImageRoot + "etc/selectCharacter0.png",
	ImageRoot + "etc/selectCharacter1.png",
]

export const selectStandingImageSrc = [
	ImageRoot + "character/adler/Idle.png",
	ImageRoot + "character/badukki/Idle.png",
	ImageRoot + "character/choi/Idle.png",
	ImageRoot + "character/hunterJ/Idle.png",
	ImageRoot + "character/sigrid/Idle.png",
	ImageRoot + "character/syatrino/Idle.png",
]

export const selectBackgroundImageSrc = ImageRoot + "etc/select.png"

export const battleStageImageSrc = ImageRoot + "stage/moon.png"

export const battleStatusBarImageSrc = [
	ImageRoot + "etc/healthBarFrame.png",
	ImageRoot + "etc/healthBarProgress.png",
	ImageRoot + "etc/vs.png",
]

export const fighterAdler = {
	[FighterState.IDLE] : ImageRoot + "character/adler/Idle.png",
	[FighterState.FORWARDS] : ImageRoot + "character/adler/Run.png",
	[FighterState.BACKWARDS] : ImageRoot + "character/adler/Run.png",
	[FighterState.ATTACK1] : ImageRoot + "character/adler/Attack1.png",
	[FighterState.ATTACK2] : ImageRoot + "character/adler/Attack2.png",
	[FighterState.JUMP] : ImageRoot + "character/adler/Jump.png",
	[FighterState.HURT] : ImageRoot + "character/adler/Get Hit.png",
	[FighterState.DEAD] : ImageRoot + "character/adler/Death.png",
}

export const fighterBadukki = {
	[FighterState.IDLE] : ImageRoot + "character/badukki/Idle.png",
	[FighterState.FORWARDS] : ImageRoot + "character/badukki/Walk.png",
	[FighterState.BACKWARDS] : ImageRoot + "character/badukki/Walk.png",
	[FighterState.ATTACK1] : ImageRoot + "character/badukki/Attack.png",
	[FighterState.ATTACK2] : ImageRoot + "character/badukki/Attack.png",
	[FighterState.JUMP] : ImageRoot + "character/badukki/Idle.png",
	[FighterState.HURT] : ImageRoot + "character/badukki/Get Hit.png",
	[FighterState.DEAD] : ImageRoot + "character/badukki/Death.png",
}

export const fighterChoi = {
	[FighterState.IDLE] : ImageRoot + "character/choi/Idle.png",
	[FighterState.FORWARDS] : ImageRoot + "character/choi/Run.png",
	[FighterState.BACKWARDS] : ImageRoot + "character/choi/Run.png",
	[FighterState.ATTACK1] : ImageRoot + "character/choi/Attack1.png",
	[FighterState.ATTACK2] : ImageRoot + "character/choi/Attack2.png",
	[FighterState.JUMP] : ImageRoot + "character/choi/Jump.png",
	[FighterState.HURT] : ImageRoot + "character/choi/Hit.png",
	[FighterState.DEAD] : ImageRoot + "character/choi/Death.png",
}

export const fighterHunterJ = {
	[FighterState.IDLE] : ImageRoot + "character/hunterJ/Idle.png",
	[FighterState.FORWARDS] : ImageRoot + "character/hunterJ/Run.png",
	[FighterState.BACKWARDS] : ImageRoot + "character/hunterJ/Run.png",
	[FighterState.ATTACK1] : ImageRoot + "character/hunterJ/Attack1.png",
	[FighterState.ATTACK2] : ImageRoot + "character/hunterJ/Attack2.png",
	[FighterState.JUMP] : ImageRoot + "character/hunterJ/Jump.png",
	[FighterState.HURT] : ImageRoot + "character/hunterJ/Take Hit.png",
	[FighterState.DEAD] : ImageRoot + "character/hunterJ/Death.png",
}

export const fighterSigrid = {
	[FighterState.IDLE] : ImageRoot + "character/sigrid/Idle.png",
	[FighterState.FORWARDS] : ImageRoot + "character/sigrid/Run.png",
	[FighterState.BACKWARDS] : ImageRoot + "character/sigrid/Run.png",
	[FighterState.ATTACK1] : ImageRoot + "character/sigrid/Attack1.png",
	[FighterState.ATTACK2] : ImageRoot + "character/sigrid/Attack2.png",
	[FighterState.JUMP] : ImageRoot + "character/sigrid/Jump.png",
	[FighterState.HURT] : ImageRoot + "character/sigrid/Take Hit.png",
	[FighterState.DEAD] : ImageRoot + "character/sigrid/Death.png",
}

export const fighterSyatrino = {
	[FighterState.IDLE] : ImageRoot + "character/syatrino/Idle.png",
	[FighterState.FORWARDS] : ImageRoot + "character/syatrino/Run.png",
	[FighterState.BACKWARDS] : ImageRoot + "character/syatrino/Run.png",
	[FighterState.ATTACK1] : ImageRoot + "character/syatrino/Attack1.png",
	[FighterState.ATTACK2] : ImageRoot + "character/syatrino/Attack2.png",
	[FighterState.JUMP] : ImageRoot + "character/syatrino/Jump.png",
	[FighterState.HURT] : ImageRoot + "character/syatrino/Take Hit.png",
	[FighterState.DEAD] : ImageRoot + "character/syatrino/Death.png",
}

export const result = {
	"win" : ImageRoot + "result/win.png",
	"lose" : ImageRoot + "result/lose.png",
}