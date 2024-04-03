import { useState } from "../../MyReact";
import Sended from "./2faSend";

const FaImgGroup = (fa, setFa) => {
  const clickHandler = (key) => {
    setFa(key);
  };

  window.clickHandler = clickHandler;

  return /*html*/ `
    <div class="d-flex justify-content-center align-items-center w-100" style="gap : 6rem;">
    <img  src="../../public/img/icons/mail.png" onclick="clickHandler('mail')" class="p-2" alt="email" style="width: 80px; cursor: pointer; ${
      fa === "mail" ? "border: 1px solid blue; border-radius: 30%" : ""
    };">
    <img  src="../../public/img/icons/sms.png"   onclick="clickHandler('sms')" class="p-2" alt="sms" style="width: 80px; cursor: pointer; ${
      fa === "sms" ? "border: 1px solid blue; border-radius: 30%" : ""
    };">
    <img  src="../../public/img/icons/app.png"   onclick="clickHandler('app')" class="p-2" alt="app" style="width: 80px; cursor: pointer; ${
      fa === "app" ? "border: 1px solid blue; border-radius: 30%" : ""
    };">
    </div>
    `;
};

const FaHeader = () => {
  return /*html*/ `
  <div class="d-flex flex-column justify-content-start align-items-start w-100 gap-2">
    <div>
      <h1>2FA</h1>
      <p style="color:gray" >Please choose from 3 authentication methods.</p>
    </div>
  </div>
  `;
};

const faPage = () => {
  const [fa, setFa] = useState(null);
  const [faSent, setFaSent] = useState(false);

  const clickHandler = () => {
    console.log("send", fa, "you should remove event listener after sending");
    setFaSent(true);
  };

  window.faClickHandler = clickHandler;

  return /*html*/ `
  <div class="d-flex justify-content-between align-items-center flex-column" style="height: 50vh;">
  
  ${
    faSent
      ? /*html*/ `${Sended()}`
      : /*html*/ `
      <div class="d-flex flex-column gap-4">
    ${FaHeader()}
    ${FaImgGroup(fa, setFa)}
    </div>
    <button 
    ${fa === null ? "disabled" : ""}
    class="btn btn-primary d-flex gap-2" onclick="faClickHandler()">
    Send
    </button>
    <div></div>
  `
  }
    
  </div>
  `;
};

export default faPage;
