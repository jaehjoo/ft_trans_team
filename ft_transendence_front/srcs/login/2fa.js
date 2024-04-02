import parser from "../../utils/parser";
import Sended from "./2faSend";
import MainLayout from "../main/layout";

const FaImgGroup = () => {
  const ImgGroup = parser(
    /*html*/ `
    <div class="d-flex justify-content-center align-items-center w-100" style="gap : 6rem;">
    <img id="faMAIL" src="../../public/img/icons/mail.png" class="p-2" alt="email" style="width: 80px; cursor: pointer;">
    <img id="faSMS" src="../../public/img/icons/sms.png"   class="p-2" alt="sms" style="width: 80px; cursor: pointer;">
    <img id="faAPP" src="../../public/img/icons/app.png"   class="p-2" alt="app" style="width: 80px; cursor: pointer;">
    </div>
    `,
    "div"
  );

  const FaHandler = (key, node) => {
    console.log(key);

    // make radio button
    if (node.style.border === "2px solid blue") {
      node.style.border = "none";
    } else {
      node.style.border = "2px solid blue";
      node.style.borderRadius = "30%";
    }

    // MainLayout(Sended());
    node.removeEventListener("click", () => FaHandler(key, node));
  };

  ImgGroup.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const key = node.id.replace("fa", "");
      node.addEventListener("click", () => FaHandler(key, node));
    }
  });

  return ImgGroup;
};

const FaHeader = () => {
  const FaContainerStr = /*html*/ `
  <div class="d-flex flex-column p-4 justify-content-start align-items-start w-100 gap-2">
    <div>
      <h1>2FA</h1>
      <p style="color:gray" >Please choose from 3 authentication methods.</p>
    </div>
  </div>
  `;
  return parser(FaContainerStr, "div");
};

const faPage = () => {
  const pageStr = /*html*/ `
  <div class="d-flex justify-content-between align-items-center flex-column" style="height: 50vh;">
  </div>
  `;
  const page = parser(pageStr, "div");

  const FaContainer = FaHeader();
  const FaImgs = FaImgGroup();
  FaContainer.appendChild(FaImgs);
  page.appendChild(FaContainer);

  return page;
};

export default faPage;
