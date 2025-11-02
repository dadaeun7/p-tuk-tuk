import type { CSSProperties } from "react";

export const BACK: string = import.meta.env.VITE_API_URL;
// email 정규식
export const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// password 정규식
export const PASSWORD_REG =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,19}$/;
export const PASSWORD_BLANK_NO = /^\S+$/;

// login password
export const PASSWORD_LOGIN_REG = /^\S{8,}$/;

// style, myPage
export const whiteBackground = "radial-gradient(ellipse closest-side, rgba(255, 255, 255, 1), rgba(246, 246, 246, 1))"

export const colorBackground = "linear-gradient(90deg,rgba(168, 223, 255, 0.8) 0%,rgba(96, 213, 87, 0.8) 85%)";

export const zoneToDate = (zone: number) => {

  let jsDate;

  if (String(zone).length === 13) {
    jsDate = new Date(zone);
  }

  jsDate = new Date(zone * 1000);

  return jsDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const blurStyle = {
  /*glass effect - start*/
  background: "rgba(255, 255, 255, 0.45)" /* 반투명 흰색 */,
  backdropFilter: " blur(20px)" /* 배경 블러 */,
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
  /*glass effect - end*/
};

export const filterBlurStyle = {
  /*glass effect - start*/
  background: "rgba(255, 255, 255, 0.5)",
  backdropFilter: " blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
  /*glass effect - end*/
};

export const filterBlurStyle2 = {
  /*glass effect - start*/
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: " blur(20px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
  /*glass effect - end*/
};

export const boldBlurStyle = {
  /*glass effect - start*/
  background: "rgba(255, 255, 255, 0.45)" /* 반투명 흰색 */,
  backdropFilter: " blur(1px)" /* 배경 블러 */,
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)",
  /*glass effect - end*/
};

export const myPageRight: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: "140vh",
  minHeight: "86vh",
  margin: "2rem 0rem 0rem 20rem",
  padding: "2rem 5rem",
  gap: "18px",
  ...boldBlurStyle
};

export function findVendor(keyword: string) {
  return vendorMatch.find(m => m.ko === keyword)?.name;
}

export const vendorMatch = [
  { name: "COUPANG", ko: "쿠팡" },
  { name: "BAEMIN", ko: "배민 장보기" },
  { name: "KERLY", ko: "컬리" },
  { name: "OCR", ko: "ocr" }
]

type recycleProp = {
  name: string;
  color: string;
};
// material 관련 설정은 무조건 아래 순서로 지켜야함
// 캔(can) ->
// 종이(paper) ->
// 비닐(vinyl) ->
// 플라스틱(plastic) ->
// 스티로폼(styrofoam) ->
// 일반(generalWaste) ->
// 유리(glass)

export const materials = [
  "pet",
  "can",
  "paper",
  "paper_pack",
  "vinyl",
  "plastic",
  "styrofoam",
  "glass",
  "general_waste",
  "special_disposal"
];

interface MatchTitle {
  key: string,
  name: string,
}

export const matchKeyName: MatchTitle[] = [
  {
    key: "PET",
    name: "페트"
  },
  {
    key: "CAN",
    name: "캔"
  },
  {
    key: "PAPER",
    name: "종이"
  }, {
    key: "PAPER_PACK",
    name: "종이팩"
  }, {
    key: "VINYL",
    name: "비닐류"
  }, {
    key: "PLASTIC",
    name: "플라스틱"
  },
  {
    key: "STYROFOAM",
    name: "스티로폼"
  },
  {
    key: "GLASS",
    name: "유리"
  }, {
    key: "GENERAL_WASTE",
    name: "일반"
  }, {
    key: "SPECIAL_DISPOSAL",
    name: "특수처리"
  },
]

export const matchTitle: Record<string, string> = {
  pet: "🧋페트",
  can: "🥫캔",
  paper: "🗞️종이",
  paper_pack: "📦종이팩",
  vinyl: "🛍️비닐류",
  plastic: "🧴플라스틱",
  styrofoam: "🧊스티로폼",
  glass: "🥛유리",
  general_waste: "🗑️일반",
  special_disposal: "🧑‍🔧특수처리"
};
export const recycleColor: recycleProp[] = [
  { name: "페트", color: "rgba(158, 225, 253, 1)" },
  { name: "캔", color: "rgba(168, 197, 209, 1)" },
  { name: "종이", color: "rgba(249, 225, 181, 1)" },
  { name: "종이팩", color: "" },
  { name: "비닐류", color: "rgba(198, 215, 114, 1)" },
  { name: "플라스틱", color: "rgba(237, 158, 134, 1)" },
  { name: "스티로폼", color: "rgba(190, 153, 210, 1)" },
  { name: "유리", color: "rgba(148, 242, 197, 1)" },
  { name: "일반", color: "rgba(148, 242, 197, 1)" },
  { name: "특수처리", color: "rgba(148, 242, 197, 1)" },
];

export const recycleGraColor: recycleProp[] = [
  {
    name: "페트",
    color:
      "radial-gradient(circle, rgba(158, 225, 253, 1), rgba(158, 225, 253, 0.3))",
  },
  {
    name: "캔",
    color:
      "radial-gradient(circle, rgba(168, 197, 209, 1), rgba(168, 197, 209, 0.3))",
  },
  {
    name: "종이",
    color:
      "radial-gradient(circle, rgba(249, 225, 181, 1), rgba(249, 225, 181, 0.3))",
  },
  {
    name: "종이팩",
    color:
      "radial-gradient(circle, rgba(249, 225, 181, 1), rgba(249, 225, 181, 0.3))",
  },
  {
    name: "비닐류",
    color:
      "radial-gradient(circle, rgba(198, 215, 114, 1), rgba(198, 215, 114, 0.3))",
  },
  {
    name: "플라스틱",
    color:
      "radial-gradient(circle, rgba(237, 158, 134, 1), rgba(237, 158, 134, 0.3))",
  },
  {
    name: "스티로폼",
    color:
      "radial-gradient(circle, rgba(190, 153, 210, 1), rgba(190, 153, 210, 0.3))",
  },
  {
    name: "유리",
    color:
      "radial-gradient(circle, rgba(148, 242, 197, 1), rgba(148, 242, 197, 0.3))",
  },
  {
    name: "일반",
    color:
      "radial-gradient(circle, rgba(148, 242, 197, 1), rgba(148, 242, 197, 0.3))",
  },
  {
    name: "특수처리",
    color:
      "radial-gradient(circle, rgba(148, 242, 197, 1), rgba(148, 242, 197, 0.3))",
  },
];

export const localUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const modifyUser = (index: string, keyName: string) => {
  const currentUserInfo = localUser();

  switch (keyName) {
    case 'location':
      currentUserInfo.location = index;
      break;
    case 'email':
      currentUserInfo.email = index
      break;
    default:
      console.log('일치하는 값이 없습니다');
  }

  const updateUserInfo = JSON.stringify(currentUserInfo);
  localStorage.setItem("user", updateUserInfo);
}

