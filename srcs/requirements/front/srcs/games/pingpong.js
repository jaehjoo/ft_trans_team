import { StartCanvasOne } from "./onebyone.js";
import { StartCanvasTeam } from "./twobytwo.js";
import { StartCanvasTournament } from "./tournament.js";

const addCanvas = async () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const body = document.body;
  body.appendChild(canvas);
  return "done";
};

const PingPong = (str) => {
  addCanvas().then((res) => {
    if (str === "one")
      StartCanvasOne();
    else if (str === "team")
      StartCanvasTeam();
    else if (str === "tournament")
      StartCanvasTournament();
  });
};

export default PingPong;
