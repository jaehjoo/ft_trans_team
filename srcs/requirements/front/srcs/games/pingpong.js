import StartCanvas from "./index.js";

const addCanvas = async () => {
  const canvas = document.createElement("canvas");
  const body = document.body;
  body.appendChild(canvas);
  return "done";
};

const PingPong = () => {
  addCanvas().then((res) => {
    StartCanvas();
  });
  // StartCanvas();
};

export default PingPong;
