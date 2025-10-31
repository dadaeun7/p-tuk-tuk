import { forwardRef, useCallback, useEffect, useState } from "react";
import OrderFilterSearch from "./order_filter/OrderFilterSearch";
import OrderFilterMaterial from "./order_filter/OrderFilterMaterial";
import { blurStyle } from "../../config";
import OrderFilterInOrder from "./order_filter/OrderFilterInOrder";
import OrderFilterCalendar from "./order_filter/OrderFilterCalendar";
import OrderSaveAtMail from "./OrderSaveAtMail";
import OrderSaveAtOcr from "./OrderSaveAtOcr";


type OrderBoxProp = {
  height?: string;
};

export type handleFilterChange = (
  key: 'startDate' | 'endDate' | 'searchKeyword' | 'material',
  value: string | number | string[]
) => void;

type deleteSubmit = () => Promise<void>

interface OrderFilterProps extends OrderBoxProp {
  filters: {
    startDate: number,
    endDate: number,
    searchKeyword: string,
    material: string[]
  },
  handleFilterChange: handleFilterChange;
  deleteSubmit: deleteSubmit;
  menu: boolean;
}

const OrderFilter = forwardRef<HTMLDivElement, OrderFilterProps>((props, ref) => {

  const [showInMail, setShowInMail] = useState(false);
  const [showInRecipe, setShowInRecipe] = useState(false);

  const [reqLoading, setReqLoading] = useState("");

  useEffect(() => {
    if (localStorage.getItem("bring")) {
      setReqLoading("");
      localStorage.removeItem("bring");
    }
  })


  const { filters, handleFilterChange, deleteSubmit, menu } = props;

  const handleDateChange: handleFilterChange = useCallback((key, value) => {
    handleFilterChange(key, value);
  }, [handleFilterChange]);

  const handleKeywordChange: handleFilterChange = useCallback((key, value) => {
    handleFilterChange(key, value);
  }, [handleFilterChange])

  const handleMaterialChange: handleFilterChange = useCallback((key, value) => {
    handleFilterChange(key, value);
  }, [handleFilterChange])

  return (
    <div
      ref={ref}
      className="my-order-table-filter"
      style={{ display: "flex", gap: "10px" }}
    >
      {/**search */}
      <OrderFilterSearch
        backStyle={backStyle}
        imgStyle={imgStyle}
        keyword={filters.searchKeyword}
        handleKeywordChange={handleKeywordChange}
      />
      {/**filter */}
      <OrderFilterMaterial
        material={filters.material}
        handleMaterialChange={handleMaterialChange} />
      {/**calendar */}
      <OrderFilterCalendar
        backStyle={backStyle}
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleDateChange={handleDateChange}
      />
      {/**order table */}
      <OrderFilterInOrder
        imgStyle={imgStyle}
        setShowInMail={setShowInMail}
        setShowInRecipe={setShowInRecipe}
        reqLoading={reqLoading} />
      {/**order delete */}
      {menu && (<div className="delete-btn" onClick={() => { deleteSubmit(); }}>📤 삭제하기</div>)}
      {/* 주문내역 불러오기 */}
      <div style={{ display: showInMail ? "block" : "none" }}><OrderSaveAtMail setShowInMail={setShowInMail} setReqLoading={setReqLoading} /></div>
      <div style={{ display: showInRecipe ? "block" : "none" }}><OrderSaveAtOcr setShowInRecipe={setShowInRecipe} setReqLoading={setReqLoading} /></div>
    </div >
  );
});

// style
const imgStyle = { marginRight: "12px", scale: "75%" };
const backStyle = {
  ...blurStyle,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  height: "30px",
  padding: "0 10px",
  borderRadius: "25px",
  fontSize: "12.8px",
};

export default OrderFilter;
