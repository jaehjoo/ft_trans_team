import Sidebar from "../../../components/ui/Sidebar.js";

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

const Friends = () => {
  fetchFriends();

  return /*html*/ `
    ${Sidebar("Friends List", ["Alice", "Bob", "Charlie"])}
`;
};

export default Friends;
