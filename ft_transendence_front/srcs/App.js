import { CounterAndMeow } from "../components/test.js";
import MainLayout from "./main/layout.js";
import LoginPage from "./login/login.js";
import FaPage from "./login/2fa.js";

export const App = () => {
  if (window.location.pathname === "/") {
    window.location.pathname = "/login";
  }

  if (window.location.pathname === "/login") {
    return `${MainLayout(LoginPage)}`;
  } else if (window.location.pathname === "/2fa") {
    return `${MainLayout(FaPage)}`;
  }

  return /*html*/ `
  <div>
    ${CounterAndMeow()}
  </div>
`;
};
