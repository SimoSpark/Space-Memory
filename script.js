const spaceEmojis = ['🚀', '🛰️', '🌍', '🌕', '🌠', '☄️', '🛸', '🌌'];
const gameGrid = document.getElementById('gameGrid');
const moveCountDisplay = document.getElementById('moveCount');
const timeCountDisplay = document.getElementById('timeCount');
const restartBtn = document.getElementById('restartBtn');

let moveCount = 0;
let time = 0;
let timeInterval;
let firstCard = null;
let lockBoard = false;

function createCard(emoji) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-back">?</div>
            <div class="card-front">${emoji}</div>
        </div>
    `;
    return card;
}

function shuffleCards() {
    const duplicatedEmojis = [...spaceEmojis, ...spaceEmojis];
    return duplicatedEmojis.sort(() => Math.random() - 0.5);
}

function startTimer() {
    timeInterval = setInterval(() => {
        time++;
        timeCountDisplay.textContent = time;
    }, 1000);
}

function initGame() {
    gameGrid.innerHTML = '';
    moveCount = 0;
    time = 0;
    moveCountDisplay.textContent = moveCount;
    timeCountDisplay.textContent = time;
    clearInterval(timeInterval);
    startTimer();

    const shuffledEmojis = shuffleCards();
    shuffledEmojis.forEach(emoji => {
        const card = createCard(emoji);
        card.addEventListener('click', flipCard);
        gameGrid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped')) return;

    moveCount++;
    moveCountDisplay.textContent = moveCount;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    checkForMatch(firstCard, this);
    firstCard = null;
}

function checkForMatch(card1, card2) {
    lockBoard = true;
    const emoji1 = card1.querySelector('.card-front').textContent;
    const emoji2 = card2.querySelector('.card-front').textContent;

    if (emoji1 === emoji2) {
        setTimeout(() => {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
            lockBoard = false;
            checkGameWin();
        }, 1000);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            lockBoard = false;
        }, 1000);
    }
}

function checkGameWin() {
    const flippedCards = document.querySelectorAll('.card:not([style*="visibility: hidden"])');
    if (flippedCards.length === 0) {
        clearInterval(timeInterval);
        alert(`🎉 Congratulations! You won in ${moveCount} moves and ${time} seconds! 🌟`);
    }
}

restartBtn.addEventListener('click', initGame);
initGame();