import { useState, type CSSProperties } from "react";
import { BACK, localUser } from "../../config";
import MUIDatePickerForm from "../util/MUIDatePickerForm";
import { usePopup } from "../../contexts/AsyncPopup";
import { useNavigate } from "react-router-dom";
import { useMyModal } from "../../contexts/MyModal";


function OrderSaveAtMail(
    { setShowInMail,
        setReqLoading
    }:
        {
            setShowInMail: React.Dispatch<React.SetStateAction<boolean>>,
            setReqLoading: React.Dispatch<React.SetStateAction<string>>
        }) {

    const { openModal } = useMyModal();
    const past = new Date();
    past.setDate(past.getDate() - 7);

    const current = new Date();

    const [start, setStart] = useState<Date>(past);
    const [end, setEnd] = useState<Date>(current);

    const nav = useNavigate();

    const [hover, setHover] = useState(false);
    const { popupSet } = usePopup();

    const submitDate = (data: Date) => {
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const sameDate = (startDate: Date, endDate: Date) => {
        if (!startDate || !endDate) {
            return;
        }

        if (startDate > endDate) {
            return true;
        }

        const year = startDate.getFullYear() === endDate.getFullYear();
        const month = startDate.getMonth() === endDate.getMonth();
        const day = startDate.getDate() === endDate.getDate();

        return year && month && day;
    }


    const submitBringMail = async () => {

        if (sameDate(start, end)) {
            openModal(<div>같은 날짜 및 날짜형식이 올바르지 않습니다!</div>);
            return;
        }

        if (localUser().email === "") {
            popupSet('error', '현재 구글과 연동되어있지 않습니다');
            return;
        }
        popupSet('loading', '메일 불러오기 요청중에 있습니다.')
        const uri = '/bring/gmail';

        setReqLoading('mail');

        await fetch(`${BACK}${uri}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                start: submitDate(start),
                end: submitDate(end)
            })
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
        }).then((data) => {
            popupSet('success', data.message);
        }).catch((err) => {
            popupSet('error', `메일 불러오기 요청에 실패했습니다. cause by : ${err}`);
            setReqLoading('');
        }).finally(() => {
            setReqLoading('');
        })

        setShowInMail(false);
    };

    return (
        <div className="order-save-at-mail"
            style={{ ...wrapStyle }}>
            <div className="order-save-at-mail-help"
                style={{
                    ...help,
                    backgroundColor: hover ? "rgb(86, 86, 86)" : "rgba(102, 143, 102, 0.15)",
                    color: hover ? "#ffffffff" : "rgba(64, 78, 64, 0.8)",
                }}
                onClick={() => {
                    nav("/how-to-connect");
                }}
                onMouseOver={() => {
                    setHover(true);
                }}
                onMouseOut={() => {
                    setHover(false);
                }}
            >다른 이메일로 연동하고 싶어요!</div>
            <div className="order-save-at-mail-title"
                style={title}>📩메일로 등록하기</div>
            <div className="order-save-at-mail-info"
                style={{
                    marginTop: "1.8rem",
                }}>
                <div className="order-save-at-mail-info-connect"
                    style={infoEmailStyle}>
                    <div className="order-save-at-mail-info-connect-title">연동 이메일</div>
                    <div className="order-save-at-mail-info-connect-value" style={{ color: "rgba(64, 78, 64, 0.8)" }}>{localUser().email}</div>
                </div>
                <div className="order-save-at-mail-info-date"
                    style={infoLastDayStyle}>
                    <div className="order-save-at-mail-info-date-title">마지막 수집일</div>
                    <div className="order-save-at-mail-info-date-value"></div>
                </div>
            </div>
            <div className="order-save-at-mail-select">
                <div className="order-save-at-mail-select-cal" style={{ display: "flex" }}>
                    <div className="order-save-at-mail-select-cal-start">
                        <MUIDatePickerForm date={start} setData={setStart} />
                    </div>
                    <div className="order-save-at-mail-select-cal-end">
                        <MUIDatePickerForm date={end} setData={setEnd} />
                    </div>
                </div>
                <div className="order-save-at-mail-select-description"
                    style={description}> ✨주문✨ 키워드가 포함 된 메일을 불러옵니다.</div>
            </div>
            <div
                className="order-save-at-mail-submit"
                style={submit}>
                <div className="order-save-at-mail-submit-success"
                    style={submitBtnStyle}
                    onClick={() => {
                        submitBringMail();
                    }}
                >확인</div>
                <div
                    className="order-save-at-mail-submit-close"
                    style={cancleBtnStyle}
                    onClick={() => {
                        setShowInMail(false);
                    }}
                >닫기</div>
            </div>
        </div>
    )
}

export const title: CSSProperties = {
    fontWeight: "800", fontSize: "1.7rem", marginTop: "4rem", color: 'rgb(86, 86, 86)'
}
export const submit: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1.2rem",
    marginRight: "-2rem"
}
export const description: CSSProperties = {
    marginTop: "-1rem",
    borderTop: "solid 0.08rem #929191ff",
    paddingTop: "0.3rem",
    color: "rgb(86, 86, 86)"
}
export const help: CSSProperties = {
    position: "absolute",
    right: "1rem",
    top: "0.7rem",
    fontSize: "0.9rem",
    padding: "0.5rem 1rem",
    borderRadius: "3rem",
    cursor: "pointer",
    transition: "all .3s",
    border: "1px solid rgba(64, 78, 64, 0.3)"
}

export const wrapStyle: CSSProperties = {
    position: "absolute",
    top: "12rem",
    left: "30rem",
    backgroundColor: "rgba(252, 253, 252, 1)",
    border: "0.015rem solid rgba(102, 143, 102, 0.45)",
    borderRadius: "0.5rem",
    width: "22rem",
    height: "20.7rem",
    padding: "1rem 4rem",
    textAlign: "left",
    zIndex: "999",
}

const infoEmailStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    color: "rgb(86, 86, 86)",
}

const infoLastDayStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    color: "rgb(86, 86, 86)",
    marginTop: "0.7rem"
}

export const submitBtnStyle: CSSProperties = { marginRight: "0.3rem", padding: "0.45rem 1.4rem", backgroundColor: "rgb(86, 86, 86)", borderRadius: "1.3rem", color: "#fff", cursor: "pointer" }
export const cancleBtnStyle: CSSProperties = { padding: "0.45rem 1.4rem", borderRadius: "1.3rem", border: "1px solid rgb(86, 86, 86)", color: "rgb(86, 86, 86)", cursor: "pointer" }

export default OrderSaveAtMail;