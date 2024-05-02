import { TimeFighter } from "./src/TimeFighter.js"
import { GameViewport } from "./src/constants/window.js";
import { startBackground } from "./src/constants/image.js";

export const StartCanvas = () => {
	const start = new Image();
	const canvas = document.querySelector("canvas");
	const context = canvas.getContext('2d');

	start.src = startBackground;
	context.drawImage(start, 0, 0, 1024, 768, 0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);

	window.addEventListener("click", function() {
		let ws;
		const access_token = localStorage.getItem("access_token")
		if (access_token)
			ws = new WebSocket("wss://" + window.location.host + "/ws/game/fighting?access=" + access_token);
		else
			ws = new WebSocket("wss://" + window.location.host + "/ws/game/fighting?access=null");

		const timeFighter = new TimeFighter(ws);

		timeFighter.start(0);
	}, {once : true})
}