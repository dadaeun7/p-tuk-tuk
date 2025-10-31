import { useEffect, useState } from "react";
import { localUser } from "../../../config";
import WidthDrawPopup from "./WidthDrawPopup";


function WithDraw() {

  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {

    const provider: string = localUser().type;

    if (provider.toLocaleLowerCase() === 'local') {
      setShow(true);
    }

  }, [])

  return (<>
    {show && (<div className="user-withdraw" style={{ cursor: "pointer" }} onClick={(() => { setExit(!exit); })}>
      회원탈퇴
    </div>)
    }
    {exit && <WidthDrawPopup setExit={setExit} />}
  </>
  );
}

export default WithDraw;
