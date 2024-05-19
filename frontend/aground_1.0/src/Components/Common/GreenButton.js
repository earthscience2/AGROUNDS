import styled from "./GreenButton.module.css"

function button({onclick, text}) {

    
    return (
        <button className={styled.greenbutton} onClick={onclick}>{text}</button>
    )
}

export default button;