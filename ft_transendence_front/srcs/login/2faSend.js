const Sended = () => {
  const handdleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "submit",
      e.target[0].value,
      "you should remove event listener after sending"
    );
    window.location.href = "/main";
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
    <form onsubmit="handdleSubmit(event)" id="2faForm" class="d-flex flex-column gap-4 p-4 justify-content-center align-items-center">
        <div class="form-group">
          <label for="2fa">2FA Code</label>
          <input type="text" class="form-control" id="2fa" placeholder="Enter Code">
        </div>
        <button type="submit" class="btn btn-primary w-100">Submit</button>
    </form></div></div>`;
};

export default Sended;
