import { useState } from "react";
import "../../../css/side-bar-mypage.css";
import { menuIconBack } from "./mypage-config";
import MyPageEdit from "./MyPageEdit";
import { motion, AnimatePresence } from 'framer-motion';

function MyPage({
  setSideMargin,
}: {
  setSideMargin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div
        className="mypage-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AnimatePresence>
          {edit &&
            (<motion.div
              initial={{ opacity: 0, }}
              animate={{ opacity: 1, }}
              exit={{ opacity: 0, }}
            ><MyPageEdit /></motion.div>)}
        </AnimatePresence>
        <div className="mypage-header-edit" style={{ position: "fixed", marginLeft: "10px", top: "0.5rem" }}>
          <img
            src="/mypage-edit-logo.svg"
            style={{ width: "28px", height: "28px", marginRight: "8px" }}
          />
          <div className="mypage-edit-title" style={{ fontSize: "13px" }}>
            MyPage
          </div>
          <div
            className="mypage-low-arrow-icon-wrap"
            style={{
              display: "flex",
              justifyContent: "center" /* 가로 */,
              alignItems: "center" /* 세로 */,
              height: "30px",
              width: "30px",
            }}
            onClick={() => {
              setEdit(!edit);
              setSideMargin(!edit);
            }}
          >
            <img
              className={edit ? "arrow open" : "arrow"}
              src="/black-gra-low-arrow-icon.svg"
              style={{
                paddingTop: "3px",
                cursor: "pointer",
                transition: "transform 0.3s ease"
              }}
            />
            <img />
          </div>
        </div>
        <div
          className="mypage-header-logo-wrap"
          style={{ ...menuIconBack, position: "fixed", left: "12rem", top: "0.5rem", borderRadius: "0.5rem" }}
        >
          <img
            className="mypage-header-logo"
            src="/color-logo.svg"
            style={{ width: "30px", height: "30px", cursor: "pointer", }}
            onClick={() => {
              window.location.href = "/"
            }}
          />
        </div>
      </div>
    </>
  );
}

export default MyPage;
