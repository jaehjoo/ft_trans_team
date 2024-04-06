const JoinModal = (index, data) => {
  const modalId = `staticBackdrop${index}`; // 고유한 모달 id 생성

  let currentModal = index;

  const JoinButtonHandler = (e) => {
    currentModal = e.target.parentNode.getAttribute("key");
    console.log("JoinButtonHandler", currentModal);
  };

  const submitHandler = (idx) => (e) => {
    e.preventDefault();
    console.log("submit", e.target[0].value);
    console.log("Modal Index:", idx);

    if (data[currentModal].type === "one") window.location.href = "/game/1v1";
    else window.location.href = "/game/tournament";
  };

  const closeModal = () => {
    window.removeEventListener("submit", submitHandler(index));
    window.removeEventListener("click", closeModal);
    window.location.reload();
  };

  window.JoinButtonHandler = JoinButtonHandler;
  window.JoinSubmitHandler = submitHandler(index);
  window.closeModal = closeModal;

  return /*html*/ `

  <div key=${index} class="d-flex justify-content-center align-items-center w-100">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}" onclick="JoinButtonHandler(event)" ${
    data[index].status === "Started" ? "disabled" : ""
  }>
      Join
    </button>

    <!-- Modal -->
    <div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="${modalId}Label">${
    data[index].type === "one" ? "1 VS 1" : "Tournament"
  }</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closeModal()"></button>
          </div>
          <form onsubmit="JoinSubmitHandler(event, ${index})">
            <div class="modal-body">
              <p>${data[index].title}</p>
              ${
                data[index].private === true
                  ? `<input type="password" class="form-control" placeholder="Enter password" required>`
                  : ``
              }
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Join !!</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>`;
};

export default JoinModal;
