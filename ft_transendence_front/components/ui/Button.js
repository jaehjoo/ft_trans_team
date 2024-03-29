const Button = (variant, disabled, callback, children) => {
  const button = document.createElement("button");
  button.type = "button";
  if (variant === "close") {
    button.classList.add("btn-close");
    button.setAttribute("aria-label", "Close");
    if (disabled) button.disabled = true;
  } else {
    button.classList.add("btn", `btn-${variant}`);
    button.appendChild(children);
  }

  if (callback) button.addEventListener("click", callback);

  return button;
};

export default Button;
