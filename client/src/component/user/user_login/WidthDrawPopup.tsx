import { useCallback } from "react";
import { BACK, localUser } from "../../../config";
import { useMyModal } from "../../../contexts/MyModal";
import { type User } from "../../../contexts/Auth";
import { cancleBtnStyle, submit, submitBtnStyle } from "../../order_table/OrderSaveAtMail";

function WidthDrawPopup({ setExit }: { setExit: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { openModal } = useMyModal();

    const exitSubmit = useCallback(async () => {

        openModal(<div>처리중입니다</div>);
        const user: User = localUser();
        const userMyId: string = user.myId;

        const uri = "/exit";

        await fetch(`${BACK}${uri}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMyId })
        }).then((res) => {
            if (res.ok) {
                openModal(<div>탈퇴 처리가 정상적으로 되었습니다.</div>);
                setTimeout(() => {
                    window.location.href = "/";
                }, 5000)
            }
            window.location.href = "/";
        }).finally(() => {
            setExit(false);
        })

    }, [])
    return (
        <>
            <div style={{
                position: "absolute",
                width: "30rem",
                padding: "2.5rem 3rem 2.5rem 3.3rem",
                backgroundColor: "rgba(252, 253, 252, 1)",
                border: "0.015rem solid rgba(102, 143, 102, 0.45)",
                borderRadius: "1rem",
                left: "40rem",
                color: "rgb(86, 86, 86)",
                textAlign: "left"
            }}>
                <div className="user-with-draw-body"
                    style={{ marginBottom: "3rem" }}
                >
                    <div style={{
                        fontWeight: "800",
                        fontSize: "1.9rem",
                        marginTop: "2.8rem",
                        marginBottom: "0.9rem",
                        opacity: '0.9'
                    }}>회원 탈퇴를 진행하겠습니까?</div>
                    <div
                        style={{
                            fontSize: "1.15rem",
                            fontWeight: "600",
                            padding: "0.8rem",
                            borderTop: "solid 0.08rem #929191ff",
                            marginBottom: "0.3rem",
                            borderBottom: "solid 0.08rem #929191ff",
                            color: "rgba(56, 56, 56, 1)",
                        }}>
                        <div style={{ paddingBottom: "0.5rem" }}>⚠️tuktuk 에 연동 된 구글 계정 자동해제 </div>
                        <div>⚠️관련 주문내역 및 재활용품 정보 삭제</div>
                    </div>

                    <div style={{ marginTop: "1rem", fontSize: "1.08rem", fontWeight: "500", opacity: '0.9' }}>추후 복원이 어렵습니다. 그래도 진행하겠습니까?</div>
                </div>
                <div className="user-with-draw-btn"
                    style={{ ...submit, marginRight: "0.1rem" }}>
                    <div
                        style={submitBtnStyle}
                        onClick={() => {
                            exitSubmit();
                        }}>확인</div>
                    <div
                        style={cancleBtnStyle}
                        onClick={() => {
                            setExit(false);
                        }}>닫기</div>
                </div>
            </div>
        </>
    )

}

export default WidthDrawPopup;