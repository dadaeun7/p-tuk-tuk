import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App.tsx";
import MyDashBoard from "./component/dash_board/MyDashBoard.tsx";
import PrivacyPolicy from "./component/law/PrivacyPolicy.tsx";
import MyMonthCur from "./component/month_current/MyMonthCur.tsx";
import MyOrderTable from "./component/order_table/MyOrderTable.tsx";
import GmailConnectCallback from "./component/user/user_info/GmailConnectCallback.tsx";
import Join from "./component/user/user_join/Join.tsx";
import JoinComplete from "./component/user/user_join/JoinComplete.tsx";
import UserPage from "./component/user/user_mypage/UserPage.tsx";
import { PopupProvider } from "./contexts/AsyncPopup.tsx";
import { AuthProvider } from "./contexts/Auth.tsx";
import { MyModal } from "./contexts/MyModal.tsx";
import Modal from "./component/util/Modal.tsx";
import { BringOrderProvider } from "./contexts/BringOrder.tsx";
import HowToMailConnect from "./component/law/HowToMailConnect.tsx";
import AdminTable from "./admin/AdminTable.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./data/queryClient.tsx";
import HowToUploadImg from "./component/law/HowToUploadImg.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Router>
    <QueryClientProvider client={queryClient}>
      <MyModal>
        <PopupProvider>
          <AuthProvider>
            <BringOrderProvider>
              <Routes>
                <Route path="/admin" element={<AdminTable />} />
                <Route path="/" element={<App />} />
                <Route path="/join" element={<Join />}></Route>
                <Route path="/join/success" element={<JoinComplete />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/how-to-connect" element={<HowToMailConnect />} />
                <Route path="/how-to-upload" element={<HowToUploadImg />} />
                <Route path="/my-page/*" element={<UserPage />}>
                  <Route path="dash-board" index={true} element={<MyDashBoard />} />
                  <Route path="order-table" element={<MyOrderTable />} />
                  <Route path="month-cur" element={<MyMonthCur />} />
                  <Route
                    path="google/auth/callback"
                    element={<GmailConnectCallback />}
                  />
                </Route>
              </Routes>
            </BringOrderProvider>
          </AuthProvider>
        </PopupProvider>
        <Modal />
      </MyModal>
    </QueryClientProvider>
  </Router>
  // </StrictMode>
);
