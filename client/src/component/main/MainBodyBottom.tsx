import { motion } from "framer-motion";
import "../../css/main-body-bottom.css";

interface how_recommand_set {
  category: string;
  title: string;
  content: string;
  icon: string;
}

const howRecommand: how_recommand_set[] = [
  {
    category: "gmail",
    title: "📩 Gmail 연동",
    content:
      "앱에 Gmail을 연동하면 주문 메일을 자동으로 분석 및, 사용자는 별도 입력없이 메일만 연결해도 배출 안내를 받을 수 있습니다.",
    icon: "gmail-connect-icon.svg",
  },
  {
    category: "mail",
    title: "🧑‍💻 메일 분석",
    content:
      "위 메일에서 상품명과 포장 정보 추출과 포장재를 분석합니다. 앞선 데이터로 기초를 마련합니다.",
    icon: "mail-analyze-icon.svg",
  },
  {
    category: "trash",
    title: "🤲 분리방법 추천",
    content:
      "분석된 포장재 정보는 거주 지역의 배출 규칙과 연결, 올바른 분리수거 방법으로 안내됩니다. ",
    icon: "trash-recommand-icon.svg",
  },
  {
    category: "data",
    title: "📈 통계 도출",
    content:
      "사용자가 기록한 배출 데이터를 바탕으로 월간 통계를 제공하여, 올바른 배출을 실천했는지 한눈에 확인 가능합니다.",
    icon: "sum-data-icon.svg",
  },
];

const gapEffect = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChidren: 0.2,
    },
  },
};

const upDownEffect = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function MainBodyBottom() {
  return (
    <div className="main-body-bottom" style={{ padding: "2rem" }}>
      <div className="main-body-bottom-header">
        <div className="main-body-bottom-header-text" style={{ marginTop: "-0.5rem" }}>
          tuktuk의 스마트한 분리수거 추천 방식✨
        </div>
      </div>
      <motion.div
        variants={gapEffect}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
        className="main-body-bottom-content"
      >
        {howRecommand.map((element, index) => (
          <motion.div
            key={index}
            variants={upDownEffect}
            className={"main-body-bottom-content-" + element.category}
          >
            <div className={"main-body-bottom-" + element.category + "header"}>
              <div
                className={
                  "main-body-bottom-content-" + element.category + "-title"
                }
              >
                {element.title}
              </div>
            </div>
            <div
              className={
                "main-body-bottom-content-" + element.category + "-content"
              }
            >
              {element.content}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default MainBodyBottom;
