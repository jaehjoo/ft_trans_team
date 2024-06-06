const fetchAddUser = async (name) => {
  const data = {
    friend_name: name,
    mode: "add",
    access: localStorage.getItem("access_token"),
  };

  const response = await fetch(`/api/friends`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "X-CSRFToken": localStorage.getItem("csrf_token"),
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (res.success !== "Y") {
    localStorage.clear();
    window.location.pathname = "/login";
  } else {
    window.location.pathname = "/main";
  }
};

const fetchUsers = async () => {
  const access = localStorage.getItem("access_token") || "null";
  const response = await fetch(`/api/list?access=${access}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
};

const fetchDeleteUser = async (name) => {
  const data = {
    friend_name: name,
    mode: "del",
    access: localStorage.getItem("access_token"),
  };

  const response = await fetch(`/api/friends`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "X-CSRFToken": localStorage.getItem("csrf_token"),
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (res.success !== "Y") {
    localStorage.clear();
    window.location.pathname = "/login";
  } else {
    window.location.pathname = "/main";
  }
};

const Friend = (friend, connect) => {
  const name = friend;
  return /*html*/ `
  <div class="d-flex justify-content-between p-2">
    <div>${friend}</div>
    <div class="d-flex justify-content-center align-items-center gap-4">
    <div>${connect ? "Online" : "Offline"}</div>
    <button onclick="fetchDeleteUser('${name}')" class="btn btn-danger">Delete</button>
    </div>
  </div>`;
};

const Sidebar = (friends) => {
  const handleSubmitSearch = (event) => {
    event.preventDefault();
    fetchUsers().then((data) => {
      const getFriends = Object.values(data.userList);
      getFriends.shift();

      const offcanvas = document.querySelector("#offcanvasRight");
      offcanvas.querySelector(".btn-close").click();

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

      const modal = document.createElement("div");
      modal.style.backgroundColor = "white";
      modal.style.overflow = "auto";
      modal.style.maxHeight = "80%";
      modal.style.width = "50%";
      modal.style.margin = "auto";

      const form = document.createElement("form");
      form.style.display = "flex";
      form.style.flexDirection = "column";
      form.style.gap = "10px";
      form.style.padding = "20px";

      getFriends.forEach((friend) => {
        const label = document.createElement("label");
        label.textContent = friend.name;
        label.style.display = "flex";
        label.style.justifyContent = "space-between";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "friend";
        radio.value = friend.name;

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

        let flag = false;
        const existFriends = Object.values(friends);
        existFriends.forEach((friend) => {
          if (friend.name === checked.value) {
            flag = true;
          }
        });

        if (!flag) {
          fetchAddUser(checked.value);
        }
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
    });
  };

  window.handleSubmitSearch = handleSubmitSearch;
  window.fetchDeleteUser = fetchDeleteUser;

  return /*html*/ `
  <button  style="font-size: 15px; height : 35px; margin-top: 5px;" class="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Friends List</button>

  
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div class="offcanvas-header d-flex gap-4">
    <h5 class="offcanvas-title" id="offcanvasRightLabel">Friends</h5>

    <form class="d-flex gap-2" onsubmit="handleSubmitSearch(event)">
      <button class="btn btn-primary" type="submit">Find Friends</button>
    </form>

    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <hr></hr>
  <div class="offcanvas-body d-flex flex-column gap-4">
  ${Object.values(friends)
    .map((friend) => {
      return Friend(friend.name, friend.connect);
    })
    .join("")}
  </div>
</div>`;
};

export default Sidebar;
