import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OrderFilter from "./OrderFilter";
import OrderList from "./OrderList";
import { tuktukDB, type Orders } from "../../data/db";
import { BACK, findVendor } from "../../config";
import { useMyModal } from "../../contexts/MyModal";
import { useAuth } from "../../contexts/Auth";
import { useBringOrder } from "../../contexts/BringOrder";
import { useQuery } from "@tanstack/react-query";

export interface FilterCriteria {
  startDate: number,
  endDate: number,
  searchKeyword: string,
  material: string[]
}

function MyOrderTable() {

  const { loading } = useBringOrder();

  /** order 삭제 관련 시작*/
  const [menu, setMenu] = useState(false);
  const [selectItems, setSelectItems] = useState<string[]>([]);

  const { openModal } = useMyModal();

  const deleteSubmit = useCallback(async () => {

    const uri = "/delete/order";
    try {

      await fetch(`${BACK}${uri}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(selectItems),
      }).then((res) => {
        if (res.ok) {
          return tuktukDB.orders.where('orderNumber').anyOf(selectItems).delete();
        } else {
          openModal(<div>주문건 삭제 실패했습니다. 관리자에게 문의하세요.</div>)
        }
      }).then(() => {
        openModal(<div>선택한 주문건이 정상적으로 삭제되었습니다.</div>)
        setTimeout(() => {
          window.location.reload();
        }, 3000)
      }).catch((err) => {
        console.error("데이터 삭제 중 에러가 발생했습니다.", err);
      });


    } catch (err) {
      console.error("주문건 삭제 중 에러가 발생했습니다! ", err);
    }

  }, [selectItems]);
  /** order 삭제 관련 끝*/

  /** orderList 설정 시작 */
  const [filters, setFilters] = useState<FilterCriteria>({
    startDate: 0,
    endDate: 0,
    searchKeyword: '',
    material: []
  })

  const { user } = useAuth();
  const userMyId = user?.myId;

  const loadOrder = async () => {
    const userMyId = user?.myId !== undefined ? user?.myId : "";

    if (!userMyId) {
      return [];
    }

    try {
      const orderFromDexie = await tuktukDB.orders.where('userId').equals(userMyId).toArray();
      return orderFromDexie;
    } catch (err) {
      console.error("orderFromDexie err : ", err);
    }
  }

  const {
    data: orders,
  } = useQuery({
    queryKey: ["orders", userMyId],
    queryFn: () => loadOrder(),
    enabled: !!userMyId
  });

  const originOrder = orders || [];

  console.log('originOrder', originOrder);
  console.log('userMyId', userMyId);


  const handleFilterChange = useCallback((key: keyof FilterCriteria, value: string | number | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const filterOrders = useMemo(() => {
    const { startDate, endDate, searchKeyword, material } = filters;

    let list: Orders[] = [];

    if (originOrder) {
      list = originOrder;
    }

    if (startDate || endDate) {
      list = list.filter(order => {
        const orderTimeStamp = order.orderDate;

        if (startDate && orderTimeStamp < startDate) {
          return false;
        }

        if (endDate && orderTimeStamp > endDate) {
          return false;
        }

        return true;
      })
    }
    if (searchKeyword !== '') {

      if (searchKeyword === '쿠팡' ||
        searchKeyword === '배민 장보기' ||
        searchKeyword === '컬리' ||
        searchKeyword.toLocaleLowerCase() === 'ocr' ||
        searchKeyword === '장보기'
      ) {
        const findKey = findVendor(searchKeyword) || '';
        list = list.filter(order => order.vendor.includes(findKey));
      }

      list = list.filter(order => order.orderitems.some(oi => oi.product.includes(searchKeyword)));
    }

    if (material && material.length > 0) {
      list = list.filter(order => order.orderitems.some(oi => oi.materials.some(m => material.includes(m.key))));
    }
    return list;

  }, [originOrder, filters]);


  const [heigt, setHeight] = useState(0);

  /** title, filter css width 설정 시작 */
  const titleRef = useRef<HTMLDivElement>(null);
  const [tWidth, setTwidth] = useState(0);

  useEffect(() => {
    if (titleRef.current) {
      const react = titleRef.current.getBoundingClientRect();
      setTwidth(react.height);
    }
  }, []);

  const filterRef = useRef<HTMLDivElement>(null);
  const [fWidth, setFwidth] = useState(0);

  useEffect(() => {
    if (filterRef.current) {
      const react = filterRef.current.getBoundingClientRect();
      setFwidth(react.height);
    }
  }, []);
  /** title, filter css width 설정 끝 */

  return (
    <div
      className="my-order-table"
      style={{
        minHeight: heigt,
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        position: "relative",
        resize: 'both'
      }}
    >
      <div
        ref={titleRef}
        style={{
          fontSize: "22px",
          fontWeight: "800",
          textAlign: "left",
          paddingTop: "20px",
        }}
      >
        주문내역
      </div>
      <OrderFilter
        ref={filterRef}
        filters={filters}
        handleFilterChange={handleFilterChange}
        menu={menu}
        deleteSubmit={deleteSubmit} />
      <OrderList
        setHeight={setHeight}
        positionY={tWidth + fWidth}
        filterOrders={filterOrders}
        loading={loading}
        setMenu={setMenu}
        menu={menu}
        selectItems={selectItems}
        setSelectItems={setSelectItems} />

    </div>
  );
}

export default MyOrderTable;