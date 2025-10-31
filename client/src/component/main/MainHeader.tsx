import { useNavigate } from "react-router-dom";
import "../../css/main-header.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { usePopup } from "../../contexts/AsyncPopup";

type loginShow = {
  openLogin: () => void;
};

function MainHeader({ openLogin }: loginShow) {

  const navigate = useNavigate();
  const clickJoinPage = () => {
    navigate("/join");
  };

  const [onLogin, setOnLogin] = useState(false);
  const { user } = useAuth();
  const { open, close } = usePopup();

  useEffect(() => {

    open('loading', '로그인 확인중에 있습니다');

    if (user) {
      setOnLogin(true);
      close();

    } else {
      setOnLogin(false);
      close();

    }

  }, [user])

  return (
    <div className="main-header">
      <div className="main-header-left">
        <img
          className="tuktuk-logo-bk"
          src="color-logo.svg"
          alt="tuktuk-logo"
          width={35}
          style={{ scale: "80%" }}
        />
        <div>tuktuk</div>
      </div>
      {!onLogin &&
        <div className="main-header-right">
          <div className="main-header-login" onClick={openLogin}>
            로그인
          </div>
          <div className="main-header-join" onClick={clickJoinPage}>
            가입하기
          </div>
        </div>
      }
      {
        onLogin &&
        <div className="main-header-right">
          <div className="main-header-mypage" onClick={() => navigate("/my-page/dash-board")} style={{ cursor: "pointer" }}>마이페이지</div>
        </div>
      }
    </div>
  );
}

export default MainHeader;
