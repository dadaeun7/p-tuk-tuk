import { useCallback, useEffect, useState } from "react";
import { EMAIL_REG } from "../../../config";
import {
  codeSubmitPreven,
  reqCommonFunc,
  type btnProps,
} from "./joinCommonConfig";
import JoinEmailCode from "./JoinEmailCode";
import JoinInputBtn from "./JoinInputBtn";
import JoinStepLayoutFoot from "./JoinStepLayoutFoot";
import JoinStepLayoutTop from "./JoinStepLayoutTop";

function JoinEmail() {
  // email 값, 유효성 검증
  const [email, setEmail] = useState("");
  const emailIsValid = EMAIL_REG.test(email);

  // email 관련 실시간 에러 메세지
  const [emailError, setEmailError] = useState("");

  // 인증 코드 show 여부
  const [codeShow, setCodeShow] = useState(false);

  // holder 설정
  const [holder, setHolder] = useState("이메일을 입력해주세요");

  // email 로 code 요청
  const emailReqPath = "/join/email-send"; // api path
  const emailVerificationReq = useCallback(
    () =>
      reqCommonFunc(
        emailReqPath,
        emailIsValid,
        email,
        setCodeShow,
        setEmailError
      ),
    [emailReqPath, emailIsValid, email, setCodeShow, setEmailError]
  );

  // input Props 값 세팅
  const joinEmailInputProp: btnProps = {
    tag: "email",
    type: "email",
    holder: holder,
    inEnable: codeShow,
    setVal: setEmail,
    reqFunc: emailVerificationReq,
  };

  const emailTopProps = {
    type: "email",
    title: "이메일 인증",
    description: "tuktuk 계정 이메일 가입",
  };

  // 이메일 관련 에러 메세지
  useEffect(() => {
    if (!emailIsValid && email.length > 0) {
      setEmailError("유효하지 않은 이메일 형식입니다.");
      return;
    }
    setEmailError("");
  }, [emailIsValid, email]);

  // 렌더시 이메일 인증코드 발송여부 확인
  useEffect(() => {
    if (codeShow) {
      localStorage.setItem("request", "ok");
      codeSubmitPreven(email, codeShow);
    }

    //localStorage 체크 후, 유효시간 지난 경우 활성화
    const emailEnable = codeSubmitPreven(email, codeShow);

    if (emailEnable === true) {
      setCodeShow(false);
      setHolder("이메일을 입력해주세요");
    } else {
      setCodeShow(true);
      setHolder(localStorage.getItem("email")!);
    }
  }, [codeShow, email]);

  return (
    <div className="join-email">
      <JoinStepLayoutTop
        type={emailTopProps.type}
        title={emailTopProps.title}
        description={emailTopProps.description}
      />
      <JoinInputBtn data={joinEmailInputProp} />
      <div
        className="email-error-msg"
        style={{ textAlign: "right", color: "#FF6464" }}
      >
        {emailError}
      </div>
      {codeShow && <JoinEmailCode show={codeShow} />}
      <JoinStepLayoutFoot />
    </div>
  );
}

export default JoinEmail;