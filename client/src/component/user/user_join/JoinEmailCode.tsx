import { useCallback, useEffect, useState } from "react";
import CountDown from "./CountDown";
import { reqCommonFunc, type btnProps } from "./joinCommonConfig";
import JoinInputBtn from "./JoinInputBtn";

interface Props {
  show: boolean;
}

function JoinEmailCode(props: Props) {
  // code 정규식
  const CODE_REG = /^\d{6}$/;

  // code 값, 유효성 검증
  const [code, setCode] = useState("");
  const codeValid = CODE_REG.test(code);

  // request 완료 여부 (input disable 설정을 위함)
  const [reqSuc, setReqSuc] = useState(false);

  // code 관련 실시간 에러 메세지
  const [codeError, setCodeError] = useState("");

  // code 인증 요청
  const codeReqPath = "/join/code-send"; // api path
  // const codeVerificationReq = reqCommonFunc(codeReqPath, codeValid, code, setReqSuc);

  const codeVerificationReq = useCallback(
    () => reqCommonFunc(codeReqPath, codeValid, code, setReqSuc, setCodeError),
    [codeReqPath, codeValid, code, setReqSuc, setCodeError]
  );
  // code input props setting
  const joinInputProp: btnProps = {
    tag: "code",
    type: "number",
    holder: "인증번호를 입력해주세요",
    inEnable: reqSuc,
    setVal: setCode,
    reqFunc: codeVerificationReq,
  };

  useEffect(() => {
    if (localStorage.getItem("request") !== "ok") {
      setReqSuc(false);
    }

    if (reqSuc === true) {
      localStorage.removeItem("request");
      localStorage.setItem("auth-success", "ok");
      location.reload();
    }
  }, [reqSuc]);

  useEffect(() => {
    if (code === "") {
      setCodeError("");
    } else if (!codeValid) {
      setCodeError("인증번호는 6자리 숫자입니다.");
    } else {
      setCodeError("");
    }
  }, [code, codeValid]);

  return (
    <>
      <JoinInputBtn data={joinInputProp} />
      <div
        className="code-error-msg"
        style={{ textAlign: "right", color: "#FF6464" }}
      >
        {codeError}
      </div>
      {props.show && <CountDown />}
    </>
  );
}

export default JoinEmailCode;