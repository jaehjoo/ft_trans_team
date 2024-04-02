const useState = (initialValue, render) => {
  let _val = initialValue;
  const setState = (newVal) => {
    _val = newVal;
    render();
  };
  return [_val, setState];
};

export default useState;
