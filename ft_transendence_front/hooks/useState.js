const useState = (initialValue) => {
  let _val = initialValue;
  const state = () => _val;
  const setState = (newVal) => {
    _val = newVal;
    render();
  };
  return [state, setState];
};

export default useState;
