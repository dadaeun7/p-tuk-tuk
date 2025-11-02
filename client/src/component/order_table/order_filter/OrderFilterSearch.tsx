import { useCallback, useState } from "react";
import type { handleFilterChange } from "../OrderFilter";

function OrderFilterSearch({
    backStyle,
    imgStyle,
    keyword,
    handleKeywordChange
}: {
    backStyle: React.CSSProperties,
    imgStyle: React.CSSProperties,
    keyword: string,
    handleKeywordChange: handleFilterChange
}) {

    const [inputValue, setInputValue] = useState<string>('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            keyword = inputValue;
            handleKeywordChange('searchKeyword', keyword);
        }

    }

    const handleKeywords = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    }, [inputValue]);

    return (
        <div className="my-order-table-filter-search" style={{ ...backStyle, width: "18rem" }}>
            <img src="/black-search-icon.svg" style={imgStyle} />
            <input
                type="text"
                placeholder="발생처, 주문물품 기준"
                value={inputValue}
                onChange={handleKeywords}
                onKeyDown={handleKeyDown}
                style={{
                    fontSize: "13px",
                    background: "none",
                    fontWeight: "500",
                    width: "15rem"
                }}
            />
        </div>
    )
}

export default OrderFilterSearch;