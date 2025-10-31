import { useCallback, useState } from "react";
import { BACK, localUser, modifyUser } from "../../../config";
import { usePopup } from "../../../contexts/AsyncPopup";


function GmailUnConnect() {

  const { popupSet } = usePopup();

  const [submitType, setSubmitType] = useState(
    localUser().email === "" ? "connect" : "unConnect"
  );

  const [showMsg, setShowMsg] = useState(
    localUser().email === "" ? "Gmail 연동하기" : "Gmail 연동해제하기"
  );

  const connectUrl = "/google/connect/auth";

  const connect = useCallback(async () => {

    popupSet('loading', '연동중에 있습니다.');

    const response = await fetch(`${BACK}${connectUrl}`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      if (!res.ok) {
        popupSet('error', `연동에 실패했습니다.`);
        return;
      }
      return res.json();
    }).then((data) => {
      return data;
    }).catch((err) => {
      popupSet('error', `연동에 실패했습니다. ${err}`);
    })

    const url = response.url;
    window.location.href = url;

    const result = await fetch(`${url}`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {

      return res.json();

    }).then((data) => {
      return data;

    }).catch((err) => {
      popupSet('error', `연동에 실패했습니다. 관리자에게 문의하세요. ${err}`);
      return false;
    })

    if (result === false) {
      return;
    }
  }, [])

  const unConnect = useCallback(async () => {

    const url = "/google/unconnect/auth";
    popupSet('loading', '연동해제중에 있습니다.');

    await fetch(`${BACK}${url}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    ).then((res) => {
      if (res.ok) {
        return res.json();
      }
    }).then((data) => {

      popupSet('success', data.message);
      modifyUser("", 'email');
      window.location.reload();

    }).catch((err) => {
      popupSet('error', `연동 해제 중 실패했습니다. ${err}`);
    })

  }, [])


  return (
    <>
      <div
        className="user-gmail-connect"
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (submitType === 'connect') {
            connect();
          } else {
            unConnect();
          }
        }}
      >
        {showMsg}
      </div>
    </>
  );
}

export default GmailUnConnect;
