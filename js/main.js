  /*----- constants -----*/
  const suits = ['s', 'c', 'd', 'h'];
  const ranks = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];

  /*----- state variables -----*/
let holdingCards
let pickedUpFrom

  /*----- cached elements  -----*/
const newGameButton =  document.querySelector('button')
const deckContainers = document.querySelectorAll('#deck > .cardContainer')
const completeContainers = document.querySelectorAll('#complete > .cardContainer')
const bottomRowContainers = document.querySelectorAll('#bottomRow > .cardContainer')
const mouseContainer = document.querySelector('#mouseContainer')

  /*----- event listeners -----*/
document.addEventListener('mousemove', e => onMouseMove(e))
document.addEventListener('click', e => onClick(e))

  /*----- functions -----*/
function startNewGame() {
    newGameButton.style.visibility = 'hidden'
    document.querySelectorAll('.cardContainer').forEach(container => container.innerHTML = '')
    holdingCards = false
    pickedUpFrom = null
    getShuffledDeck().forEach(card => deckContainers[0].innerHTML += `<div class="card back ${card}"></div>`)
    dealCards()
}

function onClick(e) {
    if (e.target.tagName === 'BUTTON') startNewGame()
    else if (e.target.className.split(' ').includes('card')) {
        if (e.target.parentElement === pickedUpFrom) {
            moveItemsToNewContainer(mouseContainer, e.target.parentElement)
        } else if (holdingCards) {
            const cardHeldInfo = getCardInfo(mouseContainer.firstChild)
            const topCardInfo = getCardInfo(e.target.parentElement.lastChild)
            if (e.target.parentElement.parentElement.parentElement.id === 'topRow'
                    && e.target.parentElement.parentElement.id === 'complete'
                    && cardHeldInfo.value - 1 === topCardInfo.value
                    && cardHeldInfo.suit === topCardInfo.suit) {
                moveItemsToNewContainer(mouseContainer, e.target.parentElement)
                // check for win
                let won = true
                completeContainers.forEach((completeContainer) => {
                    if (completeContainer.lastChild === null || getCardInfo(completeContainer.lastChild).value !== 13) {
                        won = false
                    }
                })
                if (won) winSequence()
            }
            if (e.target.parentElement.parentElement.id === 'bottomRow'
                    && cardHeldInfo.value + 1 === topCardInfo.value
                    && cardHeldInfo.color !== topCardInfo.color) {
                moveItemsToNewContainer(mouseContainer, e.target.parentElement)
            }
        } else {
            if (e.target.parentElement.parentElement.parentElement.id === 'topRow') {
                if (e.target.parentElement == deckContainers[0]) {
                    // flip over 3 cards
                    for (let idx = 0; idx < 3; idx++) {
                        setTimeout(() => {
                            const topCard = deckContainers[0].lastChild
                            if (topCard === null) return
                            topCard.classList.remove('back')
                            deckContainers[1].appendChild(topCard)
                            topCard.style.position = 'relative'
                            topCard.style.top = '0vmin'
                            topCard.style.left = '-13.5vmin'
                            setTimeout(() => topCard.style.left = '0', 30)
                        }, 200 * idx)
                    }
                } else {
                    // pick up a card from the top row
                    moveItemsToNewContainer(e.target.parentElement, mouseContainer, e.target.parentElement.lastChild)
                }
            } else if (e.target.parentElement.parentElement.id === 'bottomRow') {
                if (e.target.className.includes('back')) {
                    if (e.target.parentElement.lastChild.className.includes('back')) {
                        e.target.parentElement.lastChild.classList.remove('back')
                    }
                } else {
                    moveItemsToNewContainer(e.target.parentElement, mouseContainer, e.target)
                }
            }
        }
    } else if (e.target.className.includes('cardContainer')) {
        if (holdingCards) {
            if (e.target === pickedUpFrom ||
                    (mouseContainer.children.length === 1 && e.target.parentElement.id == 'complete' && getCardInfo(mouseContainer.firstChild).value === 1
                    || e.target.parentElement.id == 'bottomRow' && getCardInfo(mouseContainer.firstChild).value === 13)) {
                moveItemsToNewContainer(mouseContainer, e.target)
            }
        } else if (e.target === deckContainers[0]) {
            while (deckContainers[1].lastChild !== null) {
                const topCard = deckContainers[1].lastChild
                topCard.classList.add('back')
                deckContainers[0].appendChild(topCard)
                topCard.style.left = '13.5vmin'
                setTimeout(() => topCard.style.left = '0', 30)
            }
        }
    }
}

function moveItemsToNewContainer(startContainer, endContainer, startItem = startContainer.childNodes[0]) {
    if (startContainer === mouseContainer) {
        holdingCards = false
        pickedUpFrom = null
    } else if (endContainer === mouseContainer) {
        holdingCards = true
        pickedUpFrom = startContainer
    }
    const idx = [...startContainer.childNodes].indexOf(startItem)
    while (startContainer.childNodes[idx] !== undefined) {
        endContainer.appendChild(startContainer.childNodes[idx])
    }
}

function getCardInfo(card) {
    const data = card.className.split(' ').slice(-1)[0]
    const rank = data.substr(1)
    return {
        color: ['s', 'c'].includes(data.charAt(0)) ? 'b' : 'r',
        suit: data.charAt(0),
        value: Number(rank) || (rank === 'J' ? 11 : rank === 'Q' ? 12 : rank === 'K' ? 13 : 1)
    }
}

function dealCards() {
    let numCardsInRow = 7
    let curDelay = 0
    while (numCardsInRow > 0) {
        let idx = 7 - numCardsInRow
        while (idx < 7) {
            setTimeout((curIdx, curNumCardsInRow) => {
                const topCard = deckContainers[0].lastChild
                if (curIdx === 7 - curNumCardsInRow) topCard.classList.remove('back')
                bottomRowContainers[curIdx].appendChild(topCard)
                topCard.style.position = 'relative'
                topCard.style.top = `${(curNumCardsInRow - 7) * 2.15 - 22.5}vmin`
                topCard.style.left = `${-13.5 * curIdx}vmin`
                if (curNumCardsInRow === 1) newGameButton.style.visibility = 'visible'
                setTimeout(() => {
                    topCard.style.top = '0'
                    topCard.style.left = '0'
                }, 30)
            }, curDelay, idx, numCardsInRow)
            idx++
            curDelay += 200
        }
        numCardsInRow--
    }
}

function getShuffledDeck() {
    const tempDeck = []
    suits.forEach(suit => {
        ranks.forEach(rank => tempDeck.push(suit + rank))
    })
    const shuffledDeck = []
    while (tempDeck.length > 0) {
        shuffledDeck.push(tempDeck.splice(Math.floor(Math.random() * tempDeck.length), 1)[0])
    }
    return shuffledDeck
}

function onMouseMove(e) {
    mouseContainer.style.left = e.pageX + 'px'
    mouseContainer.style.top = e.pageY + 'px'
}

function winSequence() {
    for (let rank = 12; rank >= 0; rank--) {
        for (let suit = 0; suit <= 3; suit++) {
            let xPos = 41.35 + (suit * 13.5), yPos = .75, xVel = (Math.random() * 2) - 1, yVel = (Math.random() * 4) - 2
            if (xVel < 0) xVel -= .3
            else xVel += .3
            while (xPos < 100 && xPos > -15) {
                completeContainers[0].innerHTML += `<div class="card ${suits[suit]}${ranks[rank]}" style="position: absolute; top: ${yPos}vmin; left: ${xPos}vmin; z-index: 1"></div>`
                xPos += xVel
                yPos += yVel
                if (yPos > 70) yVel *= -.8
                else yVel += .1
            }
        }
    }
}