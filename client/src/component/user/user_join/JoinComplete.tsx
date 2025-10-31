import "../../../css/join-all.css";

function JoinComplete() {
  return (
    <div className="join-complete">
      <div className="success-container">
        <svg className="success-checkmark" viewBox="0 0 52 52">
          {/* 원형 테두리 */}
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          {/* 체크 표시 */}
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <h2>가입이 완료되었습니다!</h2>
      </div>
      <div className="join-complete-description">
        함께 지구를 지켜나가는 여정을 시작해보아요!
      </div>
      <div
        className="join-complete-btn"
        onClick={() => (window.location.href = "/")}
      >
        🌱바로 친환경 생활을 시작하기
      </div>
    </div>
  );
}

export default JoinComplete;
