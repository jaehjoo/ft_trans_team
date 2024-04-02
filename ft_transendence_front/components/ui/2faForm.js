const FaForm = () => {
  return /*html*/ `
  <form>
  <div class="form-group">
    <label for="2fa">2FA Code</label>
    <input type="text" class="form-control" id="2fa" placeholder="Enter Code">
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>`;
};

export default FaForm;
