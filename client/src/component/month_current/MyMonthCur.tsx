import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { tuktukDB } from "../../data/db";
import MonthCurSel from "./MonthCurSel";
import MonthSum from "./MonthSum";
import MonthTable from "./MonthTable";
import { useAuth } from "../../contexts/Auth";

export interface MaterialIndex {
  key: string;
  total: number;
}

export interface GroupedMaterials {
  [dateKey: number]: { list: MaterialIndex[], disposal: boolean, number: string[] };
}

function MyMonthCur() {
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const { user } = useAuth();

  const getDayOrders = async () => {
    const startSet = new Date(year, month - 1, 1, 0, 0, 0).getTime();
    const endSet = new Date(year, month, 0, 23, 59, 59).getTime();

    const start = Math.floor(startSet / 1000);
    const end = Math.ceil(endSet / 1000);

    const myId = user?.myId !== undefined ? user?.myId : "";
    const order = await tuktukDB.orders
      .where("userId")
      .equals(myId)
      .toArray();

    const dateFilterOrder = order.filter(order => {
      return order.orderDate >= start && order.orderDate <= end;
    });

    return dateFilterOrder;
  };

  const isReady = year > 0 && month > 0;

  const {
    data: orders,
    refetch
  } = useQuery({
    queryKey: ["dayMaterials", year, month],
    enabled: isReady,
    queryFn: () => getDayOrders(),
  });

  const submitOrders = orders || [];

  const [height, setHeight] = useState(0);

  return (
    <div className="my-month-cur" style={{ marginTop: "20px", height: `${height + 130}px` }}>
      <div
        style={{ textAlign: "left", fontWeight: "600", marginBottom: "10px" }}
      >
        <span
          style={{ fontSize: "22px", fontWeight: "800", marginRight: "20px" }}
        >
          월별 현황
        </span>
        날짜별 발생한 분리수거품과 배출한 날짜에 배출 체크를 하여 관리해보세요!
      </div>
      <MonthSum orders={submitOrders} />
      <MonthCurSel setYear={setYear} setMonth={setMonth} />
      <MonthTable orders={submitOrders} year={year} month={month} onOrderUpdate={refetch} setHeight={setHeight} />
    </div>
  );
}

export default MyMonthCur;
