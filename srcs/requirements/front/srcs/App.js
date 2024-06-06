import { CounterAndMeow } from "../components/test.js";
import MainLayout from "./main/layout.js";
import LoginPage from "./login/login.js";
import FaPage from "./login/2fa.js";
import MainPage from "./main/main.js";
import LobbyLayout from "./lobby/layout.js";
import MyPage from "./main/mypage.js";
import GameResult from "./lobby/result.js";
import PingPong from "./pongGames/pingpong.js";
import Fighting from "./fightingGames/fighting.js";
import MypageLayout from "./main/MypageLayout.js";

export const URL = "https://10.14.6.8";

const refreshHandler = (event) => {
  if (
    window.location.pathname === "/pingpong/onebyone" ||
    window.location.pathname === "/pingpong/twobytwo" ||
    window.location.pathname === "/pingpong/tournament" ||
    window.location.pathname === "/pingpong/onebyonelocal" ||
    window.location.pathname === "/pingpong/twobytwolocal" ||
    window.location.pathname === "/pingpong/tournamentlocal" ||
    window.location.pathname === "/fighting"
  ) {
    event.returnValue =
      "이 페이지를 벗어나시겠습니까? 변경사항이 저장되지 않을 수 있습니다.";
  }
};

window.onbeforeunload = refreshHandler;

export const App = () => {
  if (window.location.pathname === "/") {
    if (localStorage.getItem("access_token") === null) {
      window.location.pathname = "/login";
    } else {
      window.location.pathname = "/main";
    }
  }

  if (window.location.pathname === "/login") {
    return `${MainLayout(LoginPage)}`;
  } else if (window.location.pathname === "/shallwe") {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      fetch(`/api/auth42?code=${code}`)
        .then((res) => {
          res.json().then((data) => {
            if (data.success === "Y") {
              localStorage.setItem("access_token", data.content.access);
              localStorage.setItem("refresh_token", data.content.refresh);
              // localStorage.setItem("csrf_token", data.content.csrftoken);
              window.location.href = `/2fa`;
            } else {
              window.location.href = URL;
            }
          });
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("csrf_token");
          // window.location.href = URL;
        });
    }

    return null;
  } else if (window.location.pathname === "/2fa") {
    return `${MainLayout(FaPage)}`;
  } else if (window.location.pathname === "/main") {
    return `${MainLayout(MainPage)}`;
  } else if (window.location.pathname === "/mypage") {
    return `${MypageLayout(MyPage)}`;
  } else if (window.location.pathname === "/game/result") {
    return `${LobbyLayout(GameResult)}`;
  } else if (window.location.pathname === "/pingpong/onebyone") {
    document.body.innerHTML = "";
    PingPong("one");
  } else if (window.location.pathname === "/pingpong/twobytwo") {
    document.body.innerHTML = "";
    PingPong("team");
  } else if (window.location.pathname === "/pingpong/tournament") {
    document.body.innerHTML = "";
    PingPong("tournament");
  } else if (window.location.pathname === "/pingpong/onebyonelocal") {
    document.body.innerHTML = "";
    PingPong("one_local");
  } else if (window.location.pathname === "/pingpong/twobytwolocal") {
    document.body.innerHTML = "";
    PingPong("team_local");
  } else if (window.location.pathname === "/pingpong/tournamentlocal") {
    document.body.innerHTML = "";
    PingPong("tournament_local");
  } else if (window.location.pathname === "/fighting") {
    document.body.innerHTML = "";
    Fighting();
  }

  return /*html*/ `
  <div>
    ${CounterAndMeow()}
  </div>
`;
};
