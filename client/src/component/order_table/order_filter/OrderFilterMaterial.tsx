import { blurStyle, filterBlurStyle2, matchKeyName } from "../../../config";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import type { handleFilterChange } from "../OrderFilter";

function OrderFilterMaterial({
    material,
    handleMaterialChange
}: {
    material: string[],
    handleMaterialChange: handleFilterChange
}) {

    const [filterEdit, setFilterEdit] = useState(false);

    const [filterArray, setFilterArray] = useState<string[]>([]);


    const handleMaterialCheck = useCallback((materialVal: string, isChecked: boolean) => {
        setFilterArray(prevFilters => {

            if (isChecked) {
                if (!prevFilters.includes(materialVal)) {
                    return [...prevFilters, materialVal]
                }
            } else {
                return prevFilters.filter(m => m !== materialVal)
            }

            return prevFilters;
        })
    }, []);

    const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const materialName = e.target.value;
        const isChecked = e.target.checked;

        handleMaterialCheck(materialName, isChecked);

    }, [handleMaterialCheck]);

    useEffect(() => {
        material = filterArray;
        handleMaterialChange('material', material);
    }, [filterArray])
    return (
        <div
            className="my-order-table-filter-drop"
            style={{
                ...blurStyle,
                ...materialFilterStyle.container
            }}
        >
            <table>
                <thead>
                    <tr>
                        <th style={{ position: "relative", display: "flex", alignItems: "center", maxHeight: "13px", }}>
                            <div style={{ margin: "0 0.7rem 0 0.3rem" }}>🗑️</div>
                            <span
                                style={{ fontWeight: "bold" }}
                            >
                                Filter
                            </span>
                            <img
                                src="/black-gra-low-arrow-icon.svg"
                                onClick={() => setFilterEdit(!filterEdit)}
                                style={{
                                    marginLeft: " 5px",
                                    cursor: "pointer",
                                    transform: filterEdit ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                        </th>
                    </tr>
                </thead>
                <AnimatePresence>
                    <tbody className={filterEdit === true ? "" : "tbody-hidden"}>
                        <motion.tr
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1, }}
                            exit={{ opacity: 0, }}
                            style={{
                                ...filterBlurStyle2,
                                ...materialFilterStyle.tr
                            }}
                        >
                            {matchKeyName.map(m => (
                                <td
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        key={m.name}
                                        value={m.key}
                                        onChange={handleCheck}
                                        checked={filterArray.includes(m.key)} />
                                    <span>{m.name}</span>
                                </td>
                            ))}
                        </motion.tr>
                    </tbody>
                </AnimatePresence>
            </table>
        </div>
    )

}
export default OrderFilterMaterial;

const materialFilterStyle: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "30px",
        padding: "0px 13px",
        fontSize: "13.7px",
        position: "relative",
        color: "#565656",
    },
    tr: {
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        textAlign: "left",
        position: "absolute",
        width: "80%",
        marginTop: "0.6rem",
        marginLeft: "0.7rem",
        padding: "10px 0px 15px 0px",
        borderRadius: "0px 0px 10px 10px",
        zIndex: 999,
        fontWeight: "500",
        left: "0"
    }
}