import { BACK } from "../../../config";

type passwordSubmit = {
  password: string;
  state: string;
};

function JoinPasswordSubmit({ password, state }: passwordSubmit) {
  const joinPasswordSubmit = async () => {
    const authEmail = localStorage.getItem("email");
    const joinPassReqPath = "/join/password";

    await fetch(`${BACK}${joinPassReqPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: authEmail,
        password: password,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then(() => {
          localStorage.clear();
          window.location.href = "join/success";
        });
      }

      if (res.status === 409) {
        alert("이미 가입된 이메일입니다.");
        localStorage.clear();
        window.location.href = "/join";
      }
    });
  };

  return (
    <>
      <div
        className={
          state === ""
            ? "join-password-submit-wrap"
            : "join-password-submit-wrap-" + state
        }
        onClick={() => state && joinPasswordSubmit()}
      >
        가입하기
      </div>
    </>
  );
}

export default JoinPasswordSubmit;