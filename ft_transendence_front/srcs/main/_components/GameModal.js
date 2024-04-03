import ModalContent from "./ModalContent";

const GameModal = () => {
  return /*html*/ `
  <button type="button" class="btn btn-primary w-75" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Play Game
  </button>
  
  ${ModalContent()}
  `;
};

export default GameModal;
