import Sidebar from "../../../components/ui/Sidebar.js";

const fetchFriends = async () => {
  const response = await fetch("/api/friends");
  const data = await response.json();
  console.log(data);
  return data;
};

const Friends = () => {
  fetchFriends();
  return /*html*/ `
    ${Sidebar("Friends List", ["Alice", "Bob", "Charlie"])}
`;
};

export default Friends;
