const parser = (innerHTMLString, key) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(innerHTMLString, "text/html");
  return doc.querySelector(key);
};

export default parser;
