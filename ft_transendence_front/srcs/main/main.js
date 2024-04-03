import ButtonGroup from "./_components/ButtonGroup.js";
import Friends from "./_components/Friends.js";

const MainPage = () => {
  return /*html*/ `
  <div class="d-flex flex-column w-100 justify-content-center align-items-center gap-2">
    <div class="d-flex justify-content-center gap-4">
      <h1>dkham 님</h1>
      ${Friends()}
    </div>
    <p style="color: gray;">42 ping pong에 오신 걸 환영합니다!</p>
    ${ButtonGroup()}
  </div>
  `;
};

export default MainPage;
