const Main = (children) => {
  const main = document.createElement("main");
  main.classList.add("d-flex", "flex-column", "p-2", "bg-primary", "vh-100");

  const header = document.createElement("header");
  header.textContent = "42 Ping Pong";

  const section = document.createElement("section");
  section.classList.add(
    "d-flex",
    "p-2",
    "bg-light",
    "justify-content-between",
    "align-items-center",
    "gap-2"
  );

  const renderSection = document.createElement("div");
  renderSection.classList.add("d-flex", "w-50", "flex-column", "gap-2");
  section.appendChild(renderSection);

  if (children) {
    renderSection.appendChild(children);
  }

  const img = document.createElement("img");
  img.src = "../../public/img/main.png";
  img.alt = "main";
  img.classList.add("img-fluid", "w-50");

  section.appendChild(img);

  main.appendChild(header);
  main.appendChild(section);

  return main;
};

const MainLayout = (children) => {
  const app = document.getElementById("app");
  app.appendChild(Main(children));
};

export default MainLayout;
