import { useState } from "react";
import "../../css/side-bar-mypage.css";
import SideMenu from "./menu/SideMainMenu.tsx";
import MyPage from "./mypage/MyPage.tsx";
import LogOut from "./menu/LogOut.tsx";
import { blurStyle } from "../../config.ts";

function SideBar() {
  const [sideMargin, setSideMargin] = useState(false);

  return (
    <div
      className={`sidebar ${sideMargin ? "open" : "closed"}`}
      style={sideBarStyle.wrap}
    >
      <div style={{ flex: 1 }}>
        <MyPage
          setSideMargin={setSideMargin}
        />
      </div>
      <div
        className="side-menu-parent"
        style={sideBarStyle.sideParent}
      >
        <SideMenu />
      </div>
      <div style={sideBarStyle.logOut}>
        <LogOut />
      </div>
    </div>
  );
}

const sideBarStyle: { [key: string]: React.CSSProperties } = {
  wrap: {
    ...blurStyle,
    margin: "1rem 0rem 0rem 1rem",
    minWidth: "22vh",
    minHeight: "95vh",
    display: "flex",
    flexDirection: "column",
    color: "rgb(86, 86, 86)",
    padding: "1em 0px 0px .7em",
    position: "fixed",
    top: "0",
    left: "0",
    justifyContent: "space-between",
    zIndex: '99'
  },
  sideParent: {
    flex: 1.1,
    display: "flex",
    flexDirection: "column",
    gap: "1.3rem",
  },
  logOut: {
    flex: 0.15, display: "flex", justifyContent: "flex-end",
  }
}

export default SideBar;
