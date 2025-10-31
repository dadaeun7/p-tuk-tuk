import { useEffect, useRef, useState } from "react";
import type { btnProps } from "./joinCommonConfig";

interface Props {
  data: btnProps;
}

function JoinInputBtn(props: Props) {
  const isImeBug = useRef(false);

  const btnUnableStyle = {
    display: !props.data.inEnable ? "block" : "none",
  };

  const colorUnable = {
    color: !props.data.inEnable ? "#565656" : "#ccccccff",
  };

  const iconStle = {
    marginTop: "5px",
  };

  const [iconSet, setIconSet] = useState("arrow-next.svg");
  const [typeSet, setTypeSet] = useState(false);

  useEffect(() => {
    if (props.data.type === "email" || props.data.type === "number") {
      setIconSet("arrow-next.svg");
      return;
    }

    if (typeSet) {
      props.data.type = "text";
      setIconSet("pwd-unCheck.svg");
    } else {
      props.data.type = "password";
      setIconSet("pwd-check.svg");
    }
  }, [typeSet, props.data.type]);

  return (
    <>
      <div className={"join-" + props.data.tag + "-input-wrap"}>
        <input
          style={colorUnable}
          disabled={props.data.inEnable}
          type={props.data.type}
          placeholder={props.data.holder}
          className={"join-" + props.data.tag + "-input"}
          onChange={(e) => props.data.setVal(e.target.value)}
          onCompositionStart={() => {
            isImeBug.current = true;
          }}
          onCompositionEnd={() => {
            isImeBug.current = false;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isImeBug.current) return;
              e.preventDefault();
              if (props.data.type === "email" || props.data.type === "number")
                if (props.data.reqFunc !== undefined) void props.data.reqFunc();
            }
          }}
        />
        <div
          className={"join-" + props.data.tag + "-input-enter"}
          style={btnUnableStyle}
        >
          <img
            id={props.data.tag + props.data.type}
            style={iconStle}
            src={iconSet}
            alt={"join-" + props.data.tag + "-next-button"}
            width={18}
            height={18}
            onClick={(e) => {
              e.preventDefault();
              if (props.data.type === "email" || props.data.type === "number") {
                if (props.data.reqFunc !== undefined) void props.data.reqFunc();
                return;
              }
              setTypeSet(!typeSet);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default JoinInputBtn;