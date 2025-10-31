import { useNavigate } from "react-router-dom";

function JoinStepLayoutFoot(){

    // navigate
    const navigate = useNavigate();
    const privacyPolicyOpen = () => {
        navigate("/privacy-policy")
    }

    return(
        <div className="join-personal-info-notie">
            <div className="join-personal-info-notie-top-line"></div>
                위 정보는
            <span className="privacy-policy-btn" onClick={privacyPolicyOpen}><b> 개인정보처리 방침</b></span>
                을 따릅니다.
        </div>
    )

}

export default JoinStepLayoutFoot;