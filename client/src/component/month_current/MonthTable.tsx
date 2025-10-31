import { useCallback, useEffect, useRef, useState } from "react";
import { BACK, matchKeyName, recycleGraColor } from "../../config";
import { tuktukDB, type Orders } from "../../data/db";
import type { GroupedMaterials, MaterialIndex } from "./MyMonthCur";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useMyModal } from "../../contexts/MyModal";

function returnColor(key: string) {
  const find = returnMaterialName(key);
  const result = recycleGraColor.find((c) => c.name == find);
  return result?.color;
}

function returnMaterialName(key: string) {
  const result = matchKeyName.find((m) => m.key === key);
  return result?.name;
}

function MonthTable({
  orders,
  year,
  month,
  onOrderUpdate,
  setHeight
}: {
  orders: Orders[];
  year: number;
  month: number;
  onOrderUpdate: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Orders[], Error>>,
  setHeight: any;
}) {

  const { openModal } = useMyModal();

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDay = new Date(year, month, 0).getDate();
  const prevLastDay = new Date(year, month - 1, 0).getDate();

  const date = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const days = [];

  const zoneTimeToDateKey = (timeStamp: number): number => {
    const multiZone = timeStamp * 1000;
    const date = new Date(multiZone);
    const d = date.getDate();

    return d;
  };

  const [groupData, setGroupData] = useState<GroupedMaterials>({});

  useEffect(() => {

    const groupMaterialByDay = (orders: Orders[]) => {
      const groupMaterials = orders.reduce<GroupedMaterials>((acc, order) => {

        const dKey = zoneTimeToDateKey(order.orderDate);
        const materials = order.orderitems.flatMap((item) => item.materials);

        const inDisposal = order.disposalDate ? true : false;

        if (!acc[dKey]) {
          acc[dKey] = {
            list: [],
            disposal: inDisposal,
            number: []
          };
          acc[dKey].number.push(order.orderNumber);
        } else {
          const exitNumber = acc[dKey].number.find((n) => n === order.orderNumber);
          if (!exitNumber) {
            acc[dKey].number.push(order.orderNumber);
          }
        }

        materials.map((m) => {
          const exitMaterial = acc[dKey].list.find((a) => a.key === m.key);

          if (exitMaterial) {
            exitMaterial.total++;

          } else {
            acc[dKey].list.push({
              key: m.key,
              total: 1,
            });
          }
        });

        return acc;
      }, {});

      return groupMaterials;
    };

    if (orders) {
      setGroupData(groupMaterialByDay(orders));
    }

  }, [orders])

  const reCheckDisposal = useCallback(async (key: number) => {

    try {

      const isCheck = !groupData[key].disposal;
      const orderNumberList = groupData[key].number;

      console.log(orderNumberList);

      const uri = '/check/disposal';

      let insertDate;

      const res = await fetch(`${BACK}${uri}`, {
        method: 'POST',
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumberList, isCheck })
      });

      if (!res.ok) {
        const error = await res.json();
        openModal(<div>배출 처리 중 오류 발생!</div>);
        console.error(error.message);
      }

      const data = await res.json();

      insertDate = data.disposalDate;
      await tuktukDB.orders.where('orderNumber').anyOf(orderNumberList).modify({
        disposalDate: insertDate
      })

      onOrderUpdate();

      setGroupData(prevGroupData => {
        const updateDateEntry = {
          ...prevGroupData[key],
          disposal: insertDate !== null,
        };

        return {
          ...prevGroupData,
          [key]: updateDateEntry,
        };
      });

    } catch (err) {
      console.error("DB의 disposalDate 변경중 에러가 발생했습니다: ", err);
    }
  }, [groupData, setGroupData])

  // 시작 요일 전 (empty cell)
  const emptyDay = prevLastDay;

  for (let h = 0; h < firstDay; h++) {
    days.unshift(
      <div
        key={"empty-" + h}
        className="day-empty-cell"
        style={MonthTableStyle.emptyDay}
      >
        {emptyDay - h}
      </div>
    );
  }

  const [detailShow, setDetailShow] = useState<number | null>(null);
  const [menuShow, setMenuShow] = useState<number | null>(null);

  // 실제 데이터 cell
  for (let d = 0; d < lastDay; d++) {
    days.push(
      <div
        key={d + 1}
        className={d + 1 + "-day-cell"}
        style={MonthTableStyle.day}
        onMouseEnter={() => setDetailShow(d + 1)}
        onMouseLeave={() => { setDetailShow(null); setMenuShow(null); }}
      >
        <div
          className="date-top"
          style={MonthTableStyle.cellTop}
        >
          <div className="date">{d + 1}
            {groupData[d + 1]?.disposal && (<span>🌳</span>)}
          </div>

          {detailShow === d + 1 && (
            <div style={{ position: "absolute", right: "1rem" }}>
              <img
                src="/more-item-icon.svg"
                style={{ opacity: "0.5", cursor: "pointer" }}
                onClick={() => { setMenuShow(d + 1) }}
              />
              {menuShow === d + 1 && (
                <div
                  style={MonthTableStyle.menu}
                  onClick={() => {

                    if (groupData[d + 1] === undefined) {
                      return openModal("배출 할 항목이 없습니다");
                    }

                    if (groupData[d + 1].list) {
                      reCheckDisposal(d + 1);
                    }
                  }}
                >
                  {groupData[d + 1] !== undefined && groupData[d + 1].disposal ? "배출취소" : "배출하기"}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="date-material-list"
          style={{ margin: "0.5rem 0rem" }}>
          {(groupData[d + 1]?.list || []).map((m, index) => (
            <div
              key={index}
              className={"material-day-" + d + 1}
              style={{
                background: returnColor(m.key),
                ...MonthTableStyle.material,
              }}
            >
              {returnMaterialName(m.key)}
              <span
                style={MonthTableStyle.materialNum}
              >{m.total}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tableHeight = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!tableHeight.current) return;

    const observer = new ResizeObserver((entry) => {
      for (let et of entry) {
        const newHeight = et.contentRect.height;
        setHeight(newHeight);
      }
    })
    observer.observe(tableHeight.current);

    return () => {
      if (tableHeight.current) {
        observer.unobserve(tableHeight.current);
      }
      observer.disconnect();
    }
  }, [])

  // 본문
  return (
    <div
      ref={tableHeight}
      className="month-table"
      style={{
        width: "140vh",
      }}
    >
      <div
        className="month-table-header"
        style={{
          ...MonthTableStyle.wrapBasic,
          ...MonthTableStyle.header,
        }}
      >
        {date.map((d) => (
          <div className={"month-table-header-" + d}>{d}</div>
        ))}
      </div>
      <div className="month-table-body" style={MonthTableStyle.wrapBasic}>
        {days}
      </div>
    </div>
  );
}

const MonthTableStyle: { [key: string]: React.CSSProperties } = {
  wrapBasic: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    textAlign: "left",
    gridAutoRows: "auto",
  },
  header: {
    marginTop: "15px",
    padding: "3px 0px",
    border: "solid 1px rgba(102, 119, 143, 0.3)",
    borderWidth: "1px 0px 1px 0px",
    fontWeight: "700",
  },
  day: {
    position: "relative",
    minHeight: "7rem",
    paddingTop: "10px",
    borderBottom: "solid 1px rgba(102, 119, 143, 0.3)",
    color: "rgba(102, 119, 143, 1)",
  },
  emptyDay: {
    borderBottom: "solid 1px rgba(102, 119, 143, 0.3)",
    paddingTop: "10px",
    color: "rgba(102, 119, 143, 0.4)",
    fontWeight: "500",
  },
  cellTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  menu: {
    position: "absolute",
    padding: "0.6rem 1.3rem",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: " blur(0.9rem)",
    boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "0.7rem",
    width: "3.8rem",
    top: "-0.4rem",
    zIndex: "99",
    cursor: "pointer"
  },
  material: {
    padding: "0.3rem 0.8rem",
    width: "60%",
    borderRadius: "0.7rem",
    marginBottom: "0.25rem",
    fontWeight: "500",
    fontSize: "1.03rem",
    boxShadow: "0 2px 3px rgba(61, 61, 61, 0.1)",
  },
  materialNum: {
    position: "absolute",
    right: "34%",
    fontWeight: "500"
  }
};

export default MonthTable;
