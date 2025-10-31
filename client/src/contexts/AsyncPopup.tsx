import React, { createContext, useContext, useState } from 'react';
import { AsyncPopupLogic, type PopupStatus } from "../component/util/AsyncPopupLogic";

// 팝업 상태와 제어 함수에 대한 타입 정의
interface PopupContextType {
    open: (status: PopupStatus, message: string) => void;
    close: () => void;
    popupSet: (status: PopupStatus, msg: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

// 팝업의 상태를 관리하고, 팝업 컴포넌트를 렌더링하는 Provider
export function PopupProvider({ children }: { children: React.ReactNode }) {
    const [popupState, setPopupState] = useState<{
        isOpen: boolean;
        status: PopupStatus;
        message: string;
    }>({ isOpen: false, status: 'loading', message: '' });

    const open = (status: PopupStatus, message: string) => {
        setPopupState({ isOpen: true, status, message });
    };

    const close = () => {
        setPopupState({ isOpen: false, status: 'loading', message: '' });
    };


    const popupSet = (status: PopupStatus, msg: string) => {

        open(status, msg);

        if (status !== 'loading') {
            setTimeout(() => {
                close();
            }, 6000);
        }

    }
    const value = { open, close, popupSet };


    return (
        <PopupContext.Provider value={value}>
            {children}
            {/* isOpen이 true일 때만 Popup 컴포넌트를 화면에 렌더링 */}
            {popupState.isOpen && (
                <AsyncPopupLogic status={popupState.status} message={popupState.message} />
            )}
        </PopupContext.Provider>
    );
}

// 컴포넌트에서 팝업 제어 함수를 쉽게 사용하기 위한 커스텀 훅
export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('PopupProvider 와 같이 사용되어야 합니다.');
    }
    return context;
}