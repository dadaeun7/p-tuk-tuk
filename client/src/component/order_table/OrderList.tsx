import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { recycleGraColor, vendorMatch, zoneToDate } from "../../config";
import "../../css/order-table.css";
import { type Orders } from "../../data/db";
import LoadingDots from "../util/LoadingDots";

function returnColor(key: string) {
  const result = recycleGraColor.find((i) => i.name === key);
  return result?.color;
}

function returnVender(key: string) {
  const result = vendorMatch.find((i) => i.name === key);
  return result?.ko;
}

function OrderList(
  { setHeight, positionY, filterOrders, loading, setMenu, selectItems, setSelectItems }:
    {
      setHeight: any,
      positionY: number; filterOrders: Orders[]; loading: boolean,
      setMenu: React.Dispatch<React.SetStateAction<boolean>>,
      selectItems: string[],
      setSelectItems: React.Dispatch<React.SetStateAction<string[]>>,
      menu: boolean
    }) {

  const [desc, setDesc] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [iconDesc, setIconDesc] = useState<boolean>(false);

  const order = useMemo(() => {
    return filterOrders;
  }, [filterOrders])

  useEffect(() => {
    setMenu(selectItems.length > 0);
  }, [selectItems, setMenu]);

  const checkboxChange = useCallback((orderNumber: string, isCheck: boolean) => {

    setSelectItems(prevNumber => {
      if (isCheck) {
        return [...prevNumber, orderNumber];
      } else {
        return prevNumber.filter(n => n !== orderNumber);
      }
    });

  }, [setSelectItems]);

  const allCheckBoxChange = useCallback((isCheck: boolean) => {

    if (isCheck) {
      const allList = order.map(o => o.orderNumber)
      setSelectItems(allList);
    } else {
      setSelectItems([]);
    }
  }, [setSelectItems, order])


  const listHeight = useRef<HTMLTableElement>(null);

  useEffect(() => {

    if (listHeight.current) {
      const element = listHeight.current.getBoundingClientRect();
      setHeight(element.height);
    }
  }, [])

  return (
    <div
      className="my-order-table-list"
      style={{
        top: positionY + 20,
        ...orderListStyle.wrap
      }}
    >
      <table
        ref={listHeight}
        style={orderListStyle.table}>
        <thead
          style={{
            fontSize: "0.95rem",
          }}
        >
          <tr>
            <th style={{ width: "3%" }}>
              <input type="checkbox"
                onChange={(e) => { allCheckBoxChange(e.target.checked) }} />
            </th>
            <th style={{ width: "11%" }}>발생처</th>
            <th style={{ width: "26%" }}>주문 시간</th>
            <th style={{ width: "60%" }}>주문 물품 | 발생한 분리수거<span
              style={{
                cursor: 'pointer',
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: "600",
                backgroundColor: "#ecf1ecff",
                color: "#666666ff",
                border: "1px solid #d1e7d1",
                marginLeft: "0.5rem"
              }}
              onMouseOver={() => {
                setIconDesc(true);
              }}
              onMouseLeave={() => {
                setIconDesc(false);
              }}
            >🗑️{iconDesc &&
              <span
                style={{
                  marginLeft: "0.3rem",
                  padding: "0.3rem 0.6rem",
                  backgroundColor: "#000000cc",
                  color: "#ffffffcc",
                  borderRadius: "0.5rem",
                  fontSize: "0.8rem",
                }}
              >배출 방법을 확인해보세요!
              </span>}</span></th>

          </tr>
        </thead>
        {loading && (<div style={orderListStyle.loadingWrap}>
          <div><LoadingDots style={orderListStyle.loadingDot} /></div>
          <div style={{ color: "rgba(115, 146, 160, 1)" }}>주문건을 불러오고 있습니다</div>
        </div>)}
        <tbody>
          {order.map((order, index) => (
            <tr key={index} style={orderListStyle.tr}>
              <td style={orderListStyle.td}>
                <input type="checkbox"
                  id={order.orderNumber}
                  checked={selectItems.includes(order.orderNumber)}
                  onChange={(e) => { checkboxChange(order.orderNumber, e.target.checked) }} />
              </td>
              {/** 구매처 */}
              <td style={orderListStyle.td}>{returnVender(order.vendor)}</td>
              {/** 주문 날짜 또는 생성 날짜(OCR 인 경우) */}
              <td style={orderListStyle.td}>{zoneToDate(order.orderDate)}</td>
              {/** 상품명과, 매칭 재활용품 및 분리수거 방법 */}
              <td style={{
                ...orderListStyle.td,
              }} key={index}>
                {order.orderitems.map((prd, i) => (
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "15px" }}>{prd.product}</div>
                      {prd.materials.map((mt, index) => (
                        <div
                          key={index}
                          style={{
                            ...orderListStyle.materials,
                            background: returnColor(mt.name),
                          }}
                        >
                          {mt.name}
                        </div>
                      ))}
                      <div
                        style={{
                          cursor: 'pointer',
                          padding: "0.2rem 0.6rem",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          backgroundColor: "#ecf1ecff",
                          color: "#666666ff",
                          border: "1px solid #d1e7d1",
                          marginLeft: "0.5rem"
                        }}
                        onClick={() => {
                          setDesc(prev => {
                            if (prev !== order.orderNumber + (i.toString())) {
                              if (show === false) {
                                setShow(true);
                              }
                              return order.orderNumber + (i.toString());
                            } else {
                              setShow(!show);
                              return prev;
                            }
                          });
                        }}
                      >🗑️</div>
                    </div>
                    {desc === order.orderNumber + (i.toString()) && show && (<div
                      style={{
                        display: "",
                        maxWidth: "90%",
                        backgroundColor: "#ecf1ecff",
                        color: "#666666ff",
                        border: "1px solid #d1e7d1",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        lineHeight: "1.5rem",
                        margin: "0.3rem 0"

                      }}>
                      {prd.description}
                    </div>)
                    }
                  </div>
                ))}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const orderListStyle: { [key: string]: React.CSSProperties } = {
  delete: {
    textAlign: "left",
    padding: "1rem",
    width: "8rem",
    height: "0.4rem",
    display: "flex",
    alignItems: 'center',
    borderRadius: "0.4rem",
    marginBottom: "0.3rem",
    cursor: "pointer"
  },
  wrap: {
    width: "140vh",
    marginTop: "0.5rem",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    borderCollapse: "separate",
    textAlign: "left",
    borderSpacing: "0"
  },
  tr: {
    background: "rgba(255, 255, 255, 0.3)",
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
    zIndex: "-1"
  },
  td: {
    borderStyle: "none",
    fontWeight: "600",
    padding: "0.7rem 0",
  },
  materials: {
    fontWeight: "bold",
    marginRight: "0.3rem",
    padding: "0.2rem 1rem",
    borderRadius: "15px",
    color: "#4d4d4dff",
    margin: "0.3rem 0",
  },
  loadingWrap: {
    position: "absolute",
    right: "42%",
    marginTop: "15rem",
    fontSize: "1.2rem",
    fontWeight: "600",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.7rem",
    background: "rgba(168, 197, 209, .2)",
    padding: "2rem 3rem",
    borderRadius: "1rem",
  },
  loadingDot: {
    width: "0.5rem",
    height: "0.5rem",
    background: "radial-gradient(circle, rgba(168, 197, 209, 1), rgba(168, 197, 209, 0.3))"
  }
}


export default OrderList;
