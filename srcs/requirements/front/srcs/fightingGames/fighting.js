import { StartCanvas } from "./index.js";
import { GameViewport } from "./src/constants/window.js";

const addCanvas = async () => {
	const canvas = document.createElement("canvas");
	canvas.width = GameViewport.WIDTH;
	canvas.hieght = GameViewport.HEIGHT;
	const body = document.body;
	body.appendChild(canvas);
	return "done";
  };
  
  const Fighting = () => {
	addCanvas().then((res) => {
	  StartCanvas();
	});
  };
  
  export default Fighting;
  