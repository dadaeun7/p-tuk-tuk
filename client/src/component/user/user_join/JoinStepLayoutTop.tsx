type joinStepLayout = {
    type: string
    title: string
    description: string
}

function JoinStepLayoutTop({
    type, title, description
}:joinStepLayout){
    return(
        <>
            <div className={"join-"+type+"-title"}>{title}</div>
            <div className={"join-"+type+"-description"}>{description}</div>
        </>
    )
}

export default JoinStepLayoutTop;