import { useEffect, useState } from "react";
import { PASSWORD_BLANK_NO, PASSWORD_REG } from "../../../config";
import { type btnProps } from "./joinCommonConfig";
import JoinInputBtn from "./JoinInputBtn";
import JoinPasswordSubmit from "./JoinPasswordSubmit";
import JoinStepLayoutFoot from "./JoinStepLayoutFoot";
import JoinStepLayoutTop from "./JoinStepLayoutTop";

function JoinPassword() {
  const passwordTopProps = {
    type: "password",
    title: "비밀번호 설정",
    description: "tuktuk 계정의 비밀번호 설정해 주세요.",
  };

  const [password, setPwd] = useState("");
  const [passwordCheck, setpasswordCheck] = useState("");

  const passwordValid =
    PASSWORD_REG.test(password) && PASSWORD_BLANK_NO.test(password);

  // 패스워드 2개 모두 적합한지
  const [allSuccess, setAllSuccess] = useState("");

  useEffect(() => {
    setAllSuccess(passwordValid && password === passwordCheck ? "ok" : "");
  }, [password, passwordCheck]);

  const joinPwdInputProp1: btnProps = {
    tag: "password",
    type: "password",
    holder: "대/소문자+숫자+특수문자 8~19자",
    inEnable: undefined,
    setVal: setPwd,
    // 다른 컴포넌트에서 api 호출할 예정
    reqFunc: undefined,
  };

  const joinPwdInputProp2: btnProps = {
    tag: "password-chk",
    type: "password",
    holder: "비밀번호 다시 입력해주세요",
    inEnable: undefined,
    setVal: setpasswordCheck,
    // 다른 컴포넌트에서 api 호출할 예정
    reqFunc: undefined,
  };

  return (
    <div className="join-password">
      <JoinStepLayoutTop
        type={passwordTopProps.type}
        title={passwordTopProps.title}
        description={passwordTopProps.description}
      />
      <JoinInputBtn data={joinPwdInputProp1} />
      <JoinInputBtn data={joinPwdInputProp2} />
      <JoinPasswordSubmit password={password} state={allSuccess} />
      <JoinStepLayoutFoot />
    </div>
  );
}

export default JoinPassword;