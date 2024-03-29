import Toast from "../../components/ui/Toast";
import Accordion from "../../components/ui/Accordion";
import Modal from "../../components/ui/Modal";
import AlertBox from "../../components/ui/AlertBox";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Collapse from "../../components/ui/Collapse";
import Dropdown from "../../components/ui/Dropdown";
import ListGroup from "../../components/ui/ListGroup";
import Sidebar from "../../components/ui/Sidebar";
import Skeleton from "../../components/ui/Skeleton";
import Spinner from "../../components/ui/Spinner";

const renderUIPage = () => {
  const app = document.querySelector("#app");
  app.innerHTML = /*html*/ `
${Toast()}
${Accordion()}
${Modal()}
${AlertBox()}
${Badge()}
${Button()}
${Card()}
${Collapse()}
${Dropdown()}
${ListGroup()}
${Sidebar()}
${Skeleton()}
${Spinner()}
`;
};

export default renderUIPage;
