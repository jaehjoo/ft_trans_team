import Sidebar from "../../../components/ui/Sidebar.js";
import { useState } from "../../../MyReact.js";

const fetchFriends = async () => {
  const access = localStorage.getItem("access_token") || "null";
  const response = await fetch(`/api/friends?access=${access}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
};

let flag = false;

const Friends = () => {
  const [friends, setFriends] = useState([]);
  if (!flag) {
    fetchFriends().then((data) => {
      setFriends(data.friendsList);
    });
    flag = true;
  }

  return /*html*/ `
    ${Sidebar(friends)}
`;
};

export default Friends;
