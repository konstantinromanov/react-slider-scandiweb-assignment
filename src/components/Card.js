import React from "react";

function Card(props) {
    return (
        <div className="card" id={props.id}>
            <img className="cardImg" src={props.picsum} alt="ok" />
        </div>
    )
    
}


export default React.memo(Card);