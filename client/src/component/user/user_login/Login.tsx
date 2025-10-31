import { useEffect, useState } from "react";
import { BACK, EMAIL_REG, PASSWORD_LOGIN_REG } from "../../../config";
import "../../../css/login.css";
import { useAuth } from "../../../contexts/Auth";

type loginOpen = {
  closeLogin: () => void;
};

function Login({ closeLogin }: loginOpen) {
  const [saveId, setSaveId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  // ------------------------------------------------

  const { login, user } = useAuth();

  const loginEmailValid = EMAIL_REG.test(loginEmail);
  const loginPasswordValid = PASSWORD_LOGIN_REG.test(loginPwd);

  useEffect(() => {

    if (localStorage.getItem("saveId") !== null) {

      const value = localStorage.getItem("saveId") as string;
      setSaveId(true);
      setText(value);
      setLoginEmail(value);
    }

  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <div className="user-login">
      <div className="user-login-close" onClick={closeLogin}>
        닫기
      </div>
      <div className="user-login-header">
        <div className="user-login-header-title">로그인</div>
        <div className="user-login-header-sub">tuktuk 계정으로 로그인</div>
      </div>

      <div className="user-login-body">
        <div className="user-login-body-email-wrap">
          <input
            type="email"
            placeholder="이메일 주소"
            value={text}
            className="user-login-body-id"
            onChange={(e) => {
              setLoginEmail(e.target.value);
              setText(e.target.value);
            }}
          />
        </div>
        <div className="user-login-body-pwd-wrap">
          <input
            type="password"
            placeholder="비밀번호"
            className="user-login-body-pwd"
            onChange={(e) => {
              setLoginPwd(e.target.value);
            }}
          />
        </div>
        <div className="user-login-error" style={{
          color: "red",
          textAlign: "left",
        }}>{error}</div>
        <div className="user-login-check">
          <div className="user-login-check-id-save-wrap">
            <input
              type="checkbox"
              id="id-save"
              checked={saveId}
              onChange={(e) => {
                setSaveId(e.target.checked);
              }}
            />
            <label htmlFor="id-save">아이디 저장</label>
          </div>
          <div className="user-login-check-auto-login-wrap">
            <input
              type="checkbox"
              id="auto-login"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
            />
            <label htmlFor="auto-login">자동 로그인</label>
          </div>
        </div>
        <div
          className="user-login-btn"
          onClick={async (e) => {
            if (!loginPasswordValid) {
              console.log(loginPasswordValid);
              setError("비밀번호 8자리 이상 입력해주세요.");
              return;
            }
            if (loginEmailValid) {
              e.preventDefault();
              setError("");
              autoLogin ? localStorage.setItem("auto", "true") : localStorage.removeItem("auto");
              const ok = await login(loginEmail, loginPwd);
              if (ok) {
                saveId ? localStorage.setItem("saveId", loginEmail) : localStorage.removeItem("saveId");
              } else setError("이메일 또는 비밀번호를 확인하세요.");
            };
          }}
        >
          로그인
        </div>
      </div>

      <div className="user-login-integration">
        <div className="user-login-intergration-title">
          다른 서비스 계정으로 로그인
        </div>
        <div className="user-login-intergration-list">
          <img
            src="kakao-cnt.svg"
            alt="kakao-intergration"
            className="kakao-intergration-icon"
            onClick={() => { window.location.href = `${BACK}/oauth2/authorization/kakao`; }
            }
          />
          <img
            src="naver-cnt.svg"
            alt="naver-intergration"
            className="naver-intergration-icon"
            onClick={() => { window.location.href = `${BACK}/oauth2/authorization/naver`; }
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
