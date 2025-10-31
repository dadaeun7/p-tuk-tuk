import "../../css/loading-dots.css";

function LoadingDots({ style }: { style: React.CSSProperties }) {

    return (
        <>
            <div className="loading-dots">
                <span style={style}></span>
                <span style={style}></span>
                <span style={style}></span>
            </div>
        </>
    )
}

export default LoadingDots;