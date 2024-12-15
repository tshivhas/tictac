document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById("home-page");
    const gamePage = document.getElementById("game-page");
    const startGameBtn = document.getElementById("start-game-btn");
    const backHomeBtn = document.getElementById("back-home-btn");
    const squares = document.querySelectorAll(".square");
    const gameInfo = document.getElementById("game-info");
    const themeSwitchBtn = document.getElementById("theme-switch-btn");
    const body = document.body;

    let currentPlayer = "X";
    let board = Array(9).fill(null);
    let scores = { X: 0, O: 0 };

    // Sound effects (make sure you have these files or comment these lines out)
    const moveSound = new Audio("move.mp3");
    const winSound = new Audio("win.mp3");
    const drawSound = new Audio("draw.mp3");

    startGameBtn.addEventListener("click", () => {
        homePage.classList.add("hidden");
        gamePage.classList.remove("hidden");
    });

    backHomeBtn.addEventListener("click", () => {
        gamePage.classList.add("hidden");
        homePage.classList.remove("hidden");
        resetGame(); // Reset game when returning home
    });

    themeSwitchBtn.addEventListener("click", () => {
        if (body.classList.contains("light-theme")) {
            body.classList.remove("light-theme");
            body.classList.add("dark-theme");
            themeSwitchBtn.textContent = "Light Mode";
        } else {
            body.classList.remove("dark-theme");
            body.classList.add("light-theme");
            themeSwitchBtn.textContent = "Dark Mode";
        }
    });

    squares.forEach((square, index) => {
        square.addEventListener("click", () => {
            if (currentPlayer === "X" && !board[index]) {
                makeMove(index, "X");
                moveSound.play();
                if (!checkWinner() && !board.every(cell => cell !== null)) {
                    currentPlayer = "O";
                    setTimeout(computerMove, 500);
                }
            }
        });
    });

    function makeMove(index, player) {
        board[index] = player;
        squares[index].textContent = player;
        if (checkWinner()) {
            winSound.play();
            gameInfo.innerHTML = `Player ${player} Wins!`;
            scores[player]++;
            updateScore();
            disableBoard();
        } else if (board.every(cell => cell !== null)) {
            drawSound.play();
            gameInfo.innerHTML = `It's a Draw!`;
        } else {
            currentPlayer = player === "X" ? "O" : "X";
            gameInfo.innerHTML = `Player ${currentPlayer}'s Turn`;
        }
    }

    function computerMove() {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "O";
                let score = minimax(board, 0, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        makeMove(move, "O");
        currentPlayer = "X";
    }

    function minimax(board, depth, isMaximizing) {
        let result = checkWinnerMinimax();
        if (result !== null) {
            return result;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinnerMinimax() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === "O" ? 1 : -1;
            }
        }

        return board.every(cell => cell !== null) ? 0 : null;
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    function updateScore() {
        gameInfo.innerHTML += `<br>Score: X - ${scores.X}, O - ${scores.O}`;
    }

    function disableBoard() {
        squares.forEach(square => {
            square.style.pointerEvents = "none";
        });
    }

    function resetGame() {
        board.fill(null);
        squares.forEach(square => {
            square.textContent = "";
            square.style.pointerEvents = "auto";
        });
        currentPlayer = "X";
        gameInfo.innerHTML = `Player ${currentPlayer}'s Turn`;
    }

    document.getElementById("reset-game-btn").addEventListener("click", resetGame);
});

