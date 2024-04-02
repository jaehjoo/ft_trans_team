import parser from "../../utils/parser.js";

const FaFormGroup = () => {
  const wrapper = parser(
    /*html*/ `
    <div class="d-flex flex-column w-100 justify-content-center align-items-center">
    </div>
    `,
    "div"
  );

  const FaForm = parser(
    /*html*/ `
    <form id="2faForm" class="d-flex flex-column gap-4 p-4 justify-content-center align-items-center">
        <div class="form-group">
          <label for="2fa">2FA Code</label>
          <input type="text" class="form-control" id="2fa" placeholder="Enter Code">
        </div>
        <button type="submit" class="btn btn-primary w-100">Submit</button>
      </form>`,
    "form"
  );
  wrapper.appendChild(FaForm);

  const handdleSubmit = (e) => {
    e.preventDefault();
    console.log("submit", e.target[0].value);
    MainLayout(MainPage());

    FaForm.removeEventListener("submit", handdleSubmit);
  };

  FaForm.addEventListener("submit", handdleSubmit);

  return wrapper;
};

const Sended = () => {
  const pageStr = /*html*/ `
    <div class="d-flex justify-content-center align-items-center flex-column w-100 p-4" style="height: 50vh;">
    <div>
    <h1>Sended !</h1>
    <p style="color:gray;">Please enter your security code.</p>
    <div>
    </div>
  `;

  const page = parser(pageStr, "div");
  const FaForm = FaFormGroup();
  page.appendChild(FaForm);
  return page;
};

export default Sended;
