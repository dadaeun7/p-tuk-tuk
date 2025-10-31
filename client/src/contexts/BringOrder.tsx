import { createContext, useContext, useEffect, useState } from "react"
import { tuktukDB, type Orders } from "../data/db";
import { BACK, materials } from "../config";
import axios from 'axios';
import { useAuth } from "./Auth";
import { useQuery } from "@tanstack/react-query";

export type OrderCtx = {
    loading: boolean;
    load: () => Promise<void>;
    msgState: string,
    settingLoad: (status: boolean) => void;
}

export const BringOrderContext = createContext<OrderCtx | null>(
    null as OrderCtx | null
)

export function BringOrderProvider({ children }: { children: React.ReactNode }) {

    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [msgState, setMsgState] = useState("");

    useEffect(() => {

        if (loading) return;
        if (user) {
            load();
        }
    }, [user])

    const settingLoad = (status: boolean) => {
        setLoading(status);
    }

    const load = async () => {

        if (loading) return;
        setLoading(true);

        const uri = "/bring/order";

        try {
            const response = await axios.get(`${BACK}${uri}`, {
                withCredentials: true
            }).then((res) => { return res.data });

            if (response && response.length > 0) {

                const validOrders: Orders[] = response.filter((order: Orders) => {
                    order.orderNumber && typeof order.orderNumber === 'string' && order.orderNumber.length > 0;
                    return order;
                });

                const mergeOrderList: Orders[] = [];

                /** 삭제 된 주문건 처리 로직 시작 */
                const validOrderIds = validOrders.map((order) => order.orderNumber);

                const dexieOrder = await tuktukDB.orders.toArray();
                const orderNumbers = dexieOrder.map(order => order.orderNumber);

                const deleteIds = orderNumbers.filter(number => !validOrderIds.includes(number));

                if (deleteIds.length > 0) {
                    await tuktukDB.orders.where('orderNumber').anyOf(deleteIds).delete();
                }

                /** 삭제 된 주문건 처리 로직 끝 */

                for (const apiOrder of validOrders) {

                    const exitOrder = await tuktukDB.orders.where('orderNumber').equals(apiOrder.orderNumber).first();

                    if (exitOrder) {
                        mergeOrderList.push({
                            ...apiOrder,
                            userId: user?.myId !== undefined ? user?.myId : "",
                        })
                    } else {
                        mergeOrderList.push(apiOrder);
                    }

                }

                await tuktukDB.orders.bulkPut(mergeOrderList).catch(err => {
                    console.log("Dexie Transaction Error:", err);
                })

                setMsgState(`${response.length}의 주문건을 불러왔습니다.`);
            } else {
                setMsgState("새로운 주문건이 없습니다.");
            }

        } catch (err) {
            setMsgState(`주문 불러오는 중 에러가 발생했습니다! ${err}`);
        } finally {
            setLoading(false);
        }
    }

    const bringOrderValue = { loading, load, msgState, settingLoad };

    return (
        <BringOrderContext.Provider value={bringOrderValue}>
            {children}
        </BringOrderContext.Provider>
    )
}

export const useBringOrder = () => {
    const ctx = useContext(BringOrderContext);
    if (!ctx) throw new Error("BringOrderProvider 범위 내 컴포넌트 가 아닙니다");
    return ctx;
}