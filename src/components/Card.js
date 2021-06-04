import React from "react";

function Card(props) {
    return (
        <div className="card" id={props.id}>
            <div className="cardMat" >
                <div className="cardImgWrap">
                    <img className="cardImg" src={props.source} alt="image" />
                </div>  
            </div>
            <div className="cardCaption">
                <h2>{props.title}</h2>
                <p>{props.caption}</p>                
            </div>            
        </div>
    )    
}


export default React.memo(Card);