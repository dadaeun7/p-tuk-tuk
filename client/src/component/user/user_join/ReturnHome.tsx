function ReturnHome() {
  return (
    <div
      className="return-home"
      onClick={() => (localStorage.clear(), (window.location.href = "/"))}
      style={{ cursor: "pointer", textAlign: "left" }}
    >
      홈으로 돌아가기
    </div>
  );
}

export default ReturnHome;
