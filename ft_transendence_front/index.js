import "/styles/style.css";

import renderUIPage from "./srcs/ui/ui";
import MainLayout from "./srcs/main/layout";
import LoginPage from "./srcs/login/login";

const App = () => {
  // 라우터 처리
  if (window.location.pathname === "/ui") {
    renderUIPage();
  } else {
    MainLayout(LoginPage());
  }
};

App();
