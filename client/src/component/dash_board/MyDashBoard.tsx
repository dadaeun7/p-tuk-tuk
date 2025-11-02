import { useEffect, useState } from "react";
import ExhaustCur from "./ExhaustCur";
import SelectCal from "./SelectCal";
import LocationWaste from "./LocationWaste";
import { tuktukDB, type Orders } from "../../data/db";
import MyWasteCurrent from "./MyWasteCurrent";
import { useAuth } from "../../contexts/Auth";

function MyDashBoard() {
  const [dhYear, setDhYear] = useState<number>(new Date().getFullYear());
  const [dhMonth, setDhMonth] = useState<number>(new Date().getMonth() + 1);

  // ---- 현재 예시로 임의 값 지정 -----
  // @Return : DB에 저장 된 최초 주문 날짜

  const [startDate, _] = useState(new Date(2023, 0));
  const [occurNum, setOccurNum] = useState(0);
  const [exhNum, setExhNum] = useState(0);
  const [exhArray, setExhArray] = useState<Orders[]>([]);
  const [beforeExhArray, setBeforeExhArray] = useState<Orders[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const totalGet = async () => {
      try {

        const beforeStartDate = new Date(dhYear, dhMonth - 2, 1, 0, 0, 0).getTime();
        const startDate = new Date(dhYear, dhMonth - 1, 1, 0, 0, 0).getTime();
        const endDate = new Date(dhYear, dhMonth, 0, 23, 59, 59).getTime();

        const beforeStart = Math.floor(beforeStartDate / 1000);

        const start = Math.floor(startDate / 1000);
        const end = Math.ceil(endDate / 1000);

        const beforeEnd = start;

        const myId = user?.myId !== undefined ? user?.myId : "";
        const order = await tuktukDB.orders
          .where("userId")
          .equals(myId)
          .toArray();


        /** 저번달 데이터 */
        const beforeAllCheckTrash = order.filter(order => {
          return order.orderDate >= beforeStart && order.orderDate <= beforeEnd;
        });
        setBeforeExhArray(beforeAllCheckTrash);
        /** -------------- */

        /** 현재 데이터 */
        const allTrash = order.filter(order => {
          return order.orderDate >= start && order.orderDate <= end;
        });
        /** -------------- */

        /** 이번달 재활용품 발생한 수 */
        const totalAllTrash = allTrash.reduce((totalOrder, order) => {
          const orderMaterialSum = order.orderitems.reduce((totalItem, item) => {
            return totalItem + item.materials.length;
          }, 0)

          return totalOrder + orderMaterialSum;
        }, 0)
        setOccurNum(totalAllTrash);
        /** -------------- */

        /** 이번달 재활용품 배출한 수*/
        const checkTrash = await tuktukDB
          .orders
          .where('orderDate')
          .between(start, end, true, true)
          .and((order: Orders) => order.disposalDate != null)
          .and((order: Orders) => order.userId === myId)
          .toArray();
        setExhArray(checkTrash);


        const totalCheckTrash = checkTrash.reduce((totalCheck, cOrder) => {
          const checkMaterialSum = cOrder.orderitems.reduce((totalItem, item) => {
            return totalItem + item.materials.length;
          }, 0)

          return totalCheck + checkMaterialSum;
        }, 0)

        setExhNum(totalCheckTrash);
        /** --------------*/
      } catch (err) {
        console.error("에러 발생!", err);
      }
    }

    totalGet();

  }, [dhYear, dhMonth]);

  return (
    <div
      className="my-dash-board"
      style={dashBoardStyle.wrap}
    >
      <SelectCal pickDate={startDate} setDhYear={setDhYear} setDhMonth={setDhMonth} />
      <div style={{ marginTop: "3.1rem", minWidth: "81rem" }}>
        <ExhaustCur occurNum={occurNum} exhNum={exhNum} />
        <MyWasteCurrent occurNum={occurNum} exhNum={exhNum} exhArray={exhArray} beforeExhArray={beforeExhArray} />
        <LocationWaste />
      </div>
    </div>
  );
}

const dashBoardStyle: { [key: string]: React.CSSProperties } = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    marginTop: "15px",
    maxWidth: "110rem",
  }
}
export default MyDashBoard;
