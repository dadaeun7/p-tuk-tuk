import { Navigate, Outlet } from "react-router-dom";
import { BACK, myPageRight } from "../../../config";
import SideBar from "../../side_bar/SideBar";
import { useAuth } from "../../../contexts/Auth";
import "../../../css/user-page.css";
import NotificationList from "./NoficiationList";
import NotificationListener from "../../util/NotificationListener";


function UserPage() {

  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    // oauth2 에서 auth 정보 받아 온 후 pending으로 바로 처리가 안될 때를 대비하여 추가함
    if (localStorage.getItem("user") === null) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("provider", user.type);
    }
  }


  return (
    <div className="user-page">
      <NotificationListener />
      <NotificationList />
      <SideBar />
      <main className="user-page-right" style={myPageRight}>
        <div onClick={async () => {
          await fetch(`${BACK}/keyword/delete`, {
            method: "POST",
            credentials: "include"
          })
        }}>캐시 삭제하기</div>
        <Outlet />
      </main>
    </div>
  );
}

export default UserPage;
