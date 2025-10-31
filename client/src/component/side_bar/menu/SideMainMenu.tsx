import { useNavigate } from "react-router-dom";
import { menuDspProp } from "../mypage/mypage-config";

export type menuProps = {
  title: string;
  tag: string;
  icon: string;
  move: string;
};

function SideMenu() {
  const menuList: menuProps[] = [
    {
      title: "대시보드",
      tag: "dash-board",
      icon: "📊",
      move: "/my-page/dash-board",
    },
    {
      title: "월별현황",
      tag: "month-cur",
      icon: "📅",
      move: "/my-page/month-cur",
    },
    {
      title: "주문내역",
      tag: "order-table",
      icon: "🛒",
      move: "/my-page/order-table",
    },
  ];

  const navigate = useNavigate();
  return (
    <>
      {menuList.map((prop, index) => (
        <div
          className={"side-" + prop.tag + "-menu-wrap"}
          key={index}
          style={{ ...menuDspProp, marginRight: "20px" }}
          onClick={() => {
            navigate(prop.move);
          }}
        >
          <div className={"side-" + prop.tag + "-menu-icon-wrap"}
            style={{ backgroundColor: 'rgba(86, 86, 86, 0.1)', padding: '0.4rem', borderRadius: '8px' }}>
            {prop.icon}
          </div>
          <div
            className={"side-" + prop.tag + "-menu-title"}
            style={{
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            {prop.title}
          </div>
        </div>
      ))}
    </>
  );
}

export default SideMenu;
