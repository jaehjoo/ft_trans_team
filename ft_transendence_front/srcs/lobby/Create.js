import { useState } from "../../MyReact";

const CreatePage = () => {
  const [type, setType] = useState("");
  return /*html*/ `
    <div class="d-flex justify-content-between align-items-center">
    <img src="../../public/img/oneByone.png" alt="oneByone" class="w-25" />
    <img src="../../public/img/tournament.png" alt="tournament" class="w-25" />
    </div>
    <div></div>
    <div></div>
  `;
};

export default CreatePage;
