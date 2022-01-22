class Card {
    constructor(frontImageUrl, backImageUrl = "images/questionmark.svg") {
        this.frontImage = frontImageUrl;
        this.backImage = backImageUrl;
        this.element = null;
        this.isFlipped = false;
    }
}

Array.prototype.shuffle = function()
{
    var i = this.length;
    while (i)
    {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

var firstSelectedCard = null; // stores the first click of a card 
var secondSelectedCard = null; // ditto
var canUserClick = true; // if a user can click
var clickTimeout = 0.75; // timeout between clicking other cards



var timings = []; // stores timings between cards
var startTime = 0; 
var endTime = 0;

window.onload = function() {

startTime = performance.now(); 


    var imageList = [
        "images/NicHead.svg",
        "images/DaveHead.svg",
        "images/SteHead.svg",
        "images/SarahHead.svg",
        "images/MikHead.svg",
        "images/GazHead.svg"
    ]

    var cardList = [];

    imageList.forEach( function(curImage) {
        cardList.push(new Card(curImage));
        cardList.push(new Card(curImage));
    } )

    shuffledCards = cardList.shuffle();

    // get reference to template and remove id
    var cardTemplate = document.querySelector("#cardTemplate");
    cardTemplate.id = "";

    // remove template
    var cardContainer = document.querySelector(".container");
    cardContainer.removeChild(cardTemplate);

    // dig through all card objects 
    shuffledCards.forEach( function(curCard) {

        // clone template and add it to the card container
        var cardElement = cardTemplate.cloneNode(true);
        cardContainer.appendChild(cardElement);
        
        cardElement.addEventListener('click', () => {
            
            cardClicked(curCard);
        });
        
        // add reference of the html element to the card object.
        curCard.element = cardElement;
        
        // set up card images 
        var frontImage = cardElement.querySelector(".front");
        var backImage = cardElement.querySelector(".back");
        frontImage.src = curCard.backImage;
        backImage.src = curCard.frontImage;
    });

    peekCards();
    
    function cardClicked(card) {
        
        // if card is flipped, exit the function
        if (card.element.classList.contains("flip")) {
            return; 
        }
        
        if (canUserClick == false) {
            return;
        }
        
        card.element.classList.add('flip');
        
        // check if first card is chosen
        if (firstSelectedCard == null) {
            firstSelectedCard = card;
            console.log("Chosen First Card", card.frontImage);
        } 
        
        // check if second card is chosen
        else if (secondSelectedCard == null) {
            secondSelectedCard = card;
            console.log("Chosen Second Card", card.frontImage);
            endTime = performance.now();
        } 

        // check if  both are chosen
        if (firstSelectedCard != null && secondSelectedCard != null) {

            // slower user down, by not allowing any more clicks 
            canUserClick = false;
            setTimeout( () => {
                canUserClick = true;
            }, clickTimeout * 1000 ) 
            
            // check if both card images match 
            if (firstSelectedCard.frontImage == secondSelectedCard.frontImage) {
                console.log("Matched!");
                var difference = (endTime - startTime) / 1000;
                var statsElement = document.querySelector("#timeTaken");
                console.log(`Took ${difference} Seconds to match two cards`);

                timings.push(difference);
                startTime = performance.now();

                if (isGameFinished()) {
                    var total = 0;
                    timings.forEach( (curTiming) => {
                        total += curTiming;
                    });
                    console.log(total);
                    var roundedTotal = Math.round(total);
                    statsElement.innerHTML = `Completed in <b>${roundedTotal}</b> Seconds!`
                } 

            } 
            
            // if no match is found, reset previous selected cards to try again.
            else {
                console.log("No Match, resetting."); 
                var firstElement = firstSelectedCard.element;
                var secondElement = secondSelectedCard.element;
                setTimeout( () => { 
                    firstElement.classList.remove("flip");
                    secondElement.classList.remove("flip");
                }, 1000);
            }
            firstSelectedCard = null;
            secondSelectedCard = null;
        }

    }
    
    var resetBtn = document.querySelector("#reset")
    resetBtn.addEventListener("click", resetGame)
}

function resetFlips() { 
    // remove flip class from all cards (restart the game)
    var flippedCardElements = document.querySelectorAll(".flip");
    flippedCardElements.forEach( function(curCard) {
        curCard.classList.remove("flip");
    })
}

function isGameFinished() {
    var allCards = document.querySelectorAll(".card");

    // check if each card has the class flip to check if game has finished
    for (var i = 0; i < allCards.length; i++) {
        var card = allCards[i];
        if (!card.classList.contains("flip")) {
            return false;
        }
    }
    return true; 
}

// show then hide cards on page load
function peekCards() {
    var allCards = document.querySelectorAll(".card");

    canUserClick = false;

    allCards.forEach( (card) => {
        card.classList.add('flip');
    });

    // stop user from clicking to prevent matches before game start
    setTimeout( () => {
        allCards.forEach( (card) => {
            card.classList.remove("flip");
        });
        canUserClick = true;
    }, 1500);
}


function resetGame() {
    window.location.reload();
}