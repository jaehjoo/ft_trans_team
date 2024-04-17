const Sended = (fa) => {
  const handdleSubmit = (e) => {
    e.preventDefault();
    const code = e.target[0].value;

    fetch("/api/input2fa", {
      method: "POST",
      body: JSON.stringify({
        code: code,
        access: localStorage.getItem("access_token"),
      }),
      headers: {
        "X-CSRFToken": localStorage.getItem("csrf_token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Error");
        res.json().then((data) => {
          if (data.success === "N") {
            localStorage.clear();
            window.location.href = "/login";
          }
          window.location.href = "/main";
        });
      })
      .catch((err) => {
        console.log(err);
        window.location.href = "/login";
      });
  };

  window.handdleSubmit = handdleSubmit;

  return /* html */ `
  <div class="d-flex justify-content-center align-items-center flex-column w-100 p-4" style="height: 50vh;">
    <div>
    <h1>Sended !</h1>
    <p style="color:gray;">Please enter your security code.</p>
    <div>
    </div>
  </div><div class="d-flex flex-column w-100 justify-content-center align-items-center">
    ${
      fa === "otp"
        ? /*html*/ `<img src="/media/qr.jpg" alt="2fa-app" style="width: 100px; height: 100px;">`
        : ""
    }
    <form onsubmit="handdleSubmit(event)" id="2faForm" class="d-flex flex-column gap-4 p-4 justify-content-center align-items-center">
        <div class="form-group">
          <label for="2fa">2FA Code</label>
          <input type="text" class="form-control" id="2fa" placeholder="Enter Code">
        </div>
        <button type="submit" class="btn btn-primary w-100">Submit</button>
    </form></div></div>`;
};

export default Sended;
