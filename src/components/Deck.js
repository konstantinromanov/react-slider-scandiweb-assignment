import React, { Component, Fragment } from "react";
import Card from "./Card.js";
import leftArrow from '../images/left-chevron.png';
import rightArrow from '../images/right-chevron.png';
import plus from '../images/plus-square-regular.svg';
import minus from '../images/minus-square-regular.svg';

import AppData from '../AppData';


class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deck: AppData,
            
        }       
    }
    
    componentDidMount() {       

        this.numberOfCardsByIndex = this.images.children.length - 1;
        this.middleCardByIndex = Math.floor((this.numberOfCardsByIndex + 2) / 2);
        this.currentCard = this.middleCardByIndex - 1;   
        this.lastPositions = [];     

        // cloning first and last slide for smooth transition between first and last slide
        this.images.insertAdjacentHTML("afterbegin", this.images.children[this.numberOfCardsByIndex].outerHTML);        
        this.images.insertAdjacentHTML("beforeend", this.images.children[1].outerHTML);

        let mobDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        /* ********************* Responsive Code ******************** */

        // this.imgToShowMem = 6;
        // this.maxSlides = 6;
        // this.minSlides;
        this.imgToShow = 2;

        let imgWidthAsPercentage;
        let maxIimgWidthAsPercentage;
        let maxWidthCheck;
        let maxCardWidth;
        let maxHeightCheck;
        let minCardHeight = 300;

        this.handleResize = () => {

            let maxSlides = 8;
            let minSlides = 2;
            let winWidth = window.innerWidth;
            let winHeight = window.innerHeight;            

            for (let i = maxSlides; i >= minSlides; i--) {
                maxIimgWidthAsPercentage = window.innerWidth < 768 ? 100 : (100 / (i)); 
                maxWidthCheck = (maxIimgWidthAsPercentage / 100) * (mobDevice ?  window.screen.width : window.innerWidth);
                maxHeightCheck = `${maxWidthCheck / 1.5 + 90}px`;
                if (parseFloat(maxHeightCheck) > winHeight) break;
                this.minSlides = i;                               
            }

            for (let i = minSlides; i <= maxSlides; i++) {
                maxIimgWidthAsPercentage = window.innerWidth < 768 ? 100 : (100 / (i)); 
                maxWidthCheck = (maxIimgWidthAsPercentage / 100) * (mobDevice ?  window.screen.width : window.innerWidth);
                maxCardWidth = `${maxWidthCheck}px`;
                if (parseFloat(maxCardWidth) < minCardHeight) break;                
                this.maxSlides = i;                               
            }
            
            // this.maxSlides = Math.floor(winWidth / ((300 - 90) * 1.5));           
            // this.minSlides = Math.floor(winWidth / (((winHeight - 90) * 1.5)));
                      
            switch (true) {
                case winWidth < 1025 && this.imgToShow > 2 : this.imgToShow = 2;
                break;
                case winWidth < 1201 && this.imgToShow > 3 : this.imgToShow = 3;
                break;
                case winWidth < 1501 && this.imgToShow > 4 : this.imgToShow = 4;
                break;
                default: this.imgToShow = this.imgToShow;
            }

            this.buttonMinus.style.opacity = null;
            this.buttonPlus.style.opacity = null;
            if (this.imgToShow <= this.minSlides) {
                this.imgToShow = this.minSlides;
                this.buttonMinus.style.opacity = 0.2;
            }
            if (this.imgToShow >= this.maxSlides) {
                this.imgToShow = this.maxSlides;
                this.buttonPlus.style.opacity = 0.2;
            }
            
            imgWidthAsPercentage = window.innerWidth < 768 ? 100 : (100 / this.imgToShow); 
            this.newWidth = (imgWidthAsPercentage / 100) * (mobDevice ?  window.screen.width : window.innerWidth);
            this.images.style.width = `${this.newWidth}px`;  
            this.viewPort.style.height = `${this.newWidth / 1.5 + 90}px`;

            this.buttonPrev.style.width = `${(this.newWidth / 2) * 0.15}px`;
            this.buttonNext.style.width = `${(this.newWidth / 2) * 0.15}px`;
            
            for(let i = 0; i < this.images.children.length - 2; i++) {
                this.selectionButtonsContainer.children[i].transitionDuration = "0.0s";    
                this.selectionButtonsContainer.children[i].style.width = `${this.newWidth * 0.03}px`; 
                this.selectionButtonsContainer.children[i].style.height = `${this.newWidth * 0.007}px`;
            }
                    
            this.orderCards();    
          
            this.rightBoundary = parseFloat(this.images.children[this.numberOfCardsByIndex + 2].style.left) + this.newWidth;
            this.leftBoundary = parseFloat(this.images.children[0].style.left) - this.newWidth;

            for (let i = 0; i < this.images.children.length; i++) {
                this.lastPositions[i] = parseFloat(this.images.children[i].style.left);                                        
            }
        }
        
        this.handleResize();

        window.addEventListener("resize", this.handleResize);

        /* ************************************************************************ */

        this.updateSelection();

        /* ********** Hide mouse cursor above viewport when not moving ************* */
                  
        if (!mobDevice) {
            let justHidden = false;
            let j;
            let navFlash;
            let hide = () => {  
                this.viewPort.style.cursor = "none";                
                navFlash = true;               
                justHidden = true;
                setTimeout(() => {
                    justHidden = false;
                }, 500);    
            }

            this.viewPort.addEventListener("mousemove", e => {                
                if (!justHidden) {
                    justHidden = false;                    
                    clearTimeout(j);
                    this.viewPort.style.cursor = "default";
                    if (navFlash) {
                        for (let i = 0; i < 2; i++) {
                            this.navButtonsContainer.children[i].style.transitionDuration = "0.5s";
                            this.navButtonsContainer.children[i].style.opacity = 1;
                            this.navButtonsContainer.children[i].style.padding = "0.3%";                            
                        }                        
                        navFlash = false;
                        setTimeout(() => {
                            for (let i = 0; i < 2; i++) {
                                this.navButtonsContainer.children[i].style.opacity = null;
                                this.navButtonsContainer.children[i].style.padding = null;  
                                this.navButtonsContainer.children[i].style.transitionDuration = null;                                                         
                            }
                        }, 1000);
                    }                    
                    j = setTimeout(hide, 1000);
                }                
            })    
        }    

        /* ****************************************************************** */
        
        /* ******************* Keyboard arrows keys navigation ************** */

        document.addEventListener( "keydown", function( event ) {
            
            if (this.scrollInProgress) return; 
            this.scrollInProgress = true;
            
            if( event.code == "ArrowLeft" ) {   
                document.getElementsByClassName("navButton")[0].click();       
            }
            if( event.code == "ArrowRight" ) {
                document.getElementsByClassName("navButton")[1].click(); 
            }

            setTimeout(() => {
                this.scrollInProgress = false;                
            }, 500);
            
        }, true);

        document.addEventListener( "keydown", function( event ) {
            if( event.code == "ArrowUp" ) {
                document.getElementsByClassName("sizeButton")[0].click();
            }
            if( event.code == "ArrowDown" ) {
                document.getElementsByClassName("sizeButton")[1].click(); 
            }
        }, true);
        
        /* ********************************************************** */

        /* ******** Pause slider when browser tab is switched to another ********* */

        // Set the name of the hidden property and the change event for visibility
        let hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        
        // If the page is hidden, pause the slider;
        // if the page is shown, play the slider.
        let handleVisibilityChange = () => {
            if (document[hidden]) {                
                this.stopAutoplay();                    
            } else {
                this.startAutoplay();
            }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || hidden === undefined) {
            console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
        } else {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleVisibilityChange, false);        
        }

        /* ********************************************************** */
        
        /* ***************************** Wheel navigation ******************* */

        this.mouseOver = false;
        this.wheelTimeoutId = null;

        if (!mobDevice) {
            this.touchArea.addEventListener("mouseover", this.handleMouseOver, {
                passive: false,
            });
            this.touchArea.addEventListener("mouseleave", this.handleMouseLeave, {
                passive: false,
            });
            this.touchArea.addEventListener("wheel", this.handleWheel, {
                passive: false,
            });
        }
        /* ****************************************************************** */

        /* ***************************** Touch navigation ******************* */

        this.startTouchPostition = 0.0;
        this.updatedPosition = 0.0;
        this.speedModifier = 0.8;       
                
        this.distanceScrolled = 0;
        this.frameCounter = 0;

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

        for (let i = 0; i < this.images.children.length - 2; i++) {
            if (i === this.currentCard) {
                this.selectionButtonsContainer.children[i].style.transitionDuration = "0.0s";
                this.selectionButtonsContainer.children[i].style.backgroundColor = "red";
                this.selectionButtonsContainer.children[i].style.opacity = 1;
            } else {
                this.selectionButtonsContainer.children[i].style.transitionDuration = "1.7s";
                this.selectionButtonsContainer.children[i].style.backgroundColor = "white";
                this.selectionButtonsContainer.children[i].style.transitionDuration = "0.3s";
                this.selectionButtonsContainer.children[i].style.opacity = null;
            }                       
        }                
    }

    orderCards = () => {
        
        this.startCaptionTrans();

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
        
        this.finishCaptionTrans();
    }

    handleBoundaries = () => {
         
        if (this.lastPositions[0] * 1.01 <= this.leftBoundary) {
            const endOfDeck = this.lastPositions[this.numberOfCardsByIndex + 2] + this.newWidth;              
        
            this.images.removeChild(this.images.children[0]);
            this.lastPositions[0] = endOfDeck;        
            this.images.insertAdjacentHTML("beforeend", this.images.children[1].outerHTML);            
            this.images.children[this.numberOfCardsByIndex + 2].style.left = `${endOfDeck}px`;        
            this.lastPositions.splice(this.numberOfCardsByIndex + 2, 0, this.lastPositions.shift());        
        }
        if (this.lastPositions[this.numberOfCardsByIndex + 2] * 1.01 >= this.rightBoundary) {
            const beginningOfDeck = this.lastPositions[0] - this.newWidth;         
       
            this.images.removeChild(this.images.children[this.numberOfCardsByIndex + 2]);
            this.lastPositions[this.numberOfCardsByIndex + 2] = beginningOfDeck;            
            this.images.insertAdjacentHTML("afterbegin", this.images.children[this.numberOfCardsByIndex].outerHTML);
            this.images.children[0].style.left = `${beginningOfDeck}px`;        
            this.lastPositions.splice(0, 0, this.lastPositions.pop());        
        }
        
    }

    /* ***************************** Wheel navigation ******************* */

    handleMouseOver = () => {
        if (this.snapInProgress) return;
        this.mouseOver = true;

        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.7s";        
        }
    };
    
    handleMouseLeave = () => {
        if (this.snapInProgress) return;
        this.mouseOver = false;
    };
    
    handleWheel = (event) => {
        event.preventDefault();
        clearTimeout(this.wheelTimeoutId);
        if (this.snapInProgress) return;
        this.startCaptionTrans();    
        this.stopAutoplay();

        for (let i = 0; i < this.images.children.length; i++) {            
            this.images.children[i].children[1].style.transitionDuration = "0.0s";
            this.images.children[i].children[1].style.visibility = "hidden"; 
        }

        let difference = event.deltaY * 1.7;
        this.distanceScrolled += difference;
        this.frameCounter += difference;
        
        if (this.mouseOver) {
            
            for (let i = 0; i < this.images.children.length; i++) {
                this.updatedPosition = this.lastPositions[i] + difference;
                this.images.children[i].style.left = `${this.updatedPosition}px`;
                this.lastPositions[i] = this.updatedPosition;
            }
        
            while (Math.abs(this.frameCounter) > this.newWidth) {
                if (this.distanceScrolled < (this.newWidth * -1.0)) {  
                    this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;         
                    this.updateSelection(); 
                    this.frameCounter -= (this.newWidth * -1.0);         
                }
        
                if (this.distanceScrolled > this.newWidth) {
                    this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard; 
                    this.updateSelection(); 
                    this.frameCounter -= this.newWidth;
                }
            }
                        
            this.handleBoundaries();    
                   
            
            this.wheelTimeoutId = setTimeout(() => {
                this.frameCounter = 0;  
                             
                this.snapBack();
                this.startAutoplay();
            }, 100);
        }        
    };
    
    /* ****************************************************************** */

    /* ***************************** Snap Back Logic ******************* */

    snapBack = () => {
        this.snapInProgress = true;
        clearTimeout(this.showCaption);
        let swapRem = this.distanceScrolled % this.newWidth;       

        /* set snapBack sensivity. 2 will cause snapBack if swipe is less then half of the slide. */
        let snapSens = 4;
        let snapForward = (this.newWidth / snapSens - Math.abs(swapRem)) < 0;
        this.distanceToScroll = (!snapForward) ?
            -1.0 * swapRem : (this.newWidth - Math.abs(swapRem)) * (swapRem > 0 ? 1.0: -1.0);
        
        if (this.distanceToScroll < 0 && snapForward) {
            this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard; 
        } 
        if (this.distanceToScroll > 0 && snapForward) {
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
            
            this.showCaption = setTimeout(() => {                
                this.startCaptionTrans();
                this.finishCaptionTrans();
            }, 700);
            
            this.seed = 0.0;
            this.distanceScrolled = 0;

            setTimeout(() => {
                this.snapInProgress = false;
            }, 200);
            
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
        if(event.touches.length > 1) return;  
        this.stopAutoplay();        
        
        this.distanceScrolled = 0;
        this.frameCounter = 0;
        this.startTouchPostition = event.changedTouches[0].screenX;

        for (let i = 0; i < this.images.children.length; i++) {
        this.images.children[i].style.transitionDuration = "0.0s";
        }
    };
  
    handleTouchMove = (event) => {
        event.preventDefault();
        if (this.snapInProgress) return; 
        this.startCaptionTrans();
        clearTimeout(this.showCaption);

        const currentTouchPosition = event.changedTouches[0].screenX;
        let difference = currentTouchPosition - this.startTouchPostition;
        difference *= this.speedModifier;
        this.distanceScrolled += difference;
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

    handleTouchEnd = (event) => {
        if (this.snapInProgress) return; 
                       
        this.snapBack();
        this.startAutoplay();  
    };

    /* ****************************************************************** */    
    
    /* ********************* Button Navigation ****************** */   

    handleNext = () => {
        if (this.scrollInProgress) return;
        clearTimeout(this.showCaption);
        this.startCaptionTrans();
        this.stopAutoplay();   
        
        this.scrollInProgress = true;
        
        this.navButtonsContainer.children[1].style.transitionDuration = "0.5s";
        this.navButtonsContainer.children[1].style.opacity = 1;
        this.navButtonsContainer.children[1].style.filter = "invert(50%)";
        this.navButtonsContainer.children[1].style.padding = "0.0%";
        
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.5s";

            const updatedPosition = this.lastPositions[i] - this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;                     
        }
        
        this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;

        this.handleBoundaries();
        this.updateSelection();        
        
        this.showCaption = setTimeout(() => {
            this.finishCaptionTrans();
        }, 500);
                
        setTimeout(() => {
            this.scrollInProgress = false;
            this.startAutoplay();             
            this.navButtonsContainer.children[1].style.transitionDuration = null;
            this.navButtonsContainer.children[1].style.opacity = null;
            this.navButtonsContainer.children[1].style.filter = null;
            this.navButtonsContainer.children[1].style.padding = null;
        }, 500);
    }

    handlePrev = () => {
        if (this.scrollInProgress) return;  
        clearTimeout(this.showCaption);
        this.startCaptionTrans(); 
        this.stopAutoplay();
       
        this.scrollInProgress = true;

        this.navButtonsContainer.children[0].style.transitionDuration = "0.5s";
        this.navButtonsContainer.children[0].style.opacity = 1;
        this.navButtonsContainer.children[0].style.filter = "invert(50%)";
        this.navButtonsContainer.children[0].style.padding = "0.0%"; 
       
        for (let i = 0; i < this.images.children.length; i++) {
            this.images.children[i].style.transitionDuration = "0.5s";

            const updatedPosition = this.lastPositions[i] + this.newWidth;
            
            this.images.children[i].style.left = `${updatedPosition}px`;            
            this.lastPositions[i] = updatedPosition;           
        }
       
        this.currentCard = (this.currentCard === 0) ? this.numberOfCardsByIndex : --this.currentCard;

        this.handleBoundaries();
        this.updateSelection();

        this.showCaption = setTimeout(() => {
            this.finishCaptionTrans();
        }, 500);        
        
        setTimeout(() => {
            this.scrollInProgress = false;            
            this.startAutoplay();
            this.navButtonsContainer.children[0].style.transitionDuration = null;
            this.navButtonsContainer.children[0].style.opacity = null;
            this.navButtonsContainer.children[0].style.filter = null;
            this.navButtonsContainer.children[0].style.padding = null;
        }, 500);
    }
    
    /* ********************************************************** */
    
    /* ****************** Slides amount selection *************** */

    handlePlus = () => {
        this.viewPort.style.transitionDuration = "0.7s"; 
        if (this.imgToShow < this.maxSlides) {
            this.imgToShow += 1;
        } 
        // if (this.imgToShow === this.maxSlides) {
        //     this.buttonPlus.style.opacity = 0.2;
        // } 
        // if (this.imgToShow > this.minSlides) {
        //     this.buttonMinus.style.opacity = null;
        // }

        this.handleResize();
        
        setTimeout(() => {
            this.viewPort.style.transitionDuration = null
        }, 700);
    }

    handleMinus = () => {
        this.viewPort.style.transitionDuration = "0.7s"; 
        if (this.imgToShow > this.minSlides) {
            this.imgToShow -= 1;
        }
        // if (this.imgToShow === this.minSlides) {
        //     this.buttonMinus.style.opacity = 0.2;
        // }
        // if (this.imgToShow < this.maxSlides) {
        //     this.buttonPlus.style.opacity = null;
        // }
        
        this.handleResize();
        
        setTimeout(() => {
            this.viewPort.style.transitionDuration = null
        }, 700);
    }


    /* ********************************************************** */

    /* ********************* Selection Navigation *************** */

    handleSelection = event => {
        if (event.target === this.selectionButtonsContainer) return;
        this.startCaptionTrans();
        this.stopAutoplay();
        
        let newCard = null;

        for (let i = 0; i < this.images.children.length - 2; i++) {
            if (event.target === this.selectionButtonsContainer.children[i]) {
                newCard = i; 
            }         
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
        this.finishCaptionTrans();
        this.startAutoplay();
    }
        
    /* ********************************************************** */

    /* ************** Captions handling ************************* */
    startCaptionTrans = () => {
        for (let i = 0; i < this.images.children.length; i++) {            
            this.images.children[i].children[1].style.transitionDuration = "0.0s";
            this.images.children[i].children[1].style.visibility = "hidden"; 
        }
    }

    finishCaptionTrans = () => {
        this.images.children[this.middleCardByIndex].children[1].style.transitionDuration = "0.7s";
        this.images.children[this.middleCardByIndex].children[1].style.visibility = "visible";        
    }
    
    /* ********************************************************** */
    
    /* ********************* Autoplay Code ********************** */

    startAutoplay = () => {
        clearTimeout(this.autoplayTimeoutId);
        clearInterval(this.autoplayIntervalId);

        this.autoplayTimeoutId = setTimeout(() => {
            this.autoplayIntervalId = setInterval(() => {
                this.startCaptionTrans();

                for (let i = 0; i < this.images.children.length; i++) {
                    this.images.children[i].style.transitionDuration = "1.2s";
        
                    const updatedPosition = this.lastPositions[i] - this.newWidth;
                    
                    this.images.children[i].style.left = `${updatedPosition}px`;            
                    this.lastPositions[i] = updatedPosition;           
                }
        
                this.currentCard = (this.currentCard === this.numberOfCardsByIndex) ? 0 : ++this.currentCard;
        
                this.handleBoundaries();
                this.updateSelection();
                
                this.showCaption = setTimeout(() => {
                    this.finishCaptionTrans();
                }, 1200);

            }, 5100)
        }, 10500);
    }
        
    /* ********************* Stop autoplay ********************** */

    stopAutoplay = () => {
        clearTimeout(this.autoplayTimeoutId);
        clearInterval(this.autoplayIntervalId);
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
                        {this.state.deck.cards.map((item, index) => {
                                return (
                                    <Card source={`${item.src}`} title={`${item.title}`} caption={`${item.caption}`} id={index} key={index} />                                    
                                )
                            }, this)
                        } 

                    </div>
                    <div onClick={this.handleSelection} ref={refId => this.selectionButtonsContainer = refId} className="selectionButtonsContainer">
                        {
                            this.state.deck.cards.map((_, i) => {
                                return (<div className="selectionButton" key={i}></div>)
                            })
                        }                   
                    </div>
                    <div ref={(refId) => (this.touchArea = refId)} className="touchArea"></div>
                </div>
                <div ref={refId => this.sizeButtonsContainer = refId} className="sizeButtonsContainer">
                    <img onClick={this.handlePlus} ref={refId => this.buttonPlus = refId} className="sizeButton" src={plus} alt="plus" id="plus" />
                    <img onClick={this.handleMinus} ref={refId => this.buttonMinus = refId} className="sizeButton" src={minus} alt="minus" id="minus" />
                </div>       
            </Fragment>
        )
    }
}


export default Deck;