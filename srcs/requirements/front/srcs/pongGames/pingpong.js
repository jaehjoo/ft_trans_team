import { StartCanvasOne } from "./onebyone.js";
import { StartCanvasTeam } from "./twobytwo.js";
import { StartCanvasTournament } from "./tournament.js";
import { StartCanvasOneLocal } from "./onebyone_local.js";
import { StartCanvasTeamLocal } from "./twobytwo_local.js";
import { StartCanvasTournamentLocal } from "./tournament_local.js";

const addCanvas = async () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  canvas.style.height = "100%";
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
    else if (str === "one_local")
      StartCanvasOneLocal();
    else if (str === "team_local")
      StartCanvasTeamLocal();
    else if (str === "tournament_local")
      StartCanvasTournamentLocal();
  });
};

export default PingPong;
