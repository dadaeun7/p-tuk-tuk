import { useEffect, useMemo, useRef, useState } from "react";
import { format, isBefore, isEqual, startOfMonth, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

import "../../css/dashboard-select-calendar.css";
import { filterBlurStyle2 } from "../../config";

function SelectCal({
    pickDate,
    setPickDate,
    setDhYear,
    setDhMonth
}: {
    pickDate: Date,
    setPickDate: React.Dispatch<React.SetStateAction<Date>>,
    setDhYear: React.Dispatch<React.SetStateAction<number>>,
    setDhMonth: React.Dispatch<React.SetStateAction<number>>
}) {

    const [selectDate, setSelectDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropWidth, setDropWidth] = useState(0);

    useEffect(() => {
        if (dropdownRef.current) {
            setDropWidth(dropdownRef.current.offsetWidth);
        }
    }, [])

    const allMonths = useMemo(() => {
        const months = [];
        let currentDate = new Date();
        while (!isBefore(currentDate, pickDate)) {
            months.push(currentDate);
            currentDate = subMonths(currentDate, 1);
        }
        return months;
    }, [pickDate]);

    const filterMonths = allMonths.filter(
        (month) => !isEqual(startOfMonth(month), startOfMonth(selectDate))
    )

    const handleOptionClick = (date: Date) => {
        setSelectDate(date);
        setIsOpen(false);
        setDhYear(date.getFullYear());
        setDhMonth(date.getMonth() + 1);
    }

    return (
        <>
            <div style={{ position: 'absolute', fontSize: '1.7rem', fontWeight: "800", marginTop: "0.1rem" }}>대시보드</div>
            <div className="dash-board-select-date-wrap" ref={dropdownRef}
                style={{
                    position: 'absolute',
                    marginLeft: "6.8rem",
                    zIndex: "10",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...filterBlurStyle2
                }}>
                <div className="dash-board-select-date-title"
                    onClick={() => { setIsOpen(!isOpen) }}
                    style={{
                        display: 'flex',
                    }}>
                    <div
                        style={{
                            fontSize: "1.15rem",
                            fontWeight: "bold",
                            paddingLeft: "0.8rem",
                            lineHeight: '2rem'
                        }}
                    >{format(selectDate, 'yyyy년 MM월')}</div>
                    <img src="/low-triangle-icon.svg"
                        style={{
                            width: "1.7rem",
                            rotate: isOpen ? "180deg" : "",
                            transition: "all .3s"
                        }} />
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            className="dash-board-select-date-list"
                            style={{
                                listStyleType: "none",
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                marginTop: '0.1rem',
                                fontSize: "1rem",
                                fontWeight: "600",
                                maxWidth: dropWidth,
                                maxHeight: "30vh",
                                overflowY: "scroll",
                                overflowX: "hidden",
                                paddingInlineStart: "0px",
                            }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            {filterMonths.map((date, index) => (
                                <li
                                    className="dash-board-select-date-item"
                                    key={index}
                                    onClick={() => handleOptionClick(date)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '0.2rem'
                                    }}>
                                    {format(date, 'yyyy년 MM월', { locale: ko })}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </>

    )
}

export default SelectCal;