const Main = (children) => {
  if (children === undefined) children = "";
  const MainStr = /*html*/ `
    <main class="d-flex flex-column p-2 bg-light vh-100 justify-content-between align-items-center">
    <div class="d-flex w-100">
      <header>42 Ping Pong</header>
    </div>
    <section class="w-100 d-flex p-2 bg-light justify-content-between align-items-center gap-2">
      <div id="renderSection" class="d-flex w-100 flex-column gap-2">
      ${children}
      </div>
    </section>
    <footer>Made with by 42 Cadets</footer>
  `;
  return MainStr;
};

const LobbyLayout = (component) => {
  if (component === undefined) component = () => "";
  const children = component();

  return /*html*/ `
    ${Main(children)}
  `;
};

export default LobbyLayout;
