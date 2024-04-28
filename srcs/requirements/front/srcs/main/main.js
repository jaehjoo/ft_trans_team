import { useState } from "../../MyReact.js";
import ButtonGroup from "./_components/ButtonGroup.js";
import Friends from "./_components/Friends.js";
//$uri?access={access_value}&refresh={refresh_value}
const mainFetch = async () => {
  const access = localStorage.getItem("access_token") || "null";
  const refresh = localStorage.getItem("refresh_token") || "null";
  const response = await fetch(`/api/main?access=${access}&refresh=${refresh}`);
  const data = await response.json();

  return data;
};

let name = "";

const MainPage = () => {
  const [intra, setIntra] = useState(name);

  if (name === "") {
    mainFetch().then((data) => {
      name = data.content.name;
      setIntra(data.content.name);
    });
  }

  return /*html*/ `
  <div class="d-flex flex-column w-100 justify-content-center align-items-center gap-2">
    <div class="d-flex justify-content-center gap-4">
      <h1>${intra} 님</h1>
      ${Friends()}
    </div>
    <p style="color: gray;">42 ping pong에 오신 걸 환영합니다!</p>
    ${ButtonGroup()}
  </div>
  `;
};

export default MainPage;
