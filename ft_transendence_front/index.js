import "/styles/style.css";

import renderUIPage from "./srcs/ui/ui";
import MainLayout from "./srcs/main/layout";
import LoginPage from "./srcs/login/login";
import faPage from "./srcs/login/2fa";

const App = () => {
  // // 라우터 처리

  if (window.location.pathname === "/2fa") {
    MainLayout(faPage());
  } else {
    MainLayout(LoginPage());
  }
};

App();
