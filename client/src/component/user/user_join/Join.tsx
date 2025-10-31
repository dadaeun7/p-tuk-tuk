import { useEffect, useState } from "react";
import "../../../css/join-all.css";
import JoinEmail from "./JoinEmail";
import JoinPassword from "./JoinPassword";
import ReturnHome from "./ReturnHome";

function Join() {
  const [pwdPage, setPwdPage] = useState(false);
  const pwdSetWhether = localStorage.getItem("auth-success");

  useEffect(() => {
    if (pwdSetWhether !== null) {
      setPwdPage(true);
    }
  }, [pwdSetWhether]);

  return (
    <>
      <div className="join-header">{pwdPage && <ReturnHome />}</div>
      {!pwdPage && <JoinEmail />}
      {pwdPage && <JoinPassword />}
    </>
  );
}

export default Join;
