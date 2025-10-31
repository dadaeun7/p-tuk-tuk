import { useEffect, useState } from "react";
import { tuktukDB, type NotificationProp } from "../../../data/db";
import { useAuth } from "../../../contexts/Auth";

function setColor(type: string) {

    if (type === 'success') {
        return 'rgba(93, 176, 117, 1)'
    } else if (type === 'error') {
        return 'rgba(255, 78, 78, 0.71)'
    } else if (type === 'warning') {
        return 'rgba(235, 184, 126, 1)'
    } else if (type === 'info') {
        return 'rgba(86, 86, 86, 1)'
    }
}

function setIcon(type: string) {
    if (type === 'success') {
        return '✅'
    } else if (type === 'error') {
        return '❌'
    } else if (type === 'warning') {
        return '⚠️'
    } else if (type === 'info') {
        return '📍'
    }
}

function dateSet(pastTime: Date) {
    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = 60 * MS_PER_SECOND;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    const MS_PER_DAY = 24 * MS_PER_HOUR;

    const now = new Date().getTime();
    const past = pastTime.getTime();

    const diff = now - past;

    let value;

    if (diff < MS_PER_SECOND) {
        return '방금 전';
    }

    value = Math.floor(diff / MS_PER_SECOND);
    if (value < 60) {
        return `${value}초 전`;
    }

    value = Math.floor(diff / MS_PER_MINUTE);
    if (value < 60) {
        return `${value}분 전`;
    }

    value = Math.floor(diff / MS_PER_HOUR);
    if (value < 60) {
        return `${value}시간 전`;
    }

    value = Math.floor(diff / MS_PER_DAY);
    if (value < 60) {
        return `${value}일 전`;
    }

    return new Date(past).toLocaleDateString('ko-KR');
}

function NotificationList() {

    const [show, setShow] = useState(false);
    const [noti, setNoti] = useState<NotificationProp[]>([]);
    const [readStart, setReadStart] = useState(false);

    const [alertDot, setAlertDot] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const userMyId = user?.myId !== undefined ? user?.myId : "";

        const bringNoti = async () => {
            const notiList = await tuktukDB.notifications.where('userId').equals(userMyId).toArray();
            setNoti(notiList);
        }

        bringNoti();

    }, [noti.length, readStart, tuktukDB])


    const allRead = async () => {
        setReadStart(true);
        await tuktukDB.notifications.toCollection().modify(user => {
            user.read = true;
        }).finally(() => {
            setReadStart(false);
        });
    }
    useEffect(() => {

        const check = noti.some(n => { return n.read === false });
        setAlertDot(check);

    }, [noti.length, readStart, tuktukDB, allRead])

    return (<>
        <div style={{
            zIndex: "999",
            position: "absolute",
            left: "108rem",
            top: "5rem"
        }}>
            <div
                style={{
                    cursor: "pointer",
                    padding: "0.5rem",
                    backgroundColor: "rgba(68, 78, 60, 0.95)" /* 반투명 흰색 */,
                    backdropFilter: " blur(20px)" /* 배경 블러 */,
                    borderRadius: "0.5rem"
                }}
                onClick={() => { setShow(!show) }}>
                🔔
            </div>
            {alertDot && (
                <div style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    backgroundColor: "#17e94bff",
                    borderRadius: "0.9rem",
                    position: "absolute",
                    top: ".6rem",
                    right: ".7rem",
                }}></div>)}
            {
                show && (
                    <div className="notification-list"
                        style={{
                            position: "absolute",
                            right: "0.2rem",
                            border: "1px solid rgba(255, 255, 255, 0.7)",
                            background: "rgba(255, 255, 255, 0.45)" /* 반투명 흰색 */,
                            backdropFilter: " blur(20px)" /* 배경 블러 */,
                            boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
                            width: "17.8rem",
                            maxHeight: "18rem",
                            overflowY: "scroll",
                            borderRadius: "1rem",
                        }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "1rem 0.7rem 0.5rem 0.7rem",
                            borderBottom: "0.1rem solid rgba(185, 185, 185, 1)"
                        }}>
                            <div>주문연동 알람</div>
                            <div style={{
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                backgroundColor: "rgba(66, 66, 66, 1)",
                                color: "rgba(215, 215, 215, 1)",
                                maxHeight: "1rem",
                                padding: "0.2rem 0.6rem",
                                borderRadius: "0.3rem"
                            }}
                                onClick={() => { allRead() }}>모두 읽음</div>
                        </div>
                        <div style={{ minHeight: "15rem", }}>
                            {noti.length < 1 && (
                                <div
                                    style={{
                                        marginTop: "1rem"
                                    }}>알람이 없습니다.</div>)}
                            {noti.map(n => (
                                <div
                                    className="notification-list-index"
                                    key={n.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: "0.1rem solid  rgba(0, 0, 0, 0.1)",
                                        backgroundColor: n.read ? "rgba(215, 215, 215, 0.7)" : "transparent",
                                        opacity: n.read ? 0.8 : 1,
                                        padding: '0.5rem 0.2rem',
                                        color: setColor(n.type),
                                        marginBottom: '0.1rem',
                                    }}
                                >
                                    <div><span style={{ fontSize: '0.8rem', marginRight: "0.3rem" }}>{setIcon(n.type)}</span>{n.message}</div>
                                    <div style={{
                                        marginLeft: 'auto',
                                        fontSize: '0.85rem',
                                    }}>{dateSet(n.createAt)}</div>
                                </div>
                            ))}
                        </div>
                    </div>)
            }
        </div>
    </>)


}

export default NotificationList;