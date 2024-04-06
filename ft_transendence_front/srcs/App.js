import { CounterAndMeow } from "../components/test.js";
import MainLayout from "./main/layout.js";
import LoginPage from "./login/login.js";
import FaPage from "./login/2fa.js";
import MainPage from "./main/main.js";
import LobbyLayout from "./lobby/layout.js";
import CreatePage from "./lobby/Create.js";
import JoinPage from "./lobby/Join.js";
import OneVersusOne from "./lobby/1vs1.js";
import TournamentLobby from "./lobby/Tournament.js";

export const App = () => {
  if (window.location.pathname === "/") {
    window.location.pathname = "/login";
  }

  if (window.location.pathname === "/login") {
    return `${MainLayout(LoginPage)}`;
  } else if (window.location.pathname === "/2fa") {
    return `${MainLayout(FaPage)}`;
  } else if (window.location.pathname === "/main") {
    return `${MainLayout(MainPage)}`;
  } else if (window.location.pathname === "/create") {
    return `${LobbyLayout(CreatePage)}`;
  } else if (window.location.pathname === "/join") {
    return `${LobbyLayout(JoinPage)}`;
  } else if (window.location.pathname === "/game/1v1") {
    return `${LobbyLayout(OneVersusOne)}`;
  } else if (window.location.pathname === "/game/tournament") {
    return `${LobbyLayout(TournamentLobby)}`;
  }

  return /*html*/ `
  <div>
    ${CounterAndMeow()}
  </div>
`;
};
