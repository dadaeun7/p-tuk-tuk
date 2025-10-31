import { useEffect, useState } from "react";

function MonthCurSel({
  setYear,
  setMonth,
}: {
  setYear: React.Dispatch<React.SetStateAction<number>>;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}) {
  const now = new Date();

  const [showY, setShowY] = useState(now.getFullYear());
  const [showM, setShowM] = useState(now.getMonth() + 1);

  useEffect(() => {
    setYear(showY);
    setYear(showM);
  }, [])


  const pastToDay = () => {
    {
      let setY = showY;
      let setM = showM;
      if (setM === 1) {
        setY -= 1;
        setM = 12;
        setShowY(setY);
        setShowM(setM);
        setYear(setY);
        setMonth(setM);
        return;
      }
      setM--;
      setShowM(setM);
      setMonth(setM);
    }
  }

  useEffect(() => {
    setYear(showY);
    setMonth(showM);
  }, [showY, showM])

  const futureToDay = () => {
    let setY = showY;
    let setM = showM;

    if (setM === 12) {
      setY += 1;
      setM = 1;
      setShowY(setY);
      setShowM(setM);
      setYear(setY);
      setMonth(setM);
      return;
    }
    setM += 1;
    setShowM(setM);
    setMonth(setM);
  }


  return (
    <div
      className="month-cur-select"
      style={{ textAlign: "left", display: "flex", alignItems: "center" }}
    >
      <img
        className="month-cur-select-past"
        src="/arrow-black-right-icon.svg"
        style={{ transform: "rotate(180deg)", cursor: "pointer" }}
        onClick={() => { pastToDay() }}
      />
      <span style={{ fontSize: "18px", fontWeight: "700", padding: "0 10px" }}>
        {showY.toString().slice(2) + "년 " + showM + "월"}
      </span>
      <img
        className="month-cur-select-next"
        src="/arrow-black-right-icon.svg"
        style={{ cursor: "pointer" }}
        onClick={() => { futureToDay() }}
      />
    </div>
  );
}

export default MonthCurSel;
