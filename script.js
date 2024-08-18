// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
// const musicSound = new Audio('music.mp3');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let level = 1;
let soundEnabled = true;
let currentPlayer = 1;
let hiscoreval = 0;
let isGameOver = false;

const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');
const levelBox = document.getElementById('levelBox');
const speedBox = document.getElementById('speedBox');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const soundToggle = document.getElementById('soundToggle');
const playerSelection = document.getElementById('playerSelection');

// Toggle Sound
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

    if (!soundEnabled) {
        foodSound.pause();
        gameOverSound.pause();
        moveSound.pause();
        // musicSound.pause();
    } else {
        // musicSound.play();
    }
});



// Update HiScore from localStorage
function updateHiScore() {
    let savedHiScore = localStorage.getItem("hiscore" + currentPlayer);
    hiscoreval = savedHiScore ? JSON.parse(savedHiScore) : 0;
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

// Main Game Function
function main(ctime) {
    if (isGameOver) return; // Stop the game loop if game is over

    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Collision Function
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Game Engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        isGameOver = true; 
        if (soundEnabled) gameOverSound.play();
        // musicSound.pause();
        inputDir = { x: 0, y: 0 };
        finalScore.textContent = score;
        gameOverScreen.style.display = 'block';

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore" + currentPlayer, JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }

        return;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        if (soundEnabled) foodSound.play();
        score += 1;
        speed += 0.2;
        level = Math.floor(score / 5) + 1;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

        // Update the score and level
        scoreBox.innerHTML = "Score: " + score;
        levelBox.innerHTML = "Level: " + level;
        speedBox.innerHTML = "Speed: " + speed.toFixed(1);
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display the snake and Food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Start the Game
function startGame() {
    isGameOver = false; 
    score = 0; 
    speed = 5;
    level = 1;
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    food = { x: 6, y: 7 };
    gameOverScreen.style.display = 'none';
    scoreBox.innerHTML = "Score: " + score;  
    levelBox.innerHTML = "Level: " + level; 
    speedBox.innerHTML = "Speed: " + speed.toFixed(1); 
    // if (soundEnabled) musicSound.play();
    updateHiScore();
    window.requestAnimationFrame(main);
}

// Input Handling
window.addEventListener('keydown', e => {
    if (isGameOver) return; // Prevent input after game over

    if (soundEnabled) moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {
                inputDir = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir = { x: 0, y: 1 };
            }
            break;

        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir = { x: -1, y: 0 };
            }
            break;

        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir = { x: 1, y: 0 };
            }
            break;
    }
});

// Initial Setup
updateHiScore();
window.requestAnimationFrame(main);
