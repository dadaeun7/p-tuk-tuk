import { type Dispatch, type SetStateAction } from "react";
import { BACK } from "../../../config";

export interface btnProps {
  tag: string;
  type: string;
  holder: string;
  inEnable: boolean | undefined;
  setVal: Dispatch<SetStateAction<string>>;
  reqFunc: (() => Promise<void>) | undefined;
}

export const nowTime = new Date().toLocaleString("ko-KR", {
  timeZone: "Asia/Seoul",
});

// use component : JoinEmail.tsx , JoinEmailCode.tsx
export async function reqCommonFunc(
  path: string,
  regBoole: boolean,
  jsonBody: string,
  reqFunc: Dispatch<SetStateAction<boolean>>,
  err: Dispatch<SetStateAction<string>>
) {
  if (!regBoole) return;

  const convertObject =
    localStorage.getItem("request") === "ok"
      ? {
        email: localStorage.getItem("email"),
        code: jsonBody,
      }
      : { email: jsonBody };

  const result = await fetch(`${BACK}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(convertObject),
  });

  if (!result.ok) {
    reqFunc(false);

    if (Math.trunc(result.status / 100) === 4) {
      if (result.status === 409) {
        localKeyRemove();
        alert(await result.json().then((data) => data.message));
        window.location.href = "/join";
        return;
      }
      err(await result.json().then((data) => data.message));
      return;
    }

    return;
  }

  if (result.ok) {
    reqFunc(true);
  }
}

export const keyList = [
  "email",
  "time",
  "state",
  "request",
  "code-set-min",
  "code-set-sec",
];

// localStorage key 일괄 삭제
export const localKeyRemove = () => {
  keyList.map((key) => {
    localStorage.removeItem(key);
  });
};

// email 코드 인증 중복 발생 방지 함수
export const codeSubmitPreven = (inEmail: string, reqState: boolean) => {
  // request 는 발송 안된 상태 <localstorage 소거도 같이>
  if (reqState === false && localStorage.getItem("request") === null) {
    if (localStorage.getItem("auth-success") === "ok") {
      return false;
    }
    localKeyRemove();
    return true;
  }

  // localStorage 미세팅 && request 발송 상태
  if (
    localStorage.getItem("email") === null &&
    localStorage.getItem("request") === "ok"
  ) {
    const reqDate = new Date();
    reqDate.setMinutes(reqDate.getMinutes() + 5);

    localStorage.setItem("email", inEmail);
    localStorage.setItem(
      "time",
      reqDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    );
    localStorage.setItem("state", "true");

    return false;
  }

  // localStorage 세팅 && request 발송 완료 상태
  if (
    localStorage.getItem("email") != null &&
    localStorage.getItem("request") === "ok"
  ) {
    const check = timeDiffValue(localStorage.getItem("time")!, nowTime);
    // localStorage 세팅 됐으나, 유효시간이 지난경우 초기화
    if (check["diff-minute"] < 0) {
      localKeyRemove();
      return true;
    }
    // 유효시간 남은 경우
    return false;
  }

  return true;
};

// 시간 차이 구하기
export function timeDiffValue(future: string, now: string) {
  const setFuture = parseKoStamp(future).getTime();
  const setNow = parseKoStamp(now).getTime();

  const allSecond = Math.round((setFuture - setNow) / 1000);

  const diffMin = Math.floor(Math.abs(allSecond) / 60);
  const diffSec = Math.abs(allSecond) % 60;

  return {
    "diff-minute": diffMin,
    "diff-second": diffSec,
  };
}

export function parseKoStamp(s: string): Date {
  const m = s.match(
    /^\s*(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(?:\s*)(오전|오후)\s*(\d{1,2}):(\d{1,2}):(\d{1,2})/
  );

  if (!m) throw new Error("형식에 맞지 않습니다");

  const [, y, mon, d, ap, h, mi, se] = m;
  let hour = parseInt(h, 10);
  const year = parseInt(y, 10);
  const month = parseInt(mon, 10) - 1;
  const day = parseInt(d, 10);
  const min = parseInt(mi, 10);
  const sec = parseInt(se, 10);

  if (ap === "오전") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  return new Date(year, month, day, hour, min, sec);
}