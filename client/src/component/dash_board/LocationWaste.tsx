import { localUser } from "../../config";
import location from "../../data/location.json";
import "../../css/dashboard-body.css";
interface WasteRules {
    [key: string]: string | undefined
}

interface Waste {
    residence_type: string,
    rules: WasteRules;
}

interface Source {
    title: string;
    url: string;
}

interface Location {
    search_keyword: string,
    region: string,
    source: Source,
    waste_collection_rules: Waste[]
}

interface TransformedRule {
    key: string;
    title: string;
    content: string;
    order: number;
}

function LocationWaste() {

    const foundData = findRegionData(location, localUser().location);

    return (<>
        <div className="location-waste-wrap"
            style={{ textAlign: "left", marginTop: "1.5rem" }}>
            <div
                style={{
                    fontSize: "1.3rem",
                    fontWeight: 'bold',
                    margin: "2rem 0rem 0.3rem 0rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid rgba(80, 80, 80, 0.25)",
                }}>내 지역 쓰레기 배출 방법</div>
            <div style={{ marginBottom: "1.3rem", marginLeft: '0.5rem', }}>헷갈렸던 내 지역의 배출방법! 아래 배출 방법에 맞춰서 올바르게 배출해보세요!</div>
            <div style={{
            }}
            >
                {foundData?.waste_collection_rules.map((rule, index) => {
                    const transRules = transformRules(rule.rules);
                    return (
                        <div
                            className="rule-wrap"
                            key={index}
                            style={{
                                display: 'flex',
                                padding: "1.7rem 2rem",
                                alignItems: "center",
                                background: "rgba(255, 255, 255, 0.45)" /* 반투명 흰색 */,
                                backdropFilter: " blur(20px)" /* 배경 블러 */,
                                boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
                                borderRadius: "0.7rem",
                                marginBottom: "1rem",
                            }}>
                            <div className="rule-title"
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    marginRight: "3rem"
                                }}
                            >{rule.residence_type}
                            </div>
                            <div style={{}}>
                                {transRules.map((r, ri) => (
                                    <div key={ri}
                                        style={{
                                            display: 'flex',
                                            alignItems: "center",
                                            gap: "1rem",
                                            padding: "0.42rem",
                                        }}>
                                        <div style={{ fontWeight: 'bold' }}>🗑️{r.title}</div>
                                        <div style={{ fontSize: "1.05rem" }}>{r.content}</div>
                                    </div>
                                ))}

                            </div>
                        </div>)
                })}
            </div>
            <div style={{ padding: "0.5rem 1rem", textAlign: "center", lineHeight: "1.5rem" }}>현재 더 자세하게 정보를 제공을 위해 지속적으로 업데이트 중입니다.<br /> 정보가 없는 경우 각 구청 홈페이지에서 참고 부탁드립니다.</div>
        </div>
    </>)
}

const findRegionData = (location: Location[], userInput: string) => {

    const userInputTrim = userInput.trim();
    const userParts = userInputTrim.split(/\s+/).filter((part: string) => part.length > 0);
    if (userParts.length === 0) return undefined;

    let foundData = location.find(item => item.region.includes(userInputTrim));
    if (foundData) return foundData;

    const allPartsMatch = (item: Location) => userParts.every(part => item.region.includes(part));
    foundData = location.find(allPartsMatch);

    if (foundData) return foundData;

    const guName = userParts[userParts.length - 1];

    if (guName !== undefined && guName.length > 1) {
        foundData = location.find(item => item.region.endsWith(guName));
        if (foundData) return foundData;
    }

    return undefined;
}

const transformRules = (rulesObject: WasteRules | null | undefined): TransformedRule[] => {

    if (!rulesObject) {
        return [];
    }

    /** @param "정보_요약" 은 
     * "명확한 배출 요일 및 시간 정보는 검색 결과에서 확인되지 않음. 
     * 구청 생활폐기물 배출 안내를 별도 확인 필요." 
     * 로 명시되어있음 */
    const ruleOrder = [
        "배출_시간", "배출_시간_여름", "배출_시간_겨울",
        "배출_요일", "배출_요일_그룹1", "배출_요일_그룹2",
        "수거_체계", "동별_예시1", "동별_예시2", "동별_예시3",
        "배출_금지일", "정보_요약", "배출_원칙",
        "배출_시간_골목길", "배출_시간_도로변",
        "수거_주기", "수거_요일", "평일_배출_정보",
        "특이사항", "공휴일_규정", "배출_장소", "공통주택_예외"
    ];

    const transformedRulse: TransformedRule[] = [];

    for (const key in rulesObject) {
        if (Object.prototype.hasOwnProperty.call(rulesObject, key)) {

            const value = rulesObject[key];

            let title = key.replace(/_/g, ' ');

            if (key.startsWith("배출_요일_그룹")) {
                title = "배출 요일(지역 그룹)"
            } else if (key === "정보_요약") {
                title = "각 시청/군청 홈페이지 확인 필요"
            } else if (key.startsWith("동별_예시")) {
                title = "동별 예시(동 그룹)"
            }

            transformedRulse.push({
                key: key,
                title: title,
                content: value,
                order: ruleOrder.indexOf(key) !== -1 ? ruleOrder.indexOf(key) : 99
            } as TransformedRule)
        }
    }

    return transformedRulse?.sort((a, b) => a.order - b.order);
}

export default LocationWaste;