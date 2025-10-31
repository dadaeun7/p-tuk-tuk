
import { blurStyle, localUser } from "../../config";

function ExhaustCur({ occurNum, exhNum }: { occurNum: number; exhNum: number }) {

  return (
    <div
      className="exhaust-cur"
      style={wrapStyle}
    >
      <div
        className="exhaust-cur-num-wrap"
        style={{ display: "flex", gap: "10px", justifyContent: "center" }}
      >
        <div className="exhaust-cur-occur-num" style={rightHighLight}>
          <div className="exhaust-cur-occur-num-title" style={{ marginRight: "1rem" }}>👣 발생 수</div>
          <div className="exhaust-cur-occur-num-sum" style={{ fontSize: "1.2rem" }}>
            {occurNum}
          </div>
        </div>
        <div className="exhaust-cur-exh-num" style={rightHighLight}>
          <div className="exhaust-cur-exh-num-title" style={{ marginRight: "1rem" }}>♻️ 배출 수</div>
          <div className="exhaust-cur-exh-num-sum" style={{ fontSize: "1.2rem" }}>
            {exhNum}
          </div>
        </div>
      </div>
      <div
        className="exhaust-cur-location-wrap"
        style={{
          display: "flex",
          gap: "11px",
        }}
      >
        <div className="exhaust-cur-location-name" style={rightHighLight}>
          <div style={{ marginRight: "1rem", fontSize: "1rem", fontWeight: "500" }}>📍내 지역</div>
          <div style={{ marginLeft: "0.5rem" }}>{localUser().location}</div>
        </div>
      </div>
    </div>
  );
}

const wrapStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0.5rem 0rem 0.2rem 0rem",
}

const rightHighLight = {
  fontSize: "1.1rem",
  padding: "0.25rem 1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bolder",
  color: "#566170ff",
  ...blurStyle,
};

export default ExhaustCur;
