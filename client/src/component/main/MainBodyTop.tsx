import { useEffect, useState } from "react";
import "../../css/main-body-top.css";

type Introduce_set = {
  category: string;
  title: string;
  content: string;
  img: string;
  prov1: string;
  prov1Name: string;
  prov2: string;
  prov2Name: string;
};

const introduce: Introduce_set[] = [
  {
    category: "main",
    title: "작은 습관으로 지구를 바꿔요",
    content:
      "매일 실천하는 작은 분리배출 습관이 모여 지구 환경을 지키는 큰 힘이 됩니다.\ntuktuk의 분리배출 추천 서비스를 이용해보세요",
    img: "main-2.jpg",
    prov1:
      "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%88%B2%EC%9D%98-%EB%82%98%EB%AC%B4-jFCViYFYcus?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov1Name: "Unsplash",
    prov2:
      "https://unsplash.com/ko/@szmigieldesign?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov2Name: "Lukasz Szmigiel",
  },
  {
    category: "mail",
    title: "메일 분석과 분리수거 자동 추천",
    content:
      "주문 메일을 분석하여 필요한 분리배출 정보를 자동으로 안내해줍니다. \n사용자는 별도의 입력 없이도 편리하게 올바른 배출 방법을 확인할 수 있습니다.",
    img: "main-1.jpg",
    prov1:
      "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%ED%8C%8C%EB%9E%80%EC%83%89%EA%B3%BC-%ED%9D%B0%EC%83%89-%EB%A1%9C%EA%B3%A0-%EC%B6%94%EC%B8%A1-%EA%B2%8C%EC%9E%84-LPZy4da9aRo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov1Name: "Unsplash",
    prov2:
      "https://unsplash.com/ko/@brett_jordan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov2Name: "Brett Jordan",
  },
  {
    category: "recommand",
    title: "지역에 맞춘 배출일과 수거방법 추천",
    content:
      "지역별로 다른 쓰레기 배출 요일과 방법을 확인하고 맞춤형으로 추천받을 수 있습니다. \n더 이상 배출일을 놓치지 않고 규정에 맞게 처리할 수 있습니다.",
    img: "main-3.jpg",
    prov1:
      "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%B3%B4%EB%8F%84-%EC%9C%84%EC%97%90-%EC%95%89%EC%95%84%EC%9E%88%EB%8A%94-%EC%93%B0%EB%A0%88%EA%B8%B0%ED%86%B5-7M2Ljcw6PHI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov1Name: "Unsplash",
    prov2:
      "https://unsplash.com/ko/@borisview?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov2Name: "boris misevic",
  },
  {
    category: "ocr",
    title: "OCR로 영수증 분석 및 수거 방법 추천",
    content:
      "영수증을 사진으로 찍으면 OCR 기술이 구매 품목을 분석하여 분리배출 방법을 알려줍니다. \n복잡한 포장재도 쉽게 구분할 수 있도록 도와줍니다.",
    img: "main-4.jpg",
    prov1:
      "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%8F%B0%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EC%82%AC%EB%9E%8C%EC%9D%98-%EC%84%A0%ED%83%9D%EC%A0%81-%EC%B4%88%EC%A0%90-%EC%B4%AC%EC%98%81-mw6Onwg4frY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov1Name: "Unsplash",
    prov2:
      "https://unsplash.com/ko/@freestocks?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    prov2Name: "freestocks",
  },
];

function MainBodyTop() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 500) setStep(0);
      else if (y < 1000) setStep(1);
      else if (y < 1500) setStep(2);
      else setStep(3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="main-body-top-wrap"
      style={{
        height: `${introduce.length * 80}vh`,
        whiteSpace: "pre-line",
      }}
    >
      <div
        className="main-body-top"
        style={{
          position: "sticky",
          top: 80,
          height: "80vh",
          overflow: "hidden",
          borderRadius: "1.4rem",
        }}
      >
        {introduce.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundImage: `url(/${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              padding: "0 80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
              boxSizing: "border-box",

              /* 페이드 효과 */
              opacity: step === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          >
            <div
              className="overlay"
              style={{
                padding: "0 30px",
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)", // 반투명 검정
                zIndex: 1,
              }}
            >
              <div
                style={{
                  transform:
                    step === index ? "translateY(0)" : "translateY(30px)",
                  opacity: step === index ? 1 : 0,
                  transition: "all 0.8s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  height: "100%",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "55px",
                    fontWeight: "bolder",
                    textAlign: "center",
                    lineHeight: "1.3",
                    marginBottom: "35px",
                    marginTop: "-40px",
                    marginLeft: "-6rem",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    maxWidth: "800px",
                    lineHeight: "1.6",
                    marginLeft: "-6rem",
                  }}
                >
                  {item.content}
                </div>
                <div
                  className="source-wrap"
                  style={{
                    fontSize: "12px",
                    position: "absolute",
                    bottom: "10px",
                    right: "40px",
                    opacity: 0.7,
                  }}
                >
                  <a href={item.prov1}>{item.prov1Name}</a> 의{" "}
                  <a href={item.prov2}>{item.prov2Name}</a>
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: "50px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {introduce.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        marginRight: "-7rem",
                        borderRadius: "50%",
                        border: step === index ? "none" : "solid 1.8px",
                        width: step === index ? "13px" : "8px",
                        height: step === index ? "13px" : "8px",
                        background:
                          step === index ? "#ffffffff" : "transparent",
                        transition: "all 0.5s easeOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainBodyTop;
