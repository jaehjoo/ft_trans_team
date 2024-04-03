import { useState } from "../../../MyReact";

const ModalContent = () => {
  const handleClick = (text) => {
    console.log(text, "you should remove event listener here");
    window.location.href = `/${text}`;
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
        <button type="button" class="btn btn-primary w-100" onclick="modalHandleClick('create')">Create Room</button>
        <button type="button" class="btn btn-primary w-100" onclick="modalHandleClick('join')">Join Room</button>
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
