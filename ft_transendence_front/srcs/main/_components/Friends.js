import Sidebar from "../../../components/ui/Sidebar";

const Friends = () => {
  return /*html*/ `
    ${Sidebar("Friends List", ["Alice", "Bob", "Charlie"])}
`;
};

export default Friends;