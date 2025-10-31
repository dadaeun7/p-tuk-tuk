import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/Auth";

function LogOut() {

  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <div
        style={{ flex: 1, cursor: "pointer", textAlign: "right", marginRight: "2rem" }}
        onClick={async (e) => {
          e.preventDefault();
          await logout();
          nav("/", { replace: true });
        }}
      >
        로그아웃
      </div>
    </>
  )
}

export default LogOut;