
import { useEffect, useState, type CSSProperties } from "react";
import { type Orders } from "../../data/db";
import { matchTitle, materials } from "../../config";
import "../../css/dashboard-body.css";

interface CO2Props {
    [key: string]: number;
}

interface materialMap {
    [key: string]: number;
}

interface UpDownResult {
    item: string,
    cur: number,
    past: number;
    percent: number;
    state: 'up' | 'down' | 'same' | 'new'
}

function colorSelect(key: string) {
    if (key === 'up') {
        return '#b62c2fff'
    } else if (key === 'down') {
        return '#155897ff'
    } else if (key === 'same') {
        return '#8C8C8C'
    } else if (key === 'new') {
        return '#398612ff'
    }
}
function imgSelect(key: string) {
    if (key === 'up') {
        return '▲'
    } else if (key === 'down') {
        return '▼'
    } else if (key === 'same') {
        return '-'
    } else if (key === 'new') {
        return '💡'
    }
}

function MyWasteCurrent(
    { occurNum, exhNum, exhArray, beforeExhArray }:
        { occurNum: number; exhNum: number, exhArray: Orders[], beforeExhArray: Orders[] }) {


    const [chart, setChart] = useState<UpDownResult[]>([]);
    const materialCheckTotal = (orders: Orders[]): materialMap => {

        if (!orders) {
            return {};
        }
        const materialCount: materialMap = {};

        orders.forEach(order => {
            order.orderitems.forEach(oi => {
                oi.materials.forEach(m => {
                    const mKey = m.key;
                    materialCount[mKey] = (materialCount[mKey] || 0) + 1;
                })
            })
        })

        return materialCount;
    }

    const caculResult = () => {

        const curMonthSum = materialCheckTotal(exhArray);
        const pastMonthSum = materialCheckTotal(beforeExhArray);

        const upperMaterial: string[] = [];
        materials.forEach(m => { upperMaterial.push(m.toUpperCase()) });

        const all = new Set([...upperMaterial, ...Object.keys(curMonthSum), ...Object.keys(pastMonthSum)]);
        const results: UpDownResult[] = [];

        all.forEach(item => {
            const cur = curMonthSum[item] || 0;
            const past = pastMonthSum[item] || 0;

            let percent = 0;
            let state: UpDownResult['state'] = 'same';

            if (past === 0 && cur > 0) {
                percent = 100;
                state = 'new'
            } else if (cur > 0 && past > 0) {
                percent = ((cur - past) / past) * 100;
                state = percent > 0 ? 'up' : (percent < 0 ? 'down' : 'same');
            } else if (cur === 0 && past > 0) {
                percent = -100;
                state = 'down';
            }

            results.push({
                item,
                cur,
                past,
                percent: parseFloat(percent.toFixed(1)),
                state
            })
        })
        setChart(results);
    }


    useEffect(() => {
        caculResult();
    }, [exhArray, beforeExhArray])


    const percent = () => {

        if (occurNum === 0 || exhNum === 0) {
            return 0;
        } else {
            return ((exhNum / occurNum) * 100).toFixed(0);
        }
    }

    const recommnad = (per: number) => {

        if (per >= 80) {
            return "대단해요! 환경 지킴이로 활약 중이시군요!"
        } else if (per >= 50) {
            return "절반 달성! 나머지 재활용도 함께 클리어해요!"
        } else if (per >= 20) {
            return "곧 수거일이 다가와요! 슬슬 준비해 볼까요?"
        } else {
            return "시작이 반! 첫 재활용 기록부터 만들어보세요."
        }
    }

    const CO2_SAVING_MATERIAL: CO2Props = {
        "PET": 0.05,
        "CAN": 0.25,
        "PAPER": 0.15,
        "PAPER_PACK": 0.15,
        "VINYL": 0.01,
        "PLASTIC": 0.05,
        "GLASS": 0.10,
        "STYROFOAM": 0.12,
    }

    const totalCO2saved = () => {

        const total = exhArray.reduce((sum, order) => {
            const save = order.orderitems.reduce((oiSum, oi) => {

                const save = oi.materials.reduce((mSum, m) => {
                    const save = CO2_SAVING_MATERIAL[m.key] || 0;
                    return mSum + save;
                }, 0)

                return oiSum + save
            }, 0)

            return sum + save;
        }, 0)

        return total.toFixed(2);
    }

    return (
        <>
            <div className="my-waste-wrap"
                style={{ textAlign: "left" }}>
                <div
                    style={{
                        fontSize: "1.3rem",
                        fontWeight: 'bold',
                        margin: "1.45rem 0rem 0.3rem 0rem",
                        paddingBottom: "0.5rem",
                        borderBottom: "1px solid rgba(80, 80, 80, 0.25)",
                    }}>나의 배출 현황</div>
                <div style={{ marginBottom: "1.3rem", marginLeft: '0.5rem', }}>나의 배출 현황을 돌아보는 시간이에요!</div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ ...cardWrap, maxWidth: "17.9rem" }}>
                        <div style={cardTitle}>🌳현재 배출율</div>
                        <div style={cardDiscription}>{recommnad(Number(percent()))}</div>
                        <div style={{ ...cardPer }}>{percent()}<span style={{ fontSize: "1.8rem" }}>%</span></div>
                        <div style={cardTitle}>🌏절감된 CO2량</div>
                        <div style={cardDiscription}>분리수거로 절감한 CO2량이에요!</div>
                        <div style={cardPer}>{totalCO2saved()}<span style={{ fontSize: "1rem" }}>CO₂</span></div>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3,18.5rem)',
                        gap: "0.2rem",
                        ...cardWrap,
                    }}>
                        <div style={{ gridColumn: '1/4', ...cardTitle, marginTop: "-.3rem", marginBottom: "0.9rem" }}>🔄️품목별 증감률
                            <span style={{ marginLeft: ".5rem", fontSize: "0.97rem", fontWeight: "500", opacity: ".8" }}>지난달과 비교하여 얼마나 배출했는지 확인해보세요!</span></div>
                        {chart.map((c, index) => (
                            <div
                                className="up-down-result"
                                style={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    color: colorSelect(c.state),
                                    padding: "0.2rem 0.5rem",
                                    border: "1px solid rgba(140, 140, 140, .25)",
                                    fontSize: "1.05rem",
                                }} key={index}>
                                <div>{matchTitle[c.item.toLowerCase()]}</div>
                                <div>{c.percent}%<span>{imgSelect(c.state)}</span></div>
                            </div>
                        ))

                        }
                    </div>
                </div>
            </div >
        </>
    )
}

const cardTitle: CSSProperties = {
    fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.3rem"
}

const cardDiscription: CSSProperties = {
    marginBottom: "0.3rem"
}

const cardPer: CSSProperties = {
    fontSize: "2rem", fontWeight: "bold", textAlign: "right"
}
const cardWrap: CSSProperties = {
    padding: "1.5rem 2rem",
    background: "rgba(255, 255, 255, 0.45)" /* 반투명 흰색 */,
    backdropFilter: " blur(20px)" /* 배경 블러 */,
    boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "0.7rem",
}

export default MyWasteCurrent;

