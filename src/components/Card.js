import React from "react";

function Card(props) {
    return (
        <div className="card" id={props.id}>
            <img className="cardImg" src={props.source} alt="image" />           
        </div>
    )
    
}


export default React.memo(Card);