import { blurStyle, localUser } from "../../../config.ts";
import AddressEdit from "../../user/user_info/AddressEdit.tsx";
import GmailUnConnect from "../../user/user_info/GmailUnConnect.tsx";
import WithDraw from "../../user/user_login/WithDraw.tsx";

type List = {
  key: string,
  title: string,
  icon: string,
}
function MyPageEdit() {

  const setIdList: List[] = [
    {
      key: "NAVER",
      title: "네이버 연동 아이디",
      icon: "/rectangle-naver.svg"
    },
    {
      key: "KAKAO",
      title: "카카오 연동 아이디",
      icon: "/rectangle-kakao.svg"
    },
    {
      key: "GOOGLE",
      title: "구글 연동 아이디",
      icon: "/rectangle-google.svg"
    },
    {
      key: "LOCAL",
      title: localUser().myId,
      icon: ""
    },
  ]

  const idList = new Map<string, List>();

  setIdList.forEach((v) => {
    idList.set(v.key, v);
  })

  return (
    <div
      className="my-page-edit"
      style={{
        position: "absolute",
        top: "40px",
        left: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px 25px 40px 20px",
        gap: "12px",
        color: "rgba(81, 97, 121, 1)",
        fontWeight: "500",
        ...blurStyle,
        zIndex: 9,
      }}
    >
      <div className="user-id"
        style={{
          textAlign: "left",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}>
        <div>{idList.get(localUser().type)?.title}</div>
        <img style={{ marginLeft: "1.1rem", width: "1.5rem", display: idList.get(localUser().type)?.key === "LOCAL" ? "none" : "block" }} src={idList.get(localUser().type)?.icon} />
      </div>
      <div className="user-address"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.3))",
          height: "30px",
          display: "flex",
          alignItems: "center",
        }}>
        <span style={{ margin: "0 3px", opacity: "0.5" }}></span>
        {localUser().location === ""
          ? "지정된 지역이 없습니다."
          : localUser().location}
      </div>
      <AddressEdit />
      <div
        className="user-gmail"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          alignSelf: "stretch",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.3))",
        }}
      >
        <div>
          <img
            src="/google-cnt.svg"
            style={{
              width: "25px",
              height: "25px",
              textAlign: "center",
              marginRight: "7px",
              marginTop: "3px",
            }}
          />
        </div>
        <div>
          {localUser().email === ""
            ? "연동 이메일 없음"
            : localUser().email}
        </div>
      </div>
      <GmailUnConnect />
      <div
        style={{
          scale: "90%",
          position: "absolute",
          bottom: "8px",
          right: "10px",
        }}
      >
        <WithDraw />
      </div>
    </div>
  );
}

export default MyPageEdit;
