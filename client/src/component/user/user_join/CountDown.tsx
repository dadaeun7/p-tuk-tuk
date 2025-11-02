import { useEffect, useState } from "react";
import "../../../css/count-down.css";
import { parseKoStamp } from "./joinCommonConfig";


const LOCAL_MIN_KEY = 'code-set-min';
const LOCAL_SEC_KEY = 'code-set-sec';
const TIME_END_KEY = 'time';

function CountDown() {

    const [remainTimeMs, setRemainTimeMs] = useState(0);

    useEffect(() => {

        let timeStr = localStorage.getItem(TIME_END_KEY);

        let endAt: number = 0;
        if (timeStr) {
            console.log("localStorage에서 정상적으로 찾았습니다 ");

        } else {
            console.log("localStorage에서 정상적으로 찾지 못했습니다. :");
            const reqDate = new Date();
            const newTimeValue = reqDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
            timeStr = newTimeValue;
            localStorage.setItem("time", newTimeValue);

        }

        try {
            endAt = parseKoStamp(timeStr).getTime();
        } catch (e) {
            console.error("parseKoStamp 를 실패했습니다");
        }

        if (isNaN(endAt)) {
            console.error("endAt Time failed: Invalid date");
            return;
        }

        const tick = () => {

            const now = Date.now();
            const newRemainMs = Math.max(0, endAt - now);

            setRemainTimeMs(newRemainMs);

            if (newRemainMs === 0) {
                localStorage.removeItem(TIME_END_KEY);
                localStorage.removeItem(LOCAL_SEC_KEY);
                localStorage.removeItem(LOCAL_MIN_KEY);
                localStorage.removeItem('request');
                location.reload();
            }
        }
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);

    }, [])

    const totalSeconds = Math.floor(remainTimeMs / 1000);
    const countMin = Math.floor(totalSeconds / 60);
    const countSec = totalSeconds % 60;

    return (
        <div className="count-down-wrap">
            [인증 유효시간]<span className="count-min">{countMin.toString().padStart(2, '0')}</span> : <span className="count-sec">{countSec.toString().padStart(2, '0')}</span>
        </div>
    )
}

export default CountDown;