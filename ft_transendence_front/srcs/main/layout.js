import { render } from "../../MyReact";
import parser from "../../utils/parser";

const Main = (children) => {
  if (children === undefined) children = "";
  const MainStr = /*html*/ `
    <main class="d-flex flex-column p-2 bg-primary vh-100 justify-content-between align-items-center">
    <div class="d-flex w-100">
      <header>42 Ping Pong</header>
    </div>
    <section class="w-100 d-flex p-2 bg-light justify-content-between align-items-center gap-2">
      <div id="renderSection" class="d-flex w-50 flex-column gap-2">
      ${children}
      </div>
      <img src="../../public/img/main.png" alt="main" class="img-fluid w-50">
    </section>
    <footer>Made with by 42 Cadets</footer>
  `;
  return MainStr;
};

const MainLayout = (component) => {
  const children = component();

  return /*html*/ `
    ${Main(children)}
  `;
};

export default MainLayout;
