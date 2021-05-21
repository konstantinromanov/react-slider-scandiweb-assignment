import React, { Component, Fragment } from "react";
import Card from "./Card.js";
import leftArrow from '../images/left-chevron.png';
import rightArrow from '../images/right-chevron.png';

import slide1 from '../images/1.jpg';
import slide2 from '../images/2.jpg';
import slide3 from '../images/3.jpg';
import slide4 from '../images/4.jpg';
import slide5 from '../images/5.jpg';
import slide6 from '../images/6.jpg';
import slide7 from '../images/7.jpg';
import slide8 from '../images/8.jpg';
import slide9 from '../images/9.jpg';
import slide10 from '../images/10.jpg';


class Deck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [
                <Card source={slide1} id="one" key="one" />,
                <Card source={slide2} id="two" key="two" />,
                <Card source={slide3} id="three" key="three" />,
                <Card source={slide4} id="four" key="four" />,
                <Card source={slide5} id="five" key="five" />,
                <Card source={slide6} id="six" key="six" />,
                <Card source={slide7} id="seven" key="seven" />,
                <Card source={slide8} id="eight" key="eight" />,
                <Card source={slide9} id="nine" key="nine" />,
                <Card source={slide10} id="ten" key="ten" />
            ]
        }
    }
    
    componentDidMount() {       

        this.numberOfCardsByIndex = this.images.children.length - 1;
        this.middleCardByIndex = Math.floor(this.numberOfCardsByIndex / 2);
        this.currentCard = this.middleCardByIndex;        

        /* ********************* Responsive Code ******************** */

        /* Set quantity of slides per viewport */        
        const imgQty = 2;
        let imgWidthAsPercentage = 100 / imgQty;
        imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
        let navButtonsPlacementAsPercentage = 55;
        navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

        this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
            (imgWidthAsPercentage / 100) * window.screen.width :
            (imgWidthAsPercentage / 100) * window.innerWidth;
            this.viewPort.children[0].style.width = `${this.newWidth}px`;   
            this.viewPort.style.height = `${this.newWidth / 1.5}px`;  
            this.viewPort.children[0].style.height = `${this.newWidth / 1.5}px`;  
 
        this.touchArea.style.height = this.viewPort.style.height;

        this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
        this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.20}px`;
        this.buttonNext.style.width = `${(this.newWidth / 2) * 0.20}px`;

        if (this.newWidth < 640) {
            this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 35}px`;
        } else {
            this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 55}px`;    
        }  

        for(let i = 0; i < this.images.children.length; i++) {
            this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";

            if (this.newWidth < 640) {
                this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.03}px`;
                this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.01}px`;                
            } else {
                this.selectionButtonsContainer.children[i].style.width = `${640 * 0.03}px`; 
                this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.01}px`;
            }
        }

        this.orderCards();

        this.updateSelection();

        window.addEventListener("resize", () => {
            
            imgWidthAsPercentage = 100 / imgQty;
            imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
            navButtonsPlacementAsPercentage = 55;
            navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

            this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ?
                (imgWidthAsPercentage / 100) * window.screen.width :
                (imgWidthAsPercentage / 100) * window.innerWidth; 
                   
            this.viewPort.children[0].style.width = `${this.newWidth}px`; 

            this.viewPort.style.height = `${this.newWidth / 1.5}px`;
            this.viewPort.children[0].style.height = `${this.newWidth / 1.5}px`;  

            this.touchArea.style.height = this.viewPort.style.height;

            this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
            this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.20}px`;
            this.buttonNext.style.width = `${(this.newWidth / 2) * 0.20}px`;

            if (this.newWidth < 640) {
                this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 35}px`;
            } else {
                this.selectionButtonsContainer.style.bottom = `${this.viewPort.getBoundingClientRect().top + 55}px`;    
            }   

            for(let i = 0; i < this.images.children.length; i++) {
                this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";
                
                if (this.newWidth < 640) {
                    this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.03}px`;
                    this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.01}px`;
                } else {
                    this.selectionButtonsContainer.children[i].style.width = `${640 * 0.03}px`;
                    this.selectionButtonsContainer.children[i].style.height = `${640 * 0.01}px`;
                }
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

        this.swapDist = 0;

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

        this.selectionButtonsContainer.children[0].click();

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
                this.selectionButtonsContainer.children[i].style.backgroundColor = "white";
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
        let swapRem = this.swapDist % this.newWidth;

        /* set snapBack sensivity. 2 will cause snapBack if swipe is less then half of the slide. */
        let snapSens = 4;
        this.distanceToScroll = ((this.newWidth / snapSens - Math.abs(swapRem)) > 0) ?
            -1.0 * swapRem : (this.newWidth - Math.abs(swapRem)) * (swapRem > 0 ? 1.0: -1.0);
        
        if (this.distanceToScroll < 0 && this.newWidth / 2 - Math.abs(swapRem) < 0) {
            this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard; 
        } 
        if (this.distanceToScroll > 0 && this.newWidth / 2 - Math.abs(swapRem) < 0) {
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
                this.updatedPosition = parseFloat((this.lastPositions[i] + this.distanceToScroll).toFixed(2));
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
        this.swapDist = 0;
        this.frameCounter = 0;
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
        this.swapDist += difference;
        this.frameCounter += difference;

        this.startTouchPostition = currentTouchPosition;

        for (let i = 0; i < this.images.children.length; i++) {
            this.updatedPosition = this.lastPositions[i] + difference;
            this.images.children[i].style.left = `${this.updatedPosition}px`;
            this.lastPositions[i] = this.updatedPosition;            
        }

        if (this.frameCounter < (this.newWidth * -1.0)) {
            this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;         
            this.updateSelection();    
            this.frameCounter = 0;  
        }

        if (this.frameCounter > this.newWidth) {
            this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard; 
            this.updateSelection();          
            this.frameCounter = 0;             
        }
         
        this.handleBoundaries();
    };

    handleTouchEnd = () => {
        if (this.snapInProgress) return;     
        this.snapBack();
        this.startAutoplay();
    };

  /* ****************************************************************** */

    /* ********************* Button Navigation ****************** */   

    handleNext = () => {
        if (this.scrollInProgress) return;   
        
        this.scrollInProgress = true;
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.5s";

            const updatedPosition = this.lastPositions[i] - this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;           
        }

        this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;

        this.handleBoundaries();
        this.updateSelection();
        
        setTimeout(() => {
            this.scrollInProgress = false;
            this.startAutoplay();
        }, 200);
    }

    handlePrev = () => {
        if (this.scrollInProgress) return;   
        
        this.scrollInProgress = true;
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.5s";

            const updatedPosition = this.lastPositions[i] + this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;           
        }

        this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard;

        this.handleBoundaries();
        this.updateSelection();
        
        setTimeout(() => {
            this.scrollInProgress = false;
            this.startAutoplay();
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
        this.startAutoplay();
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
            }, 5100)
        }, 2200);
    }
        
    /* ********************************************************** */

    render() {
        return (
            <Fragment>
                <div ref={refId => this.navButtonsContainer = refId} className="navButtonsContainer">
                    <img onClick={this.handlePrev} ref={refId => this.buttonPrev = refId} className="navButton" src={leftArrow} alt="prev" id="prev" />
                    <img onClick={this.handleNext} ref={refId => this.buttonNext = refId} className="navButton" src={rightArrow} alt="next" id="next" />
                </div>
                <div ref={refId => this.viewPort = refId} className="viewPort">
                    <div ref={refId => this.images = refId} className="imagesContainer"> 
                        {this.state.cards}
                    </div>
                    
                </div>
                <div ref={(refId) => (this.touchArea = refId)} className="touchArea"></div>
                <div onClick={this.handleSelection} ref={refId => this.selectionButtonsContainer = refId} className="selectionButtonsContainer">
                    {
                        this.state.cards.map((_, i) => {
                            return (<div className="selectionButton" key={i}></div>)
                        })
                    }                   
                </div>
            </Fragment>
        )
    }
}


export default Deck;