// DAFTAR GAMBAR KARTU

const cardImages = [
    "🍎", "🍌", "🍇", "🍉",
    "🍓", "🍒", "🍍", "🥝"
];


// MENGAMBIL ELEMEN HTML

const gameBoard = document.getElementById("game-board");

const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const scoreElement = document.getElementById("score");

const messageElement = document.getElementById("message");


// VARIABEL PERMAINAN

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let score = 0;
let matchedPairs = 0;

let seconds = 0;

let timerInterval = null;
let gameStarted = false;


// MENGATUR PERPINDAHAN HALAMAN

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

}


// MENAMPILKAN HALAMAN AWAL

function showHome() {

    clearInterval(timerInterval);

    showScreen("home-screen");

}


// MENAMPILKAN PETUNJUK

function showInstructions() {

    showScreen("instruction-screen");

}


// MENGACAK KARTU

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;

}


// MEMULAI PERMAINAN

function startGame() {

    clearInterval(timerInterval);

    moves = 0;
    score = 0;
    matchedPairs = 0;
    seconds = 0;

    firstCard = null;
    secondCard = null;

    lockBoard = false;
    gameStarted = false;

    movesElement.textContent = 0;
    scoreElement.textContent = 0;
    timerElement.textContent = "00:00";

    messageElement.textContent = "Find all matching cards!";

    showScreen("game-screen");

    let cards = shuffle([...cardImages, ...cardImages]);

    gameBoard.innerHTML = "";

    cards.forEach(image => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.image = image;

        card.textContent = "?";

        card.addEventListener("click", function() {
            flipCard(card);
        });

        gameBoard.appendChild(card);

    });

}


// TIMER

function startTimer() {

    if (gameStarted) return;

    gameStarted = true;

    timerInterval = setInterval(() => {

        seconds++;

        let minutes = Math.floor(seconds / 60);

        let remainingSeconds = seconds % 60;

        timerElement.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");

    }, 1000);

}


// MEMBUKA KARTU

function flipCard(card) {

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched") ||
        card.classList.contains("open")
    ) {
        return;
    }

    startTimer();

    card.classList.add("open");

    card.textContent = card.dataset.image;

    if (!firstCard) {

        firstCard = card;

        return;

    }

    secondCard = card;

    moves++;

    movesElement.textContent = moves;

    checkMatch();

}


// MEMERIKSA KARTU

function checkMatch() {

    let isMatch =
        firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        score += 100;

        matchedPairs++;

        scoreElement.textContent = score;

        messageElement.textContent = "Great! You found a pair!";

        resetTurn();

        if (matchedPairs === cardImages.length) {

            clearInterval(timerInterval);

            setTimeout(showWin, 700);

        }

    } else {

        lockBoard = true;

        messageElement.textContent = "Not a match! Try again.";

        setTimeout(() => {

            firstCard.classList.remove("open");

            secondCard.classList.remove("open");

            firstCard.textContent = "?";

            secondCard.textContent = "?";

            resetTurn();

        }, 1000);

    }

}


// MENGATUR ULANG GILIRAN

function resetTurn() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// MENAMPILKAN HALAMAN KEMENANGAN

function showWin() {

    document.getElementById("final-score").textContent = score;

    document.getElementById("final-moves").textContent = moves;

    document.getElementById("final-time").textContent =
        timerElement.textContent;

    showScreen("win-screen");

}