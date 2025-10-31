import { useNavigate } from "react-router-dom";
import "../../css/how-to-connect.css";

function HowToUploadImg() {

    const nav = useNavigate();
    return (
        <div className="how-to-connect-box">
            <div className="container">
                <div
                    style={{
                        cursor: "pointer",
                        width: "12rem",
                        borderBottom: "solid 1px #A8D8B9",
                        color: "#38b463ff"
                    }}
                    onClick={() => {
                        nav(-1);
                    }}

                > 👈이전 페이지로 돌아가기</div>
                <h1>OCR에 등록할 이미지 가이드✨</h1>
                <p>OCR에 등록할 이미지 올리기 전 정확도를 높일 수 있는 이미지 규격 가이드 안내입니다. <br />가이드에 맞춰 캡쳐해주세요!</p>
                <hr />

                <h3>1단계: 이미지 캡쳐는 최대한 상품명, 수량, 가격 기준으로 영역잡기</h3>

                <ol>
                    <li>
                        매칭에 필요하지 않은 부가 정보는 제외하고, <strong>'상품명', '수량', '가격'</strong>기준으로 캡쳐해주세요.<br />
                        <img src="/capture_ex.svg" alt="네이버 POP3/IMAP 설정" />
                    </li>
                </ol>
                <h3>2단계: 지원되는 포맷인 JPEG, PNG로 저장하기</h3>
                <ol>
                    <li>
                        다른이름으로 저장 시 꼭 <code>JPG</code> <code>JPEG</code>, <code>PNG</code> 포맷으로 저장해주세요!<br />
                        <p style={{ fontSize: ' 0.94rem' }}> 🙇‍♀️이외 포맷은 현재 OCR 지원이 되지않습니다. 양해부탁드립니다.</p>
                        <img src="/save_format.svg" alt="Gmail 설정 메뉴" />
                    </li>

                </ol>

                <hr />
                <div className="tip">
                    <h3>✨ 등록 전 주의 점</h3>
                    <ul>
                        <li><strong>해상도 :</strong> 이미지 해상도가 너무 낮으면 OCR 인식률이 떨어질 수 있습니다.</li>
                        <li><strong>조명 :</strong> 이미지가 너무 어둡거나 밝으면 인식률이 떨어질 수 있습니다.</li>
                    </ul>
                </div>
            </div>

        </div>)

}

export default HowToUploadImg;