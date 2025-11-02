import { blurStyle, filterBlurStyle2 } from "../../../config";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

function OrderFilterInOrder(
    { reqLoading, setShowInMail, setShowInRecipe }:
        {
            reqLoading: string,
            setShowInMail: React.Dispatch<React.SetStateAction<boolean>>,
            setShowInRecipe: React.Dispatch<React.SetStateAction<boolean>>,
        }) {

    const [orderEdit, setOrderEdit] = useState(false);
    const [recipePopup, setRecipePopup] = useState(false);
    const [mailPopup, setMailPopup] = useState(false);

    const orderAdd = [
        {
            tag: 'recipe',
            title: "영수증 업로드",
            icon: "📃",
            onClick: setShowInRecipe,
            showSet: setRecipePopup,
            showObj: recipePopup
        },
        {
            tag: 'mail',
            title: "메일 불러오기",
            icon: "📩",
            onClick: setShowInMail,
            showSet: setMailPopup,
            showObj: mailPopup
        },
    ];


    return (
        <div
            className="my-order-table-filter-add"
            style={{
                ...blurStyle,
                ...orderFilterStyle.container
            }}
        >
            <table>
                <thead>
                    <tr>
                        <th
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: "16px",
                            }}
                        >
                            <div style={{ marginRight: "0.9rem", fontSize: "1.3rem" }}>📦</div>
                            <span
                                style={{ fontWeight: "bold" }}
                            >
                                주문내역 추가
                            </span>
                            <img
                                src="/black-gra-low-arrow-icon.svg"
                                onClick={() => setOrderEdit(!orderEdit)}
                                style={{
                                    marginLeft: "5px",
                                    cursor: "pointer",
                                    transform: orderEdit ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                        </th>
                    </tr>
                </thead>
                <AnimatePresence>
                    <tbody className={orderEdit === true ? "" : "tbody-hidden"}>
                        <motion.tr
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, }}
                            style={{
                                ...filterBlurStyle2,
                                ...orderFilterStyle.tr,
                            }}
                        >
                            {orderAdd.map((add, id) => (
                                <td
                                    key={id}
                                    style={{
                                        ...orderFilterStyle.td,
                                        cursor: reqLoading === add.tag ? "not-allowed" : "pointer",
                                        color: reqLoading === add.tag ? "rgba(86, 86, 86, .3)" : "rgba(86, 86, 86, 1)"
                                    }}
                                    onClick={() => {
                                        if (reqLoading === add.tag) {
                                            return;
                                        }
                                        add.onClick(true);
                                        setOrderEdit(false)
                                    }}
                                    onMouseEnter={() => {
                                        if (reqLoading !== add.tag) {
                                            return;
                                        }
                                        add.showSet(true);
                                    }}
                                    onMouseLeave={() => {
                                        if (reqLoading !== add.tag) {
                                            return;
                                        }
                                        add.showSet(false);
                                    }}
                                >
                                    <div style={{ margin: "0 0.7rem" }}>{add.icon}</div>
                                    <span style={{ paddingRight: "17px" }}>{add.title}</span>
                                    <div style={{ ...orderFilterStyle.uploading, display: add.showObj ? "block" : "none", }}>🚕현재 업로드중에 있습니다. 완료 된 후에 시도해주세요</div>
                                </td>
                            ))}
                        </motion.tr>
                    </tbody>
                </AnimatePresence>
            </table>
        </div>
    )
}

export default OrderFilterInOrder;

const orderFilterStyle: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "26px",
        padding: "1.5px 9px",
        borderWidth: "1px 1px 0px 1px",
        fontSize: "13.7px",
        position: "relative",
        color: "#565656",
    },
    tr: {
        display: "flex",
        gap: "13px",
        flexDirection: "column",
        textAlign: "left",
        position: "fixed",
        width: "83%",
        margin: "0.4rem 0rem 0rem 0.2rem",
        padding: "15px 0px 15px 0px",
        borderRadius: "0rem 0rem 0.7rem 0.7rem",
        fontWeight: "500",
    },
    td: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        fontSize: "0.95rem",
    },
    uploading: {
        position: "absolute",
        width: "22rem",
        left: "1.2rem",
        marginTop: "3rem",
        backgroundColor: "#fff",
        padding: "0.3rem 0.6rem",
        border: "solid 0.1rem rgba(86, 86, 86, .5)",
        borderRadius: "1rem",
        color: "rgba(86, 86, 86, 1)"
    }
}