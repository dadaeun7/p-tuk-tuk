import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { BACK } from "../../config";
import { tuktukDB, type NotificationProp } from "../../data/db";
import { useBringOrder } from "../../contexts/BringOrder";
import LoadingDots from "./LoadingDots";
import { useMyModal } from "../../contexts/MyModal";
import { useLocation } from "react-router-dom";
interface NotiProp {
    id: number;
    message: string;
}

function NotificationListener() {

    const { user } = useAuth();
    const [noti, setNoti] = useState<NotiProp | null>(null);

    const [reload, setReload] = useState(false);
    const { openModal } = useMyModal();
    const location = useLocation();

    // ----------------- [백엔드 SSE 알람]---------------------

    const { load, settingLoad } = useBringOrder()

    const saveToDeixe = useCallback((eventData: NotificationProp) => {
        console.log("DB 저장 로직 시작");

        tuktukDB.notifications.add(eventData)
            .then(() => {
                console.log("알림이 DB에 저장되었습니다:", eventData);
                setTimeout(() => {
                    window.location.reload();
                }, 5000)
            })
            .catch((error) => {
                console.error("알림 저장 중 오류 발생:", error);
            });
    }, [tuktukDB])

    useEffect(() => {

        const source = new EventSource(`${BACK}/notification/subcribe`, {
            withCredentials: true,
        });


        const bringEventHandler = (event: MessageEvent<any>) => {

            const message = "분석 중에 있습니다";
            const create = new Date();
            settingLoad(true);

            const data = JSON.parse(event.data);
            setNoti({ id: create.getTime(), message: data.message })

            const eventData: NotificationProp = {
                message: message,
                type: "info",
                createAt: create,
                read: false,
                userId: user?.myId !== undefined ? user?.myId : ""
            };

            saveToDeixe(eventData);

        }

        const successEventHandler = (event: MessageEvent<any>) => {

            localStorage.setItem("bring", "ok");

            const message = "분석이 완료 되었습니다";
            const create = new Date();

            const data = JSON.parse(event.data);
            setNoti({ id: create.getTime(), message: data.message })

            const eventData: NotificationProp = {
                message: message,
                type: "success",
                createAt: create,
                read: false,
                userId: user?.myId !== undefined ? user?.myId : ""
            };

            saveToDeixe(eventData);
            openModal(<div>{message}</div>);
            setTimeout(() => { setNoti(null) }, 5000);
        }

        const errorEventHandler = (event: MessageEvent<any>) => {

            localStorage.setItem("bring", "error");

            const message = "분석에 실패했습니다.";
            const create = new Date();
            settingLoad(true);

            const data = JSON.parse(event.data);
            setNoti({ id: create.getTime(), message: data.message })

            const eventData: NotificationProp = {
                message: message,
                type: "error",
                createAt: create,
                read: false,
                userId: user?.myId !== undefined ? user?.myId : ""
            };

            saveToDeixe(eventData);
            openModal(<div>{message}</div>);
            setTimeout(() => { setNoti(null) }, 3000);
        }



        source.addEventListener('startBringMail', bringEventHandler);
        source.addEventListener('bringToMailSuceess', successEventHandler);
        source.addEventListener('bringToMailError', errorEventHandler);


        (source as EventSource).onerror = (e) => {
            console.log('sse 에러', e);
            source?.close();
        }

        return () => {
            if (source) {
                console.log("sse 연결을 닫습니다");

                source.removeEventListener('startBringMail', bringEventHandler);
                source.removeEventListener('bringToMailSuceess', successEventHandler);
                source.removeEventListener('bringToMailError', errorEventHandler);
                source.close();
                setNoti(null);
            }
        }
    }, [saveToDeixe])

    useEffect(() => {

        if (reload) {
            window.location.reload();
        }

    }, [reload])


    if (noti === null) {
        return;
    }

    // ----------------- [ SSE 받기 전 메일 분석 요청이 있는 내용 ] ---------------------

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    display: "flex",
                    top: '1.5rem',
                    right: '3rem',
                    padding: '0.7rem 1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    borderRadius: '0.7rem',
                    zIndex: 9999,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    fontSize: "0.93rem"
                }}>
                <LoadingDots style={{}} />
                <span style={{ marginLeft: "0.7rem" }}>{noti?.message}</span>
            </div>
        </>

    )
}

export default NotificationListener;