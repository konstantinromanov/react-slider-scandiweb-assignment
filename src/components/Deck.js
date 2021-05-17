import React, { Component, Fragment } from "react";
import Card from "./Card.js";
import leftArrow from '../images/left-chevron.png';
import rightArrow from '../images/right-chevron.png';


class Deck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [
                <Card picsum={"https://picsum.photos/800/350"} id="one" key="one" />,
                <Card picsum={"https://picsum.photos/800/352"} id="two" key="two" />,
                <Card picsum={"https://picsum.photos/800/353"} id="three" key="three" />,
                <Card picsum={"https://picsum.photos/800/354"} id="four" key="four" />
            ]
        }
    }

    componentDidMount() {
        this.numberOfCardsByIndex = this.images.children.length - 1;
        this.middleCardByIndex = Math.floor(this.numberOfCardsByIndex / 2);
        this.currentCard = this.middleCardByIndex;

        /* ********************* Responsive Code ******************** */

        let imgWidthAsPercentage = 50;
        imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
        let navButtonsPlacementAsPercentage = 60;
        navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

        this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
            (imgWidthAsPercentage / 100) * window.screen.width :
            (imgWidthAsPercentage / 100) * window.innerWidth; 

        //let widthToHeightRatio = parseFloat(this.viewPort.style.width) / parseFloat(this.viewPort.style.height);

        this.viewPort.style.width = `${this.newWidth}px`;

        //this.viewPort.style.height = `${this.newWidth / widthToHeightRatio}px`;

        this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
        this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.30}px`;
        this.buttonNext.style.width = `${(this.newWidth / 2) * 0.30}px`;

        //this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top}px`;
                
        this.selectionButtonsContainer.style.bottom = `${this.images.children.bottom}px`;

        for(let i = 0; i < this.images.children.length; i++) {
            this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";
            this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.05}px`;
            this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.05}px`;
        }

        this.orderCards();

        this.updateSelection();

        window.addEventListener("resize", () => {
            imgWidthAsPercentage = 50;
            imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
            navButtonsPlacementAsPercentage = 60;
            navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

            this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
                (imgWidthAsPercentage / 100) * window.screen.width :
                (imgWidthAsPercentage / 100) * window.innerWidth; 

            this.viewPort.style.width = `${this.newWidth}px`;

            //this.viewPort.style.height = `${this.newWidth / widthToHeightRatio}px`;

            this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
            this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.30}px`;
            this.buttonNext.style.width = `${(this.newWidth / 2) * 0.30}px`;

            this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top}px`;  

            for(let i = 0; i < this.images.children.length; i++) {
                this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";
                this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.05}px`;
                this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.05}px`;
            }

            this.orderCards();

            this.rightBoundary = parseFloat(this.images.children[this.numberOfCardsByIndex].style.left) + this.newWidth;
            this.leftBoundary = parseFloat(this.images.children[0].style.left) - this.newWidth;

            for (let i = 0; i < this.images.children.length; i++) {
                this.lastPositions[i] = parseFloat(this.images.children[i].style.left);            
            }
        });
        
        /* ********************************************************** */

        /* ***************************** Touch navigation ******************* */

        this.startTouchPostition = 0.0;
        this.updatedPosition = 0.0;
        this.speedModifier = 0.8;

        this.lastPositions = [];
        this.rightBoundary = parseFloat(this.images.children[this.numberOfCardsByIndex].style.left) + this.newWidth;
        this.leftBoundary = parseFloat(this.images.children[0].style.left) - this.newWidth;

        for (let i = 0; i < this.images.children.length; i++) {
            this.lastPositions.push(parseFloat(this.images.children[i].style.left));            
        }

        this.touchArea.addEventListener("touchstart", this.handleTouchStart, {
            passive: false,
          });
        this.touchArea.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
        });
        this.touchArea.addEventListener("touchend", this.handleTouchEnd, {
        passive: false,
        });

        /* ****************************************************************** */

        /* ********************* Button Navigation ****************** */

        this.scrollInProgress = false;      
        
        /* ********************************************************** */

        

        /* ********************* Autoplay Code ********************** */

        this.autoplayTimeoutId = null;
        this.autoplayIntervalId = null;
        
        /* ********************************************************** */

        /* ********************* Init Code ************************** */

        //this.selectionButtonsContainer.children[0].click();

        /* ********************************************************** */
        
        /* ***************************** Snap Back Logic ******************* */

        this.snapInProgress = false;
        this.distanceToScroll = 0.0;
        this.seed = 0.0;
        this.snapSpeedModifier = 0.05;

      /* ****************************************************************** */

    }
    

    updateSelection = () => {
        for (let i = 0; i < this.images.children.length; i++) {
            if (i === this.currentCard) {
                this.selectionButtonsContainer.children[i].style.backgroundColor = "red";
            } else {
                this.selectionButtonsContainer.children[i].style.backgroundColor = "grey";
            }            
        }        
    }

    orderCards = () => {
        //const cardWidth = parseFloat(getComputedStyle(this.images.children[0]).width);
        let counterForRight = 1;
        let counterForLeft = this.middleCardByIndex;

        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.0s";
            
            if (i < this.middleCardByIndex) {
                this.images.children[i].style.left = `${-1 * ((counterForLeft * this.newWidth) - (this.newWidth / 2))}px`;
                counterForLeft--;
            } else if (i > this.middleCardByIndex) {
                this.images.children[i].style.left = `${(counterForRight * this.newWidth) + (this.newWidth / 2)}px`;
                counterForRight++;
            } else {
                this.images.children[i].style.left = `${this.newWidth / 2}px`;
            }
        }
    }

    handleBoundaries = () => {
        if (this.lastPositions[0] <= this.leftBoundary) {
            const endOfDeck = this.lastPositions[this.numberOfCardsByIndex] + this.newWidth;

            this.images.children[0].style.left = `${endOfDeck}px`;            
            this.lastPositions[0] = endOfDeck;

            this.images.appendChild(this.images.children[0], this.images.children[this.numberOfCardsByIndex]);
            this.lastPositions.splice(this.numberOfCardsByIndex, 0, this.lastPositions.shift());
        }
        if (this.lastPositions[this.numberOfCardsByIndex] >= this.rightBoundary) {
            const beginningOfDeck = this.lastPositions[0] - this.newWidth;

            this.images.children[this.numberOfCardsByIndex].style.left = `${beginningOfDeck}px`;            
            this.lastPositions[this.numberOfCardsByIndex] = beginningOfDeck;

            this.images.insertBefore(this.images.children[this.numberOfCardsByIndex], this.images.children[0]);
            this.lastPositions.splice(0, 0, this.lastPositions.pop());
        }
    }

    /* ***************************** Snap Back Logic ******************* */

    snapBack = () => {
        this.snapInProgress = true;

        const adjustedPositions = this.lastPositions.map(position => Math.abs(position - (this.newWidth / 2)));
        const closestCardByIndex = adjustedPositions.indexOf(Math.min(...adjustedPositions));

        this.distanceToScroll = adjustedPositions[closestCardByIndex] * 
        (this.lastPositions[closestCardByIndex] > (this.newWidth / 2) ? -1.0 : 1.0);       

            if (this.distanceToScroll < 0 && closestCardByIndex !== this.middleCardByIndex) {
                this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard; 
            } 
            if (this.distanceToScroll > 0 && closestCardByIndex !== this.middleCardByIndex) {
                this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard;  
            } 

        this.animateSnap();
    };

    animateSnap = () => {
        this.seed = parseFloat(this.seed.toFixed(2));

        let percentageToMove = Math.pow(this.seed, 2.0);
        percentageToMove = parseFloat(percentageToMove.toFixed(2));

        if (this.seed > 1) {
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.updatedPosition = this.lastPositions[i] + this.distanceToScroll;
            this.images.children[i].style.left = `${this.updatedPosition}px`; 
            this.lastPositions[i] = this.updatedPosition;     
        }

        this.handleBoundaries();
        this.updateSelection();

        this.snapInProgress = false;
        this.seed = 0.0;

        return;
        }

        for (let i = 0; i < this.images.children.length; i++) {
        this.updatedPosition = this.lastPositions[i] + (percentageToMove * this.distanceToScroll);
        this.images.children[i].style.left = `${this.updatedPosition}px`;      
        }

        this.seed += 1 * this.snapSpeedModifier;
        requestAnimationFrame(this.animateSnap);
    }

  /* ****************************************************************** */

  /* ***************************** Touch navigation ******************* */

  handleTouchStart = (event) => {
    if (this.snapInProgress) return;

    this.startTouchPostition = event.changedTouches[0].screenX;

    for (let i = 0; i < this.images.children.length; i++) {
      this.images.children[i].style.transitionDuration = "0.0s";
    }
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    if (this.snapInProgress) return;

    const currentTouchPosition = event.changedTouches[0].screenX;
    let difference = currentTouchPosition - this.startTouchPostition;
    difference *= this.speedModifier;

    this.startTouchPostition = currentTouchPosition;

    for (let i = 0; i < this.images.children.length; i++) {
      this.updatedPosition = this.lastPositions[i] + difference;
      this.images.children[i].style.left = `${this.updatedPosition}px`;
      this.lastPositions[i] = this.updatedPosition;
    }

    this.handleBoundaries();
  };

  handleTouchEnd = () => {
    if (this.snapInProgress) return;

    this.snapBack();
  };

  /* ****************************************************************** */

    /* ********************* Button Navigation ****************** */   

    handleNext = () => {
        if (this.scrollInProgress) return;   
        
        this.scrollInProgress = true;
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.0s";

            const updatedPosition = this.lastPositions[i] - this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;           
        }

        this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;

        this.handleBoundaries();
        this.updateSelection();

        setTimeout(() => {
            this.scrollInProgress = false;
            //this.startAutoplay();
        }, 200);
    }

    handlePrev = () => {
        if (this.scrollInProgress) return;   
        
        this.scrollInProgress = true;
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.0s";

            const updatedPosition = this.lastPositions[i] + this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;           
        }

        this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard;

        this.handleBoundaries();
        this.updateSelection();

        setTimeout(() => {
            this.scrollInProgress = false;
            //this.startAutoplay();
        }, 200);
    }
    
    /* ********************************************************** */

    /* ********************* Selection Navigation *************** */

    handleSelection = event => {
        if (event.target === this.selectionButtonsContainer) return;

        let newCard = null;

        for (let i = 0; i < this.images.children.length; i++) {
            if (event.target === this.selectionButtonsContainer.children[i]) newCard = i;            
        }

        for (let i = 0; i < this.images.children.length; i++) {
           const updatedPosition = this.lastPositions[i] + ((this.currentCard - newCard) * this.newWidth);

           this.images.children[i].style.transitionDuration = "0.0s";
           this.images.children[i].style.left = `${updatedPosition}px`;
           this.lastPositions[i] = updatedPosition;
        }

        for (let i = 0; i < Math.abs(this.currentCard - newCard); i++) {
            this.handleBoundaries();            
        }

        this.currentCard = newCard;

        this.updateSelection();
        //this.startAutoplay();
    }
        
    /* ********************************************************** */

    /* ********************* Autoplay Code ********************** */

    startAutoplay = () => {
        clearTimeout(this.autoplayTimeoutId);
        clearInterval(this.autoplayIntervalId);

        this.autoplayTimeoutId = setTimeout(() => {
            this.autoplayIntervalId = setInterval(() => {
                for (let i = 0; i < this.images.children.length; i++) {
                    this.images.children[i].style.transitionDuration = "0.5s";
        
                    const updatedPosition = this.lastPositions[i] - this.newWidth;
                    
                    this.images.children[i].style.left = `${updatedPosition}px`;            
                    this.lastPositions[i] = updatedPosition;           
                }
        
                this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;
        
                this.handleBoundaries();
                this.updateSelection();
            }, 12100)
        }, 1200);
    }
        
    /* ********************************************************** */

    render() {
        return (
            <Fragment>
                <div ref={refId => this.navButtonsContainer = refId} style={styles.navButtonsContainer}>
                    <img onClick={this.handlePrev} ref={refId => this.buttonPrev = refId} style={styles.navButton} src={leftArrow} alt="prev" id="prev" />
                    <img onClick={this.handleNext} ref={refId => this.buttonNext = refId} style={styles.navButton} src={rightArrow} alt="next" id="next" />
                </div>
                <div ref={refId => this.viewPort = refId} style={styles.viewPort}>
                    <div ref={refId => this.images = refId} style={styles.imagesContainer}> 
                        {this.state.cards}
                    </div>
                </div>
                <div ref={(refId) => (this.touchArea = refId)} style={styles.touchArea} className="touchArea"></div>
                <div onClick={this.handleSelection} ref={refId => this.selectionButtonsContainer = refId} style={styles.selectionButtonsContainer}>
                    {
                        this.state.cards.map((_, i) => {
                            return (<div style={styles.selectionButton} key={i}></div>)
                        })
                    }
                   
                </div>
            </Fragment>
        )
    }
}

const styles = {
    viewPort: {
        margin: 0,
        padding: 0,
        width: "500px",
        height: "300px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        //overflow: "hidden",
        //backgroundColor: "red"
    },
    imagesContainer: {
        margin: 0,
        padding: 0,
        width: "inherit",
        height: "inherit",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    touchArea: {
      margin: 0,
      padding: 0,
      width: "100vw",
      height: "300px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      //backgroundColor: "rgba(255, 0, 0, 0.2)",
      zIndex: 9999,
    },
    navButtonsContainer: {
        margin: 0,
        padding: 0,
        width: "100vw",        
        position: "absolute",
        top: "50%",
        left: "50%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999
    },
    navButton: {
        width: "50%",
        height: "auto",
        pointerEvents: "all",
        cursor: "pointer"
    },
    selectionButtonsContainer: {
        margin: 0,
        padding: 0,
        width: "fit-content",
        height: "fit-content",
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 9999,
        //backgroundColor: "rgba(0, 0, 255, 0.4)"
    },
    selectionButton: {
        marginRight: "7.5px",
        marginLeft: "7.5px",
        padding: 0,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "grey",
        pointerEvents: "all",
        cursor: "pointer"
    }
}

export default Deck;