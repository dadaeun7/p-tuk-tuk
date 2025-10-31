import { useState } from "react";
import "../../css/main.css";
import Login from "../user/user_login/Login";
import MainBody from "./MainBody";
import MainHeader from "./MainHeader";

function Main() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="main">
      {isOpen && <Login closeLogin={() => setIsOpen(false)} />}
      <MainHeader openLogin={() => setIsOpen(true)} />
      <MainBody />
    </div>
  );
}

export default Main;
