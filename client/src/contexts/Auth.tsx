import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACK, localUser } from "../config";
import { usePopup } from "./AsyncPopup";
import { useMyModal } from "./MyModal";

export type User = {
  myId: string;
  email: string;
  location: string;
  type: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthCtx | null>(
  null as AuthCtx | null
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setLeload] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  const GOOGLE_CLIENT_ID =
    "685309934763-97odu8bs4nl2norhbjmmhqpsam5hac0m.apps.googleusercontent.com";

  const OAUTH2_REQUEST_URL = "/local/oauth2/logout";

  const popup = usePopup();
  const { openModal } = useMyModal();

  useEffect(() => {

    const { pathname } = location;
    if (localStorage.getItem('time')) {
      return;
    }

    const checkAuth = async () => {
      setLoading(true);

      if (pathname === "/how-to-connect" || pathname === "/privacy-policy" || pathname === "/how-to-upload") {
        return;
      }

      try {
        const rp = await fetch(`${BACK}/login/auth`, {
          method: "POST",
          credentials: "include",
        });

        if (rp.ok) {
          const info = await rp.json();
          setUser(info);
        } else {

          const userMyId = localUser().myId;
          const refresh = await fetch(`${BACK}/login/auto`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMyId })
          })

          if (refresh.ok) {
            const info = await refresh.json();
            setUser(info);

          } else {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("provider");
            nav("/");
          }
        }
      } catch {
        setUser(null);
        setLeload(reload);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {

    if (reload) {
      window.location.reload();
    }
  }, [reload])

  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load("auth2", () => {
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
          });
        });
      };
      document.body.appendChild(script);
      setUser(null);
      setLoading(false);
    };
    loadGoogleApi();
  }, []);

  const login = async (email: string, password: string) => {
    popup.open("loading", "로그인 중입니다");

    let autoCheck = false;
    if (localStorage.getItem("auto") === "true") {
      autoCheck = true;
    }

    const rp = await fetch(`${BACK}/login/local`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, autoCheck }),
    }).then((res) => {
      if (!res.ok) {
        popup.open("error", `로그인에 실패했습니다. ${res.statusText}`);
        setTimeout(() => {
          popup.close();
        }, 2000);
        return false;
      }
      popup.open("success", "정상적으로 로그인이 되었습니다.");
      setTimeout(() => {
        popup.close();
      }, 2000);
      window.location.href = "/";
      return true;
    });

    return rp;
  };

  const logout = async () => {
    popup.open("loading", "로그아웃 중입니다");

    if (
      localStorage.getItem("provider") === "KAKAO" ||
      localStorage.getItem("provider") === "NAVER"
    ) {
      const response = await fetch(`${BACK}${OAUTH2_REQUEST_URL}`, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error 발생 : ${response.status}`);
      }

      localStorage.removeItem("user");
      localStorage.removeItem("provider");
      setUser(null);

      openModal(<div>로그아웃 처리되었습니다.</div>);
      setTimeout(() => {
        window.location.href = "/";
      }, 4000)

    } else if (localStorage.getItem("provider") === "LOCAL") {
      await fetch(`${BACK}/login/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.myId }),
      })
        .then((res) => {
          if (res.ok) {
            popup.open("success", "정상적으로 로그아웃 되었습니다.");
            setTimeout(() => {
              popup.close();
            }, 2000);
            localStorage.removeItem("user");
            localStorage.removeItem("provider");
            setUser(null);
          }
        })
        .catch((err) => {
          popup.open("error", `로그아웃 실패: ${err}`);
          setTimeout(() => {
            popup.close();
          }, 2000);

          localStorage.removeItem("user");
          localStorage.removeItem("provider");
          setUser(null);
          window.location.href = "/";
        });
    }
  };

  const authValue = useMemo(() => ({ user, loading, login, logout }), [user]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider 범위 내 컴포넌트 가 아닙니다");
  return ctx;
};
