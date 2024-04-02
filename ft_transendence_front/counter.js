// Counter.js

import useState from "./hooks/useState.js";

const Counter = () => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState("클릭!");

  window.increase = () => {
    setCount(count + 1);
    setClick(click + "클릭!");
  };

  return `
    <div>
      <span>클릭한 횟수 : ${count}</span>
      <button onclick="increase()">클릭</button>
      <div>${click}</div> 
    </div>`;
};

export default Counter;
