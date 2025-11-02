import React, { useState } from 'react';
import { BACK, localUser } from '../config';
import { useMyModal } from '../contexts/MyModal';

// ------------------------------------
// 1. 타입 정의 (Typescript Interface)
// ------------------------------------
interface TableRow {
    id: number;
    originalName: string;
    item: string; // 매칭 아이템
    material: string; // 매칭 소재
    description: string;
    isChecked: boolean;
}

// interface RequestItem {
//     id: number;
//     originalName: string;
//     matchedItem: string;
// }

// ------------------------------------
// 2. 초기 데이터 및 상수
// ------------------------------------
const initialData: TableRow[] = [
    { id: 1, originalName: '사과.jpg', item: '과일', material: '레드', description: '싱싱한 사과', isChecked: false },

];

function AdminTable() {
    const [tableData, setTableData] = useState<TableRow[]>(initialData);
    const [hover, setHover] = useState<boolean>(false);

    const { openModal } = useMyModal();
    // ------------------------------------
    // 3. 이벤트 핸들러
    // ------------------------------------

    // 체크박스 핸들러
    const handleCheckboxChange = (id: number): void => {
        setTableData(prevData =>
            prevData.map(row =>
                row.id === id ? { ...row, isChecked: !row.isChecked } : row
            )
        );
    };

    const cacheReset = async () => {
        const uri = "/keyword/delete";
        const res = await fetch(`${BACK}${uri}`, {
            method: "POST",
            credentials: "include"
        })

        if (!res.ok) {
            openModal(<div>캐시가 삭제에 문제가 생겼습니다. 로그를 확인해주세요.</div>);
            return;
        }

        openModal(<div>캐시가 정상적으로 삭제 되었습니다.</div>);
    }
    // ------------------------------------
    // 4. 렌더링
    // ------------------------------------
    return (
        <>
            <div style={styles.container}>
                <div style={styles.top}>
                    <div style={styles.loginInfo}><strong style={{ color: "#929292ff" }}>🧑‍🔧로그인 계정 | {localUser().myId}</strong>
                        <span
                            style={hover ? styles.logoutHover : styles.logout}
                            onMouseOver={() => { setHover(true) }}
                            onMouseOut={() => { setHover(false) }}
                        >로그아웃</span>
                    </div>
                    <h1 style={styles.header}>👮‍♂️관리자 페이지</h1>
                    <span style={styles.topBtn}>AI 추천 내용</span>
                    <div
                        style={{
                            backgroundColor: "#292929ff",
                            color: "#fff",
                            padding: "0.8rem 1.3rem",
                            marginTop: "1rem",
                        }}
                        onClick={() => {
                            cacheReset();
                        }}>keyword 캐시 초기화</div>
                </div>

                {/* Table 영역 */}
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeaderRow}>
                                <th style={{ ...styles.th, width: '5%' }}>선택</th>
                                <th style={{ ...styles.th, width: '25%' }}>원본명</th>
                                <th style={styles.th}>매칭 아이템</th>
                                <th style={styles.th}>매칭 소재</th>
                                <th style={styles.th}>매칭 설명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} style={row.isChecked ? styles.tableRowChecked : styles.tableRow}>
                                    <td style={styles.tdCenter}>
                                        <input
                                            type="checkbox"
                                            checked={row.isChecked}
                                            onChange={() => handleCheckboxChange(row.id)}
                                            style={styles.checkbox}
                                        />
                                    </td>
                                    <td style={styles.td}>{row.originalName}</td>
                                    <td style={styles.td}>{row.item}</td>
                                    <td style={styles.td}>{row.material}</td>
                                    <td style={styles.td}>{row.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 버튼 영역 */}
                {/* <div style={styles.buttonContainer}>
                    <button
                        onClick={handleSubmit}
                        style={styles.button}
                    >
                        매칭 키워드로 추가 ({tableData.filter(row => row.isChecked).length})
                    </button>
                </div> */}
            </div>
        </>

    );
};

export default AdminTable;

// ------------------------------------
// 5. 인라인 스타일 (CSS-in-JS 유사)
// ------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
    loginInfo: {
        textAlign: "right",
    },
    logout: {
        marginLeft: "1rem",
        padding: "0.3rem 1rem",
        borderRadius: "0.5rem",
        border: "0.1rem solid #3498db",
        color: "#3498db"
    },
    logoutHover: {
        marginLeft: "1rem",
        padding: "0.3rem 1rem",
        border: "0.1rem solid transparent",
        borderRadius: "0.5rem",
        background: "#3498db",
        color: "#fff",
        transition: "all .3s"
    },
    container: {
        textAlign: "left",
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f4f7f9', // 밝은 배경
        borderRadius: '8px',
    },
    topBtn: {
        padding: "0.5rem 2rem",
        border: "0.1rem solid #3498db",
        borderRadius: "0.5rem",
        color: "#3498db",
        cursor: "pointer"
    },
    top: {
        borderBottom: '2px solid #bdc3c7',
        paddingBottom: '2rem',
        marginBottom: '20px',
    },
    header: {
        color: '#2c3e50',
        textAlign: "left"
    },
    tableContainer: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '6px',
        overflow: 'hidden', // 테이블 모서리 둥글게
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
    },
    tableHeaderRow: {
        backgroundColor: '#3498db', // 헤더 색상
        color: 'white',
        fontSize: '14px',
        textTransform: 'uppercase',
    },
    th: {
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: '600',
    },
    tableRow: {
        borderBottom: '1px solid #ecf0f1', // 구분선
        transition: 'background-color 0.3s',
    },
    tableRowChecked: {
        borderBottom: '1px solid #ecf0f1',
        backgroundColor: '#e8f6e8', // 체크된 행 강조 (옅은 녹색)
        transition: 'background-color 0.3s',
    },
    td: {
        padding: '12px 15px',
        fontSize: '14px',
        color: '#34495e',
        textAlign: 'left'
    },
    tdCenter: {
        padding: '12px 15px',
        textAlign: 'center',
    },
    checkbox: {
        transform: 'scale(1.2)', // 체크박스 키우기
        cursor: 'pointer',
    },
    buttonContainer: {
        marginTop: '25px',
        textAlign: 'right',
    },
    button: {
        padding: '12px 25px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        backgroundColor: '#2ecc71', // 버튼 색상
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s',
    },
};