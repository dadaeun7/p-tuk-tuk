import { useEffect, useState } from "react";
import MUIDatePickerForm from "../../util/MUIDatePickerForm";
import type { handleFilterChange } from "../OrderFilter";

function OrderFilterCalendar({
    backStyle,
    startDate,
    endDate,
    handleDateChange
}: {
    backStyle: React.CSSProperties,
    startDate: number,
    endDate: number,
    handleDateChange: handleFilterChange
}) {

    const past = new Date();
    past.setDate(past.getDate() - 7);

    const current = new Date();

    const tomorrow = new Date(current);
    tomorrow.setDate(current.getDate() + 1)

    const [start, setStart] = useState<Date>(past);
    const [end, setEnd] = useState<Date>(tomorrow);

    useEffect(() => {

        if (start !== null && end !== null) {
            const sYear = start?.getFullYear() || 0;
            const sMonth = start?.getMonth() || 0;
            const sDate = start?.getDate() || 0;

            const eEnd = end?.getFullYear() || 0;
            const eMonth = end?.getMonth() || 0;
            const eDate = end?.getDate() || 0;

            const startSet = new Date(sYear, sMonth, sDate, 0, 0, 0).getTime();
            const endSet = new Date(eEnd, eMonth, eDate, 0, 0, 0).getTime();

            const subStart = Math.floor(startSet / 1000);
            const subEnd = Math.floor(endSet / 1000);

            startDate = subStart
            handleDateChange('startDate', startDate);

            endDate = subEnd
            handleDateChange('endDate', endDate);

        }

    }, [start, end])

    return (
        <div className="my-order-table-filter-calendar" style={backStyle}>
            <div
                style={{
                    fontWeight: "bold",
                    display: "flex"
                }}
            >
                <div className="my-order-table-filter-calendar-start"><MUIDatePickerForm date={start} setData={setStart} /></div>
                <div className="my-order-table-filter-calendar-end"> <MUIDatePickerForm date={end} setData={setEnd} /></div>
            </div>
        </div>
    )
}

export default OrderFilterCalendar;