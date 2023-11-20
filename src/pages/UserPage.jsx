import { Outlet } from "react-router-dom";

import UserProfile from "../components/UserProfile";

const UserPage = () => {
  return (
    <>
      <UserProfile />
      <Outlet />
    </>
  )
}

export default UserPage;
