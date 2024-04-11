const Friend = (friend) => {
  return /*html*/ `
  <div class="d-flex justify-content-between p-2">
    <div>${friend}</div>
    <button class="btn btn-primary">Chat</button>
  </div>`;
};

const Sidebar = (text, Friends) => {
  const FriendsButtonHanddler = () => {
    console.log(Friends, "you should remove event listener here");
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    if (event.target[0].value === "") return;

    console.log("searching friends...", event.target[0].value);

    const friends = [
      event.target[0].value,
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Hannah",
      "Ivy",
      "Jack",
      "Katie",
      "Liam",
      "Mia",
      "Noah",
      "Olivia",
      "Peter",
      "Queen",
      "Ryan",
      "Sara",
      "Tom",
      "Uma",
      "Vivian",
      "Will",
      "Xavier",
      "Yuna",
      "Zoe",
    ];

    //offcanvas close
    const offcanvas = document.querySelector("#offcanvasRight");
    offcanvas.querySelector(".btn-close").click();

    //input clear
    event.target[0].value = "";

    // create portal
    const rootBody = document.querySelector("body");
    const bg = document.createElement("div");
    bg.style.position = "fixed";
    bg.style.top = "0";
    bg.style.left = "0";
    bg.style.width = "100%";
    bg.style.height = "100%";
    bg.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    bg.style.zIndex = "1000";
    bg.style.display = "flex";
    bg.style.justifyContent = "center";

    // modal can scroll
    const modal = document.createElement("div");
    modal.style.backgroundColor = "white";
    modal.style.overflow = "auto";
    modal.style.maxHeight = "80%";
    modal.style.width = "50%";
    modal.style.margin = "auto";

    // form radio button
    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.gap = "10px";
    form.style.padding = "20px";

    friends.forEach((friend) => {
      const label = document.createElement("label");
      label.textContent = friend;
      label.style.display = "flex";
      label.style.justifyContent = "space-between";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "friend";
      radio.value = friend;

      label.appendChild(radio);
      form.appendChild(label);
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Add Friend";
    submitButton.classList.add("btn", "btn-primary");
    submitButton.style.margin = "10px";
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const checked = form.querySelector("input:checked");
      if (!checked) return;

      console.log("add friend", checked.value);
      rootBody.removeChild(bg);
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.classList.add("btn", "btn-secondary");
    closeButton.style.margin = "10px";
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      rootBody.removeChild(bg);
    });

    form.appendChild(submitButton);
    form.appendChild(closeButton);

    modal.appendChild(form);

    bg.appendChild(modal);
    rootBody.appendChild(bg);

    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        rootBody.removeChild(bg);
      }
    });
  };

  window.FriendsButtonHanddler = FriendsButtonHanddler;
  window.handleSubmitSearch = handleSubmitSearch;

  return /*html*/ `
  <button onclick="FriendsButtonHanddler()" style="font-size: 15px; height : 35px; margin-top: 5px;" class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">${text}</button>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header d-flex gap-4">
    <h5 class="offcanvas-title" id="offcanvasRightLabel">Friends</h5>

    <form class="d-flex gap-2" onsubmit="handleSubmitSearch(event)">
      <input class="form-control" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-primary" type="submit">Search</button>
    </form>

    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <hr></hr>
  <div class="offcanvas-body d-flex flex-column gap-4">
    ${Friends.map(Friend).join("")}
  </div>
</div>`;
};

export default Sidebar;
