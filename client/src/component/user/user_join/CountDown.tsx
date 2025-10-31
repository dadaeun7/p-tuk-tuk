import { useEffect, useState } from "react";
import "../../../css/count-down.css";
import { parseKoStamp } from "./joinCommonConfig";

function CountDown() {

    const localMinNaming = 'code-set-min';
    const localSecNaming = 'code-set-sec';

    const [countMin, setCountMin] = useState(() => {
        const v = Number(localStorage.getItem(localMinNaming));
        return Number.isFinite(v) ? v : 0;
    });

    const [countSec, setCountSec] = useState(() => {
        const v = Number(localStorage.getItem(localSecNaming));
        return Number.isFinite(v) ? v : 0;
    });

    useEffect(() => {

        const timeStr = localStorage.getItem('time');
        if (!timeStr) return;

        const endAt = parseKoStamp(timeStr).getTime();

        const countDown = () => {

            const now = Date.now();
            const deltaSec = Math.max(0, Math.ceil((endAt - now) / 1000));
            const mm = Math.floor(deltaSec / 60);
            const ss = deltaSec % 60;

            setCountMin(mm);
            setCountSec(ss);

            localStorage.setItem(localMinNaming, String(mm));
            localStorage.setItem(localSecNaming, String(ss));

            if (deltaSec === 0) {
                localStorage.removeItem(localMinNaming);
                localStorage.removeItem(localSecNaming);
                localStorage.removeItem('request');
                location.reload();
            }
        }

        countDown();
        const iv = setInterval(countDown, 1000);
        return () => clearInterval(iv);

    }, [])

    return (
        <div className="count-down-wrap">
            [인증 유효시간]<span className="count-min">{countMin}</span> : <span className="count-sec">{countSec}</span>
        </div>
    )
}

export default CountDown;