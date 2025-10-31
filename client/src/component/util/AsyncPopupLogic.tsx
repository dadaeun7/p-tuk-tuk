import "../../css/async-popup-modal.css";

// 팝업의 상태를 나타내는 타입
export type PopupStatus = 'loading' | 'success' | 'error';

interface PopupProps {
    status: PopupStatus;
    message: string;
}

export function AsyncPopupLogic({ status, message }: PopupProps) {
    const renderIcon = () => {
        switch (status) {
            case 'loading':
                // CSS로 만든 스피너 애니메이션
                return <div className="spinner"></div>;
            case 'success':
                // SVG 체크 아이콘
                return (
                    <svg className="icon success" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                    </svg>
                );
            case 'error':
                // SVG X 아이콘
                return (
                    <svg className="icon error" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="popup-backdrop">
            <div className="popup-content">
                {renderIcon()}
                <p>{message}</p>
            </div>
        </div>
    );
}

