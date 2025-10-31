import ReactDOM from "react-dom";
import { useMyModal } from "../../contexts/MyModal";
import "../../css/modal.css";

function Modal() {

    const { modalState, closeModal } = useMyModal();
    const modalRoot = document.getElementById("modal-root");

    if (!modalState.isOpen || !modalRoot) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-wrap" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeModal}>
                    &times;
                </button>
                {modalState.content}
            </div>
        </div>,
        modalRoot
    )
}

export default Modal;