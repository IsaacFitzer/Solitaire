  /*----- constants -----*/
  const suits = ['s', 'c', 'd', 'h'];
  const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

  /*----- state variables -----*/


  /*----- cached elements  -----*/
const newGameButton =  document.querySelector('button')
const deckContainers = document.querySelectorAll('#deck > .cardContainer')
const completeContainers = document.querySelectorAll('#complete > .cardContainer')
const bottomRowContainers = document.querySelectorAll('#bottomRow > .cardContainer')

  /*----- event listeners -----*/
newGameButton.addEventListener('click', () => startNewGame())

  /*----- functions -----*/
function startNewGame() {
    newGameButton.style.visibility = 'hidden'
    document.querySelectorAll('.cardContainer').forEach(container => container.innerHTML = '')
    getShuffledDeck().forEach(card => deckContainers[0].innerHTML += `<div class="card back ${card.face}"></div>`)
    dealCards()
}

function dealCards() {
    // const topCard = document.querySelector('#deck > .cardContainer:first-child > .card:last-child')
    // setTimeout(() => topCard.style.top = '23.25vmin', 0)
    // setTimeout(() => topCard.style.left = '14.25vmin', 0)
    // setTimeout(() => topCard.style.left = '27.75vmin', 1000)
    // console.log(topCard.style)
    // console.log(deckContainers[0].lastChild)
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
                setTimeout((curTopCard) => {
                    curTopCard.style.top = '0'
                    curTopCard.style.left = '0'
                }, 30, topCard)
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
        ranks.forEach(rank => {
            tempDeck.push({
                face: suit + rank,
                value: Number(rank) || (rank === 'J' ? 11 : rank === 'Q' ? 12 : rank === 'K' ? 13 : 1)
            })
        })
    })
    const shuffledDeck = []
    while (tempDeck.length > 0) {
        shuffledDeck.push(tempDeck.splice(Math.floor(Math.random() * tempDeck.length), 1)[0])
    }
    return shuffledDeck
}