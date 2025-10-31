import { useState } from "react";
import { BACK } from "../../config";
import { useMyModal } from "../../contexts/MyModal";
import { cancleBtnStyle, description, help, submit, submitBtnStyle, title, wrapStyle } from "./OrderSaveAtMail";
import { useNavigate } from "react-router-dom";

function OrderSaveAtOcr({
    setShowInRecipe,
    setReqLoading
}: {
    setShowInRecipe: React.Dispatch<React.SetStateAction<boolean>>,
    setReqLoading: React.Dispatch<React.SetStateAction<string>>
}) {


    const [hover, setHover] = useState(false);
    const nav = useNavigate();

    const [selectFile, setSelectFile] = useState<File | null>(null);
    const uri = "/bring/ocr";


    const { openModal } = useMyModal();

    const seletFileHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setSelectFile(e.target.files[0]);
        }
    }

    const bringOcr = async () => {

        if (!selectFile) {
            openModal(<div>파일을 선택해주세요.</div>);
        } else {
            setReqLoading('recipe')
            const formData = new FormData();
            formData.append('file', selectFile);

            try {
                await fetch(`${BACK}${uri}`, {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
                ).then((res) => {
                    if (res.ok) {
                        openModal(<div>서버로 요청이 되었습니다! 조금만 기다려주세요.</div>)
                    }
                }).catch((err) => {
                    openModal(<div>이미지를 ocr 처리 중 에러가 발생했습니다.{err}</div>);
                    setReqLoading('');
                }).finally(() => {
                    setReqLoading('');
                })


            } catch (err) {
                console.error("이미지 ocr 처리 중 오류 발생, ", err);
            }

            setShowInRecipe(false);

        }

    }


    return (<>
        <div
            className="order-save-at-ocr"
            style={{ ...wrapStyle, height: "19.5rem" }}
        >
            <div
                style={{
                    ...help,
                    backgroundColor: hover ? "rgb(86, 86, 86)" : "rgba(86, 86, 86, 0.15)",
                    color: hover ? "#ffffffff" : "rgba(86, 86, 86, 0.9)",
                }}
                onClick={() => {
                    nav("/how-to-upload");
                }}
                onMouseOver={() => {
                    setHover(true);
                }}
                onMouseOut={() => {
                    setHover(false);
                }}

            >등록할 이미지 캡쳐 가이드</div>
            <div className="order-save-at-ocr-title" style={{ ...title, paddingBottom: "1.2rem" }}>📃이미지로 등록하기</div>
            <div className="order-save-at-ocr-desc" style={{ ...description, marginTop: "0.2rem" }}>이미지 파일만 가능합니다. (지원 포맷: jpeg, png)</div>
            <div className="order-save-at-ocr-desc" style={{ paddingTop: "0.5rem", color: "rgb(86, 86, 86)", fontSize: "0.98rem", }}>이미지에
                <strong style={{ border: "1px solid rgba(86, 86, 86, 0.4)", padding: "0.2rem 0.8rem", margin: "0 0.4rem", borderRadius: "0.8rem", fontSize: "0.89rem", backgroundColor: "rgba(86, 86, 86, .15)" }}>상품명 | 수량 | 가격</strong>이 포함되어있어합니다.</div>
            <input style={{ marginTop: "2rem" }} type="file" onChange={seletFileHandle} accept="image/jpeg,image/png"></input>
            <div
                className="order-save-at-ocr-submit"
                style={submit}>
                <div className="order-save-at-ocr-submit-success"
                    style={submitBtnStyle}
                    onClick={() => {
                        bringOcr();
                    }}
                >확인</div>
                <div
                    className="order-save-at-ocr-submit-close"
                    style={cancleBtnStyle}
                    onClick={() => {
                        setShowInRecipe(false);
                    }}
                >닫기</div>
            </div>
        </div>
    </>)
}

export default OrderSaveAtOcr;