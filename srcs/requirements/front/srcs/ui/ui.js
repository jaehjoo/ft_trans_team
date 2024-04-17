import Toast from "../../components/ui/Toast.js";
import Accordion from "../../components/ui/Accordion.js";
import Modal from "../../components/ui/Modal.js";
import AlertBox from "../../components/ui/AlertBox.js";
import Badge from "../../components/ui/Badge.js";
import Button from "../../components/ui/Button.js";
import Card from "../../components/ui/Card.js";
import Collapse from "../../components/ui/Collapse.js";
import Dropdown from "../../components/ui/Dropdown.js";
import ListGroup from "../../components/ui/ListGroup.js";
import Sidebar from "../../components/ui/Sidebar.js";
import Skeleton from "../../components/ui/Skeleton.js";
import Spinner from "../../components/ui/Spinner.js";

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
