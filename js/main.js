  /*----- constants -----*/
  const suits = ['s', 'c', 'd', 'h'];
  const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

  /*----- state variables -----*/


  /*----- cached elements  -----*/
const newGameButton =  document.querySelector('button')
const deckContainers = document.querySelectorAll('#deck > div')
const completeContainers = document.querySelectorAll('#complete > div')
const bottomRowContainers = document.querySelectorAll('#bottomRow > div')

  /*----- event listeners -----*/
newGameButton.addEventListener('click', () => startNewGame())

  /*----- functions -----*/
function startNewGame() {
    newGameButton.style.visibility = 'hidden'
    document.querySelectorAll('.cardContainer').forEach(container => container.innerHTML = '')
    console.log(deckContainers[0])
    getShuffledDeck().forEach(card => deckContainers[0].innerHTML += `<div class="card back ${card.face}"></div>`)
    dealCards()
}

function dealCards() {
    // write code here
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