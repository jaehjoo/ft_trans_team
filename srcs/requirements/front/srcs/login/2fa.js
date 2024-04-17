import { useState } from "../../MyReact.js";
import Sended from "./2faSend.js";

// url = "http://transcendence.kgnj.kr/media/qr.jpg"

{
  sms: "01023331111";
}
// const data = await this.postData("https://transcendence.kgnj.kr/api/input2fa", { 'X-CSRFToken' : csrftoken },  { 'access' : access, 'code' : code});

const FaImgGroup = (fa, setFa, setFaSent) => {
  const clickHandler = (key) => {
    setFa(key);
  };

  const submitSms = (e) => {
    e.preventDefault();
    const num = e.target[0].value;
    fetch("/api/auth2fa", {
      method: "POST",
      body: JSON.stringify({
        sms: num,
        access: localStorage.getItem("access_token"),
      }),
      headers: {
        "X-CSRFToken": localStorage.getItem("csrf_token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Error");
        res
          .json()
          .then((data) => {
            setFaSent(true);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
        localStorage.clear();
        window.location.href = "/login";
      });
  };

  window.clickHandler = clickHandler;
  window.submitSms = submitSms;

  return /*html*/ `
    <div class="d-flex justify-content-center align-items-center w-100" style="gap : 6rem;">
    <img  src="../img/icons/mail.png" onclick="clickHandler('email')" class="p-2" alt="email" style="width: 80px; cursor: pointer; ${
      fa === "email" ? "border: 1px solid blue; border-radius: 30%" : ""
    };">
    <div class="d-flex flex-column justify-content-center align-items-center gap-4">
    <img  src="../img/icons/sms.png"   onclick="clickHandler('sms')" class="p-2" alt="sms" style="width: 80px; cursor: pointer; ${
      fa === "sms" ? "border: 1px solid blue; border-radius: 30%" : ""
    };">
    ${
      fa === "sms"
        ? /*html*/ `
        <form onsubmit="submitSms(event)" class="d-flex flex-column justify-content-center align-items-center gap-4">
        <input type="text" placeholder="Phone number" class="form-control" style="width: 200px; height: 50px; border-radius: 30px; text-align: center;">
        <button class="btn btn-primary" type="submit">Send</button>
        </form>
        `
        : ""
    }
    </div>
    <img  src="../img/icons/app.png"   onclick="clickHandler('otp')" class="p-2" alt="app" style="width: 80px; cursor: pointer; ${
      fa === "otp" ? "border: 1px solid blue; border-radius: 30%" : ""
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
    fetch("/api/auth2fa", {
      method: "POST",
      body: JSON.stringify({
        [fa]: "yes",
        access: localStorage.getItem("access_token"),
      }),
      headers: {
        "X-CSRFToken": localStorage.getItem("csrf_token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        res
          .json()
          .then((data) => {
            setFaSent(true);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        localStorage.clear();
        window.location.href = "/login";
      });
    setFaSent(true);
  };

  window.faClickHandler = clickHandler;

  const checkDisabled = () => {
    if (fa === null) return "disabled";
    return "";
  };

  return /*html*/ `
  <div class="d-flex justify-content-between align-items-center flex-column" style="height: 50vh;">
  
  ${
    faSent
      ? /*html*/ `${Sended(fa)}`
      : /*html*/ `
      <div class="d-flex flex-column gap-4">
    ${FaHeader()}
    ${FaImgGroup(fa, setFa, setFaSent)}
    </div>
    ${
      fa === "sms"
        ? ""
        : /*html*/ `
      <button 
      ${checkDisabled()}
      class="btn btn-primary d-flex gap-2" onclick="faClickHandler()">
      Send
      </button>`
    }
    <div></div>
  `
  }
    
  </div>
  `;
};

export default faPage;
