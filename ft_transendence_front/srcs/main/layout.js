import parser from "../../utils/parser";

const Main = (children) => {
  const MainStr = /*html*/ `
    <main class="d-flex flex-column p-2 bg-primary vh-100 justify-content-between align-items-center">
    <div class="d-flex w-100">
      <header>42 Ping Pong</header>
    </div>
    <section class="d-flex p-2 bg-light justify-content-between align-items-center gap-2">
      <div id="renderSection" class="d-flex w-50 flex-column gap-2">
      </div>
      <img src="../../public/img/main.png" alt="main" class="img-fluid w-50">
    </section>
    <footer>Made with by 42 Cadets</footer>
  `;

  const mainElement = parser(MainStr, "main");
  const renderSection = mainElement.querySelector("#renderSection");
  renderSection.appendChild(children);

  return mainElement;
};

const MainLayout = (children) => {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(Main(children));
};

export default MainLayout;
