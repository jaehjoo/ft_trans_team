const JoinModal = (index, d) => {
  const modalId = `staticBackdrop${index}`; // 고유한 모달 id 생성

  const JoinHandler = () => {
    console.log("fetch", index, "you should remove event listener here");
    console.log(d);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit", e.target[0].value);
  };

  const closeModal = () => {
    window.removeEventListener("click", JoinHandler);
    window.removeEventListener("submit", submitHandler);
    window.removeEventListener("click", closeModal);
    window.location.reload();
  };

  window.JoinHandler = JoinHandler;
  window.JoinSubmitHandler = submitHandler;
  window.closeModal = closeModal;

  return /*html*/ `
  <div key=${index} class="d-flex justify-content-center align-items-center w-100">
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}" onclick="JoinHandler(${index})" ${
    d.status === "Started" ? "disabled" : ""
  }>
      Join
    </button>

    <!-- Modal -->
    <div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="${modalId}Label">${
    d.type === "one" ? "1 VS 1" : "Tournament"
  }</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closeModal()"></button>
          </div>
          <form onsubmit="JoinSubmitHandler(event)">
            <div class="modal-body">
              <p>${d.title}</p>
              ${
                d.private === true
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
