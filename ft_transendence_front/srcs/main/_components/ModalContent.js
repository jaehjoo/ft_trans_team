import { useState } from "../../../MyReact";

const ModalContent = () => {
  const handleClick = (text) => {
    console.log(text, "you should remove event listener here");
    window.location.href = `/game/${text}`;
  };

  window.modalHandleClick = handleClick;

  return /*html*/ `
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-md">
    <div class="modal-content" >
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Select Contents</h1>
        
      </div>
      <div class="modal-body d-flex flex-column gap-4">
        <button type="button" class="btn btn-primary w-100" onclick="modalHandleClick('1v1')">1 VS 1</button>
        <button type="button" class="btn btn-primary w-100" onclick="modalHandleClick('2v2')">2 VS 2</button>
        <button type="button" class="btn btn-primary w-100" onclick="modalHandleClick('tournament')">Tournament</button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        
      </div>
    </div>
  </div>
  </div>
  `;
};

export default ModalContent;
