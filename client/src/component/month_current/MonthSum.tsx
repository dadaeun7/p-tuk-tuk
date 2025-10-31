import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { blurStyle, matchTitle, materials } from "../../config";
import type { Orders } from "../../data/db";

interface TotalMaterial {
  [key: string]: number;
}

function MonthSum({ orders }: { orders: Orders[] }) {

  const resultMaterial = orders.flatMap((o) => {
    return o.orderitems.flatMap((oi) => {
      return oi.materials.map((m) => m.key);
    });
  });

  const { groupMaterial, totalCount } = useMemo(() => {

    let curTotal = 0;

    const caculateGroupMaterial = resultMaterial.reduce<TotalMaterial>((acc, cur) => {
      /** 총 발생량 */
      curTotal += 1;
      /** 각 material 합 구하기 */
      const currentCount = acc[cur] || 0;
      acc[cur] = currentCount + 1;
      return acc;
    }, {});

    return {
      groupMaterial: caculateGroupMaterial,
      totalCount: curTotal
    }
  }, [orders]);

  return (
    <div className="month-cur-sum" style={MonthSumStyle.wrap}>
      <div className="month-cur-sum-total" style={MonthSumStyle.total}>
        🌏 총 발생량 <span style={{ marginLeft: "10px" }}>{totalCount}</span>
      </div>
      {materials.map((mat, index) => (
        <div
          className={"month-cur-sum-" + mat}
          key={index}
          style={MonthSumStyle.materials}
        >
          {matchTitle[mat]}
          <span style={{ marginLeft: "6px" }}>{groupMaterial[mat.toUpperCase()] ? groupMaterial[mat.toUpperCase()] : 0}</span>
        </div>
      ))}
    </div>
  );
}

export default MonthSum;

const MonthSumStyle: { [key: string]: React.CSSProperties } = {
  wrap: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "3px",
    marginBottom: "15px",
  },
  total: {
    ...blurStyle,
    padding: "6px 12px",
    color: "#334155",
    fontWeight: "bold",
    fontSize: "15px",
  },
  materials: {
    padding: "6px 12px",
    ...blurStyle,
    color: "#334155",
    fontSize: "14px",
    fontWeight: "500",
  },
};
