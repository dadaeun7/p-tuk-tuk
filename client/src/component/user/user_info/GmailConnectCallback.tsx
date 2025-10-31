import { useEffect } from "react";
import { BACK, modifyUser } from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { usePopup } from "../../../contexts/AsyncPopup";
import type { PopupStatus } from "../../util/AsyncPopupLogic";



function GmailConnectCallback() {

    const popup = usePopup();
    const popupSet = (status: PopupStatus, msg: string) => {

        popup.open(status, msg);

        if (status !== 'loading') {
            setTimeout(() => {
                popup.close();
            }, 5000);
        }

    }

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParam = new URLSearchParams(location.search);
        const code = searchParam.get('code');

        if (code) {
            const encode = encodeURIComponent(code);
            popupSet('loading', '구글 계정을 연동하고 있습니다...');

            const start = async () => {

                await fetch(`${BACK}/login/oauth2/code/google?code=${encode}`, {
                    method: "GET",
                    credentials: "include",
                }).then((res) => {

                    if (res.status == 409) {
                        popupSet('error', '다른 계정에 연동 된 gmail 입니다. 다른 아이디를 선택해주세요')
                        return;
                    }
                    if (res.ok) {
                        return res.json()
                    }
                }).then((data) => {

                    if (data.gmail) {
                        popupSet('success', '구글 계정이 성공적으로 연동되었습니다.');
                        modifyUser(data.gmail, "email");
                        navigate("/my-page/dash-board");
                    }

                }).catch((err) => {
                    console.error("err : ", err);
                })
            }

            start();

        }
    }, [location, navigate])

    return (<></>);

}

export default GmailConnectCallback;