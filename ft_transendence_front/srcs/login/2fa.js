import Button from "../../components/ui/Button";
import Modal from "../../components/ui/CreateByModal";

const FaImgGroup = () => {
  const ImgGroup = document.createElement("div");
  ImgGroup.classList.add(
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "w-100"
  );

  ImgGroup.style.gap = "6rem";

  const emailImg = document.createElement("img");
  emailImg.src = "../../public/img/icons/mail.png";
  emailImg.alt = "email";
  emailImg.style.width = "50px";
  emailImg.style.cursor = "pointer";
  emailImg.addEventListener("click", () => {
    console.log("email");
  });

  const smsImg = document.createElement("img");
  smsImg.src = "../../public/img/icons/sms.png";
  smsImg.alt = "sms";
  smsImg.style.width = "50px";
  smsImg.style.cursor = "pointer";
  smsImg.addEventListener("click", () => {
    console.log("sms");
  });

  const appImg = document.createElement("img");
  appImg.src = "../../public/img/icons/app.png";
  appImg.alt = "app";
  appImg.style.width = "50px";
  appImg.style.cursor = "pointer";
  appImg.addEventListener("click", () => {
    console.log("app");
  });

  ImgGroup.appendChild(emailImg);
  ImgGroup.appendChild(smsImg);
  ImgGroup.appendChild(appImg);

  return ImgGroup;
};

const FaFormGroup = () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add(
    "d-flex",
    "flex-column",
    "w-100",
    "justify-content-center",
    "align-items-center"
  );

  const FaForm = document.createElement("form");
  FaForm.classList.add(
    "d-flex",
    "flex-column",
    "gap-4",
    "p-4",
    "justify-content-center",
    "align-items-center"
  );

  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");
  const FormLabel = document.createElement("label");
  FormLabel.htmlFor = "2fa";
  FormLabel.textContent = "2FA Code";
  const FormInput = document.createElement("input");
  FormInput.type = "text";
  FormInput.classList.add("form-control");
  FormInput.id = "2fa";
  FormInput.placeholder = "Enter Code";
  const FormButton = document.createElement("button");
  FormButton.type = "submit";
  FormButton.classList.add("btn", "btn-primary", "w-100");
  FormButton.textContent = "Submit";

  FaForm.appendChild(formGroup);
  formGroup.appendChild(FormLabel);
  formGroup.appendChild(FormInput);
  FaForm.appendChild(FormButton);

  FaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submit");
  });

  wrapper.appendChild(FaForm);

  return wrapper;
};

const Fa = () => {
  const FaContainer = document.createElement("div");
  FaContainer.innerHTML = /*html*/ `
  <div>
  <h1>2FA</h1>
  <p style="color:gray" >Please choose from 3 authentication methods.</p>
  </div>
  `;

  FaContainer.classList.add(
    "d-flex",
    "flex-column",
    "p-4",
    "justify-content-start",
    "align-items-start",
    "w-100",
    "gap-2"
  );

  const FaImgs = FaImgGroup();
  FaContainer.appendChild(FaImgs);
  const FaForm = FaFormGroup();
  FaContainer.appendChild(FaForm);

  return FaContainer;
};

const faPage = () => {
  const FaContainer = Fa();

  const page = document.createElement("div");
  page.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "flex-column"
  );
  page.style.height = "50vh";

  page.appendChild(FaContainer);

  return page;
};

export default faPage;
