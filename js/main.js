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
    console.log(e)
    if (e.target.tagName === 'BUTTON') startNewGame()
    else if (e.target.className.split(' ').includes('card')) {
        if (e.target.parentElement === pickedUpFrom) {
            holdingCards = false
            pickedUpFrom = null
            moveItemsToNewContainer(mouseContainer, e.target.parentElement)
        } else if (holdingCards) {
            const cardHeldInfo = getCardInfo(mouseContainer.firstChild)
            if (e.target.parentElement.parentElement.parentElement.id === 'topRow') {
                // top row stuff
            } else if (e.target.parentElement.parentElement.id === 'bottomRow') {
                const topCardInfo = getCardInfo(e.target.parentElement.lastChild)
                if (cardHeldInfo.value + 1 === topCardInfo.value && cardHeldInfo.color !== topCardInfo.color) {
                    holdingCards = false
                    pickedUpFrom = null
                    moveItemsToNewContainer(mouseContainer, e.target.parentElement)
                }
            }
        } else {
            if (e.target.parentElement.parentElement.parentElement.id === 'topRow') {
                if (e.target.parentElement == deckContainers[0]) {
                    // flip over 3 cards
                } else {
                    // pick up a card from the top row
                    holdingCards = true
                    pickedUpFrom = e.target.parentElement
                    mouseContainer.appendChild(e.target)
                }
            } else if (e.target.parentElement.parentElement.id === 'bottomRow') {
                if (e.target.className.includes('back')) {
                    if (e.target.parentElement.lastChild.className.includes('back')) {
                        e.target.parentElement.lastChild.classList.remove('back')
                    }
                } else {
                    holdingCards = true
                    pickedUpFrom = e.target.parentElement
                    moveItemsToNewContainer(e.target.parentElement, mouseContainer, e.target)
                }
            }
        }
    } else if (e.target.className.includes('cardContainer')) {
        if (holdingCards) {
            if (e.target === pickedUpFrom || mouseContainer.children.length === 1 && 
                    (e.target.parentElement.id == 'complete' && getCardInfo(mouseContainer.firstChild).value === 1 
                    || e.target.parentElement.id == 'bottomRow' && getCardInfo(mouseContainer.firstChild).value === 13)) {
                holdingCards = false
                pickedUpFrom = null
                moveItemsToNewContainer(mouseContainer, e.target)
            }
        } else if (e.target === deckContainers[0]) {
            console.log('empty deck')
        }
    }
}

function moveItemsToNewContainer(startContainer, endContainer, startItem = startContainer.childNodes[0]) {
    let idx = [...startContainer.childNodes].indexOf(startItem)
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

onMouseMove = e => {
    mouseContainer.style.left = e.pageX + 'px'
    mouseContainer.style.top = e.pageY + 'px'
}