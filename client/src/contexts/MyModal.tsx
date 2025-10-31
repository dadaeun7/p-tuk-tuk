import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";

type ModalContent = ReactNode;

interface ModalState {
    isOpen: boolean,
    content: ModalContent | null,
}

type ModalAction = | { type: 'OPEN'; payload: ModalContent } | { type: "CLOSE" }

type ModalDispatch = Dispatch<ModalAction>

const initialSet: ModalState = {
    isOpen: false,
    content: null
}

function modalReducer(state: ModalState, action: ModalAction): ModalState {
    switch (action.type) {
        case 'OPEN':
            return {
                ...state,
                isOpen: true,
                content: action.payload
            };
        case 'CLOSE':
            return {
                ...state,
                isOpen: false,
                content: null,
            };
        default:
            throw new Error("지원하지 않는 액션 타입입니다");
    }
}

const ModalStateContext = createContext<ModalState | undefined>(undefined);
const ModalDispatchContext = createContext<ModalDispatch | undefined>(undefined);

export function MyModal({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(modalReducer, initialSet);

    return (
        <ModalStateContext.Provider value={state}>
            <ModalDispatchContext.Provider value={dispatch}>
                {children}
            </ModalDispatchContext.Provider>
        </ModalStateContext.Provider>
    )
}

export const useMyModal = () => {
    const state = useContext(ModalStateContext);
    const dispatch = useContext(ModalDispatchContext);

    if (state === undefined || dispatch === undefined) {
        throw new Error("모달은 myModal과 같이 사용되어야 합니다.");
    }

    const openModal = (content: ModalContent) => dispatch({ type: "OPEN", payload: content });
    const closeModal = () => dispatch({ type: "CLOSE" })

    return { modalState: state, openModal, closeModal }
}